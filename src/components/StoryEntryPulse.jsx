import { useEffect, useRef } from 'react'

// The entry wire lives outside the pinned cards, so its pulse must too.
export function StoryEntryPulse({ d, reduced, eventName = 'journey:entry-progress' }) {
  const path = useRef(null), head = useRef(null), progress = useRef(-1)
  useEffect(() => {
    const draw = () => {
      const active = !reduced && progress.current >= 0 && progress.current <= 1
      head.current.style.opacity = active ? '1' : '0'
      if (active) {
        const point = path.current.getPointAtLength(path.current.getTotalLength() * progress.current)
        head.current.setAttribute('transform', `translate(${point.x} ${point.y})`)
      }
    }
    const update = event => { progress.current = event.detail; draw() }
    window.addEventListener(eventName, update)
    draw()
    return () => window.removeEventListener(eventName, update)
  }, [d, reduced, eventName])
  return <g><path ref={path} d={d} fill="none" stroke="none" /><g ref={head} style={{ opacity:0 }}><circle r="5" fill="#8beaff" opacity=".22" /><circle r="2" fill="#efffff" /></g></g>
}
