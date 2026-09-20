import { useEffect, useRef, useState } from 'react'
const chapters = ['The clearing', 'The encounter', 'The guardian']
export default function GamePreview({ reduced, visible }) {
  const canvas = useRef(null)
  const player = useRef({ x: 180, y: 220, targetX: 180, targetY: 220, attackUntil: 0 })
  const [chapter, setChapter] = useState(0)
  const [health, setHealth] = useState(100)
  const [announcement, setAnnouncement] = useState('Explore the clearing. Use the arrow controls, or click the ground to move.')
  const [paused, setPaused] = useState(false)
  const [assetError, setAssetError] = useState(false)
  const attack = () => {
    if (chapter === 0 || health <= 0) return
    player.current.attackUntil = performance.now() + 400
    setHealth(h => Math.max(0, h - 25))
    setAnnouncement(health <= 25 ? 'Encounter complete. Choose another chapter or replay this one.' : 'Strike landed. The encounter continues.')
  }
  function selectChapter(i) {
    setChapter(i); setHealth(100)
    player.current = { x: 180, y: 220, targetX: 180, targetY: 220, attackUntil: 0 }
    setAnnouncement(i === 0 ? 'Explore the clearing. Click the ground or use the arrow controls.' : `${chapters[i]}. Use Strike to try a short combat preview.`)
  }
  function move(dx, dy) {
    player.current.targetX = Math.max(50, Math.min(590, player.current.targetX + dx))
    player.current.targetY = Math.max(105, Math.min(285, player.current.targetY + dy))
  }
  useEffect(() => {
    const ctx = canvas.current.getContext('2d')
    const warrior = new Image(), enemy = new Image(), boss = new Image()
    warrior.src = '/game/warrior.png'; enemy.src = '/game/enemy.png'; boss.src = '/game/boss.png'
    let dead = false, frame = 0, last = 0
    const draw = (time) => {
      if (dead) return
      const dt = Math.min((time - last) / 1000 || 0, 0.04); last = time
      const p = player.current
      const speed = reduced ? 1 : Math.min(1, dt * 9)
      if (!paused && visible) { p.x += (p.targetX - p.x) * speed; p.y += (p.targetY - p.y) * speed }
      ctx.imageSmoothingEnabled = false
      ctx.fillStyle = '#112327'; ctx.fillRect(0, 0, 640, 340)
      for (let row = 0; row < 22; row++) for (let col = 0; col < 40; col++) {
        const v = (row * 7 + col * 13) % 9
        ctx.fillStyle = v < 4 ? '#183331' : v < 7 ? '#1b3933' : '#204137'
        ctx.fillRect(col * 16, row * 16, 16, 16)
        if (v === 3) { ctx.fillStyle = '#315042'; ctx.fillRect(col * 16 + 3, row * 16 + 8, 2, 4) }
      }
      ctx.fillStyle = '#516254'; ctx.beginPath(); ctx.moveTo(80, 340); ctx.lineTo(230, 100); ctx.lineTo(345, 100); ctx.lineTo(500, 340); ctx.fill()
      ctx.fillStyle = '#626b59'; for (let i = 0; i < 30; i++) { const x = 170 + ((i * 41) % 260), y = 160 + ((i * 27) % 170); ctx.fillRect(x, y, 9, 4) }
      function tree(x, y, scale = 1) {
        ctx.fillStyle = '#293d32'; ctx.fillRect(x - 4, y, 8, 35 * scale)
        ;['#102d2c', '#18473d', '#245c47'].forEach((color, i) => { ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x, y - 52 * scale + i * 14); ctx.lineTo(x - (28 - i * 4) * scale, y + i * 7); ctx.lineTo(x + (28 - i * 4) * scale, y + i * 7); ctx.fill() })
      }
      for (let i = 0; i < 11; i++) tree(i * 65 + 7, 55 + (i % 3) * 13, 1.5)
      tree(40, 220, 1.4); tree(590, 180, 1.6); tree(550, 310, 1.2)
      if (chapter === 0) {
        ctx.fillStyle = '#aa91ff'; ctx.beginPath(); ctx.moveTo(440, 170); ctx.lineTo(452, 190); ctx.lineTo(440, 210); ctx.lineTo(428, 190); ctx.fill()
        ctx.fillStyle = '#e8dfff'; ctx.fillRect(437, 176, 3, 19)
      }
      const moving = Math.abs(p.targetX - p.x) + Math.abs(p.targetY - p.y) > 2
      const spriteFrame = reduced || paused || !visible ? 0 : Math.floor(time / (moving ? 95 : 160)) % 6
      ctx.fillStyle = '#081b20aa'; ctx.beginPath(); ctx.ellipse(p.x, p.y + 19, 18, 6, 0, 0, Math.PI * 2); ctx.fill()
      if (warrior.complete && warrior.naturalWidth) ctx.drawImage(warrior, spriteFrame * 192, moving ? 192 : 0, 192, 192, p.x - 60, p.y - 64, 120, 120)
      if (chapter > 0 && health > 0) {
        const img = chapter === 2 ? boss : enemy
        if (img.complete && img.naturalWidth) {
          const size = chapter === 2 ? 64 : 192
          ctx.drawImage(img, spriteFrame * size, 0, size, size, 370, chapter === 2 ? 115 : 125, chapter === 2 ? 128 : 110, chapter === 2 ? 128 : 110)
        }
        ctx.fillStyle = '#131a23'; ctx.fillRect(382, 111, 100, 5); ctx.fillStyle = chapter === 2 ? '#aa91ff' : '#55dff5'; ctx.fillRect(382, 111, health, 5)
      }
      if (!reduced && p.attackUntil > time) { ctx.strokeStyle = '#b2faff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p.x + 30, p.y - 8, 30, -1.4, 1.3); ctx.stroke() }
      const shade = ctx.createLinearGradient(0, 0, 0, 340); shade.addColorStop(0, '#030b1477'); shade.addColorStop(0.6, '#030b1400'); shade.addColorStop(1, '#030b1466'); ctx.fillStyle = shade; ctx.fillRect(0, 0, 640, 340)
      if (health === 0 && chapter > 0) { ctx.fillStyle = '#08121ccc'; ctx.fillRect(175, 132, 290, 52); ctx.fillStyle = '#e5e9f4'; ctx.font = '16px monospace'; ctx.textAlign = 'center'; ctx.fillText('ENCOUNTER COMPLETE', 320, 164) }
      if (!paused && visible) frame = requestAnimationFrame(draw)
    }
    const ready = () => { if (!dead) { cancelAnimationFrame(frame); frame = requestAnimationFrame(draw) } }
    for (const img of [warrior, enemy, boss]) { img.onload = ready; img.onerror = () => { if (!dead) setAssetError(true) } }
    frame = requestAnimationFrame(draw)
    return () => { dead = true; cancelAnimationFrame(frame) }
  }, [chapter, health, paused, reduced, visible])
  return <div className="game-preview"><div className="chapter-controls" aria-label="Preview chapter">{chapters.map((name, i) => <button key={name} aria-pressed={chapter === i} onClick={() => selectChapter(i)}>0{i + 1} <span>{name}</span></button>)}</div><canvas ref={canvas} width="640" height="340" tabIndex="0" aria-label={`${chapters[chapter]}. Arrow keys move the character. Space strikes during an encounter.`} onKeyDown={e => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) { e.preventDefault(); if (paused) return; if (e.key === ' ') attack(); else move(e.key === 'ArrowLeft' ? -24 : e.key === 'ArrowRight' ? 24 : 0, e.key === 'ArrowUp' ? -24 : e.key === 'ArrowDown' ? 24 : 0) } }} onClick={e => { if (paused) return; const box = e.currentTarget.getBoundingClientRect(); player.current.targetX = Math.max(50, Math.min(590, (e.clientX - box.left) / box.width * 640)); player.current.targetY = Math.max(105, Math.min(285, (e.clientY - box.top) / box.height * 340)) }}>An interactive forest scene with a warrior and a guardian. Use the chapter buttons and Strike control to explore the preview.</canvas><div className="game-controls"><div className="direction-controls"><button aria-label="Move left" disabled={paused} onClick={() => move(-30, 0)}>←</button><button aria-label="Move up" disabled={paused} onClick={() => move(0, -30)}>↑</button><button aria-label="Move down" disabled={paused} onClick={() => move(0, 30)}>↓</button><button aria-label="Move right" disabled={paused} onClick={() => move(30, 0)}>→</button></div><button onClick={attack} disabled={chapter === 0 || health === 0 || paused}>Strike ⚔</button><button onClick={() => setPaused(!paused)}>{paused ? 'Resume' : 'Pause'}</button><button onClick={() => selectChapter(chapter)}>Replay ↻</button></div><p className="game-announcement" role="status">{assetError ? 'Some game artwork could not load. You can still explore the chapters or visit the Unity repository.' : announcement}</p></div>
}
