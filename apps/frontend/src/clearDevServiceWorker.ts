export async function clearDevServiceWorker() {
  const isLocalHost = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
  if ((!import.meta.env.DEV && !isLocalHost) || !('serviceWorker' in navigator)) return

  try {
    const scope = new URL(import.meta.env.BASE_URL, window.location.origin).href
    const workerUrl = new URL('sw.js', scope).href
    const registrations = await navigator.serviceWorker.getRegistrations()
    const owned = registrations.filter((registration) => registration.scope === scope &&
      [registration.active, registration.waiting, registration.installing].some((worker) => worker?.scriptURL === workerUrl))
    await Promise.all(owned.map((registration) => registration.unregister()))
  } catch {
    // A stale local worker must never block rendering or trigger storage deletion.
  }
}
