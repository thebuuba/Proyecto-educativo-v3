import { useSyncExternalStore } from "react";

/** Suscripción segura a media queries (sin setState dentro de efectos). */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") return () => undefined;
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => (typeof window === "undefined" ? serverFallback : window.matchMedia(query).matches),
    () => serverFallback,
  );
}

/** Reloj que se actualiza cada minuto para estados "ahora / próxima clase". */
let minuteListeners = new Set<() => void>();
let minuteTimer: ReturnType<typeof setInterval> | null = null;
let currentMinute = Math.floor(Date.now() / 60000);

function subscribeMinute(listener: () => void) {
  minuteListeners.add(listener);
  if (!minuteTimer) {
    minuteTimer = setInterval(() => {
      const value = Math.floor(Date.now() / 60000);
      if (value !== currentMinute) {
        currentMinute = value;
        minuteListeners.forEach((l) => l());
      }
    }, 15000);
  }
  return () => {
    minuteListeners.delete(listener);
    if (minuteListeners.size === 0 && minuteTimer) {
      clearInterval(minuteTimer);
      minuteTimer = null;
      minuteListeners = new Set();
    }
  };
}

export function useMinuteClock(): Date {
  const minute = useSyncExternalStore(subscribeMinute, () => currentMinute, () => currentMinute);
  return new Date(minute * 60000);
}
