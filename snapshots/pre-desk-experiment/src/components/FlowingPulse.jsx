import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// A section owns one itinerary. Finish every leg before returning to the source.
export function FlowingPulse({ d, legs, reduced = false, duration = 3.5, scope, color = '#a9edf4', onArrival, onLegStart, activation = 'visible', repeat = true, delay = 0, repeatDelay = 0.65, legGap = 0.3 }) {
  const root = useRef(null)
  const itinerary = legs || [d]
  const routeKey = itinerary.join('|')
  useEffect(() => {
    if (reduced || !routeKey) return
    const group = root.current
    const paths = [...group.querySelectorAll('path')]
    const head = group.querySelector('.pulse-head')
    const lengths = paths.map(path => path.getTotalLength())
    const total = lengths.reduce((sum, length) => sum + length, 0)
    const timeline = gsap.timeline({ paused: true, delay, repeat: repeat ? -1 : 0, repeatDelay })
    paths.forEach((path, index) => {
      const signal = { progress: 0 }
      const place = () => {
        const point = path.getPointAtLength(signal.progress * lengths[index])
        head.setAttribute('transform', `translate(${point.x} ${point.y})`)
      }
      timeline.to(signal, {
        progress: 1, duration: duration * lengths[index] / total, ease: 'none',
        onStart: () => { group.dataset.leg = String(index); head.style.opacity = '1'; onLegStart?.(index); place() },
        onUpdate: place,
        onComplete: () => { if (index === paths.length - 1) onArrival?.() },
      }).to({}, { duration: legGap })
    })
    timeline.to(head, { opacity: 0, duration: 0.2 })
    let visible = false
    let engaged = activation !== 'hover'
    const update = () => {
      const running = visible && engaged && !document.hidden
      group.dataset.running = String(running)
      if (running) timeline.play()
      else timeline.pause()
    }
    const target = scope ? document.querySelector(scope) : group.closest('section') || group.ownerSVGElement
    const enter = () => { engaged = true; update() }
    const leave = () => {
      if (activation !== 'hover' || target.matches(':hover') || target.contains(document.activeElement)) return
      engaged = false
      timeline.pause().progress(0)
      head.style.opacity = '0'
      update()
    }
    if (activation === 'hover') {
      target.addEventListener('pointerenter', enter)
      target.addEventListener('pointerleave', leave)
      target.addEventListener('focusin', enter)
      target.addEventListener('focusout', leave)
    }
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting
      update()
    }, { rootMargin: '-48px 0px -48px 0px' })
    observer.observe(target)
    document.addEventListener('visibilitychange', update)
    return () => {
      timeline.kill(); observer.disconnect(); document.removeEventListener('visibilitychange', update)
      target.removeEventListener('pointerenter', enter); target.removeEventListener('pointerleave', leave)
      target.removeEventListener('focusin', enter); target.removeEventListener('focusout', leave)
    }
  }, [routeKey, reduced, duration, scope, onArrival, onLegStart, activation, repeat, delay, repeatDelay, legGap])
  if (reduced) return null
  return <g ref={root} className="flowing-pulse" style={{ color }}>
    {itinerary.map((route, index) => <path key={index} d={route} fill="none" stroke="none" />)}
    <g className="pulse-head" style={{ opacity: 0 }}><circle r="6" fill="currentColor" opacity=".12" /><circle r="3.5" fill="currentColor" opacity=".3" /><circle r="1.8" fill="#f5ffff" /></g>
  </g>
}
