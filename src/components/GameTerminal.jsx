import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { WoodenDesk } from './WoodenDesk'
const GamePreview = lazy(() => import('./GamePreview'))
class PreviewBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <div className="boot-screen"><p>The browser preview could not load.</p><a className="text-link" href="https://github.com/cmartinez1542/Quintex-RPG" target="_blank" rel="noreferrer">Explore the Unity project ↗</a></div> : this.props.children
  }
}
export function GameTerminal({ reduced }) {
  const [state, setState] = useState('standby')
  const [powered, setPowered] = useState(false)
  useEffect(() => {
    const power = () => setPowered(true)
    window.addEventListener('quintex:power', power)
    return () => window.removeEventListener('quintex:power', power)
  }, [])
  const [screenOn, setScreenOn] = useState(false)
  useEffect(() => {
    if (!powered) return
    const timer = setTimeout(() => setScreenOn(true), reduced ? 0 : 900)
    return () => clearTimeout(timer)
  }, [powered, reduced])
  const ready = powered
  const root = useRef(null)
  const inView = useInView(root, { amount: 0.15 })
  useEffect(() => {
    const sequence = { inserting: ['booting', 950], booting: ['scan', 900], scan: ['expanding', 850], expanding: ['running', 650] }
    const next = sequence[state]
    if (!next) return
    const id = setTimeout(() => setState(next[0]), reduced ? 0 : next[1])
    return () => clearTimeout(id)
  }, [state, reduced])
  return <section id="quintex" aria-label="Hidden arcade" onPointerEnter={() => { if (reduced) setPowered(true) }} onFocus={() => { if (reduced) setPowered(true) }} className={`game-section section-shell secret-arcade ${ready ? 'terminal-powered' : ''} ${screenOn ? 'screen-ready' : ''}`} ref={root}>
    <div className="game-station" data-state={state}>
      <WoodenDesk />
      <div className="monitor"><div className="monitor-screen">
        {state === 'standby' ? <div className="standby-screen">{powered && !screenOn && <span className="tv-power-flash" aria-hidden="true" />}{screenOn && <div className="arcade-prompt"><p>Insert Cartridge</p></div>}</div> : state !== 'running' ? <div className="boot-screen" role="status" aria-label={state === 'booting' ? 'Loading Quintex RPG' : 'Starting game'}>{state === 'booting' ? <p className="arcade-loading">Loading…</p> : state === 'scan' ? <span className="screen-boot-line" /> : null}</div> : <PreviewBoundary><Suspense fallback={<div className="boot-screen" aria-label="Loading game" />}><GamePreview reduced={reduced} visible={inView} /></Suspense></PreviewBoundary>}
      </div><div className="monitor-chin"><span className="monitor-vents" /><span className="arcade-led" /></div></div>
      <div className="monitor-neck" /><div className="monitor-foot" />
      <div className="console-stage">
        <svg className="console-cable" viewBox="0 0 500 210" preserveAspectRatio="none" aria-hidden="true"><path d="M250 0V18H425Q441 18 441 34V165Q441 181 425 181H360" /></svg>
        <button className={`cartridge secret-cartridge ${state !== 'standby' ? 'inserted' : ''}`} aria-disabled={!screenOn} disabled={state !== 'standby' && state !== 'running'} onClick={() => { if (screenOn) setState(state === 'running' ? 'standby' : 'inserting') }} aria-label={state === 'running' ? 'Eject cartridge' : 'Insert cartridge and start game'} title={state === 'running' ? 'Eject cartridge' : 'Insert cartridge'}><span className="cartridge-ridges" /><span className="cartridge-label"><span className="cartridge-cover" role="img" aria-label="Quintex fantasy village cover art" /><span className="cartridge-title">Quintex RPG</span></span><span className="cartridge-pins" /></button>
        <div className="arcade-console" aria-hidden="true"><div className="console-slot" /><span className="console-vents" /><span className="arcade-led" /><span className="console-switch" /></div>
      </div>
    </div>
  </section>
}

