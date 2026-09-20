import { useEffect, useState } from 'react'
import { FlowingPulse } from './FlowingPulse'

const powerQuintex = () => window.dispatchEvent(new Event('quintex:power'))

// Measure the real section edges so the connecting wire survives responsive layout changes.
export function ContinuousCircuit({ reduced }) {
  const [geometry, setGeometry] = useState(null)
  const [arcadePowered, setArcadePowered] = useState(false)
  useEffect(() => {
    const latch = () => setArcadePowered(true)
    window.addEventListener('quintex:power', latch)
    return () => window.removeEventListener('quintex:power', latch)
  }, [])
  useEffect(() => {
    const main = document.querySelector('main')
    const core = document.querySelector('.counter-circuit')
    const sections = [...document.querySelectorAll('main > section')].slice(1)
    if (!main || !core || !sections.length) return
    let frame
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const origin = main.getBoundingClientRect()
        const box = el => { const r = el.getBoundingClientRect(); return { x: r.left - origin.left, y: r.top - origin.top, width: r.width, bottom: r.bottom - origin.top } }
        const boxes = sections.map(box), c = box(core)
        const mid = c.x + c.width / 2
        const routes = boxes.map((b, i) => {
          const start = b.y - 30
          const end = boxes[i + 1] ? boxes[i + 1].y - 30 : b.bottom - 10
          const x = Math.max(8, b.x - 14)
          const turn = boxes[i + 1] ? b.bottom - 45 : b.bottom - 10
          const approach = `V${b.y + 22}H${x}`
          const continuation = `${approach}V${turn}H${mid}V${end}`
          if (sections[i].id === 'story') {
            const journey = box(document.querySelector('.story-journey'))
            return { id: 'story', start, end, gate: b.y - 12, wire: `M${mid} ${start}V${b.y - 22}M${mid} ${b.y + 2}V${b.y + 22}H${journey.x + journey.width - 1}V${journey.y}M${journey.x + journey.width / 2} ${journey.bottom}V${end}`, pulse: null }
          }
          if (sections[i].id === 'work') {
            const outputs = document.querySelector('.output-system')
            const o = box(outputs)
            const entryX = matchMedia('(max-width:600px)').matches ? o.x + 8 : o.x + o.width / 2
            const sourceY = o.y + 16
            const wire = `M${mid} ${start}V${b.y - 22}M${mid} ${b.y + 2}V${b.y + 22}H${x}V${sourceY}H${entryX}`
            const exit = `M${entryX} ${o.bottom - 16}V${o.bottom + 12}H${x}V${turn}H${mid}V${end}`
            return { id: 'work', start, end, gate: b.y - 12, wire: `${wire}${exit}`, pulse: null }
          }
          if (sections[i].id === 'background') {
            return { id: 'background', start, end, gate: b.y - 12, wire: `M${mid} ${start}V${b.y - 22}M${mid} ${b.y + 2}M${mid} ${b.bottom - 30}V${end}`, pulse: null }
          }
          if (sections[i].id === 'quintex') {
            const port = document.querySelector('.workstation-power-port')
            const monitor = box(port || document.querySelector('.workstation-scene'))
            return { id:'quintex', start, end:monitor.y, gate:b.y-12,
              wire:`M${mid} ${start}V${b.y-22}M${mid} ${b.y+2}V${monitor.y}`,
              pulse:port ? `M${mid} ${start}V${monitor.y}` : null }
          }
          if (sections[i].id === 'featured') {
            const node = box(document.querySelector('.case-index'))
            const railX = Math.max(b.x + 8,node.x - 24)
            return { id:'featured',start,end,gate:b.y-12,wire:`M${mid} ${start}V${b.y-22}M${mid} ${b.y+2}V${b.y+22}H${railX}V${turn}H${mid}V${end}`,pulse:null }
          }
          return { id: sections[i].id, start, end, gate: b.y - 12, wire: `M${mid} ${start}V${b.y - 22}M${mid} ${b.y + 2}${continuation}`, pulse: `M${mid} ${start}${continuation}` }
        })
        const board = box(document.querySelector('.counter-board'))
        setGeometry({ width: origin.width, height: origin.height, mid, source: c.bottom, lead: `M${mid} ${board.bottom}V${routes[0].start}`, routes })
      })
    }
    const observer = new ResizeObserver(measure)
    ;[main, core, ...sections].forEach(el => observer.observe(el))
    document.fonts.ready.then(measure)
    window.addEventListener('journey:layout',measure)
    measure()
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('journey:layout',measure) }
  }, [])
  if (!geometry) return null
  return <svg className="continuous-circuit" width={geometry.width} height={geometry.height} viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true">
    <path d={geometry.lead} className="circuit-wire" />
    <circle cx={geometry.mid} cy={geometry.source} r="3" className="circuit-terminal" />
    {geometry.routes.map(route => <g key={route.id} data-section-circuit={route.id}>
      <path d={route.wire} className="circuit-wire" />
      <circle cx={geometry.mid} cy={route.start} r="3" className="circuit-terminal" />
      <g transform={`translate(${geometry.mid} ${route.gate})`} className="section-inverter">
        <path d="M-8 -10H8L0 8Z" /><circle cx="0" cy="11" r="3" />
      </g>
      {route.pulse && !(route.id === 'quintex' && arcadePowered) && <FlowingPulse d={route.pulse} reduced={reduced} duration={route.id === 'quintex' ? 1.2 : 8} scope={`#${route.id}`} activation="hover" repeat={route.id !== 'quintex'} onArrival={route.id === 'quintex' ? powerQuintex : undefined} />}
    </g>)}
    <circle cx={geometry.mid} cy={geometry.routes.at(-1).end} r="3" className="circuit-terminal" />
  </svg>
}
