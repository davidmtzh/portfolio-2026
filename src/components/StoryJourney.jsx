import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMobileLayout } from '../hooks/useMobileLayout'

gsap.registerPlugin(ScrollTrigger)

const chapters = [
  ['01', 'A foundation in electronics.', 'An associate’s in electronics, followed by five semesters of university engineering, taught me to trace a problem to its source.', 'Electronics & physical systems'],
  ['02', 'A degree in computer science.', 'From an associate degree for transfer to a B.S. in Computer Science, I built on that foundation with algorithms, software architecture, databases, and intelligent systems.', 'Computer science & software'],
  ['03', 'A human perspective.', 'An associate degree for transfer in psychology added another way to understand problems: through the people experiencing them.', 'Psychology & people'],
  ['04', 'Knowledge worth sharing.', 'Teaching electronics, after-school coding, and K–12 STEM shaped how I communicate. A good system needs to make sense to the people who use it.', 'Teaching & communication'],
]
function Gate({ type, x, y, angle = 0 }) {
  return <g className="journey-gate" transform={`translate(${x} ${y}) rotate(${angle})`}>
    {type === 'and' && <><path d="M-14 -15H0A15 15 0 0 1 0 15H-14Z" /><path className="gate-lead" d="M-25 0V-8H-14M-25 0V8H-14M15 0H25" /></>}
    {type === 'not' && <><path d="M-12 -12L10 0L-12 12Z" /><circle cx="14" cy="0" r="4" /><path className="gate-lead" d="M-25 0H-12M18 0H25" /></>}
    {type === 'or' && <><path d="M-16 -15Q7 -17 20 0Q7 17 -16 15Q-5 0 -16 -15Z" /><path className="gate-lead" d="M-25 0V-8H-12M-25 0V8H-12M20 0H25" /></>}
  </g>
}
export function StoryJourney({ reduced }) {
  const mobile = useMobileLayout()
  const root = useRef(null)
  const track = useRef(null)
  const focusCard = useRef(null)
  const [layout, setLayout] = useState(null)
  useEffect(() => {
    const element = root.current
    let frame
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = element.getBoundingClientRect()
        const cards = [...element.querySelectorAll('.journey-card')].map(el => { const b = el.getBoundingClientRect(); return { l:b.left-r.left, r:b.right-r.left, t:b.top-r.top, b:b.bottom-r.top, x:b.left-r.left+b.width/2, y:b.top-r.top+b.height/2 } })
        const [a,b,c,d] = cards, narrow = matchMedia('(max-width:1200px), (max-height:850px)').matches
        const paths = [`M${r.width-1} 0V${a.y}H${a.r}`]
        const gates = []
        if (narrow) {
          cards.slice(0,3).forEach((card,i) => { const next=cards[i+1]; paths.push(`M${card.x} ${card.b}V${next.t}`); gates.push({type:['and','not','or'][i],x:card.x,y:(card.b+next.t)/2,angle:90}) })
        } else {
          paths.push(`M${a.l} ${a.y}H${b.r}`, `M${b.x} ${b.b}V${c.t}`, `M${c.r} ${c.y}H${d.l}`)
          gates.push({type:'and',x:(a.l+b.r)/2,y:a.y,angle:180},{type:'not',x:b.x,y:(b.b+c.t)/2,angle:90},{type:'or',x:(c.r+d.l)/2,y:c.y})
        }
        paths.push(`M${d.r} ${d.y}H${r.width-1}V${r.height}H${r.width/2}`)
        const bottomRight = card=>`V${card.b-9}Q${card.r} ${card.b} ${card.r-9} ${card.b}`
        const leftSide = card=>`H${card.l+9}Q${card.l} ${card.t} ${card.l} ${card.t+9}V${card.b-9}Q${card.l} ${card.b} ${card.l+9} ${card.b}`
        const borders = narrow
          ? [`M${a.r} ${a.y}${bottomRight(a)}H${a.x}`, ...[b,c].map(card=>`M${card.x} ${card.t}${leftSide(card)}H${card.x}`), `M${d.x} ${d.t}${leftSide(d)}H${d.r-9}Q${d.r} ${d.b} ${d.r} ${d.b-9}V${d.y}`]
          : [`M${a.r} ${a.y}V${a.t+9}Q${a.r} ${a.t} ${a.r-9} ${a.t}H${a.l+9}Q${a.l} ${a.t} ${a.l} ${a.t+9}V${a.y}`, `M${b.r} ${b.y}${bottomRight(b)}H${b.x}`, `M${c.x} ${c.t}${leftSide(c)}H${c.r-9}Q${c.r} ${c.b} ${c.r} ${c.b-9}V${c.y}`, `M${d.l} ${d.y}V${d.t+9}Q${d.l} ${d.t} ${d.l+9} ${d.t}H${d.r-9}Q${d.r} ${d.t} ${d.r} ${d.t+9}V${d.y}`]
        const itinerary = paths.flatMap((path,i)=>i<4?[path,borders[i]]:[path])
        // Card 03 alone uses its right edge, preserving both connection points.
        itinerary[5] = narrow
          ? `M${c.x} ${c.t}H${c.r-9}Q${c.r} ${c.t} ${c.r} ${c.t+9}V${c.b-9}Q${c.r} ${c.b} ${c.r-9} ${c.b}H${c.x}`
          : `M${c.x} ${c.t}H${c.r-9}Q${c.r} ${c.t} ${c.r} ${c.t+9}V${c.y}`
        setLayout({width:r.width,height:r.height,paths,gates,itinerary,cards,narrow,viewport:innerHeight})
      })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    element.querySelectorAll('.journey-card').forEach(el=>observer.observe(el))
    document.fonts.ready.then(measure); measure()
    let lastWidth = innerWidth
    const resize = () => {
      // Browser chrome resizing during a swipe must not rebuild scroll timelines.
      if (matchMedia('(pointer: coarse), (max-width:850px)').matches && lastWidth === innerWidth) return
      lastWidth = innerWidth
      measure()
    }
    window.addEventListener('resize',resize)
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize',resize) }
  }, [])
  useEffect(() => {
    if (!layout) return
    const element = root.current, wrapper = track.current, section = element.closest('section')
    const cards = [...element.querySelectorAll('.journey-card')]
    if (mobile) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-readable')
            observer.unobserve(entry.target)
          }
        })
      }, { threshold: 0, rootMargin: '0px 0px 40px 0px' })
      cards.forEach(card => observer.observe(card))
      return () => { observer.disconnect(); cards.forEach(card => card.classList.remove('is-readable')) }
    }
    if (reduced) return
    const pinned = !layout.narrow && layout.height < innerHeight - 96
    const distance = Math.max(900, layout.height * 1.5)
    wrapper.dataset.pinned = String(pinned)
    const paths = [...element.querySelectorAll('.journey-motion-path')]
    const lengths = paths.map(path=>path.getTotalLength())
    const head = element.querySelector('.journey-pulse')
    const state = { phase: 0 }
    // The light spends most of the scroll distance at a card, not in transit.
    const stops = pinned ? [0, .06, .24, .29, .47, .52, .70, .75, .94, 1] : (() => {
      const span = layout.height + innerHeight * .1
      const arrivals = layout.cards.map(card=>(card.t + Math.min((card.b-card.t)*.4,180) + innerHeight*.12)/span)
      const result = [0]
      arrivals.forEach((arrival,i)=>result.push(arrival, i<3 ? arrivals[i+1] - Math.min(.065,(arrivals[i+1]-arrival)*.25) : .94))
      return [...result,1]
    })()
    const update = () => {
      const phase = Math.min(state.phase,8.99999), part = Math.floor(phase)
      window.dispatchEvent(new CustomEvent('journey:entry-progress', { detail: phase < 1 ? phase : -1 }))
      window.dispatchEvent(new CustomEvent('journey:exit-progress', { detail: state.phase >= 8 ? Math.min(1, state.phase - 8) : -1 }))
      head.style.visibility = phase < 1 || phase >= 8 ? 'hidden' : 'visible'
      element.dataset.started = String(state.phase > 0)
      const point = paths[part].getPointAtLength((phase-part)*lengths[part])
      head.setAttribute('transform',`translate(${point.x} ${point.y})`)
      const selected = phase < 1 ? -1 : Math.min(3,Math.floor((phase-1)/2))
      element.dataset.activeCard = String(selected)
      element.dataset.phase = phase.toFixed(3)
      cards.forEach((card,i)=>{
        card.classList.toggle('is-current',i===selected)
        card.style.setProperty('--charge',i===selected ? String(Math.min(1,Math.max(0,phase-(i*2+1)))) : '0')
      })
      element.style.setProperty('--journey-power',String(selected<0?0:.2+phase/12))
      section.style.setProperty('--story-power',String(selected<0?0:Math.min(.65,.08+phase*.065)))
      const status = element.querySelector('.journey-scroll-status')
      status.textContent = selected<0 ? 'Scroll to follow the current ↓' : `${String(selected+1).padStart(2,'0')} / 04 · Scroll to follow my path`
      if (pinned) window.dispatchEvent(new Event('journey:layout'))
    }
    const timeline = gsap.timeline({ onUpdate:update, scrollTrigger:{ trigger:wrapper, pin:pinned ? element : false, pinSpacing:true, start:pinned?'top 48px':'top 62%', end:pinned?`+=${distance}`:'bottom 52%', scrub:.55, invalidateOnRefresh:true, onToggle:self=>element.dataset.inView=String(self.isActive) } })
    for(let i=0;i<9;i++) timeline.to(state,{phase:i+1,duration:Math.max(.015,stops[i+1]-stops[i]),ease:'none'})
    focusCard.current = index => {
      const trigger = timeline.scrollTrigger
      window.scrollTo({top:trigger.start+(trigger.end-trigger.start)*(stops[index*2+1]+.025),behavior:'instant'})
    }
    update(); ScrollTrigger.refresh()
    return () => {
      timeline.scrollTrigger.kill(); timeline.kill(); focusCard.current=null
      delete wrapper.dataset.pinned; wrapper.style.removeProperty('height')
      delete element.dataset.inView; delete element.dataset.started; delete element.dataset.activeCard; delete element.dataset.phase
      element.style.removeProperty('--journey-power'); section.style.removeProperty('--story-power')
      cards.forEach(card=>{card.classList.remove('is-current');card.style.removeProperty('--charge')})
    }
  }, [layout,reduced,mobile])
  return <div className="journey-scroll-track" ref={track}><div className="story-journey" ref={root}>
    {layout && <svg className="journey-wires" width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true">
      {layout.paths.map((path,i)=><path key={i} d={path} className="circuit-wire" />)}
      {layout.gates.map(gate=><Gate key={gate.type} {...gate} />)}
      <circle cx={layout.width-1} cy="0" r="3" className="circuit-terminal" />
    </svg>}
    {layout && !reduced && <svg className="journey-electricity" width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true">
      {layout.itinerary.map((path,i)=><path key={i} d={path} className="journey-motion-path" fill="none" stroke="none" />)}
      <g className="journey-pulse"><circle r="10" fill="#8beaff" opacity=".07"/><circle r="5" fill="#8beaff" opacity=".22"/><circle r="2" fill="#efffff"/></g>
    </svg>}
    {chapters.map(([number,title,body,tag],i)=><article key={number} className={`journey-card journey-card-${i}`} tabIndex="0" onFocus={e=>{if(e.currentTarget.matches(':focus-visible'))focusCard.current?.(i)}}>
      <span className="journey-step">{number} / My path</span><h3>{title}</h3><p>{body}</p><span className="journey-tag">{tag}</span>
    </article>)}
    <span className="journey-scroll-status" aria-hidden="true">{reduced?'':'Scroll to follow the current ↓'}</span>
  </div></div>
}

