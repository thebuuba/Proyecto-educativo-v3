import { BadRequestException, ServiceUnavailableException } from '@nestjs/common'

export function checkoutClientToken(): string {
  const token = process.env.PADDLE_SANDBOX_CLIENT_TOKEN ?? ''
  if (!/^test_[a-zA-Z0-9]{27}$/.test(token)) throw new ServiceUnavailableException('Configura el token público de Paddle Sandbox antes de contratar.')
  return token
}

export function checkoutBaseUrl(): string {
  let url: URL
  try { url = new URL(process.env.FRONTEND_URL ?? '') }
  catch { throw new ServiceUnavailableException('Configura la URL de la aplicación de pruebas.') }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  if ((url.protocol !== 'https:' && !(local && url.protocol === 'http:')) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new ServiceUnavailableException('La URL de la aplicación de pruebas debe ser un origen HTTPS o loopback local.')
  }
  return `${url.origin}/api/v1/billing/checkout-page`
}

export function checkoutPath(transactionId: string): string {
  if (!/^txn_[a-z\d]{26}$/.test(transactionId)) throw new BadRequestException('Identificador de transacción no válido.')
  return `/api/v1/billing/checkout-page?_ptxn=${transactionId}`
}

export function checkoutPageHtml(token: string, nonce: string): string {
  if (!/^test_[a-zA-Z0-9]{27}$/.test(token) || !/^[a-zA-Z0-9_-]+$/.test(nonce)) throw new ServiceUnavailableException('Configuración de checkout no válida.')
  // Paddle.js opens the server-verified _ptxn query automatically on initialization.
  // No client event grants coverage; only verified server processing can do that.
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Pago de prueba · AulaBase</title></head>
<body><main><h1>Pago de prueba</h1><p>Estás en Paddle Sandbox. Utiliza únicamente tarjetas de prueba.</p>
<p>El acceso se actualizará cuando el servidor confirme el pago.</p><p><a href="/cuenta/suscripcion">Volver a Suscripción y pagos</a></p>
<noscript>Activa JavaScript para abrir el checkout de prueba.</noscript></main>
<script nonce="${nonce}" src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>
<script nonce="${nonce}">Paddle.Environment.set("sandbox");Paddle.Initialize({token: ${JSON.stringify(token)}, checkout: {settings: {locale: "es", allowLogout: false, allowedPaymentMethods: ["card"]}}});</script>
</body></html>`
}
