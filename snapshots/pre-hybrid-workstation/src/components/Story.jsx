import { EducationCircuit } from './EducationCircuit'
import { Bridge, SectionLabel } from './Circuit'
import { StoryJourney } from './StoryJourney'

export function Story({ reduced }) {
  return <section id="story" className="story section-shell"><SectionLabel number="02">About me</SectionLabel><div className="story-heading journey-heading"><h2>Different disciplines.<br /><span>One perspective.</span></h2><p>My path into software wasn't a straight line.<br />That's what makes it useful.</p></div><StoryJourney reduced={reduced} /><Bridge /></section>
}
export function Background({ reduced }) {
  return <section id="background" className="background section-shell"><EducationCircuit reduced={reduced} /><SectionLabel number="05">Education & experience</SectionLabel><div className="section-heading"><h2>A foundation<br /><span>with many layers.</span></h2><p>Engineering gives me the tools.<br />Teaching keeps me asking better questions.</p></div><div className="background-grid"><div><h3 className="list-heading">Education <span>01—05</span></h3>{[
    ['B.S. Computer Science', 'San Diego State University', '2025'], ['Computer Science · Associate for Transfer', 'Imperial Valley College', ''], ['Psychology · Associate for Transfer', 'Imperial Valley College', ''], ['Electronics / Electrical Engineering', 'UABC · Five semesters of university coursework', '2018–2020'], ["Associate's in Electronics", 'CBTIS 21 · Mexicali, Mexico', '2016'],
  ].map(([title, place, year]) => <article className="credential" key={title}><div><h4>{title}</h4><p>{place}</p></div><span className="mono">{year}</span></article>)}</div><div><h3 className="list-heading">Teaching & experience <span>BEYOND THE CODE</span></h3>{[
    ['STEM Instructor', 'Nexplore · Programming, robotics, and electronics for grades 1–12.', '2024–2025'], ['Systems Administration Intern', 'San Diego State University · Linux services, automation, and distributed infrastructure.', '2025'], ['Coding Instructor', 'theCoderSchool · After-school coding instruction.', ''], ['Academic Instructor', 'Electronics education at my former high school.', ''], ['A human perspective', 'Experience in case management and behavioral support informs my communication, patience, and problem-solving.', ''],
  ].map(([title, place, year]) => <article className="credential" key={title}><div><h4>{title}</h4><p>{place}</p></div><span className="mono">{year}</span></article>)}</div></div><a className="text-link resume-link" href="/resume.pdf" target="_blank" rel="noreferrer">Read my résumé <span>↗</span></a><Bridge label="EXPERIENCE → YOUR NEXT IDEA" /></section>
}


