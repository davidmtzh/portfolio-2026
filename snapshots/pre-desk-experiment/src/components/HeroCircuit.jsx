import { useCallback, useState } from 'react'
import { CounterPulses } from './CounterPulses'

const digits = ['abcdef', 'bc', 'abdeg', 'abcdg', 'bcfg', 'acdfg', 'acdefg', 'abc', 'abcdefg', 'abcdfg']
const segments = {
  a: 'M548 75H591L596 80L591 85H548L543 80Z',
  b: 'M598 83L603 88V124L598 129L593 124V88Z',
  c: 'M598 133L603 138V174L598 179L593 174V138Z',
  d: 'M548 177H591L596 182L591 187H548L543 182Z',
  e: 'M541 133L546 138V174L541 179L536 174V138Z',
  f: 'M541 83L546 88V124L541 129L536 124V88Z',
  g: 'M548 126H591L596 131L591 136H548L543 131Z',
}
const input = 'M74 130H155L160 123L169 137L178 123L187 137L196 123L201 130H286'
const arrival = 'M354 103H438V88H520'
const feeds = [arrival, 'M354 121H458V116H520', 'M354 139H478V144H520', 'M354 157H438V172H520',
  'M312 88V36H658V88H622', 'M330 88V20H678V116H622', 'M312 172V224H658V144H622', 'M330 172V240H678V172H622']

export function HeroCircuit({ reduced }) {
  const [digit, setDigit] = useState(0)
  const [counterLit, setCounterLit] = useState(false)
  const advance = useCallback(() => {
    setCounterLit(false)
    setDigit(value => (value + 1) % 10)
  }, [])
  return <div className="electronic-core counter-circuit">
    <div className="counter-heading"><span>A small circuit. A visible result.</span><span className="counter-caption">Live counter · 0–9</span></div>
    <svg className="counter-board" viewBox="0 0 720 260" role="img" aria-label="An eight-pin seven-segment display connected to a pulse source and counter. The display counts from zero to nine.">
      <path d={input} className="circuit-wire" />
      {feeds.map((d, i) => <path key={i} d={d} className="circuit-wire" />)}
      <path d="M360 240V260" className="circuit-wire" /><circle cx="360" cy="240" r="2" className="circuit-terminal" />
      <circle cx="52" cy="130" r="22" className="counter-component" />
      <path d="M39 134H47V124H57V134H65" className="counter-symbol" />
      <rect x="286" y="88" width="68" height="84" rx="8" className={`counter-component ${counterLit ? 'counter-step-active' : ''}`} />
      <text x="320" y="138" textAnchor="middle" className={`counter-plus ${counterLit ? 'counter-step-active' : ''}`}>+1</text>
      <rect x="520" y="55" width="102" height="152" rx="10" className="counter-display" />
      {[88, 116, 144, 172].map(y => <g key={y} className="display-pin"><path d={`M506 ${y}H520M622 ${y}H636`} /><circle cx="506" cy={y} r="2" /><circle cx="636" cy={y} r="2" /></g>)}
      <g className="display-segments" data-digit={digit} aria-hidden="true">{Object.entries(segments).map(([name, d]) => <path key={name} d={d} className={digits[digit].includes(name) ? 'segment is-lit' : 'segment'} />)}</g>
      <circle cx="609" cy="192" r="2.5" className="display-decimal" />
      <CounterPulses input={input} feeds={feeds} reduced={reduced} onCharge={setCounterLit} onArrival={advance} />
    </svg>
    <div className="counter-legend" aria-hidden="true"><span>01 <b>Pulse</b></span><span>02 <b>Count</b></span><span>03 <b>Display</b></span></div>
  </div>
}
