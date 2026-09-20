import { useEffect, useRef } from 'react'

export function WoodenDesk() {
  const grain = useRef(null)
  useEffect(() => {
    const ctx = grain.current.getContext('2d')
    const pixels = ctx.createImageData(1024, 512)
    let seed = 31
    const noise = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
    // The same walnut grain and palette as the saved wooden workstation.
    for (let y = 0; y < 512; y++) for (let x = 0; x < 1024; x++) {
      const bend = Math.sin(x * .008 + y * .013) * 6 + Math.sin(x * .002) * 12
      const variation = Math.sin((y + bend) * .65) * 4 + Math.sin((y + bend) * .14) * 7 + noise() * 7
      const plank = Math.floor(y / 128) % 2 * 5, i = (y * 1024 + x) * 4
      pixels.data[i] = 57 + variation + plank
      pixels.data[i + 1] = 35 + variation * .65 + plank
      pixels.data[i + 2] = 24 + variation * .43
      pixels.data[i + 3] = 255
    }
    ctx.putImageData(pixels, 0, 0)
  }, [])
  return <div className="wooden-desk" aria-hidden="true">
    <div className="wooden-desk-top"><canvas ref={grain} width="1024" height="512" /><span className="wooden-desk-spill" /></div>
    <span className="wooden-desk-leg left" /><span className="wooden-desk-leg right" />
    <svg className="desk-plant" viewBox="0 0 150 210" fill="none">
      <ellipse cx="75" cy="197" rx="49" ry="9" fill="#000" opacity=".5" />
      <path d="M46 147L53 193Q75 202 97 193L104 147Z" fill="#24282a" stroke="#42494a" />
      <ellipse cx="75" cy="147" rx="29" ry="8" fill="#151916" stroke="#4a514a" />
      <g className="desk-leaves" fill="#254b36" stroke="#496d4b" strokeWidth="1.5">
        <path d="M75 149Q65 83 78 30M75 134Q34 110 28 68M74 119Q103 96 124 53" />
        <path d="M73 123Q24 126 20 89Q58 82 73 123Z" /><path d="M71 98Q39 80 47 43Q79 55 71 98Z" />
        <path d="M77 73Q56 35 81 12Q106 39 77 73Z" /><path d="M78 113Q79 70 117 74Q116 104 78 113Z" />
        <path d="M96 89Q92 53 131 39Q139 74 96 89Z" /><path d="M76 144Q95 108 125 126Q111 151 76 144Z" />
      </g>
    </svg>
    <div className="desk-lava-lamp">
      <span className="lava-halo" />
      <div className="lava-cap" />
      <div className="lava-glass"><span className="lava-wax wax-one" /><span className="lava-wax wax-two" /><span className="lava-wax wax-three" /></div>
      <div className="lava-base" />
    </div>
  </div>
}
