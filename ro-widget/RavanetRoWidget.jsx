import React, { useEffect, useId, useRef, useState } from 'react';
import './ro-widget.css';

const defaultMessages = [{ id: 1, role: 'ro', text: 'سلام. من رو‌ام. اینجام.' }];

function SendIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3.1 11.15 20.4 3.8c.78-.33 1.52.48 1.12 1.24L14.2 20.7c-.35.82-1.52.78-1.8-.07l-2.2-6.55-6.55-2.2c-.85-.28-.89-1.45-.07-1.8Z"/></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.3 5.7a1 1 0 0 0-1.4-1.4L12 9.17 7.1 4.3A1 1 0 0 0 5.7 5.7L10.17 12 5.7 16.9a1 1 0 1 0 1.4 1.4L12 14.83l4.9 4.87a1 1 0 0 0 1.4-1.4L13.83 12z"/></svg>;
}

/**
 * Ro face reconstructed from the original Ravanet website widget.
 * When enabled, its gaze tracks the pointer relative to the face itself.
 */
export function RoFace({ size = 50, mood = 'idle', followMouse = false, followStrength = 1 }) {
  const id = useId().replace(/:/g, '');
  const faceRef = useRef(null);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!followMouse || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const updateGaze = () => {
      frame = 0;
      const rect = faceRef.current?.getBoundingClientRect();
      if (!rect) return;
      const dx = pointerX - (rect.left + rect.width / 2);
      const dy = pointerY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      const proximity = Math.min(1, distance / Math.max(90, rect.width * 1.35));
      const unitX = distance ? dx / distance : 0;
      const unitY = distance ? dy / distance : 0;
      setGaze({
        x: unitX * 3.1 * followStrength * proximity,
        y: unitY * 2.4 * followStrength * proximity
      });
    };

    const onMove = (event) => {
      if (event.pointerType === 'touch') return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(updateGaze);
    };
    const resetGaze = () => setGaze({ x: 0, y: 0 });

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('blur', resetGaze);
    document.documentElement.addEventListener('mouseleave', resetGaze);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('blur', resetGaze);
      document.documentElement.removeEventListener('mouseleave', resetGaze);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [followMouse, followStrength]);

  // Exaggerated vertical ovals from Ro's expression sheet: large enough to read
  // as the character's signature feature while staying balanced inside the head.
  const eyeRx = mood === 'surprise' ? 6.4 : 6.1;
  const eyeRy = mood === 'sleepy' ? 1.4 : mood === 'surprise' ? 12.4 : mood === 'listen' ? 11.6 : 11.9;

  return (
    <span ref={faceRef} className={`original-ro-face original-ro-face--${mood}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" overflow="visible">
        <defs>
          <radialGradient id={`ro-face-${id}`} cx="32%" cy="24%" r="82%">
            <stop offset="0%" stopColor="#303030"/>
            <stop offset="48%" stopColor="#181818"/>
            <stop offset="100%" stopColor="#0D0D0D"/>
          </radialGradient>
          <radialGradient id={`ro-sheen-${id}`} cx="28%" cy="18%" r="72%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".3"/>
            <stop offset="34%" stopColor="#D8D8D8" stopOpacity=".08"/>
            <stop offset="100%" stopColor="#D8D8D8" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id={`ro-rim-${id}`} x1="12%" y1="8%" x2="86%" y2="92%">
            <stop offset="0%" stopColor="#D8D8D8" stopOpacity=".7"/>
            <stop offset="42%" stopColor="#B7FF00" stopOpacity=".34"/>
            <stop offset="100%" stopColor="#D8D8D8" stopOpacity=".08"/>
          </linearGradient>
          <filter id={`ro-glow-${id}`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle className="original-ro-shell" cx="50" cy="50" r="46" fill={`url(#ro-face-${id})`} stroke="#B7FF00" strokeOpacity=".34" strokeWidth="1.4"/>
        <circle className="original-ro-sheen" cx="50" cy="50" r="44.7" fill={`url(#ro-sheen-${id})`}/>
        <circle className="original-ro-inner-rim" cx="50" cy="50" r="44.8" fill="none" stroke={`url(#ro-rim-${id})`} strokeWidth=".72" opacity=".82"/>
        <ellipse className="original-ro-highlight" cx="34" cy="25" rx="18" ry="7" fill="#D8D8D8" opacity=".055" transform="rotate(-18 34 25)"/>
        {mood === 'thinking' ? (
          <g className="original-ro-thinking">
            <circle cx="36" cy="51" r="4.2" fill="#C7FF55" filter={`url(#ro-glow-${id})`}/>
            <circle cx="50" cy="51" r="4.2" fill="#C7FF55" filter={`url(#ro-glow-${id})`}/>
            <circle cx="64" cy="51" r="4.2" fill="#C7FF55" filter={`url(#ro-glow-${id})`}/>
          </g>
        ) : (
          <g className="original-ro-eyes" style={{ transform: `translate(${gaze.x}px, ${gaze.y}px)` }}>
            <ellipse cx="38" cy="50" rx={eyeRx} ry={eyeRy} fill="#C7FF55" filter={`url(#ro-glow-${id})`}/>
            <ellipse cx="62" cy="50" rx={eyeRx} ry={eyeRy} fill="#C7FF55" filter={`url(#ro-glow-${id})`}/>
          </g>
        )}
      </svg>
    </span>
  );
}

function fallbackReply(text) {
  if (/سلام/.test(text)) return 'سلام. خوشحالم که اومدی. هرجا راحت‌تری شروع کن.';
  if (/خواب|شب|فکر/.test(text)) return 'می‌شنوم. وقتی شب ساکت می‌شه، فکرها گاهی بلندتر می‌شن. بیشتر کدوم فکر برمی‌گرده؟';
  if (/خسته|سخت/.test(text)) return 'لازم نیست الان همه‌چیز رو حل کنی. می‌خوای فقط از سخت‌ترین بخشش بگی؟';
  if (/نمی.*دون|نمی.*دان/.test(text)) return 'همین «نمی‌دونم» هم یک شروعه. می‌تونیم خیلی آروم جلو بریم.';
  return 'ممنون که گفتی. من اینجام و گوش می‌دم. دوست داری یکم بیشتر ازش بگی؟';
}

/**
 * Props:
 * open / onOpenChange  -> optional controlled state
 * initialMessages       -> [{ id, role: 'ro' | 'user', text }]
 * onSend(text, history) -> async string | { text }
 */
export default function RavanetRoWidget({
  open: controlledOpen,
  onOpenChange,
  initialMessages = defaultMessages,
  onSend,
  className = ''
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [mood, setMood] = useState('idle');
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const open = typeof controlledOpen === 'boolean' ? controlledOpen : internalOpen;

  const setOpen = (next) => {
    if (typeof controlledOpen !== 'boolean') setInternalOpen(next);
    onOpenChange?.(next);
    setMood(next ? 'listen' : 'idle');
  };

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 180);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll('button,input,[tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const submit = async (event) => {
    event?.preventDefault();
    const text = input.trim();
    if (!text || thinking) return;
    const userMessage = { id: Date.now(), role: 'user', text };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput('');
    setThinking(true);
    setMood('thinking');
    try {
      const result = onSend ? await onSend(text, history) : await new Promise(resolve => window.setTimeout(() => resolve(fallbackReply(text)), Math.min(1700, 640 + text.length * 16)));
      const reply = typeof result === 'string' ? result : result?.text;
      if (reply) setMessages(items => [...items, { id: Date.now() + 1, role: 'ro', text: reply }]);
      setMood('listen');
    } catch {
      setMessages(items => [...items, { id: Date.now() + 1, role: 'ro', text: 'ارتباط برای یک لحظه قطع شد. دوباره امتحان کنیم؟' }]);
      setMood('idle');
    } finally {
      setThinking(false);
      window.setTimeout(() => setMood('idle'), 2600);
    }
  };

  return (
    <div className={`original-ro-widget ${className}`} dir="rtl">
      <section ref={panelRef} id="ro-chat-panel" className={`original-ro-panel ${open ? 'is-open' : ''}`} role="dialog" aria-modal="false" aria-labelledby="ro-chat-title" aria-hidden={!open}>
        <header>
          <RoFace size={30} mood={mood} />
          <div><strong id="ro-chat-title">رو</strong><span>{thinking ? '…' : 'همراه روانت'}</span></div>
          <button type="button" onClick={() => setOpen(false)} aria-label="بستن گفتگو"><CloseIcon/></button>
        </header>

        <div ref={scrollRef} className="original-ro-messages" aria-live="polite" aria-relevant="additions">
          {messages.map(message => <div key={message.id} className={`original-ro-message original-ro-message--${message.role}`}><p>{message.text}</p></div>)}
          {thinking && <div className="original-ro-message original-ro-message--ro"><p className="original-ro-dots"><i/><i/><i/></p></div>}
        </div>

        <form onSubmit={submit}>
          <div>
            <input ref={inputRef} type="text" value={input} onChange={event => setInput(event.target.value)} placeholder="هرچی هست…" aria-label="پیام برای رو" autoComplete="off"/>
            <button type="submit" aria-label="ارسال" disabled={thinking || !input.trim()}><SendIcon/></button>
          </div>
        </form>
      </section>

      <button type="button" className="original-ro-launcher" aria-label={open ? 'بستن گفتگو با رو' : 'گفتگو با رو'} aria-expanded={open} aria-controls="ro-chat-panel" onClick={() => setOpen(!open)}>
        <RoFace size={50} mood={mood} followMouse />
        <span>رو</span>
      </button>
    </div>
  );
}
