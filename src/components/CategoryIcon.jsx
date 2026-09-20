export function CategoryIcon({ index }) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {index === 0 && <><rect x="7" y="10" width="50" height="43" rx="5" /><path d="M7 21H57M24 29L17 36L24 43M40 29L47 36L40 43M35 27L29 45" /><circle cx="14" cy="16" r="1" /></>}
    {index === 1 && <><path d="M16 15L32 23L48 12M16 15L12 43L32 23L48 46M12 43L31 53L48 46L52 30L32 23M48 12L52 30" />{[[16,15],[48,12],[32,23],[12,43],[31,53],[48,46],[52,30]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#202434" />)}</>}
    {index === 2 && <><rect x="17" y="17" width="30" height="30" rx="4" /><rect x="25" y="25" width="14" height="14" rx="2" /><path d="M24 8V17M32 8V17M40 8V17M24 47V56M32 47V56M40 47V56M8 24H17M8 32H17M8 40H17M47 24H56M47 32H56M47 40H56" /></>}
    {index === 3 && <><path d="M16 33H13a9 9 0 010-18 15 15 0 0128-3 11 11 0 017 21H46" /><rect x="18" y="29" width="28" height="12" rx="3" /><rect x="18" y="45" width="28" height="12" rx="3" /><path d="M31 35H40M31 51H40M32 41V45" /><circle cx="24" cy="35" r="1" /><circle cx="24" cy="51" r="1" /></>}
  </svg>
}
