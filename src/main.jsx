import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft, CalendarDays, Check, ChevronDown, HeartHandshake, LockKeyhole,
  Menu, MessageCircle, Mic, Send, ShieldCheck, Sparkles, UserRound, X, Brain
} from 'lucide-react';
import './styles.css';
import './no-motion.css';
import './product-polish.css';
import './interaction-motion.css';
import './motion-system.css';
import RavanetRoWidget, { RoFace } from '../ro-widget/RavanetRoWidget.jsx';
import './palette-modern.css';

const DASHBOARD_URL = (import.meta.env.VITE_DASHBOARD_URL || '').trim();
const faDigits = (value) => String(value).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

function useMotionEnhancements(dependency) {
  useLayoutEffect(() => {
    if (dependency !== 'landing') return undefined;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const configs = [
      { section: '#signs', items: '.section-kicker, .section-heading h2, .section-heading>p, .sign-row, .inline-cta' },
      { section: '.reminder-section', items: '.section-kicker, h2, .reminder-content>p' },
      { section: '#services', items: '.section-kicker, .section-heading h2, .section-heading>p, .service-row, .inline-cta' },
      { section: '.explore-section', items: '.explore-card' },
      { section: '#view', items: '.section-kicker, .section-heading h2, .section-heading>p, .values, .view-visual' },
      { section: '#path', items: '.section-kicker, .path-head h2, .path-head>p, .path-step' },
      { section: '.ro-intro-section', items: '.ro-copy>.section-kicker, .ro-copy h2, .ro-copy>p, .ro-boundary, .ro-actions, .ro-stage' },
      { section: '.final-section', items: '.final-ro, .final-section>span, .final-section h2, .final-section>p, .final-section>.primary-button' }
    ];

    const sections = configs.map(config => {
      const section = document.querySelector(config.section);
      if (!section) return null;
      section.classList.add('brand-motion-section');
      const items = [...section.querySelectorAll(config.items)];
      items.forEach((item, index) => {
        item.classList.add('brand-motion-item');
        if (item.matches('h2')) item.classList.add('brand-motion-title');
        if (item.matches('.sign-row,.service-row,.path-step')) item.classList.add('brand-motion-row');
        if (item.matches('.view-visual,.ro-stage,.explore-card')) item.classList.add('brand-motion-visual');
        item.style.setProperty('--brand-delay', `${Math.min(index * 65, 455)}ms`);
      });
      if (reduceMotion) section.classList.add('is-inview');
      return section;
    }).filter(Boolean);

    if (reduceMotion || !('IntersectionObserver' in window)) {
      sections.forEach(section => section.classList.add('is-inview'));
      return undefined;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-inview');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -11% 0px' });

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [dependency]);
}

function Logo({ compact = false }) {
  return <button className={`brand-logo ${compact ? 'compact' : ''}`} aria-label="روانت" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
    <img src="/assets/logo-light.png" alt="روانت" />
  </button>;
}

function InteractiveRo({ onActivate }) {
  const characterRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches) return undefined;
    let frame = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    const updatePose = () => {
      frame = 0;
      const character = characterRef.current;
      if (!character) return;
      const rect = character.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const dx = pointerX - (rect.left + rect.width / 2);
      const dy = pointerY - (rect.top + rect.height / 2);
      const nx = Math.max(-1, Math.min(1, dx / Math.max(340, window.innerWidth * .38)));
      const ny = Math.max(-1, Math.min(1, dy / Math.max(260, window.innerHeight * .4)));
      character.style.setProperty('--ro-follow-x', `${(nx * 10).toFixed(2)}px`);
      character.style.setProperty('--ro-follow-y', `${(ny * 8).toFixed(2)}px`);
      character.style.setProperty('--ro-follow-tilt', `${(nx * 1.8).toFixed(2)}deg`);
    };

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch') return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(updatePose);
    };
    const resetPose = () => {
      const character = characterRef.current;
      if (!character) return;
      character.style.setProperty('--ro-follow-x', '0px');
      character.style.setProperty('--ro-follow-y', '0px');
      character.style.setProperty('--ro-follow-tilt', '0deg');
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('blur', resetPose);
    document.documentElement.addEventListener('mouseleave', resetPose);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('blur', resetPose);
      document.documentElement.removeEventListener('mouseleave', resetPose);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <button ref={characterRef} type="button" className="ro-stage-character" onClick={onActivate} aria-label="شروع گفت‌وگو با رو">
    <span className="ro-stage-orbit ro-stage-orbit--rear" aria-hidden="true"><i/><i/></span>
    <span className="ro-stage-core"><RoFace size={220} mood="listen" followMouse followStrength={1.9} /></span>
    <span className="ro-stage-orbit ro-stage-orbit--front" aria-hidden="true"><i/></span>
  </button>;
}

function PrimaryButton({ children, onClick, className = '', icon = true, type = 'button' }) {
  return <button type={type} onClick={onClick} className={`primary-button ${className}`}>
    <span>{children}</span>{icon && <span className="button-icon"><ArrowLeft size={18} /></span>}
  </button>;
}

function Header({ onOpenChat, dashboardUrl }) {
  const [menu, setMenu] = useState(false);
  return <header className="site-header">
    <div className="header-inner">
      <Logo />
      <nav className="desktop-nav" aria-label="ناوبری اصلی">
        <a href="#signs">نشانه‌ها</a>
        <a href="#services">خدمات</a>
        <a href="#view">نگاه روانت</a>
        <a href="#path">مسیر شروع</a>
      </nav>
      <div className="header-actions">
        {dashboardUrl && <a className="world-link" href={dashboardUrl}><UserRound size={17} /> دنیای من</a>}
        <PrimaryButton onClick={onOpenChat}>شروع گفت‌وگو</PrimaryButton>
      </div>
      <button className="mobile-menu-button" onClick={() => setMenu(!menu)} aria-label="نمایش منو">{menu ? <X /> : <Menu />}</button>
    </div>
    {menu && <>
      <button className="mobile-menu-scrim" onClick={() => setMenu(false)} aria-label="بستن منو" />
      <div className="mobile-menu">
        <div className="mobile-menu-label">منوی روانت</div>
        <a href="#signs" onClick={() => setMenu(false)}><span>نشانه‌ها</span><small>۰۱</small></a>
        <a href="#services" onClick={() => setMenu(false)}><span>خدمات</span><small>۰۲</small></a>
        <a href="#view" onClick={() => setMenu(false)}><span>نگاه روانت</span><small>۰۳</small></a>
        {dashboardUrl && <a className="mobile-world-button" href={dashboardUrl}><span><UserRound size={17}/> ورود به دنیای من</span><ArrowLeft size={17}/></a>}
        <small className="mobile-menu-note"><LockKeyhole size={13}/> گفت‌وگویی خصوصی، امن و در کنترل تو</small>
      </div>
    </>}
  </header>;
}

const signs = [
  ['۰۱', 'شب‌ها ذهنت تا صبح روشن است', 'چشم که می‌بندی، فکرها بلندتر می‌شوند و خواب جای خودش را می‌دهد به مرور همه‌چیز.'],
  ['۰۲', 'بین جمع هستی، اما تنهایی', 'می‌خندی، جواب می‌دهی، ولی چیزی از درون سنگین است که کسی نمی‌بیندش.'],
  ['۰۳', 'چیزهایی که قبلاً حالت را خوب می‌کرد، دیگر نمی‌کند', 'همان موسیقی، همان قدم‌زدن، همان رابطه — انگار جای خالیِ چیزی هنوز پُر نیست.'],
  ['۰۴', 'می‌خواهی حرف بزنی، ولی نمی‌دانی با کی', 'بعضی حرف‌ها به هیچ‌کدام از آدم‌های اطرافت نمی‌آید بگویی؛ شاید فقط به یک جای امن نیاز داری.']
];

const services = [
  'مشاوره و روان‌درمانی فردی', 'رابطه عاطفی، زوج‌درمانی و پیش از ازدواج',
  'سلامت جنسی و صمیمیت', 'اضطراب، استرس و مشکلات خلقی',
  'عزت‌نفس، خودشناسی و رشد فردی', 'جدایی، خیانت و سوگ',
  'خانواده و فرزندپروری', 'کودک و نوجوان',
  'تحصیلی، شغلی و مسیر حرفه‌ای', 'روان‌پزشکی و دارودرمانی'
];

function Landing({ onOpenChat, dashboardUrl }) {
  useMotionEnhancements('landing');
  return <div className="landing-page">
    <Header onOpenChat={onOpenChat} dashboardUrl={dashboardUrl} />
    <main>
      <section className="hero">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/assets/ravanet-hero-loop.mp4" type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <div className="hero-grain" />
        <div className="hero-content">
          <div className="eyebrow"><span /> یک جای امن برای حرف‌زدن</div>
          <h1>به ذهنِ خودت<br/><em>برگرد.</em></h1>
          <p>این روزها خیلی از ما بیشتر از چیزی که نشان می‌دهیم خسته‌ایم. اگر تو هم چیزی را بی‌صدا حمل می‌کنی، لازم نیست تنهایی ادامه بدهی؛ می‌توانی فقط از یک جمله شروع کنی.</p>
          <div className="hero-cta-row">
            <a className="primary-button" href="#signs"><span>یک قدم برای خودت</span><span className="button-icon"><ArrowLeft size={18}/></span></a>
            <a className="text-link" href="#signs">هنوز مطمئن نیستم <ArrowLeft size={16}/></a>
          </div>
        </div>
        <div className="hero-foot">
          <div><strong>بی‌قضاوت</strong><span>از هرجایی که امروز هستی</span></div>
          <div><MessageCircle size={20}/><span>یک گفت‌وگوی امن<br/><small>خصوصی و بدون نیاز به ثبت‌نام</small></span></div>
        </div>
        <a className="scroll-hint" href="#signs"><span>کمی پایین‌تر</span><ChevronDown size={18}/></a>
      </section>

      <section className="marquee" aria-hidden="true">
        <div>این روزها برای خیلی‌هامان سخت است <i/> لازم نیست همیشه قوی به نظر برسی <i/> حرفت لازم نیست کامل باشد <i/> یک نفر می‌شنود <i/> بدون قضاوت، بدون فشار <i/></div>
      </section>

      <section className="signs-section" id="signs">
        <div className="section-shell signs-layout">
          <div className="section-heading sticky-copy">
            <div className="section-kicker"><span/> اگر این روزها…</div>
            <h2>شاید این حس‌ها<br/><em>برای تو هم آشنا باشند.</em></h2>
            <p>نه برای اینکه اسمی روی حالت بگذاریم؛ فقط برای اینکه بدانی تجربه‌ات نادیده یا عجیب نیست.</p>
          </div>
          <div className="sign-list">
            {signs.map(([n,t,d]) => <article className="sign-row" key={n}>
              <span className="sign-number">{n}</span>
              <div><h3>{t}</h3><p>{d}</p></div>
              <span className="row-arrow"><ArrowLeft size={20}/></span>
            </article>)}
            <button className="inline-cta" onClick={onOpenChat}>اگر یکی از این‌ها مالِ توست، فقط از یک جمله شروع کن <ArrowLeft size={17}/></button>
          </div>
        </div>
      </section>

      <section className="reminder-section">
        <div className="reminder-orb orb-one"/><div className="reminder-orb orb-two"/>
        <div className="section-shell reminder-content">
          <span className="section-kicker centered"><span/> یک یادآوری جمعی</span>
          <h2>این روزها خیلی از ما<br/><em>بیشتر از چیزی که می‌گوییم خسته‌ایم.</em></h2>
          <p>اگر تو هم این سنگینی را حس می‌کنی، تنها نیستی. لازم نیست پیش از حرف‌زدن همه‌چیز را فهمیده یا مرتب کرده باشی.</p>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="section-shell services-layout">
          <div className="section-heading sticky-copy">
            <div className="section-kicker"><span/> هر چیزی که با توست</div>
            <h2>لازم نیست اول<br/><em>اسمش را بدانی.</em></h2>
            <p>گاهی فقط می‌دانیم چیزی سنگین است. می‌توانی از همان حس شروع کنی؛ موضوع و مسیر بعدی آرام‌آرام روشن می‌شود.</p>
            <button className="inline-cta" onClick={onOpenChat}>از چیزی که حس می‌کنم شروع می‌کنم <ArrowLeft size={17}/></button>
          </div>
          <div className="service-grid">
            {services.map((service, index) => <button key={service} onClick={onOpenChat} className="service-row">
              <span>{faDigits(String(index + 1).padStart(2, '0'))}</span><strong>{service}</strong><ArrowLeft size={17}/>
            </button>)}
          </div>
        </div>
      </section>

      <section className="explore-section">
        <div className="section-shell explore-grid">
          <article className="explore-card events-card">
            <span className="card-index">۰۱</span><CalendarDays size={28}/>
            <h3>گاهی کمک، از شناختن شروع می‌شود.</h3>
            <p>کارگاه‌ها و نشست‌هایی برای شناخت بهتر خود، رابطه‌ها و انتخاب‌هایمان.</p>
            <button>برنامه‌های پیش رو <ArrowLeft size={16}/></button>
          </article>
          <article className="explore-card assessment-card">
            <span className="card-index">۰۲</span><Brain size={28}/>
            <h3>خودت را کمی واضح‌تر ببین.</h3>
            <p>ارزیابی‌های معتبر، همراه با تفسیر متخصص؛ نه یک برچسب یا تشخیص خودکار.</p>
            <button>دیدن ارزیابی‌ها <ArrowLeft size={16}/></button>
          </article>
        </div>
      </section>

      <section className="view-section" id="view">
        <div className="section-shell view-layout">
          <div className="view-visual" aria-hidden="true">
            <div className="human-circle"><span className="human-head"/><span className="human-body"/></div>
            <div className="connection-line"><i/><i/><i/></div>
            <div className="care-circle"><HeartHandshake size={48}/></div>
          </div>
          <div className="section-heading">
            <div className="section-kicker"><span/> نگاه روانت</div>
            <h2>فناوری جای ارتباط انسانی را نمی‌گیرد؛<br/><em>فقط راه رسیدن به آن را ساده‌تر می‌کند.</em></h2>
            <p>کار روانت از شنیدن شروع می‌شود، نه از نسخه‌پیچی. رو کمک می‌کند حرف‌هایت شکل بگیرند؛ و فقط اگر خودت بخواهی، قدم بعدی می‌تواند گفت‌وگو با یک متخصص باشد.</p>
            <div className="values"><span>شنیدن</span><span>بی‌قضاوت</span><span>انتخاب با تو</span><span>حریم خصوصی</span><span>انسان‌محور</span></div>
          </div>
        </div>
      </section>

      <section className="path-section" id="path">
        <div className="section-shell">
          <div className="path-head">
            <div className="section-heading">
              <div className="section-kicker"><span/> اگر خواستی ادامه بدهی</div>
              <h2>اول حرف‌زدن؛<br/><em>بعد هر قدمی که برای تو درست است.</em></h2>
            </div>
            <p>هیچ تصمیمی از قبل برای تو گرفته نشده. می‌توانی فقط حرف بزنی، کمی بیشتر بفهمی و هر وقت آماده بودی قدم بعدی را خودت انتخاب کنی.</p>
          </div>
          <div className="path-steps">
            {[
              ['۰۱','از همان‌جایی که هستی','حرفت لازم نیست کامل، مرتب یا حتی قابل‌توضیح باشد.'],
              ['۰۲','کمی روشن‌تر دیدن','رو گوش می‌دهد و کمک می‌کند بفهمی چه چیزی بیشتر سنگین است.'],
              ['۰۳','انتخاب قدم بعدی','می‌توانی ادامه بدهی، مکث کنی یا درباره‌ی راه‌های کمک بیشتر بدانی.'],
              ['۰۴','فقط اگر خودت خواستی','روانت رسیدن به یک متخصص مرتبط را ساده‌تر می‌کند؛ انتخاب و زمانش با توست.']
            ].map(([n,t,d], i) => <article key={n} className="path-step"><span>{n}</span><div className="step-dot">{i === 0 ? <MessageCircle size={18}/> : i === 3 ? <HeartHandshake size={18}/> : <Check size={17}/>}</div><h3>{t}</h3><p>{d}</p></article>)}
          </div>
        </div>
      </section>

      <section className="ro-intro-section">
        <div className="section-shell ro-intro-card">
          <div className="ro-copy">
            <span className="section-kicker"><span/> وقتی آماده‌ای حرف بزنی</span>
            <h2>قرار نیست اولین قدم را<br/><em>تنهایی برداری.</em></h2>
            <p><strong>رو</strong> از تو نمی‌خواهد همین حالا تصمیم بزرگی بگیری. فقط کمک می‌کند اولین حرف آسان‌تر شود، حرف‌هایت شکل بگیرند و اگر خودت خواستی، قدم بعدی را ببینی.</p>
            <div className="ro-boundary"><ShieldCheck size={19}/><span>رو درمانگر نیست و جای کمک حرفه‌ای را نمی‌گیرد.</span></div>
            <div className="ro-actions">
              <PrimaryButton onClick={onOpenChat}>چند دقیقه با رو حرف بزن</PrimaryButton>
              <span>بدون نیاز به ثبت‌نام</span>
            </div>
          </div>
          <div className="ro-stage" aria-label="رو، همراه گفت‌وگوی روانت">
            <div className="stage-glow"/><InteractiveRo onActivate={onOpenChat} />
            <div className="floating-word word-one">هرجا دوست داری شروع کن</div>
            <div className="floating-word word-two">می‌شنوم</div>
            <div className="floating-word word-three">بدون قضاوت</div>
          </div>
        </div>
      </section>

      <section className="final-section">
        <div className="final-ro"><RoFace size={46} mood="idle"/></div>
        <span>همین‌جا، بدون عجله.</span>
        <h2>لازم نیست همین امروز<br/><em>همه‌چیز را حل کنی.</em></h2>
        <p>فقط از چیزی بگو که همین حالا با توست؛ یک جمله‌ی کوتاه کافی‌ست.</p>
        <PrimaryButton onClick={onOpenChat}>از یک جمله شروع می‌کنم</PrimaryButton>
      </section>
    </main>
    <footer>
      <div className="footer-main"><Logo/><p>یک جای امن برای فهمیدن، حرف‌زدن و رسیدن به حال بهتر.</p></div>
      <div className="footer-links">{dashboardUrl && <a href={dashboardUrl}>دنیای من</a>}<a href="#services">خدمات</a><a href="#view">درباره روانت</a><a href="#">حریم خصوصی</a></div>
      <small>© {faDigits(new Date().getFullYear())} روانت — همه‌ی حقوق محفوظ است.</small>
    </footer>
  </div>;
}

function TypingDots() {
  return <span className="typing-dots"><i/><i/><i/></span>;
}

const responseFor = (text) => {
  if (/خواب|شب|فکر/.test(text)) return 'می‌فهمم؛ وقتی قرار است همه‌چیز ساکت شود، انگار ذهن تازه بلندتر حرف می‌زند. این شب‌ها بیشتر چه فکری برمی‌گردد؟';
  if (/تنها|تنهایی|کسی/.test(text)) return 'تنها ماندن با یک حس، خودش می‌تواند آن را سنگین‌تر کند. دوست داری از آخرین باری بگویی که این تنهایی را واضح‌تر حس کردی؟';
  if (/اضطراب|استرس|نگران/.test(text)) return 'به نظر می‌رسد بدنت و ذهنت مدتی‌ست در حالت آماده‌باش مانده‌اند. معمولاً این نگرانی خودش را کجای روز بیشتر نشان می‌دهد؟';
  if (/نمی.*دون|نمی.*دان|شروع/.test(text)) return 'لازم نیست دقیق بدانی. همین «نمی‌دانم» هم شروع واقعی و مهمی‌ست. اگر بخواهی، می‌توانیم از حسی که همین حالا در بدنت داری شروع کنیم.';
  return 'ممنون که گفتی. عجله‌ای برای نتیجه‌گیری نیست؛ می‌خواهم کمی بیشتر بفهمم. این چیزی که گفتی، بیشتر شبیه یک اتفاق تازه است یا مدتی‌ست همراهت مانده؟';
};

function ChatPanel({ open, onClose, dashboardUrl }) {
  const [messages, setMessages] = useState([
    { role: 'ro', text: 'سلام. من رو هستم. قرار نیست همین اول همه‌چیز را توضیح بدهی؛ می‌توانیم از یک جمله‌ی ساده شروع کنیم.' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [phase, setPhase] = useState('chat');
  const [step, setStep] = useState(0);
  const [name, setName] = useState('نیلوفر');
  const [remember, setRemember] = useState(true);
  const scrollRef = useRef(null);
  const userCount = messages.filter(m => m.role === 'user').length;

  useEffect(() => {
    if (open) document.body.classList.add('no-scroll'); else document.body.classList.remove('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, [open]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, typing, phase, step]);

  const send = (text = input) => {
    const clean = text.trim();
    if (!clean || typing) return;
    setMessages(prev => [...prev, { role: 'user', text: clean }]); setInput(''); setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ro', text: responseFor(clean) }]); setTyping(false);
    }, 950);
  };

  const startSignup = () => { setPhase('signup'); setStep(0); };
  const finish = () => { setPhase('done'); };

  return <>
    <div className={`chat-backdrop ${open ? 'open' : ''}`} onClick={onClose}/>
    <aside className={`chat-panel ${open ? 'open' : ''}`} aria-hidden={!open}>
      <header className="chat-header">
        <div className="chat-person"><RoFace size={46} mood={typing ? 'thinking' : 'listen'} followMouse followStrength={1.1}/><div><strong>رو</strong><span><i/> اینجا و آماده‌ی شنیدن</span></div></div>
        <button onClick={onClose} aria-label="بستن گفت‌وگو"><X size={21}/></button>
      </header>

      {phase === 'chat' && <>
        <div className="chat-trust"><LockKeyhole size={14}/> این گفت‌وگو خصوصی‌ست و فعلاً جایی ذخیره نمی‌شود.</div>
        <div className="messages" ref={scrollRef}>
          <div className="day-label">همین حالا</div>
          {messages.map((message, idx) => <div key={idx} className={`message ${message.role}`}>
            {message.role === 'ro' && <span className="message-avatar"><RoFace size={28} mood="idle"/></span>}
            <div className="message-bubble">{message.text}</div>
          </div>)}
          {typing && <div className="message ro"><span className="message-avatar"><RoFace size={28} mood="thinking"/></span><div className="message-bubble"><TypingDots/></div></div>}
          {userCount >= 2 && !typing && <div className="save-invite">
            <Sparkles size={20}/><div><strong>دوست داری این گفت‌وگو برای خودت بماند؟</strong><p>می‌توانیم دفعه‌ی بعد از همین‌جا ادامه بدهیم؛ با حافظه‌ای که همیشه کنترلش دست خودت است.</p></div>
            <button onClick={startSignup}>آره، فضای خودم را بساز <ArrowLeft size={16}/></button>
            <button className="quiet-button" onClick={() => setMessages(prev => [...prev, { role: 'ro', text: 'حتماً. بدون ساختن حساب هم می‌توانیم همین‌جا ادامه بدهیم.' }])}>فعلاً نه، ادامه بدهیم</button>
          </div>}
        </div>
        {userCount === 0 && <div className="starter-prompts">
          {['این روزها ذهنم خیلی شلوغه', 'نمی‌دونم از کجا شروع کنم', 'فقط می‌خوام یکی بشنوه'].map(t => <button key={t} onClick={() => send(t)}>{t}</button>)}
        </div>}
        <form className="chat-composer" onSubmit={e => { e.preventDefault(); send(); }}>
          <button type="button" className="composer-action" aria-label="پیام صوتی"><Mic size={20}/></button>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="هرچه در ذهنت هست بنویس…" />
          <button type="submit" className="send-button" aria-label="ارسال پیام" disabled={!input.trim() || typing}><Send size={19}/></button>
        </form>
        <p className="chat-disclaimer">رو درمانگر نیست. در خطر فوری با اورژانس محل زندگی‌ات تماس بگیر.</p>
      </>}

      {phase === 'signup' && <div className="onboarding">
        <div className="onboarding-progress"><span style={{width: `${(step + 1) * 25}%`}}/></div>
        {step === 0 && <div className="onboarding-card">
          <RoFace size={76} mood="listen" followMouse followStrength={1.2}/><span className="onboarding-step">آشنایی نزدیک‌تر</span>
          <h2>چطور صدایت کنم؟</h2>
          <p>همین یک اسم کافی‌ست. بقیه را آرام‌آرام و فقط اگر خودت خواستی می‌فهمم.</p>
          <label>نامی که دوست داری<input value={name} onChange={e => setName(e.target.value)} autoFocus/></label>
          <PrimaryButton onClick={() => setStep(1)} className={!name.trim() ? 'disabled' : ''}>ادامه</PrimaryButton>
        </div>}
        {step === 1 && <div className="onboarding-card">
          <div className="onboarding-icon"><ShieldCheck/></div><span className="onboarding-step">چرا رو وجود دارد؟</span>
          <h2>لازم نیست یک‌باره به یک غریبه اعتماد کنی.</h2>
          <p>من کمک می‌کنم حرف‌هایت شکل بگیرند. تشخیص نمی‌دهم و درمانگر نیستم؛ وقتی آماده باشی، راه رسیدن به یک متخصص مناسب را کوتاه‌تر می‌کنم.</p>
          <div className="principle-row"><span><MessageCircle/>گفت‌وگوی امن</span><span><HeartHandshake/>پل به درمانگر</span></div>
          <PrimaryButton onClick={() => setStep(2)}>فهمیدم، ادامه بده</PrimaryButton>
        </div>}
        {step === 2 && <div className="onboarding-card">
          <div className="onboarding-icon"><Brain/></div><span className="onboarding-step">حافظه‌ی رو</span>
          <h2>چیزهای مهم را، فقط با اجازه‌ی تو یادم می‌ماند.</h2>
          <p>می‌توانی هر چیزی را ببینی، ویرایش یا پاک کنی. هیچ یادداشتی پنهان از تو ساخته نمی‌شود.</p>
          <button className={`memory-choice ${remember ? 'selected' : ''}`} onClick={() => setRemember(true)}><span><strong>حافظه روشن باشد</strong><small>برای ادامه‌ی پیوسته‌تر گفتگوها</small></span>{remember && <Check/>}</button>
          <button className={`memory-choice ${!remember ? 'selected' : ''}`} onClick={() => setRemember(false)}><span><strong>فعلاً چیزی یادم نماند</strong><small>هر زمان خواستی می‌توانی فعالش کنی</small></span>{!remember && <Check/>}</button>
          <PrimaryButton onClick={() => setStep(3)}>انتخاب من همین است</PrimaryButton>
        </div>}
        {step === 3 && <div className="onboarding-card">
          <div className="onboarding-icon"><LockKeyhole/></div><span className="onboarding-step">فضای شخصی تو</span>
          <h2>فقط یک راه امن برای برگشتن لازم داریم.</h2>
          <p>در نسخه‌ی کامل، شماره‌ی همراه با رمز یک‌بارمصرف تأیید می‌شود. برای دیدن تجربه‌ی نمونه، مستقیم وارد شو.</p>
          <label>شماره همراه<input defaultValue="۰۹۱۲ ۱۲۳ ۴۵۶۷" dir="ltr"/></label>
          <label className="check-label"><input type="checkbox" defaultChecked/> قوانین حریم خصوصی روانت را خوانده‌ام.</label>
          <PrimaryButton onClick={finish}>تکمیل ثبت‌نام</PrimaryButton>
        </div>}
      </div>}

      {phase === 'done' && <div className="onboarding done-state">
        <div className="welcome-rings"><RoFace size={116} mood="idle" followMouse followStrength={1.35}/></div>
        <span className="onboarding-step">خوش آمدی، {name || 'دوست من'}</span>
        <h2>این‌جا دنیای سلامت توست.</h2>
        <p>گفت‌وگویت با رو، جلسه‌ها، درمانگر و چیزهایی که درباره‌ی خودت می‌فهمی، همگی در یک جای امن کنار هم می‌مانند.</p>
        <div className="welcome-list"><span><Check/>گفت‌وگو از همین‌جا ادامه دارد</span><span><Check/>حافظه همیشه در کنترل توست</span><span><Check/>رسیدن به درمانگر فقط وقتی‌ست که آماده‌ای</span></div>
        {dashboardUrl
          ? <PrimaryButton onClick={() => window.location.assign(dashboardUrl)}>ورود به دنیای من</PrimaryButton>
          : <PrimaryButton onClick={onClose}>بازگشت به سایت</PrimaryButton>}
      </div>}
    </aside>
  </>;
}

function App() {
  const [chat,setChat]=useState(false);
  const [siteRoOpen,setSiteRoOpen]=useState(false);
  const openGuidedChat=()=>{setSiteRoOpen(false);setChat(true)};

  return <>
    <Landing onOpenChat={openGuidedChat} dashboardUrl={DASHBOARD_URL}/>
    <ChatPanel open={chat} onClose={()=>setChat(false)} dashboardUrl={DASHBOARD_URL}/>
    <RavanetRoWidget open={siteRoOpen} onOpenChange={(next)=>{setSiteRoOpen(next);if(next)setChat(false)}}/>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
