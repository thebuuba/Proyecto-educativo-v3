export function clearDevServiceWorker() {
  if (!import.meta.env.DEV || !('serviceWorker' in navigator)) return

  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
    .then(() => caches.keys())
    .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
    .catch(() => undefined)
}
