import { useEffect, useState } from 'react';
import { listeners, type Notice } from './feedback-store';
export function Toaster() {
  const [notices, setNotices] = useState<Notice[]>([]);
  useEffect(() => { const timers = new Set<ReturnType<typeof setTimeout>>(); const listener = (notice: Notice) => { setNotices(current => [...current.slice(-2), notice]); const timer = setTimeout(() => { setNotices(current => current.filter(item => item.id !== notice.id)); timers.delete(timer); }, 5000); timers.add(timer); }; listeners.add(listener); return () => { listeners.delete(listener); timers.forEach(clearTimeout); }; }, []);
  return <div className="schedule-polymet-theme fixed bottom-4 right-4 z-[200] flex max-w-sm flex-col gap-2" aria-live="polite" aria-atomic="false">{notices.map(notice => <div key={notice.id} role={notice.tone === 'error' ? 'alert' : 'status'} className="rounded-xl border border-border bg-card p-4 text-sm text-card-foreground shadow-lg"><div className="font-medium">{notice.message}</div>{notice.description && <div className="mt-1 text-xs text-muted-foreground">{notice.description}</div>}<button type="button" aria-label="Cerrar aviso" className="mt-2 text-xs text-muted-foreground" onClick={() => setNotices(current => current.filter(item => item.id !== notice.id))}>Cerrar</button></div>)}</div>;
}
