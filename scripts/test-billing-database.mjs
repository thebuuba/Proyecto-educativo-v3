// Isolated PostgreSQL acceptance checks. Never reads DATABASE_URL or a Supabase link.
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'
import { readFile, readdir } from 'node:fs/promises'
const require = createRequire(new URL('../packages/database/package.json', import.meta.url))
const { Client } = require('pg')
const origin = new URL(process.env.BILLING_TEST_DATABASE_URL ?? 'postgresql://postgres@127.0.0.1:55439/postgres')
assert(['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname), 'Only a loopback test database is permitted')
assert(origin.port === '55439', 'Use the isolated billing test port 55439')
assert(origin.pathname === '/postgres', 'Connect to postgres only to create an isolated database')
const database = `aulabase_billing_test_${randomUUID().replaceAll('-', '')}`
const admin = new Client({ connectionString: origin.toString() })
await admin.connect()
await admin.query(`create database "${database}"`)
origin.pathname = `/${database}`
const db = new Client({ connectionString: origin.toString() })
await db.connect()
try {
  await db.query(`
    do $$ begin
      if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role bypassrls; end if;
    end $$;
    create schema auth; create schema storage; create schema extensions;
    create schema supabase_migrations;
    create table supabase_migrations.schema_migrations (version text primary key);
    create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    grant usage on schema auth, storage to authenticated, anon;
    grant execute on function auth.uid() to authenticated, anon;
    create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text, owner_id text);
    alter table storage.objects enable row level security;
    grant select, insert, update, delete on storage.objects to authenticated;
    create function storage.foldername(text) returns text[] language sql immutable as $$ select string_to_array($1, '/') $$;
  `)
  const migrations = (await readdir(new URL('../supabase/migrations/', import.meta.url))).filter(n => n.endsWith('.sql')).sort()
  for (const filename of migrations) {
    const sql = await readFile(new URL(`../supabase/migrations/${filename}`, import.meta.url), 'utf8')
    if (sql.trim()) {
      try {
        await db.query(sql)
        await db.query('insert into supabase_migrations.schema_migrations(version) values ($1)', [filename.split('_')[0]])
      } catch (error) { throw new Error(`Migration ${filename}: ${error.message}`, { cause: error }) }
    }
  }
  console.log(`Applied ${migrations.length} migration files to isolated PostgreSQL.`)
  const result = await db.query(`select count(*)::int as n from pg_tables where schemaname='public' and tablename like 'billing_%' and not rowsecurity`)
  assert.equal(result.rows[0].n, 0, 'All commercial tables enable RLS')
  const grants = await db.query(`select count(*)::int as n from information_schema.role_table_grants where table_schema='public' and table_name like 'billing_%' and grantee in ('anon','authenticated','PUBLIC')`)
  assert.equal(grants.rows[0].n, 0, 'Clients cannot read or mutate commercial state directly')
  console.log('PASS: commercial RLS and grants.')
  // Additional behavioral scenarios are kept in SQL so the real constraints and policies execute.
  await db.query(await readFile(new URL('../supabase/tests/billing-access.sql', import.meta.url), 'utf8'))
  console.log('PASS: individual coverage, suspension, courtesy revocation, expiry, trial uniqueness and direct API isolation.')
  if (process.argv.includes('--keep')) console.log(`BILLING_ACCEPTANCE_DATABASE=${origin.toString()}`)
} finally {
  await db.end()
  if (!process.argv.includes('--keep')) await admin.query(`drop database "${database}" with (force)`)
  await admin.end()
}
