
const WA_PHONE = '2348154791878';

// ── THEME
const html = document.documentElement;
const tBtn = document.getElementById('themeToggle');
const ttIcon = document.getElementById('ttIcon');
const ttLabel = document.getElementById('ttLabel');
function applyTheme(t) {
  html.dataset.theme = t;
  ttIcon.textContent = t === 'dark' ? '🌙' : '☀️';
  ttLabel.textContent = t === 'dark' ? 'Dark' : 'Light';
  localStorage.setItem('ms-theme', t);
}
applyTheme(localStorage.getItem('ms-theme') || 'light');
tBtn.addEventListener('click', () => applyTheme(html.dataset.theme === 'light' ? 'dark' : 'light'));

// ── CURSOR
const dot = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
(function loop(){ rx+=(mx-rx)*.12; ry+=(my-ry)*.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(loop); })();
document.querySelectorAll('a,button,.project-card,.service-item,.review-card,.chat-inp').forEach(el => {
  el.addEventListener('mouseenter', ()=>{ dot.style.width='14px'; dot.style.height='14px'; ring.style.width='52px'; ring.style.height='52px'; ring.style.borderColor='var(--rust)'; });
  el.addEventListener('mouseleave', ()=>{ dot.style.width='8px'; dot.style.height='8px'; ring.style.width='36px'; ring.style.height='36px'; ring.style.borderColor='var(--ink)'; });
});

// ── SCROLL REVEAL
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ setTimeout(()=>e.target.classList.add('visible'),80); ro.unobserve(e.target); } });
}, { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// ── HERO SLIDESHOW
const HERO_LABELS = [
  'Brand Identity · Visual Systems',
  'Editorial Design · Typography',
  'Packaging · Art Direction',
  'Motion Identity · Animation',
  'Typography · Lettering',
  'Visual Systems · Components',
  'Art Direction · Photography',
];
const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
const heroDots = document.getElementById('heroDots');
const heroLabel = document.getElementById('heroSlideLabel');
let heroIdx = 0;
let heroTimer;

heroSlides.forEach((_,i) => {
  const d = document.createElement('button');
  d.className = 'hero-dot' + (i===0?' active':'');
  d.addEventListener('click', ()=>{ goHero(i); resetHeroTimer(); });
  heroDots.appendChild(d);
});

function goHero(n) {
  heroSlides[heroIdx].classList.remove('active');
  heroDots.children[heroIdx].classList.remove('active');
  heroIdx = (n + heroSlides.length) % heroSlides.length;
  heroSlides[heroIdx].classList.add('active');
  heroDots.children[heroIdx].classList.add('active');
  heroLabel.style.opacity = '0';
  setTimeout(()=>{ heroLabel.textContent = HERO_LABELS[heroIdx]; heroLabel.style.opacity='.5'; }, 500);
}
function resetHeroTimer() { clearInterval(heroTimer); heroTimer = setInterval(()=>goHero(heroIdx+1), 4500); }
resetHeroTimer();

document.getElementById('heroPrev').addEventListener('click', ()=>{ goHero(heroIdx-1); resetHeroTimer(); });
document.getElementById('heroNext').addEventListener('click', ()=>{ goHero(heroIdx+1); resetHeroTimer(); });

// ── WORK SLIDER
const workTrack = document.getElementById('workTrack');
const workDots = document.getElementById('workDots');
const workCounter = document.getElementById('workCounter');
const workPrev = document.getElementById('workPrev');
const workNext = document.getElementById('workNext');
const workSlides = Array.from(workTrack.children);
const workTotal = workSlides.length;
let workIdx = 0;

workSlides.forEach((_,i) => {
  const d = document.createElement('button');
  d.className = 'work-dot' + (i===0?' active':'');
  d.addEventListener('click', ()=>goWork(i));
  workDots.appendChild(d);
});

function goWork(n) {
  workIdx = Math.max(0, Math.min(n, workTotal-1));
  workTrack.style.transform = `translateX(-${workIdx * 100}%)`;
  Array.from(workDots.children).forEach((d,i)=>d.classList.toggle('active',i===workIdx));
  workCounter.textContent = `${workIdx+1} / ${workTotal}`;
  workPrev.disabled = workIdx === 0;
  workNext.disabled = workIdx === workTotal-1;
}
workPrev.addEventListener('click', ()=>goWork(workIdx-1));
workNext.addEventListener('click', ()=>goWork(workIdx+1));
goWork(0);

// ── REVIEWS SLIDER
const reviewsTrack = document.getElementById('reviewsTrack');
const reviewsDots = document.getElementById('reviewsDots');
const reviewsPrev = document.getElementById('reviewsPrev');
const reviewsNext = document.getElementById('reviewsNext');
const reviewCards = Array.from(reviewsTrack.children);
const totalReviews = reviewCards.length;
const VISIBLE = 3;
const maxPage = totalReviews - VISIBLE;
let reviewOffset = 0;

function getCardWidth() {
  if(reviewCards[0]) return reviewCards[0].offsetWidth + 24;
  return 0;
}

const reviewPages = Math.ceil(totalReviews / VISIBLE);
for(let i=0; i<reviewPages; i++){
  const d = document.createElement('button');
  d.className = 'reviews-dot' + (i===0?' active':'');
  d.addEventListener('click', ()=>goReviews(i * VISIBLE));
  reviewsDots.appendChild(d);
}

function goReviews(offset) {
  reviewOffset = Math.max(0, Math.min(offset, maxPage));
  reviewsTrack.style.transform = `translateX(-${reviewOffset * getCardWidth()}px)`;
  const page = Math.round(reviewOffset / VISIBLE);
  Array.from(reviewsDots.children).forEach((d,i)=>d.classList.toggle('active',i===page));
}

reviewsPrev.addEventListener('click', ()=>goReviews(reviewOffset - VISIBLE));
reviewsNext.addEventListener('click', ()=>goReviews(reviewOffset + VISIBLE));

// ── WHATSAPP
const waFab = document.getElementById('waFab');
const waChat = document.getElementById('waChat');
const chatClose = document.getElementById('chatClose');
const chatMsgs = document.getElementById('chatMsgs');
const chatQR = document.getElementById('chatQR');
const chatInp = document.getElementById('chatInp');
const chatSend = document.getElementById('chatSend');
const waBadge = document.querySelector('.wa-badge');
let initialized = false;

const KB = [
  { pattern:/pric|cost|rate|fee|budget|charge|how much/i, key:'pricing' },
  { pattern:/portfolio|work|project|sample|case|show/i, key:'portfolio' },
  { pattern:/time|timeline|long|week|deadline|fast|quick/i, key:'timeline' },
  { pattern:/start|hire|book|commission|onboard|begin/i, key:'start' },
  { pattern:/hi|hello|hey|hola|good\s?(morning|afternoon|evening)/i, key:'greet' },
  { pattern:/service|offer|what do you do|speciali/i, key:'services' },
  { pattern:/contact|email|reach|call/i, key:'contact' },
];
const ANSWERS = {
  greet: "Hi there! 👋 I'm Adeleke's studio assistant. I can answer quick questions or connect you directly with Adeleke on WhatsApp. What are you looking for?",
  pricing: "Pricing depends on scope — brand identity projects start around $800, editorial work from $500. Tap 'Start a Project' for a tailored quote! 💬",
  portfolio: "Browse selected projects right here on the page. For the full case study deck, hit 'Start a Project' and Adeleke will send it on WhatsApp. 📁",
  timeline: "Most brand projects run 3–6 weeks. Rush timelines are possible! Tap 'Start a Project' to chat. 🗓️",
  start: "Wonderful! Opening WhatsApp now so Adeleke knows to expect you. See you there! 🚀",
  services: "Adeleke offers brand identity, editorial & print, art direction, packaging, visual systems, and motion & digital. Anything specific catch your eye?",
  contact: "Best way is WhatsApp — tap 'Start a Project' below. You can also email hello@Adelekesolis.co. 📩",
  fallback: "Great question! Adeleke would love to chat directly. Tap 'Start a Project' and she'll reply usually within the hour. 😊",
};
const QUICK_OPTIONS = [
  { label:'💰 Pricing', key:'pricing' },
  { label:'📂 Portfolio', key:'portfolio' },
  { label:'🗓️ Timeline', key:'timeline' },
  { label:'🚀 Start a Project', key:'start' },
];
function openWALink(prefill='') {
  const msg = encodeURIComponent(prefill || "Hi Adeleke! I found you through your portfolio and I'd love to chat about a project.");
  window.open(`https://wa.me/${WA_PHONE}?text=${msg}`, '_blank');
}
function addBubble(text, who) {
  const d = document.createElement('div');
  d.className = `bubble bubble-${who}`;
  d.textContent = text;
  chatMsgs.appendChild(d);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}
function showTyping() { const t=document.createElement('div'); t.className='typing'; t.id='typing'; t.innerHTML='<span></span><span></span><span></span>'; chatMsgs.appendChild(t); chatMsgs.scrollTop=chatMsgs.scrollHeight; }
function hideTyping() { document.getElementById('typing')?.remove(); }
function renderQR(options) {
  chatQR.innerHTML = '';
  options.forEach(o => {
    const btn = document.createElement('button');
    btn.className = 'qr-btn'; btn.textContent = o.label;
    btn.addEventListener('click', ()=>{ addBubble(o.label,'user'); chatQR.innerHTML=''; botReply(o.key, o.label); });
    chatQR.appendChild(btn);
  });
}
function botReply(key, userText='') {
  showTyping();
  setTimeout(()=>{
    hideTyping();
    addBubble(ANSWERS[key]||ANSWERS.fallback, 'bot');
    if(key==='start'){ setTimeout(()=>openWALink(`Hi Adeleke! I found you through your portfolio — ${userText}`),500); }
    else { setTimeout(()=>renderQR([{label:'🚀 Start a Project',key:'start'},{label:'💰 Pricing',key:'pricing'},{label:'📂 Portfolio',key:'portfolio'}]),300); }
  }, 900+Math.random()*500);
}
function handleSend() {
  const text = chatInp.value.trim(); if(!text) return;
  addBubble(text,'user'); chatInp.value=''; chatQR.innerHTML='';
  const match = KB.find(r=>r.pattern.test(text));
  const key = match ? match.key : 'fallback';
  botReply(key, text);
  if(key!=='start') setTimeout(()=>openWALink(text), 2400);
}
function openChat() {
  waChat.classList.add('open'); waBadge.style.display='none';
  if(!initialized){ initialized=true; showTyping(); setTimeout(()=>{ hideTyping(); addBubble("Hey! 👋 Welcome to Adeleke's studio. I'm here to help with any questions — or connect you straight to Adeleke on WhatsApp.", 'bot'); setTimeout(()=>renderQR(QUICK_OPTIONS),300); }, 1000); }
}
waFab.addEventListener('click', openChat);
chatClose.addEventListener('click', ()=>waChat.classList.remove('open'));
chatSend.addEventListener('click', handleSend);
chatInp.addEventListener('keydown', e=>{ if(e.key==='Enter') handleSend(); });
