import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const patterns = [[0, 4], [1, 5, 6], [2, 7], [3, 4, 6]]

// One clock owns the input, processing flash, fan-out and display update.
export function CounterPulses({ input, feeds, reduced, onCharge, onArrival }) {
  const root = useRef(null)
  useEffect(() => {
    if (reduced) return
    const group = root.current
    const paths = [...group.querySelectorAll('path')]
    const heads = [...group.querySelectorAll('.counter-packet-head')]
    const lengths = paths.map(path => path.getTotalLength())
    const state = { input: 0, output: 0 }
    let cycle = 0
    let selected = patterns[0]
    const place = (index, progress) => {
      const point = paths[index].getPointAtLength(lengths[index] * progress)
      heads[index].setAttribute('transform', `translate(${point.x} ${point.y})`)
    }
    heads.forEach((_, index) => place(index, 0))
    const timeline = gsap.timeline({ paused: true, repeat: -1, repeatDelay: .65 })
      .call(() => {
        selected = patterns[cycle % patterns.length]
        state.input = 0; state.output = 0
        heads.forEach((head, index) => { place(index, 0); head.style.opacity = index === 0 ? '1' : '0' })
        onCharge(false)
      })
      .to(state, { input: 1, duration: .85, ease: 'none', onUpdate: () => place(0, state.input) })
      .call(() => { heads[0].style.opacity = '0'; onCharge(true) })
      .to({}, { duration: .12 })
      .call(() => selected.forEach(index => { heads[index + 1].style.opacity = '1' }))
      .to(state, {
        output: 1, duration: 1.1, ease: 'none',
        onUpdate: () => selected.forEach(index => place(index + 1, state.output)),
        onComplete: () => { onArrival(); onCharge(false); cycle += 1 },
      })
      .to(heads, { opacity: 0, duration: .16 })
    let visible = false
    const update = () => { if (visible && !document.hidden) timeline.play(); else timeline.pause() }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
    observer.observe(group.closest('.counter-circuit'))
    document.addEventListener('visibilitychange', update)
    return () => { timeline.kill(); observer.disconnect(); document.removeEventListener('visibilitychange', update); onCharge(false) }
  }, [input, feeds, reduced, onCharge, onArrival])
  if (reduced) return null
  return <g ref={root} aria-hidden="true">
    {[input, ...feeds].map((route, index) => <g key={route}>
      <path d={route} fill="none" stroke="none" />
      <g className="counter-packet-head" style={{ opacity: 0 }}>
        <circle r="6" fill={index ? '#efb66b' : '#a9edf4'} opacity=".12" />
        <circle r="3.5" fill={index ? '#efb66b' : '#a9edf4'} opacity=".3" />
        <circle r="1.8" fill="#fff5df" />
      </g>
    </g>)}
  </g>
}
