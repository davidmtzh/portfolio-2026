import { useEffect, useRef } from 'react'

export function EducationCircuit({ reduced }) {
  const ref = useRef(null)
  useEffect(() => {
    const svg = ref.current, section = svg.closest('section'), grid = section.querySelector('.background-grid')
    const wires = [...svg.querySelectorAll('.education-wire')], heads = [...svg.querySelectorAll('.education-pulse')], gates = [...svg.querySelectorAll('.education-gate')]
    let frame, visible = false, last = 0, elapsed = 0, lengths = [], horizontal = [], vertical = 0
    const measure = () => {
      const b = section.getBoundingClientRect(), g = grid.getBoundingClientRect()
      const width = b.width, height = b.height, mid = width / 2
      const top = g.top - b.top - 28, bottom = g.bottom - b.top - 8
      vertical = bottom - top
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      const mobile = width < 700
      const xs = mobile ? [g.left - b.left + 2, g.left - b.left + 10, g.right - b.left - 2] : [g.left - b.left + 5, mid, g.right - b.left - 5]
      svg.querySelector('.education-entry').setAttribute('d', `M${mid} 2V${top}M${mid} ${bottom}V${height - 30}`)
      wires.forEach((wire, i) => {
        const x = xs[i]
        wire.setAttribute('d', `M${mid} ${top}H${x}V${bottom}H${mid}`)
        lengths[i] = wire.getTotalLength()
        horizontal[i] = Math.abs(mid - x)
        gates[i].setAttribute('transform', `translate(${x} ${bottom - 20})`)
      })
    }
    const resize = new ResizeObserver(measure)
    resize.observe(section); resize.observe(grid); measure()
    const tick = now => {
      if (visible && !document.hidden && !reduced) {
        if (last) elapsed += Math.min(now - last, 50)
        const progress = Math.min((elapsed % 4200) / 3200, 1)
        heads.forEach((head, i) => {
          const distance = progress < .2 ? horizontal[i] * progress / .2 : progress < .9 ? horizontal[i] + vertical * (progress - .2) / .7 : horizontal[i] + vertical + horizontal[i] * (progress - .9) / .1
          const p = wires[i].getPointAtLength(Math.min(distance, lengths[i]))
          head.setAttribute('cx', p.x); head.setAttribute('cy', p.y)
          head.style.opacity = progress < 1 ? 1 : 0
        })
        section.dataset.educationPower = progress >= .22 ? 'on' : 'off'
      }
      last = now
      frame = requestAnimationFrame(tick)
    }
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible) { elapsed = 0; section.dataset.educationPower = 'off'; heads.forEach(head => { head.style.opacity = 0 }) }
    }, { threshold: .15 })
    intersection.observe(section)
    if (!reduced) frame = requestAnimationFrame(tick)
    return () => { resize.disconnect(); intersection.disconnect(); cancelAnimationFrame(frame); delete section.dataset.educationPower }
  }, [reduced])
  return <svg ref={ref} className="education-circuit" aria-hidden="true">
    <path className="education-entry" />
    {[0, 1, 2].map(i => <g key={i}><path className="education-wire"/><circle className="education-pulse" r="2.3"/><g className="education-gate">{i === 0 ? <path d="M-10 -9Q0 -4 10 -9Q10 4 0 10Q-10 4 -10 -9Z"/> : i === 1 ? <path d="M-9 -9H9V1A9 9 0 0 1 -9 1Z"/> : <><path d="M-8 -9H8L0 6Z"/><circle cy="9" r="3"/></>}</g></g>)}
  </svg>
}


