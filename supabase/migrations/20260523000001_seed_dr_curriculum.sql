-- Seed Dominican Republic curriculum data (MINERD, Ordenanza 03-2023).
-- Each school copies these templates into their own records via the admin UI.
-- This migration only populates the reference catalogs (grades, subjects).

-- =============================================================================
-- 1. Grados del sistema educativo dominicano
-- =============================================================================
-- Nivel Primario: 1ro - 6to
-- Nivel Secundario: 1ero - 6to

-- Note: grades are inserted as templates with sequence ordering.
-- Schools can customise names via the UI after initial sync.

do $$
declare
  v_school_id uuid;
begin
  select id into v_school_id from public.schools limit 1;

  insert into public.grades (name, level, sequence, school_id) values
    ('1ro de Primaria',   'Primario',    1,  v_school_id),
    ('2do de Primaria',   'Primario',    2,  v_school_id),
    ('3ro de Primaria',   'Primario',    3,  v_school_id),
    ('4to de Primaria',   'Primario',    4,  v_school_id),
    ('5to de Primaria',   'Primario',    5,  v_school_id),
    ('6to de Primaria',   'Primario',    6,  v_school_id),
    ('1ero de Secundaria','Secundario',  7,  v_school_id),
    ('2do de Secundaria', 'Secundario',  8,  v_school_id),
    ('3ro de Secundaria', 'Secundario',  9,  v_school_id),
    ('4to de Secundaria', 'Secundario', 10,  v_school_id),
    ('5to de Secundaria', 'Secundario', 11,  v_school_id),
    ('6to de Secundaria', 'Secundario', 12,  v_school_id)
  on conflict (school_id, name) do nothing;

  -- ===========================================================================
  -- 2. Asignaturas del currículo MINERD por nivel
  -- ===========================================================================

  -- Primaria (compartidas para 1ro-6to)
  insert into public.subjects (code, name, description, school_id) values
    ('LEN-PRI',  'Lengua Española',         'Comprensión y producción oral y escrita', v_school_id),
    ('MAT-PRI',  'Matemática',              'Razonamiento lógico y resolución de problemas', v_school_id),
    ('SOC-PRI',  'Ciencias Sociales',       'Realidad social, historia y geografía', v_school_id),
    ('NAT-PRI',  'Ciencias de la Naturaleza','Exploración del mundo natural', v_school_id),
    ('FOR-PRI',  'Formación Integral Humana y Religiosa', 'Desarrollo espiritual y ético', v_school_id),
    ('EFI-PRI',  'Educación Física',        'Desarrollo físico y psicomotor', v_school_id),
    ('ING-PRI',  'Inglés',                  'Lengua extranjera', v_school_id),
    ('ART-PRI',  'Educación Artística',     'Expresión artística y cultura', v_school_id)
  on conflict (school_id, code) do nothing;

  -- Secundaria
  insert into public.subjects (code, name, description, school_id) values
    ('LEN-SEC',  'Lengua Española',         'Análisis literario, producción textual y comunicación', v_school_id),
    ('MAT-SEC',  'Matemática',              'Álgebra, geometría, estadística y funciones', v_school_id),
    ('SOC-SEC',  'Ciencias Sociales',       'Historia universal y dominicana, geografía, formación ciudadana', v_school_id),
    ('BIO-SEC',  'Biología',                'Ciencias biológicas y ecológicas', v_school_id),
    ('QUI-SEC',  'Química',                 'Química general y aplicada', v_school_id),
    ('FIS-SEC',  'Física',                  'Física clásica y moderna', v_school_id),
    ('FOR-SEC',  'Formación Integral Humana y Religiosa', 'Desarrollo ético y espiritual', v_school_id),
    ('EFI-SEC',  'Educación Física',        'Acondicionamiento físico y deportes', v_school_id),
    ('ING-SEC',  'Inglés',                  'Lengua extranjera (nivel intermedio-avanzado)', v_school_id),
    ('FRA-SEC',  'Francés',                 'Segunda lengua extranjera', v_school_id),
    ('ART-SEC',  'Educación Artística',     'Apreciación y producción artística', v_school_id),
    ('INF-SEC',  'Informática',             'Tecnología de la información y comunicación', v_school_id)
  on conflict (school_id, code) do nothing;

end;
$$;
