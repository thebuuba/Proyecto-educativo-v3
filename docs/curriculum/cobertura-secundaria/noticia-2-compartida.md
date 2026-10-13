# La noticia de 2.º — definición compartida y cinco niveles

El módulo anterior se conserva y se comparte entre el motor y la alternativa editable del frontend. Se verifican escritura, análisis, comparación, noticiero, informe y debate. Las cuatro presentaciones reciben los mismos títulos, observaciones, descriptores y puntos en centésimas.

## Fuente y límites

La fuente sigue siendo el PDF aportado, SHA256 registrado en `revision.json`. La noticia de 2.º aparece en PDF 76 / impresa 75: tema `76d1d9e3-52af-58b4-a886-50daf7b4ed98` y tres procedimientos asociados. La anomalía de producción escrita de noticia en PDF 74 permanece registrada; no se reasigna a 2.º ni se presenta como procedimiento verificado de este grado.

Los criterios son adaptaciones de Aula Base. Informe y debate combinan el hecho noticioso con las dimensiones del producto pedido. No se declara aprobación de instrumentos por MINERD. Los cinco niveles distinguen evidencia pertinente, parcial, contradictoria y ausente; no repiten el objetivo seguido de modificadores generales. El noticiero permite apoyos de lectura o de acceso, sin exigir memorización o preguntas adicionales no solicitadas.

## Cambios y preservación

- `secondary-news-grade-two.ts` contiene la única definición de criterios para esas seis acciones. El backend reexporta el proveedor y la alternativa local utiliza el mismo compositor y reparto en centésimas.
- Se retiran las copias de informe y debate del frontend. Los títulos nuevos adoptan los nombres específicos que ya usaba el backend; los borradores anteriores conservan sus textos originales.
- Release `evaluation-2026.9` registra las definiciones base y referencias del módulo. `catalog-v8.ts` conserva íntegra la definición del release 8; se aceptan snapshots de los releases 7, 8 y 9. Los datos del release 8 y los snapshots existentes no se modificaron.
- El paquete compartido expone JavaScript compilado para Node. Vite y las pruebas utilizan explícitamente el código TypeScript de origen para mantener cambios y pruebas actuales. El flujo normal `pnpm build` compila las dependencias; para compilar únicamente el backend en un checkout nuevo, compilar antes `pnpm --filter @aula/shared build`.
- El creador, sus campos, selector, resumen y estilos permanecen iguales. La lectura de valores relativos sigue usando el formateador compartido.

## Evidencia

31 pruebas nuevas comparan seis acciones × cuatro formatos y comprueban cinco niveles y apoyos de lectura. Las pruebas de edición, puntaje pendiente, respuesta atrasada, resumen, guardado y reapertura de `GradingBook` siguen activas; el caso de borrador anterior conserva el título antiguo.

Verificación completa del bloque: backend 476 pruebas; frontend 534 pruebas. Compilaciones de paquetes compartidos, backend y frontend aprobadas; Cloudflare sólo en `--dry-run`.

[Persistencia HTTP local de los 24 casos](evidencias/persistencia-noticia-2.json): reintentos sin duplicados, edición manual con versión 2 enlazada a versión 1 y contenido anterior intacto. La ejecución se repitió con Node nativo, sin cargador TypeScript para el backend. Usa una sesión JWT sintética con guards reales y un docente asignado a una escuela ficticia; no demuestra login con contraseña. La escuela y cuenta ficticias se desactivan al finalizar.

El catálogo se instaló únicamente en Supabase local confirmado (puerto 54332): creación seguida de `UNCHANGED`, con fingerprints anteriores preservados. Sin publicación del Worker ni cambios remotos de DB.

Para repetir los casos de noticia, después del build y del catálogo local:

```powershell
pnpm exec node scripts/evaluation-instruments/verify-secondary-local.mjs <ruta-absoluta-al-CLI-pnpm.mjs> --news
```

La noticia de 2.º queda verificada para estas seis acciones. La anomalía de fuente, las demás consignas posibles y la revisión de Lengua 1.º siguen registradas: esto no certifica cobertura completa de toda secundaria.
