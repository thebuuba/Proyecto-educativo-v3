export async function clearDevServiceWorker() {
  if (!import.meta.env.DEV || !('serviceWorker' in navigator)) return

  try {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map((registration) => registration.unregister()))

    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
  } catch {
    // Development cache cleanup should never block the app from rendering.
  }
}
