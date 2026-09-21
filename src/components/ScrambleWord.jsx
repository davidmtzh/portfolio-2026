import { useEffect, useRef, useState } from 'react'

const words = ['software', 'AI / ML', 'robotics', 'systems']
const glyphs = '01<>/{}[]'

export function ScrambleWord({ reduced }) {
  const [text, setText] = useState(words[0])
  const root = useRef(null)
  useEffect(() => {
    if (reduced) return
    let visible = false, frame, last = 0, elapsed = 0, index = 0, displayed = ''
    const tick = now => {
      frame = null
      if (visible && !document.hidden && last) elapsed += Math.min(now - last, 80)
      last = now
      const next = words[(index + 1) % words.length]
      let value = words[index]
      if (elapsed >= 3800) {
        const progress = Math.min(1, (elapsed - 3800) / 550)
        value = [...next].map((letter, i) => i < Math.floor(progress * next.length) || letter === ' ' ? letter : glyphs[Math.floor(now / 65 + i * 3) % glyphs.length]).join('')
        if (progress === 1) { index = (index + 1) % words.length; elapsed = 0; value = words[index] }
      }
      if (displayed !== value) { displayed = value; setText(value) }
      if (visible && !document.hidden) frame = requestAnimationFrame(tick)
    }
    const resume = () => {
      last = 0
      if (visible && !document.hidden && !frame) frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume() })
    observer.observe(root.current)
    document.addEventListener('visibilitychange', resume)
    return () => { observer.disconnect(); cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', resume) }
  }, [reduced])
  return <span ref={root} className="scramble-word" aria-hidden="true">{reduced ? words[0] : text}.</span>
}
