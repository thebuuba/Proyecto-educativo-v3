# Web pública de Aula Base: decisiones para publicar

El diseño de Polymet está integrado en `apps/frontend/src/modules/promo`. El registro e inicio de sesión usan la autenticación real de la aplicación. La contratación y los estados de pago son vistas previas y no procesan dinero.

## Antes de activar cobros

- Definir importes, moneda, impuestos, límites y funciones de cada plan en `data/plans-data.ts`.
- Aprobar renovación, cancelación, reembolsos y facturación; actualizar la página de precios y los términos.
- Elegir e integrar el proveedor de pago en backend. Verificar sus eventos con firma y guardar suscripciones en la base de datos antes de habilitar el botón de pago.
- Sustituir los estados de ejemplo de `/contratar/estado/:estado` por datos verificados por el servidor.

## Antes de publicar los documentos legales

- Confirmar razón social, RNC, dirección, correo de contacto y correo de privacidad.
- Revisar con asesoría legal los borradores de `data/legal-content.ts`, incluidos los campos marcados entre corchetes.
- Fijar versión y fecha de vigencia. El registro enlaza estos documentos y requiere aceptación.

## Antes de habilitar contacto

- Confirmar un correo institucional o conectar el formulario a un endpoint real.
- El formulario actual solo prepara una copia visible del mensaje. No indica que se haya enviado.

## Rutas públicas

`/`, `/precios`, `/contratar`, `/contratar/estado/:estado`, `/cuenta/suscripcion`, `/registro`, `/registro/confirma-correo`, `/login`, `/iniciar-sesion` (alias), `/contacto`, `/terminos` y `/privacidad`.
