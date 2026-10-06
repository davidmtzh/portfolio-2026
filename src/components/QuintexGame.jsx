import { useEffect, useRef } from 'react'

export default function QuintexGame({ visible }) {
  const frame = useRef(null)
  useEffect(() => {
    const pause = () => frame.current?.contentWindow?.postMessage({ type: 'quintex:pause' }, window.location.origin)
    const ready = event => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return
      if (event.data?.type === 'quintex:ready' && !visible) pause()
    }
    if (!visible) pause()
    window.addEventListener('message', ready)
    return () => window.removeEventListener('message', ready)
  }, [visible])

  return <iframe ref={frame} className="quintex-game-frame" src="/game/quintex/index.html" title="Quintex RPG playable demo" allow="fullscreen; gamepad" allowFullScreen />
}
