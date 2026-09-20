import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function FolderTransmitter({ geometry, reduced }) {
  const root = useRef(null)
  const { x, y, endX, endY, feeds } = geometry
  useEffect(() => {
    const group = root.current
    const path = group.querySelector('.transmitter-feed')
    const head = group.querySelector('.transmitter-packet')
    const waves = [...group.querySelectorAll('.transmitter-wave')]
    const receiver = group.querySelector('.transmitter-receiver')
    let timeline
    const reset = () => {
      timeline?.kill()
      gsap.set([head, receiver, ...waves], { opacity:0 })
      waves.forEach(wave => wave.setAttribute('transform', `translate(${x} ${y+12})`))
    }
    const transmit = event => {
      const feed = feeds[event.detail.index]
      if (!feed || reduced) return
      reset()
      group.style.color = event.detail.color
      path.setAttribute('d', feed)
      const length = path.getTotalLength(), state = { progress:0 }
      const place = () => {
        const point = path.getPointAtLength(state.progress * length)
        head.setAttribute('transform', `translate(${point.x} ${point.y})`)
      }
      place()
      timeline = gsap.timeline()
        .set(head, { opacity:1 })
        .to(state, { progress:1, duration:.55, ease:'none', onUpdate:place })
        .set(head, { opacity:0 })
      // Three short wavefronts cross the open gap; the receiver glows on arrival.
      waves.forEach((wave, i) => {
        const signal = { progress:0 }
        const start = .55 + i * .12
        timeline.set(wave, { opacity:.75 }, start)
          .to(signal, { progress:1, duration:.55, ease:'none', onUpdate:() => {
            const t = signal.progress
            wave.setAttribute('transform', `translate(${x+(endX-x)*t} ${y+12+(endY-y-12)*t}) scale(${1+t*.45})`)
          } }, start)
          .set(wave, { opacity:0 }, start+.55)
      })
      timeline.to(receiver, { opacity:1, duration:.12 }, 1.10)
        .to(receiver, { opacity:0, duration:.65 }, 1.46)
    }
    window.addEventListener('work:transmit', transmit)
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) reset() })
    observer.observe(document.getElementById('work'))
    return () => { reset(); observer.disconnect(); window.removeEventListener('work:transmit', transmit) }
  }, [geometry, reduced, feeds, x, y, endX, endY])
  return <g ref={root} className="folder-transmitter" style={{ color:'#bca0f6' }}>
    <path className="transmitter-feed" fill="none" stroke="none" />
    <g className="transmitter-symbol" transform={`translate(${x} ${y})`}>
      <path d="M0 -14V8M-9 -9L0 1L9 -9M-6 8H6" />
      <circle cy="-14" r="2" />
    </g>
    {[0,1,2].map(i => <path key={i} className="transmitter-wave" d="M-9 -3Q0 5 9 -3" opacity="0" transform={`translate(${x} ${y+12})`} />)}
    <g className="transmitter-packet" opacity="0"><circle r="5" fill="currentColor" opacity=".2" /><circle r="2" fill="#f5ffff" /></g>
    <g className="transmitter-receiver" transform={`translate(${endX} ${endY})`} opacity="0"><circle r="10" fill="currentColor" opacity=".12" /><circle r="5" fill="currentColor" opacity=".35" /><circle r="2" fill="#fff" /></g>
  </g>
}
