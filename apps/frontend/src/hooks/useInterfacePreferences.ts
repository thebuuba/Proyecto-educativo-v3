import { useSyncExternalStore } from 'react'

const SIDEBAR_KEY = 'aulabase:sidebar-expanded'
const MOTION_KEY = 'aulabase:reduced-motion'
const CHANGE_EVENT = 'aulabase:interface-preferences-changed'
const MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function readPreference(key: string) {
  try {
    return window.localStorage.getItem(key) === 'true'
  } catch {
    return false
  }
}

function savePreference(key: string, value: boolean) {
  try {
    window.localStorage.setItem(key, String(value))
    window.dispatchEvent(new Event(CHANGE_EVENT))
    return true
  } catch {
    return false
  }
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === SIDEBAR_KEY || event.key === MOTION_KEY) callback()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener(CHANGE_EVENT, callback)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(CHANGE_EVENT, callback)
  }
}

const readSidebar = () => readPreference(SIDEBAR_KEY)
const readMotion = () => readPreference(MOTION_KEY)
const serverSnapshot = () => false

export const setSidebarExpanded = (value: boolean) => savePreference(SIDEBAR_KEY, value)
export const setReduceAnimations = (value: boolean) => savePreference(MOTION_KEY, value)

export function isMotionReduced() {
  return readMotion() || (typeof window !== 'undefined' && (window.matchMedia?.(MOTION_QUERY).matches ?? false))
}

function subscribeMotion(callback: () => void) {
  const unsubscribe = subscribe(callback)
  const media = window.matchMedia?.(MOTION_QUERY)
  media?.addEventListener?.('change', callback)
  return () => {
    unsubscribe()
    media?.removeEventListener?.('change', callback)
  }
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, isMotionReduced, serverSnapshot)
}

export function useInterfacePreferences() {
  const sidebarExpanded = useSyncExternalStore(subscribe, readSidebar, serverSnapshot)
  const reduceAnimations = useSyncExternalStore(subscribe, readMotion, serverSnapshot)
  return { sidebarExpanded, reduceAnimations }
}
