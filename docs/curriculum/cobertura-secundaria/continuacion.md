# Continuación del encargo completo

Último bloque: entorno normal local y núcleo de La noticia de Lengua Española 1.º (13/10/2026). No equivale a cobertura completa de secundaria.

Rama: `amplia-instrumentos-secundaria`; entorno publicado en `1b9cf5c44595ac5ac36f31a76d38b6ab9d26d9ea`. Catálogo instalado: `evaluation-2026.11`; releases anteriores conservados. Currículo secundario local: `d98f8201-3cac-5da6-b855-38f7bb8c8011`, DRAFT; no se publica ni modifica su texto oficial.

## Arranque reproducible

1. `pnpm supabase:local` si Supabase no está iniciado.
2. `pnpm dev:local`: confirma localhost 54321/54332, reconstruye shared/backend, instala el catálogo idempotentemente, inicia API 3000 y Vite 5173 con las mismas variables locales. Los puertos deben estar libres. No termina procesos ajenos automáticamente.
3. `pnpm dev:local:seed`: crea/reutiliza centro y docente ficticios con rol docente real y 54 asignaciones comunes. No copia datos remotos. Las 18 optativas todavía no están incorporadas al centro QA.
4. Acceder a `http://localhost:5173/login` con correo/contraseña de `.dev-qa-account.local` (archivo ignorado por Git; no publicar). `.dev-qa-context.local` conserva IDs QA para las pruebas.
5. `node scripts/evaluation-instruments/verify-normal-local.mjs`: login por contraseña, proxy real y 32 instrumentos de células/Ohm. `--news`: 96 propuestas de noticia de 1.º; `verify-browser-saves-local.mjs`: lectura autenticada de las actividades guardadas desde navegador.

Los `.env` remotos se conservan. Autenticación y almacenamiento consumen el mismo SUPABASE_URL local; subida de archivos no verificada en este bloque. El endpoint `/api/v1/health` identifica commit de arranque, cambios sin commit, fecha y catálogo exclusivamente en desarrollo. El frontend normal usa código fuente mediante Vite; cambios del backend requieren reiniciar `dev:local`.

## Evidencia y pendientes

- Dos pruebas del arranque local pasan; rechazan destinos remotos, puertos incorrectos y claves ausentes.
- Seed ejecutado dos veces sin duplicar asignaciones.
- Login real del docente ficticio en navegador. Células: rúbrica, 20 puntos, guardada y reabierta con cinco criterios contextualizados. Ohm: lista ponderada automática, 17,35 puntos, guardada y reabierta; no requiere construir circuito.
- Servicio normal: 32 propuestas, cuatro formatos, 20/17,35 y títulos originales/neutrales; HTTP 200, catálogo .10. Evidencia: `evidencias/entorno-normal-local.json` y capturas `entorno-normal-celulas.png` / `entorno-normal-ohm.png`.
- Backend: 999 pruebas; frontend: 594; inventario: seis. Builds backend/frontend y Cloudflare dry-run del bloque .11 aprobados. No despliegue ni reset.
- Hallazgo de ponderada corregido en .11: evidencia específica de Parcial (50%) en proveedores compartidos con progresión; no modifica los instrumentos históricos .10. Verificación HTTP realizada; navegador de la ponderada .11 todavía pendiente.
- Noticia de 1.º: núcleo de seis familias compartido entre servicio y alternativa, niveles específicos y selección compatible con la acción. 96 casos HTTP normales y rúbrica neutral guardada/reabierta; snapshot .11 confirmado por API. Informes y subtemas pendientes en [noticia-1-reauditoria.md](noticia-1-reauditoria.md).

Siguiente módulo: La guía turística de Lengua Española 1.º (PDF 70–71). Continuar informe de lectura, afiche, cuento policíaco y caligrama, más subtemas pendientes de noticia. Después completar la reauditoría de Lengua 2.º y continuar 3.º–6.º, Ciencias, Matemática, demás áreas y optativas. La cobertura pendiente sigue registrada en `avance.md` y `matriz.csv`; no se ha cambiado a completa.

Control de trigonometría: la descripción original sí está disponible en el chat anterior: resolver alturas/distancias utilizando seno, coseno y tangente; identificar datos, seleccionar razón, calcular y explicar procedimientos/resultados. Recuperarla fielmente al implementar Matemática 6.º, sin sustituirla por una descripción inventada.
