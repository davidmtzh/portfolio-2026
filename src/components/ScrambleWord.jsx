import { useEffect, useRef, useState } from 'react'

const words = ['software', 'AI / ML', 'robotics', 'systems']
const glyphs = '01<>/{}[]'

export function ScrambleWord({ reduced }) {
  const [text, setText] = useState(words[0])
  const root = useRef(null)
  useEffect(() => {
    if (reduced) return
    let visible = false, frame, last = 0, elapsed = 0, index = 0, displayed = ''
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    observer.observe(root.current)
    const tick = now => {
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
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [reduced])
  return <span ref={root} className="scramble-word" aria-hidden="true">{reduced ? words[0] : text}.</span>
}
