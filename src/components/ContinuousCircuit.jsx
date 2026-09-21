import { useEffect, useState } from 'react'
import { FlowingPulse } from './FlowingPulse'
import { StoryEntryPulse } from './StoryEntryPulse'
import { FolderTransmitter } from './FolderTransmitter'

const powerQuintex = () => window.dispatchEvent(new Event('quintex:power'))

// Measure the real section edges so the connecting wire survives responsive layout changes.
export function ContinuousCircuit({ reduced }) {
  const [geometry, setGeometry] = useState(null)
  const [arcadePowered, setArcadePowered] = useState(false)
  const [counterPulse, setCounterPulse] = useState(0)
  const [featuredExit, setFeaturedExit] = useState(0)
  useEffect(() => {
    const send = () => setFeaturedExit(value => value + 1)
    window.addEventListener('featured:exit', send)
    return () => window.removeEventListener('featured:exit', send)
  }, [])
  useEffect(() => {
    const send = () => setCounterPulse(value => value + 1)
    window.addEventListener('counter:change', send)
    return () => window.removeEventListener('counter:change', send)
  }, [])
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
            const first = box(document.querySelector('.journey-card-0'))
            const entry = `M${mid} ${start}V${b.y+22}H${journey.x+journey.width-1}V${(first.y+first.bottom)/2}H${first.x+first.width}`
            const last = box(document.querySelector('.journey-card-3'))
            const exit = `M${last.x+last.width} ${(last.y+last.bottom)/2}H${journey.x+journey.width-1}V${journey.bottom}H${journey.x+journey.width/2}V${end}`
            return { id: 'story', entry, exit, start, end, gate: b.y - 12, wire: `M${mid} ${start}V${b.y - 22}M${mid} ${b.y + 2}V${b.y + 22}H${journey.x + journey.width - 1}V${journey.y}M${journey.x + journey.width / 2} ${journey.bottom}V${end}`, pulse: null }
          }
          if (sections[i].id === 'work') {
            const outputs = document.querySelector('.output-system')
            const o = box(outputs)
            const entryX = matchMedia('(max-width:600px)').matches ? o.x + 8 : o.x + o.width / 2
            const sourceY = o.y + 16
            const wire = `M${mid} ${start}V${b.y - 22}M${mid} ${b.y + 2}V${b.y + 22}H${x}V${sourceY}H${entryX}`
            const antennaY = o.bottom + 12
            const exit = `M${entryX} ${o.bottom - 16}V${antennaY-14}`
            const feeds = [...outputs.querySelectorAll('.folder-surface')].map((folder, index) => {
              const card = box(folder)
              const portX = matchMedia('(max-width:600px)').matches || index % 2 ? card.x : card.x+card.width
              return `M${portX} ${(card.y+card.bottom)/2}H${entryX}V${antennaY-14}`
            })
            return { id: 'work', transmitter:{ x:entryX, y:antennaY, endX:mid, endY:end, feeds }, start, end, gate: b.y - 12, wire: `${wire}${exit}`, pulse: [`M${mid} ${start}V${b.y - 22}`, `M${mid} ${b.y + 2}V${b.y + 22}H${x}V${sourceY}H${entryX}`] }
          }
          if (sections[i].id === 'background') {
            return { id: 'background', start, end, gate: b.y - 12, wire: `M${mid} ${start}V${b.y - 22}M${mid} ${b.y + 2}M${mid} ${b.bottom - 30}V${end}`, pulse: null }
          }
          if (sections[i].id === 'quintex') {
            const monitor = box(document.querySelector('.monitor'))
            return { id:'quintex', start, end:monitor.y, gate:b.y-12,
              wire:`M${mid} ${start}V${b.y-22}M${mid} ${b.y+2}V${monitor.y}`,
              pulse:`M${mid} ${start}V${monitor.y}` }
          }
          if (sections[i].id === 'contact') {
            const port = box(document.querySelector('.contact-port'))
            const portX = port.x + port.width / 2
            const form = box(document.querySelector('.contact-form'))
            const copy = box(document.querySelector('.contact-copy'))
            const stacked = form.y >= copy.bottom - 1
            // On stacked layouts follow the outside rail, then cross the empty
            // gap above the form. Never run a cable through the contact copy.
            const feed = stacked
              ? `V${b.y+22}H${x}V${port.y-25}H${portX}`
              : `V${b.y+22}H${portX}`
            // Feed the contact board directly from the section's center node.
            // The previous route joined the left rail first, which made the
            // pulse visibly travel away from the board before returning to it.
            const branch = stacked
              ? `M${x} ${port.y-25}H${portX}`
              : `M${mid} ${b.y + 22}H${portX}V${port.y - 25}`
            return { id:'contact', start, end, gate:b.y-12,
              contactFeed:`M${mid} ${start}${feed}V${port.y+4}`,
              wire:`M${mid} ${start}V${b.y-22}M${mid} ${b.y+2}${continuation}${branch}`,
              pulse:`M${mid} ${start}${continuation}` }
          }
          if (sections[i].id === 'featured') {
            const node = box(document.querySelector('.case-index'))
            const railX = Math.max(b.x + 8,node.x - 24)
            const lastNode = box(document.querySelectorAll('.case-index')[2])
            const release = `M${lastNode.x} ${(lastNode.y+lastNode.bottom)/2}H${railX}V${turn}H${mid}V${end}`
            return { id:'featured',release,start,end,gate:b.y-12,wire:`M${mid} ${start}V${b.y-22}M${mid} ${b.y+2}V${b.y+22}H${railX}V${turn}H${mid}V${end}`,pulse:null }
          }
          return { id: sections[i].id, start, end, gate: b.y - 12, wire: `M${mid} ${start}V${b.y - 22}M${mid} ${b.y + 2}${continuation}`, pulse: `M${mid} ${start}${continuation}` }
        })
        const board = box(document.querySelector('.counter-board'))
        const pin = box(document.querySelector('.display-output-pin'))
        const pinX = pin.x + pin.width / 2
        const pinY = pin.y + (pin.bottom - pin.y) / 2
        const rail = board.x + board.width * 700 / 720
        // Cross below the legend, never through its Display label.
        setGeometry({ width: origin.width, height: origin.height, mid, lead: `M${pinX} ${pinY}H${rail}V${c.bottom + 12}H${mid}V${routes[0].start}`, routes })
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
    {counterPulse > 0 && <FlowingPulse key={`counter-${counterPulse}`} d={geometry.lead} scope="#home" reduced={reduced} repeat={false} duration={1.2} color="#efb66b" />}
    {geometry.routes.map(route => <g key={route.id} data-section-circuit={route.id}>
      <path d={route.wire} className="circuit-wire" />
      {route.entry && <StoryEntryPulse d={route.entry} reduced={reduced} />}
      {route.exit && <StoryEntryPulse d={route.exit} reduced={reduced} eventName="journey:exit-progress" />}
      {route.transmitter && <FolderTransmitter geometry={route.transmitter} reduced={reduced} />}
      {route.contactFeed && <FlowingPulse d={route.contactFeed} scope="#contact" reduced={reduced} repeat={false} restartOnReentry duration={1.1} color="#73dbea" />}
      {route.release && featuredExit > 0 && <FlowingPulse key={`featured-exit-${featuredExit}`} d={route.release} scope="#featured" reduced={reduced} repeat={false} duration={.7} color="#ffda86" />}
      <circle cx={geometry.mid} cy={route.start} r="3" className="circuit-terminal" />
      <g transform={`translate(${geometry.mid} ${route.gate})`} className="section-inverter">
        <path d="M-8 -10H8L0 8Z" /><circle cx="0" cy="11" r="3" />
      </g>
      {route.pulse && !(route.id === 'quintex' && arcadePowered) && <FlowingPulse d={Array.isArray(route.pulse) ? undefined : route.pulse} legs={Array.isArray(route.pulse) ? route.pulse : undefined} reduced={reduced} duration={route.id === 'work' ? 2.4 : route.id === 'quintex' ? 1.2 : 8} scope={`#${route.id}`} activation={route.id === 'work' ? 'visible' : 'hover'} repeat={route.id !== 'quintex' && route.id !== 'work'} restartOnReentry={route.id === 'work'} onArrival={route.id === 'quintex' ? powerQuintex : undefined} />}
    </g>)}
    <circle cx={geometry.mid} cy={geometry.routes.at(-1).end} r="3" className="circuit-terminal" />
  </svg>
}
