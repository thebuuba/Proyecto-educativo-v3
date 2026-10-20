export type Notice = { id: number; message: string; description?: string; tone: 'success' | 'warning' | 'error' };
export const listeners = new Set<(notice: Notice) => void>();
let nextId = 0;
const notify = (tone: Notice['tone']) => (message: string, options?: { description?: string }) => { const notice = { id: ++nextId, message, description: options?.description, tone }; listeners.forEach(listener => listener(notice)); };
export const toast = { success: notify('success'), warning: notify('warning'), error: notify('error') };
