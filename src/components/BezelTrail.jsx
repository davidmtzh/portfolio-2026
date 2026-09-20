import { useEffect, useRef } from 'react'

const colors = ['#ff3030', '#ff8c00', '#ffeb00', '#00e648', '#008cff', '#493cff', '#b52aff']

export function BezelTrail({ powered, reduced, visible }) {
  const root = useRef(null)
  const distance = useRef(0)
  useEffect(() => {
    const svg = root.current
    const tracks = [...svg.querySelectorAll('rect')]
    let length = 1, frame, previous = 0
    const place = () => tracks.forEach((track, i) => {
      track.setAttribute('stroke-dashoffset', -((distance.current + i * 9) % length))
    })
    const measure = () => {
      // Use local dimensions: the scene's CSS zoom must not distort the path.
      const width = svg.clientWidth, height = svg.clientHeight
      tracks.forEach(track => {
        track.setAttribute('width', Math.max(1, width - 4))
        track.setAttribute('height', Math.max(1, height - 4))
      })
      length = tracks[0].getTotalLength()
      tracks.forEach(track => track.setAttribute('stroke-dasharray', `9 ${Math.max(1, length - 9)}`))
      place()
    }
    const observer = new ResizeObserver(measure)
    observer.observe(svg)
    measure()
    const tick = now => {
      if (previous && !document.hidden) distance.current = (distance.current + Math.min(now - previous, 50) * .15) % length
      previous = now
      place()
      frame = requestAnimationFrame(tick)
    }
    if (powered && visible && !reduced) frame = requestAnimationFrame(tick)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [powered, visible, reduced])
  return <svg ref={root} className="bezel-streak" aria-hidden="true" style={{ opacity: powered ? 1 : 0 }}>
    {colors.map(color => <rect key={color} x="2" y="2" rx="20" fill="none" stroke={color} strokeWidth="2" />)}
  </svg>
}
