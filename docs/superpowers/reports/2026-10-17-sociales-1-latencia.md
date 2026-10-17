# Sociales 1.º: investigación de latencia sin cambio de comportamiento

Continuación de `970552872f9ef465d3eed0c538a9b2c504659539`. La fuente y catálogo de Development siguen publicados; este bloque no modifica datos, cuentas, permisos ni producción. No se hizo push.

Se compararon peticiones autenticadas de solo recomendación con las mismas cuatro descripciones, formatos, puntos, contexto QA y selecciones curriculares usadas antes. No se crearon actividades. Se conservaron los logs privados de cada experimento.

| Variante | Media de cuatro peticiones | Tres peticiones posteriores a la primera | Resultado |
|---|---:|---:|---|
| Fuente publicada, sin reutilización | 12.568ms | No medida como grupo separado | Referencia inicial |
| Solo elementos públicos, primera tanda | 10.497ms | 9.311ms | Mejora inicial, pendiente repetición |
| Elementos y ámbitos públicos | 10.692ms | 10.071ms | Sin beneficio adicional claro |
| Solo elementos, repetición final | 13.396ms | 14.462ms | No confirmó mejora sostenida |

La repetición de una petición idéntica produjo exactamente la misma propuesta JSON antes/después de reutilizar datos; se mantuvieron autorizaciones y mappings frescos, aislamiento por versión/ámbito y exclusiones. Las pruebas del prototipo también cubrieron borradores y límite de memoria. Esto demostraba consistencia del prototipo, **no una solución de rendimiento**.

Se retiraron ambos experimentos mediante edición de sus cambios locales. Servicio y pruebas vuelven exactamente al contenido de `97055287`; hash Git del servicio `19efb33c8e1ac1dce0ebe4595825c1d09a93de1f`. Se conservó el filtro de referentes excluidos. No se restauró la rama, no se ejecutó reset y no se tocaron borradores ni almacenamiento del navegador. No queda ninguna caché nueva en el producto.

Después de retirar el prototipo se recompiló `pnpm cloudflare:build` con éxito (dry-run,12,0s), se reinició un único Worker local y se repitió backend completo:45.622 pruebas/135 archivos aprobados. El asset servido coincide con el compilado y apunta exclusivamente a Development. Los builds backend/frontend ya aprobados del código publicado permanecen válidos; no se modificó frontend.

La latencia sigue pendiente: los datos muestran variación significativa, pero no aíslan la causa entre Auth, conexiones/consultas y emulación del Worker. El sondeo Node de lectura y las medidas HTTP no son recorridos equivalentes. Para retomarlo, instrumentar esas fronteras en Development antes de proponer otra optimización; no repetir este mismo experimento como si fuera nuevo.

No se subieron timeouts, cambiaron DNS/TLS, agregaron banners ni debilitaron permisos. Continuar la cobertura curricular independiente y la revisión de instrumentos. La prueba visual personal sigue pendiente del acceso mediante el enlace autorizado. [Continuación maestra](2026-10-17-secundaria-continuacion.md).
