import { useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Hero } from './components/Hero'
import { Story, Background } from './components/Story'
import { ProjectExplorer } from './components/ProjectExplorer'
import { FeaturedProjects } from './components/FeaturedProjects'
import { Contact } from './components/Contact'
import { GameTerminal } from './components/GameTerminal'
import { ContinuousCircuit } from './components/ContinuousCircuit'
import { useReducedMotion } from './hooks/useReducedMotion'
import './App.css'
gsap.registerPlugin(ScrollTrigger)
export default function App() {
  const systemReduced = useReducedMotion()
  const [calm, setCalm] = useState(false)
  const reduced = systemReduced || calm
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const media = matchMedia('(min-width: 851px) and (pointer: fine)')
    let lenis
    const tick = time => lenis?.raf(time * 1000)
    const update = () => {
      gsap.ticker.remove(tick); lenis?.destroy(); lenis = null
      if (reduced || !media.matches) return
      lenis = new Lenis({ duration: 0.85, anchors: true })
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
    }
    update(); media.addEventListener('change', update)
    return () => { media.removeEventListener('change', update); gsap.ticker.remove(tick); lenis?.destroy() }
  }, [reduced])
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduce' : 'full'
    return () => { delete document.documentElement.dataset.motion }
  }, [reduced])
  useEffect(() => {
    const close = event => { if (event.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [])
  return <MotionConfig reducedMotion={reduced ? 'always' : 'user'}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Carlos Martinez home"><span className="brand-glyph">c<span>m</span><i /></span><span>CARLOS D. MARTINEZ<small>SOFTWARE ENGINEER</small></span></a>
      <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close −' : 'Menu +'}</button>
      <nav id="main-nav" className={menuOpen ? 'open' : ''} aria-label="Main navigation" onClick={() => setMenuOpen(false)}><a href="#work">Work</a><a href="#story">About</a><a href="/resume.pdf" target="_blank" rel="noreferrer">Résumé ↗</a><a className="nav-contact" href="#contact">Let's connect <span>↗</span></a></nav>
    </header>
    <main id="main"><ContinuousCircuit reduced={reduced} /><Hero reduced={reduced} /><Story reduced={reduced} /><ProjectExplorer reduced={reduced} /><FeaturedProjects reduced={reduced} /><Background reduced={reduced} /><Contact /><GameTerminal reduced={reduced} /></main>
    <footer className="site-footer"><a href="#home" className="footer-name">Carlos D. Martinez <span>© {new Date().getFullYear()}</span></a><p>Built with curiosity. Connected by design.</p><button className="motion-control" aria-pressed={reduced} disabled={systemReduced} onClick={() => setCalm(!calm)}>{systemReduced ? 'Reduced motion (system)' : reduced ? 'Motion: reduced' : 'Motion: full'}</button><a href="#home">Back to input ↑</a></footer>
  </MotionConfig>
}


