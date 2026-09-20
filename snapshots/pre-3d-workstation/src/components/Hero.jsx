import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Bridge } from './Circuit'
import { HeroCircuit } from './HeroCircuit'


export function Hero({ reduced }) {
  const root = useRef(null)
  const timeline = useRef(null)
  useEffect(() => {
    let played = false
    try { played = sessionStorage.getItem('cm-powered') === 'yes' } catch { /* optional */ }
    if (reduced || played || window.scrollY > 150) { root.current?.querySelector('.skip-intro')?.setAttribute('hidden', ''); return }
    const ctx = gsap.context(() => {
      timeline.current = gsap.timeline({ onComplete: () => { try { sessionStorage.setItem('cm-powered', 'yes') } catch { /* optional */ } } })

        .from('.hero h1', { opacity: 0.25, y: 14, duration: 0.8 }, 0.3)
        .from('.hero-description, .hero-actions', { opacity: 0.3, y: 8, stagger: 0.15, duration: 0.6 }, 0.8)
        .to('.skip-intro', { opacity: 0, duration: 0.2, onComplete: () => root.current?.querySelector('.skip-intro')?.setAttribute('hidden', '') }, 2.4)
    }, root)
    if (matchMedia('(max-width: 600px)').matches) timeline.current.timeScale(1.5)
    const finish = () => { if (window.scrollY > 80) timeline.current?.progress(1) }
    window.addEventListener('scroll', finish, { passive: true })
    return () => { ctx.revert(); window.removeEventListener('scroll', finish) }
  }, [reduced])
  return <section className="hero section-shell" id="home" ref={root}>
    <div className="hero-topline"><span><i className="status-dot" /> Software engineer · Electronics background</span><span className="location">San Diego, California</span></div>
    <div className="hero-title-row">
      <h1>From signal<br />to <span>software.</span></h1>
      <div className="hero-intro"><span className="eyebrow">Hi, I'm Carlos.</span><p className="hero-description">I build applications, intelligent systems, and technology that connects software to the physical world.</p><div className="hero-actions"><a className="button primary" href="#work">Explore my work <span>↘</span></a><a className="text-link" href="#contact">Contact me ↗</a></div></div>
    </div>
    <div className="core-wrap">
      <HeroCircuit reduced={reduced} />
    </div>
    {!reduced && <button className="skip-intro" onClick={() => timeline.current?.progress(1)}>Skip intro →</button>}
    <Bridge />
  </section>
}


