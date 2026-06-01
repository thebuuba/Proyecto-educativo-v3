# Diseño de registro individual de escuelas

## Objetivo

Corregir el registro público para que cada cuenta nueva cree una escuela
independiente y se convierta en administradora de esa escuela. El registro no
debe llamar endpoints protegidos de configuración antes de que exista la
cuenta.

## Problema actual

La página de registro llama `GET /settings/school` para calcular un slug
disponible antes de enviar el formulario. El controlador de configuración
requiere autenticación JWT, por lo que un visitante nuevo recibe
`401 Unauthorized` antes de que se ejecute `POST /auth/register`.

El frontend también envía `schoolName` y `slug`, pero el DTO de registro del
backend actualmente rechaza esos campos. Luego el backend vincula los usuarios
nuevos a la primera escuela existente y no asigna un rol de administrador.

## Contrato de la API

`POST /api/v1/auth/register` continúa siendo público y acepta:

```json
{
  "email": "admin@example.com",
  "password": "minimum-six-characters",
  "fullName": "School Administrator",
  "schoolName": "Example School",
  "slug": "example-school"
}
```

El endpoint devuelve la misma estructura de sesión autenticada que usa el
inicio de sesión: `user`, `token`, `appUser`, `roles` y `permissions`.

## Diseño del backend

El servicio de autenticación controla el registro. Normaliza el slug recibido,
usa `escuela` como valor alternativo cuando sea necesario y agrega sufijos
`-1`, `-2` y posteriores hasta encontrar un slug libre.

Dentro de una única transacción de Prisma, el registro:

1. Verifica que el correo no esté registrado.
2. Busca el rol global `admin`.
3. Crea una escuela nueva con el nombre solicitado y el slug disponible.
4. Crea el usuario con el ID de la escuela nueva y la contraseña cifrada.
5. Crea el vínculo activo entre el usuario y el rol de administrador.
6. Devuelve una sesión JWT que contiene el administrador de la escuela nueva.

Si algún paso falla, no queda una escuela o un usuario creado parcialmente.

## Diseño del frontend

La página de registro elimina la consulta de configuración previa al registro.
Envía el slug candidato generado localmente directamente a
`POST /auth/register`.

Cuando el registro termina correctamente, el frontend guarda la sesión JWT
devuelta en el contexto de autenticación existente y navega a la aplicación.
No llama `refreshAuth` antes de guardar el token.

## Manejo de errores

- Un correo existente devuelve `409 Email already registered`.
- Los campos inválidos del DTO devuelven `400`.
- La ausencia del rol global `admin` devuelve un error explícito del servidor.
- Las colisiones de slug se resuelven automáticamente en el backend.
- El frontend muestra el error del backend mediante el cliente API existente.

## Verificación

1. Enviar el formulario de registro sin token y confirmar que no llama una
   ruta protegida de configuración.
2. Confirmar que el registro devuelve `201`, un JWT, la escuela creada y el
   rol `admin`.
3. Confirmar que una segunda escuela con el mismo nombre recibe un slug con
   sufijo.
4. Confirmar que registrar un correo duplicado devuelve `409`.
5. Confirmar que la sesión devuelta puede acceder a un endpoint protegido.
6. Ejecutar las compilaciones del backend y frontend, reportando por separado
   los fallos preexistentes no relacionados.
