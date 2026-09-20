import { useEffect, useRef } from 'react'

// Distance-based dashes: identical speed on straight edges and rounded corners.
export function BezelTrail({ powered, reduced, visible }) {
  const root = useRef(null)
  useEffect(() => {
    const svg = root.current, rects = [...svg.querySelectorAll('rect')]
    let length = 1, frame, previous = 0, distance = 0
    const measure = () => {
      const { width, height } = svg.getBoundingClientRect()
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      rects.forEach(rect => { rect.setAttribute('width', Math.max(1, width - 4)); rect.setAttribute('height', Math.max(1, height - 4)) })
      length = rects[0].getTotalLength()
      rects.forEach(rect => rect.setAttribute('stroke-dasharray', `8 ${length - 8}`))
    }
    const observer = new ResizeObserver(measure)
    observer.observe(svg)
    measure()
    const tick = now => {
      if (previous && !document.hidden) distance = (distance + Math.min(now - previous, 50) * .075) % length
      previous = now
      rects.forEach((rect, i) => rect.setAttribute('stroke-dashoffset', -((distance + i * 8) % length)))
      frame = requestAnimationFrame(tick)
    }
    if (powered && visible && !reduced) frame = requestAnimationFrame(tick)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [powered, reduced, visible])
  return <svg ref={root} className="bezel-streak" aria-hidden="true" style={{ opacity: powered ? 1 : 0 }}>{['#ff3434', '#ff8b21', '#ffe635', '#49e458', '#22caff', '#4363ff', '#b348ff'].map(color => <rect key={color} x="2" y="2" rx="12" fill="none" stroke={color} strokeWidth="1.5" />)}</svg>
}
