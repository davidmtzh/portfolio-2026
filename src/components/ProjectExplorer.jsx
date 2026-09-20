import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { gsap } from 'gsap'
import { Bridge, SectionLabel } from './Circuit'
import { categories, projects } from '../content/projects'
import { FlowingPulse } from './FlowingPulse'
import { CategoryIcon } from './CategoryIcon'
const folderColors = ['#73dbea', '#bca0f6', '#efb66b', '#84d4a3']
export function ProjectLinks({ project }) {
  return <div className="project-links">{project.repo && <a href={project.repo} target="_blank" rel="noreferrer">Repository ↗</a>}{project.demo && <a href={project.demo} target={project.demo.startsWith('#') ? undefined : '_blank'} rel="noreferrer">{project.demoLabel || 'Live project'} ↗</a>}</div>
}
export function ProjectExplorer({ reduced }) {
  const [active, setActive] = useState(null)
  const [charged, setCharged] = useState(null)
  const arrive = useCallback(() => {
    setCharged(active)
  }, [active])
  function activate(index) { if (active !== index) { setActive(index); setCharged(null) } }
  function deactivate() { setActive(null); setCharged(null) }
  function leaveFolder(index) {
    window.dispatchEvent(new CustomEvent('work:transmit', { detail: { index, color:folderColors[index] } }))
    deactivate()
  }
  const [opened, setOpened] = useState(null)
  const root = useRef(null)
  const scene = useRef(null)
  const panel = useRef(null)
  const [routes, setRoutes] = useState({ width: 1, height: 1, wires: [], legs: [], terminals: [] })
  useEffect(() => {
    const container = scene.current
    let frame
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const parent = container.getBoundingClientRect()
        const cards = [...container.querySelectorAll('.folder-surface')]
        const narrow = matchMedia('(max-width: 600px)').matches
        const hubX = narrow ? 8 : parent.width / 2
        const ports = cards.map((card, index) => {
          const rect = card.getBoundingClientRect()
          const x = narrow ? rect.left - parent.left : index % 2 === 0 ? rect.right - parent.left : rect.left - parent.left
          const y = rect.top - parent.top + rect.height / 2
          return { x, y }
        })
        const source = { x: hubX, y: 16 }
        const wires = [`M${hubX} 16V${parent.height - 16}`, ...ports.map(p => `M${hubX} ${p.y}H${p.x}`)]
        const legs = ports.map(p => `M${hubX} 16V${p.y}H${p.x}`)
        setRoutes({ width: parent.width, height: parent.height, wires, legs, terminals: [source, ...ports] })
      })
    }
    const observer = new ResizeObserver(update)
    observer.observe(container)
    container.querySelectorAll('.folder-surface').forEach(el => observer.observe(el))
    // Translated folders can move without changing size. Re-measure when
    // responsive rules change, rather than relying only on ResizeObserver.
    window.addEventListener('resize', update)
    const raisedLayout = matchMedia('(min-width: 601px)')
    raisedLayout.addEventListener('change', update)
    // CSS hot updates can reposition folders without resizing them.
    const styles = new MutationObserver(update)
    styles.observe(document.head, { childList: true, subtree: true, characterData: true })
    document.fonts.ready.then(update)
    update()
    return () => { observer.disconnect(); styles.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', update); raisedLayout.removeEventListener('change', update) }
  }, [])
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('.output-module', { opacity: 0.35, stagger: 0.12, duration: 0.8, scrollTrigger: { trigger: scene.current, start: 'top 75%', once: true } })
    }, root)
    return () => ctx.revert()
  }, [reduced])
  useEffect(() => {
    if (opened === null) return
    const dialog = panel.current
    const trigger = root.current.querySelectorAll('.output-module')[opened]
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
      trigger?.focus({ preventScroll: true })
    }
  }, [opened])
  function closeCategory() { setOpened(null) }
  function openCategory(index) {
    setActive(index)
    setOpened(index === opened ? null : index)
  }
  const current = opened === null ? null : categories[opened]
  return <section id="work" className="work section-shell" ref={root}>
    <SectionLabel number="03">Explore my work</SectionLabel><div className="section-heading"><h2>Four areas.<br /><span>One engineering mindset.</span></h2><p>Choose an area to explore the projects,<br />tools, and ideas behind my work.</p></div>
    <div className="output-system" ref={scene}>
      <svg className="output-branches" viewBox={`0 0 ${routes.width} ${routes.height}`} width={routes.width} height={routes.height} aria-hidden="true">
        {routes.wires.map((d, i) => <path key={i} d={d} className="circuit-wire" />)}
        {routes.terminals.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" className="circuit-terminal" />)}
        {active !== null && routes.legs[active] && <FlowingPulse key={`pulse-${active}`} d={routes.legs[active]} reduced={reduced} duration={0.36} scope=".output-system" color={folderColors[active]} repeat={false} onArrival={arrive} />}
        {charged !== null && routes.terminals[charged + 1] && <circle key={`spark-${charged}`} className="folder-port-spark" cx={routes.terminals[charged + 1].x} cy={routes.terminals[charged + 1].y} r="4" style={{ color: folderColors[charged] }} />}
      </svg>
      {categories.map((category, i) => <div className={`output-position position-${i}`} key={category.id} style={{ '--folder-accent': folderColors[i] }}><motion.button className={`output-module folder-module ${active === i ? 'is-active' : ''} ${charged === i || opened === i || (reduced && active === i) ? 'is-charged' : ''}`} aria-haspopup="dialog" aria-expanded={opened === i} aria-controls="project-folder" onFocus={() => activate(i)} onBlur={deactivate} onPointerEnter={() => activate(i)} onPointerLeave={() => leaveFolder(i)} onClick={() => openCategory(i)}>
        <span className="folder-tab" aria-hidden="true">{category.short}</span><span className="folder-surface" aria-hidden="true" /><span className="module-top mono"><span>{category.index}</span><span className="module-light" /></span><span className={`module-visual visual-${category.id}`} aria-hidden="true"><span className="category-icon"><CategoryIcon index={i} /></span></span><span className="module-content"><span className="mono module-tags">{category.tags}</span><span className="module-name">{category.name}</span><span className="module-description">{category.description}</span><span className="module-footer"><span>{projects.filter(p => p.category === category.id).length} projects</span><span>{opened === i ? 'Close folder −' : 'Open folder ↗'}</span></span></span>
      </motion.button></div>)}
    </div>
    <div className="explore-caption mono"><span>Select a card to open its projects ↗</span></div>
    <dialog id="project-folder" ref={panel} className="project-folder folder-dialog" aria-labelledby="folder-title" style={{ '--folder-accent': folderColors[opened ?? 0] }} data-lenis-prevent onCancel={closeCategory} onClose={closeCategory} onClick={event => {
      if (event.target.closest('a[href^="#"]')) closeCategory()
      if (event.target === panel.current) {
        const bounds = panel.current.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeCategory()
      }
    }}>{current && <>
      <div className="folder-heading">
        <div className="folder-title-group"><span className="folder-dialog-icon"><CategoryIcon index={opened} /></span><div><span className="folder-eyebrow">Project folder {current.index} · {projects.filter(p => p.category === current.id).length} projects</span><h3 id="folder-title">{current.name}</h3></div></div>
        <button className="folder-close" aria-label="Close project folder" onClick={closeCategory} autoFocus><span aria-hidden="true">×</span> Close</button>
      </div>
      <div className="folder-projects">{projects.filter(p => p.category === current.id).map((project, index) => <article className="project-entry project-folder-file" key={project.id}>
        <span className="project-folder-tab" aria-hidden="true" />
        <div className="project-file-label"><span>Project {String(index + 1).padStart(2, '0')}</span>{project.featured && <span>Featured</span>}</div>
        <div className="project-entry-heading"><h4>{project.name}</h4></div>
        <p>{project.summary}</p>
        <div className="tags">{project.tech.map(t => <span key={t}>{t}</span>)}</div>
        <details><summary>Project details <span>+</span></summary><p>{project.detail}</p>{project.image && <a href={`/media/${project.image}.webp`} target="_blank" rel="noreferrer" className="evidence-link"><img src={`/media/${project.image}.webp`} alt={`${project.name} project visual`} loading="lazy" width="700" height="467" /><span>Open full visual ↗</span></a>}</details>
        <div className="project-file-actions">{project.featured && <a className="case-study-link" href={`#case-${project.id}`}>Read case study ↗</a>}<ProjectLinks project={project} /></div>
      </article>)}</div>
      <div className="folder-dialog-footer">{current.description}<button onClick={closeCategory}>← Back to folders</button></div>
    </>}</dialog>
    <Bridge label="EXPLORATION → SELECTED WORK" />
  </section>
}



