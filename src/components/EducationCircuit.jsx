import { useEffect, useRef } from 'react'
import { useMobileLayout } from '../hooks/useMobileLayout'

export function EducationCircuit({ reduced }) {
  const ref = useRef(null)
  const mobile = useMobileLayout()
  useEffect(() => {
    const svg = ref.current, section = svg.closest('section'), grid = section.querySelector('.background-grid')
    const wires = [...svg.querySelectorAll('.education-wire')], heads = [...svg.querySelectorAll('.education-pulse')], gates = [...svg.querySelectorAll('.education-gate')]
    const columns = [...grid.children].map(column => [...column.querySelectorAll('.credential')])
    const pairs = columns[0].map((card, i) => [card, columns[1][i]])
    // Stacked records reveal independently rather than waiting for a
    // paired record much further down the mobile page.
    if (mobile) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      }, { threshold: 0, rootMargin: '0px 0px 40px 0px' })
      pairs.flat().forEach(card => observer.observe(card))
      return () => observer.disconnect()
    }
    let arrivals = []
    section.dataset.educationReveal = 'ready'
    let frame, visible = false, last = 0, elapsed = 0, lengths = [], horizontal = [], vertical = 0
    const measure = () => {
      const b = section.getBoundingClientRect(), g = grid.getBoundingClientRect()
      const width = b.width, height = b.height, mid = width / 2
      const top = g.top - b.top - 28, bottom = g.bottom - b.top - 8
      vertical = bottom - top
      arrivals = pairs.map(pair => .2 + .7 * Math.max(...pair.map(card => {
        const rect = card.getBoundingClientRect()
        return Math.max(0, Math.min(1, (rect.top - b.top + rect.height * .25 - top) / vertical))
      })))
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      const mobile = width < 700
      const xs = mobile ? [g.left - b.left + 2, g.left - b.left + 10, g.right - b.left - 2] : [g.left - b.left + 5, mid, g.right - b.left - 5]
      svg.querySelector('.education-entry').setAttribute('d', `M${mid} 2V${top}M${mid} ${bottom}V${height - 30}`)
      wires.forEach((wire, i) => {
        const x = xs[i]
        wire.setAttribute('d', `M${mid} ${top}H${x}V${bottom}H${mid}`)
        lengths[i] = wire.getTotalLength()
        horizontal[i] = Math.abs(mid - x)
        gates[i].setAttribute('transform', `translate(${x} ${(top + bottom) / 2})`)
      })
    }
    const resize = new ResizeObserver(measure)
    resize.observe(section); resize.observe(grid); measure()
    const tick = now => {
      frame = null
      if (visible && !document.hidden && !reduced) {
        if (last) elapsed += Math.min(now - last, 50)
        const progress = Math.min(elapsed / 8500, 1)
        pairs.forEach((pair, i) => {
          if (progress >= arrivals[i]) pair.forEach(card => card.classList.add('is-revealed'))
        })
        heads.forEach((head, i) => {
          const distance = progress < .2 ? horizontal[i] * progress / .2 : progress < .9 ? horizontal[i] + vertical * (progress - .2) / .7 : horizontal[i] + vertical + horizontal[i] * (progress - .9) / .1
          const p = wires[i].getPointAtLength(Math.min(distance, lengths[i]))
          head.setAttribute('cx', p.x); head.setAttribute('cy', p.y)
          head.style.opacity = progress < 1 ? 1 : 0
        })
        section.dataset.educationPower = progress >= .22 ? 'on' : 'off'
      }
      last = now
      if (visible && !document.hidden && elapsed < 8500) frame = requestAnimationFrame(tick)
    }
    const resume = () => {
      last = 0
      if (visible && !document.hidden && !reduced && elapsed < 8500 && !frame) frame = requestAnimationFrame(tick)
    }
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      last = 0
      if (!visible) heads.forEach(head => { head.style.opacity = 0 })
      resume()
    }, { threshold: .15 })
    intersection.observe(section)
    document.addEventListener('visibilitychange', resume)
    if (reduced) pairs.flat().forEach(card => card.classList.add('is-revealed'))
    return () => { document.removeEventListener('visibilitychange', resume); resize.disconnect(); intersection.disconnect(); cancelAnimationFrame(frame); delete section.dataset.educationPower; delete section.dataset.educationReveal; pairs.flat().forEach(card => card.classList.remove('is-revealed')) }
  }, [reduced, mobile])
  return <svg ref={ref} className="education-circuit" aria-hidden="true">
    <path className="education-entry" />
    {[0, 1, 2].map(i => <g key={i}><path className="education-wire"/><circle className="education-pulse" r="2.3"/><g className="education-gate">{i === 0 ? <path d="M-10 -9Q0 -4 10 -9Q10 4 0 10Q-10 4 -10 -9Z"/> : i === 1 ? <path d="M-9 -9H9V1A9 9 0 0 1 -9 1Z"/> : <><path d="M-8 -9H8L0 6Z"/><circle cy="9" r="3"/></>}</g></g>)}
  </svg>
}


