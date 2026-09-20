export function SectionLabel({ number, children }) {
  const trace = Number(number) % 2
    ? 'M390 0V180L355 215V410L385 440V800'
    : 'M375 0V270L400 295V570L360 610V800'
  return <>
    <svg className="section-current" viewBox="0 0 420 800" preserveAspectRatio="none" aria-hidden="true">
      <path d={trace} className="ambient-wire" />
    </svg>
    <div className="section-label"><span className="label-node" /><span>{number}</span><span className="label-rule" />{children}</div>
  </>
}
export function Bridge() {
  return <div className="bridge" aria-hidden="true" />
}
