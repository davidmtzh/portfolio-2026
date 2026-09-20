import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
const GamePreview = lazy(() => import('./GamePreview'))
const WorkstationScene = lazy(() => import('./WorkstationScene'))
class PreviewBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <div className="workstation-fallback"><p>The 3D preview could not load.</p><a className="text-link" href="https://github.com/cmartinez1542/Quintex-RPG" target="_blank" rel="noreferrer">Explore the Unity project ↗</a></div> : this.props.children
  }
}
export function GameTerminal({ reduced }) {
  const [state, setState] = useState('standby')
  const [powered, setPowered] = useState(false)
  const [stage, setStage] = useState(0)
  const root = useRef(null)
  const inView = useInView(root, { amount: 0.05 })
  const loadScene = useInView(root, { margin: '600px', once: true })
  const powerLatched = useRef(false)
  useEffect(() => {
    const power = () => {
      if (powerLatched.current) return
      powerLatched.current = true
      setPowered(true)
    }
    window.addEventListener('quintex:power', power)
    return () => window.removeEventListener('quintex:power', power)
  }, [])
  // One clock owns the entire startup; scrolling and pointer movement cannot restart it.
  useEffect(() => {
    if (!powered) return
    const timings = [0, 160, 430, 650, 850, 1100, 1350, 1650]
    const timers = timings.map((delay, index) => setTimeout(() => setStage(current => Math.max(current, index + 1)), reduced ? 0 : delay))
    return () => timers.forEach(clearTimeout)
  }, [powered, reduced])
  const screenOn = stage >= 3
  useEffect(() => {
    const next = { booting: ['scan', 1100], scan: ['expanding', 850], expanding: ['running', 650] }[state]
    if (!next) return
    const id = setTimeout(() => setState(next[0]), reduced ? 0 : next[1])
    return () => clearTimeout(id)
  }, [state, reduced])
  const engage = () => { if (reduced) window.dispatchEvent(new Event('quintex:power')) }
  const insert = () => { if (screenOn) setState(state === 'running' ? 'standby' : 'booting') }
  return <section id="quintex" aria-label="Hidden arcade" onPointerEnter={engage} onFocus={engage} className={`game-section section-shell secret-arcade cinematic-arcade ${powered ? 'terminal-powered' : ''} ${screenOn ? 'screen-ready' : ''}`} ref={root} data-power-stage={stage}>
    <div className="workstation-scene" data-state={state}>
      <PreviewBoundary><Suspense fallback={<div className="workstation-loading" role="status">Preparing the workstation…</div>}>
        {loadScene && <WorkstationScene stage={stage} state={state} screenOn={screenOn} reduced={reduced} visible={inView} onInsert={insert}>
          {state === 'standby' ? <div className={`physical-standby ${stage === 2 ? 'screen-flicker' : ''}`}><p>Insert Cartridge</p></div> : state !== 'running' ? <div className="physical-boot" role="status" aria-label={state === 'booting' ? 'Loading Quintex RPG' : 'Starting game'}>{state === 'booting' ? <p>Loading…</p> : state === 'scan' ? <span className="screen-boot-line" /> : null}</div> : <Suspense fallback={<div className="physical-boot">Loading…</div>}><GamePreview reduced={reduced} visible={inView}/></Suspense>}
        </WorkstationScene>}
      </Suspense></PreviewBoundary>
    </div>
  </section>
}

