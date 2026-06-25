const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
const table = process.env.SUPABASE_KEEPALIVE_TABLE || 'roles'

if (!url || !key) {
  console.error('Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY')
  process.exit(1)
}

const endpoint = `${url.replace(/\/$/, '')}/rest/v1/${encodeURIComponent(table)}?select=id&limit=1`

if (process.env.SUPABASE_KEEPALIVE_DRY_RUN === '1') {
  console.log(`Supabase keepalive dry run: ${endpoint}`)
  process.exit(0)
}

const response = await fetch(endpoint, {
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
  },
})

if (!response.ok) {
  const body = await response.text()
  console.error(`Supabase keepalive failed: ${response.status} ${body}`)
  process.exit(1)
}

console.log(`Supabase keepalive ok: ${response.status}`)
