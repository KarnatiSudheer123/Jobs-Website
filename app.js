/* === CareerNest core app === */
// THEME
(function(){
  const saved = localStorage.getItem('cn_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();
document.addEventListener('DOMContentLoaded', () => {
  const tBtn = document.getElementById('themeToggle');
  if(tBtn){
    const setIcon = () => {
      tBtn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
    };
    setIcon();
    tBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('cn_theme', next);
      setIcon();
    });
  }
  // Hamburger
  const burger = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if(burger && links){
    burger.addEventListener('click', () => links.classList.toggle('open'));
  }
  // Back to top
  const toTop = document.getElementById('toTop');
  if(toTop){
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('visible', window.scrollY > 400);
    });
    toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  }
  initReveal();
  initCounters();
});
// REVEAL
function initReveal(){
  const els = document.querySelectorAll('.reveal:not(.visible)');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});
  els.forEach(el => io.observe(el));
}
// COUNTERS
function initCounters(){
  document.querySelectorAll('[data-target]').forEach(el => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting){ animateCounter(el); io.unobserve(el); }
      });
    });
    io.observe(el);
  });
}
function animateCounter(el){
  const target = parseInt(el.dataset.target || el.textContent, 10);
  if(isNaN(target)) return;
  const duration = 1400;
  const start = performance.now();
  const startVal = 0;
  function step(now){
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.floor(startVal + (target - startVal) * eased);
    el.textContent = val.toLocaleString();
    if(p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
// TOAST
function toast(msg){
  const el = document.getElementById('toast');
  if(!el){ console.log(msg); return; }
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.add('hidden'), 2400);
}
