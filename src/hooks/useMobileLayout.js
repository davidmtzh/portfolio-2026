import { useSyncExternalStore } from 'react'

const query = '(max-width: 850px), (pointer: coarse)'
const subscribe = callback => {
  const media = matchMedia(query)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}
export function useMobileLayout() {
  return useSyncExternalStore(subscribe, () => matchMedia(query).matches, () => false)
}
