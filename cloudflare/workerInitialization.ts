export async function initializeWithRetry(initialize: () => Promise<void>) {
  try {
    await initialize()
  } catch {
    await initialize()
  }
}
