import { useRef, useState } from 'react'
import { Bridge, SectionLabel } from './Circuit'
const email = 'carlos_10david@hotmail.com'
const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT || ''
export function Contact() {
  const [status, setStatus] = useState('')
  const [pending, setPending] = useState(false)
  const form = useRef(null)
  const messageText = () => {
    const data = new FormData(form.current)
    return { name: data.get('name'), text: `${data.get('message')}\n\nFrom: ${data.get('name')}\nEmail: ${data.get('email')}` }
  }
  async function copy(value, success) {
    try { await navigator.clipboard.writeText(value); setStatus(success) } catch { setStatus('Copy is unavailable in this browser. Please select and copy the email address or message manually.') }
  }
  async function submit(event) {
    event.preventDefault()
    if (pending) return
    const data = new FormData(event.currentTarget)
    if (data.get('website')) return
    if (!endpoint) {
      const message = messageText()
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Portfolio inquiry from ${message.name}`)}&body=${encodeURIComponent(message.text)}`
      setStatus('Your email app has been requested. Review and send the draft there. If it did not open, copy your message and email it directly.')
      return
    }
    setPending(true); setStatus('Sending your message…')
    try {
      const response = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) })
      if (!response.ok) throw new Error('Submission failed')
      setStatus('Your message was submitted successfully. Thank you for reaching out.')
      form.current.reset()
    } catch { setStatus('Your message could not be sent. Please try again or use the email link. Your message is still here.') }
    finally { setPending(false) }
  }
  return <section id="contact" className="contact section-shell"><SectionLabel number="06">Contact</SectionLabel><div className="contact-grid"><div className="contact-copy"><h2>What could we<br /><span>build together?</span></h2><p>An engineering opportunity, a collaboration, or an interesting problem. I'd like to hear about it.</p><a className="contact-email" href={`mailto:${email}`}>{email} ↗</a><button className="small-button" onClick={() => copy(email, 'Email address copied.')}>Copy email address ⧉</button><div className="contact-social"><a href="https://github.com/davidmtzh" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/carlos-d-martinez-6bb753363/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="/resume.pdf" target="_blank" rel="noreferrer">Résumé ↗</a></div></div><form ref={form} onSubmit={submit} className="contact-form"><div className="form-row"><label>Your name<input name="name" autoComplete="name" required maxLength="100" placeholder="How should I call you?" /></label><label>Email address<input name="email" type="email" autoComplete="email" required maxLength="254" placeholder="you@example.com" /></label></div><label>What's on your mind?<textarea name="message" required minLength="10" maxLength="3000" rows="5" placeholder="Tell me a little about your idea…" /></label><div className="honeypot" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex="-1" autoComplete="off" /></label></div><div className="form-actions"><button className="button primary" type="submit" disabled={pending}>{pending ? 'Sending…' : endpoint ? 'Send message ↗' : 'Open email draft ↗'}</button><button type="button" className="text-link" onClick={() => { if (form.current.reportValidity()) copy(messageText().text, 'Message copied. Paste it into an email to Carlos.') }}>Copy message</button></div><p className="form-note">{endpoint ? 'Your details are used only to respond to your message.' : 'Opens your email app with a draft. Nothing is sent until you send it there.'}</p><p className="form-status" role="status" aria-live="polite">{status}</p></form></div><Bridge label="ONE MORE OUTPUT TO DISCOVER" /></section>
}
