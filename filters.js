/* === Jobs page: filters, list, modals === */
(function(){
  const params = new URLSearchParams(location.search);
  const state = {
    q: params.get('q') || '',
    loc: params.get('loc') || '',
    category: params.get('cat') || '',
    company: params.get('company') || '',
    types: new Set(),
    experience: '',
    minSalary: 0,
    sort: 'recent',
  };
  const all = getAllJobs();
  // Populate selects
  const catSel = document.getElementById('fCategory');
  const locSel = document.getElementById('fLocation');
  [...new Set(all.map(j => j.category))].sort().forEach(c => catSel.insertAdjacentHTML('beforeend', `<option>${c}</option>`));
  [...new Set(all.map(j => j.location))].sort().forEach(l => locSel.insertAdjacentHTML('beforeend', `<option>${l}</option>`));
  // Initial values from URL
  document.getElementById('fQuery').value = state.q;
  if(state.category) catSel.value = state.category;
  const totalCountEl = document.getElementById('totalCount');
  totalCountEl.textContent = all.length;
  animateCounter(totalCountEl);
  // Listeners
  document.getElementById('fQuery').addEventListener('input', e => { state.q = e.target.value; render(); });
  catSel.addEventListener('change', e => { state.category = e.target.value; render(); });
  locSel.addEventListener('change', e => { state.loc = e.target.value; render(); });
  document.getElementById('fExperience').addEventListener('change', e => { state.experience = e.target.value; render(); });
  const sal = document.getElementById('fSalary');
  sal.addEventListener('input', e => {
    state.minSalary = parseInt(e.target.value);
    document.getElementById('fSalaryVal').textContent = state.minSalary;
    render();
  });
  document.querySelectorAll('#fType .chip').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.val;
    if(state.types.has(v)){ state.types.delete(v); b.classList.remove('active'); }
    else{ state.types.add(v); b.classList.add('active'); }
    render();
  }));
  document.getElementById('sortBy').addEventListener('change', e => { state.sort = e.target.value; render(); });
  document.getElementById('clearFilters').addEventListener('click', () => {
    state.q=''; state.loc=''; state.category=''; state.company=''; state.experience=''; state.minSalary=0; state.types.clear();
    document.getElementById('fQuery').value='';
    catSel.value=''; locSel.value=''; document.getElementById('fExperience').value='';
    sal.value=0; document.getElementById('fSalaryVal').textContent='0';
    document.querySelectorAll('#fType .chip').forEach(b => b.classList.remove('active'));
    render();
  });
  function getSaved(){ return new Set(JSON.parse(localStorage.getItem('cn_saved') || '[]')); }
  function toggleSave(id){
    const s = getSaved();
    if(s.has(id)) s.delete(id); else s.add(id);
    localStorage.setItem('cn_saved', JSON.stringify([...s]));
    toast(s.has(id) ? 'Job saved' : 'Removed from saved');
    render();
  }
  window.cnToggleSave = toggleSave;
  function render(){
    let list = all.filter(j => {
      const text = (j.title + ' ' + j.company).toLowerCase();
      if(state.q && !text.includes(state.q.toLowerCase())) return false;
      if(state.loc && j.location !== state.loc) return false;
      if(state.category && j.category !== state.category) return false;
      if(state.company && j.company !== state.company) return false;
      if(state.experience && j.experience !== state.experience) return false;
      if(state.types.size && !state.types.has(j.type)) return false;
      if(state.minSalary && j.max < state.minSalary) return false;
      return true;
    });
    if(state.sort === 'salaryDesc') list.sort((a,b) => b.max - a.max);
    else if(state.sort === 'salaryAsc') list.sort((a,b) => a.min - b.min);
    document.getElementById('resultCount').textContent = list.length;
    const wrap = document.getElementById('jobList');
    const empty = document.getElementById('empty');
    const saved = getSaved();
    if(!list.length){
      wrap.innerHTML = ''; empty.classList.remove('hidden'); return;
    }
    empty.classList.add('hidden');
    wrap.innerHTML = list.map(j => `
      <article class="job glass">
        <div>
          <div class="job-head">
            <div class="logo" style="background:${j.color}">${j.company[0]}</div>
            <div>
              <strong>${j.title}</strong>
              <small>${j.company} · ${j.location} · ${j.posted}</small>
            </div>
          </div>
          <div class="job-meta">
            <span class="chip mini">${j.type}</span>
            <span class="chip mini">${j.experience}</span>
            <span class="chip mini">${j.category}</span>
            <span class="chip mini">$${j.min}k–$${j.max}k</span>
          </div>
        </div>
        <div class="job-actions">
          <button class="bookmark ${saved.has(j.id)?'active':''}" onclick="cnToggleSave(${j.id})" aria-label="Save">${saved.has(j.id)?'★':'☆'}</button>
          <button class="btn btn-ghost" onclick="cnOpenJob(${j.id})">Details</button>
          <button class="btn btn-primary" onclick="cnApply(${j.id})">Apply</button>
        </div>
      </article>
    `).join('');
  }
  // MODAL
  const modal = document.getElementById('jobModal');
  const modalContent = document.getElementById('modalContent');
  document.getElementById('modalClose').addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', e => { if(e.target === modal) modal.classList.add('hidden'); });
  window.cnOpenJob = (id) => {
    const j = all.find(x => x.id === id);
    if(!j) return;
    // Recently viewed
    const recent = JSON.parse(localStorage.getItem('cn_recent') || '[]').filter(x => x !== id);
    recent.unshift(id);
    localStorage.setItem('cn_recent', JSON.stringify(recent.slice(0,10)));
    modalContent.innerHTML = `
      <div class="modal-head">
        <div class="logo" style="background:${j.color};width:56px;height:56px;font-size:1.3rem">${j.company[0]}</div>
        <div>
          <h2>${j.title}</h2>
          <p class="muted">${j.company} · ${j.location} · ${j.posted}</p>
        </div>
      </div>
      <div class="modal-meta">
        <span class="chip mini">${j.type}</span>
        <span class="chip mini">${j.experience}</span>
        <span class="chip mini">${j.category}</span>
        <span class="chip mini">$${j.min}k–$${j.max}k</span>
      </div>
      <p>${j.description}</p>
      <h4>Responsibilities</h4>
      <ul>${j.responsibilities.map(r=>`<li>${r}</li>`).join('')}</ul>
      <h4>Required Skills</h4>
      <ul>${j.skills.map(r=>`<li>${r}</li>`).join('')}</ul>
      <h4>Benefits</h4>
      <ul>${j.benefits.map(r=>`<li>${r}</li>`).join('')}</ul>
      <h4>About ${j.company}</h4>
      <p class="muted">${j.company} is a leading employer in ${j.category}. Join a team that values craft, autonomy, and impact.</p>
      <div class="modal-cta">
        <button class="btn btn-primary" onclick="cnApply(${j.id})">Apply Now</button>
        <button class="btn btn-ghost" onclick="cnToggleSave(${j.id})">${getSaved().has(j.id)?'★ Saved':'☆ Save Job'}</button>
      </div>
    `;
    modal.classList.remove('hidden');
  };
  // APPLY
  const applyModal = document.getElementById('applyModal');
  const applyForm = document.getElementById('applyForm');
  const applySuccess = document.getElementById('applySuccess');
  document.getElementById('applyClose').addEventListener('click', () => applyModal.classList.add('hidden'));
  applyModal.addEventListener('click', e => { if(e.target === applyModal) applyModal.classList.add('hidden'); });
  let currentApplyId = null;
  window.cnApply = (id) => {
    const j = all.find(x => x.id === id); if(!j) return;
    currentApplyId = id;
    document.getElementById('applyJobTitle').textContent = j.title;
    applyForm.classList.remove('hidden');
    applySuccess.classList.add('hidden');
    applyForm.reset();
    modal.classList.add('hidden');
    applyModal.classList.remove('hidden');
  };
  applyForm.addEventListener('submit', e => {
    e.preventDefault();
    if(!applyForm.checkValidity()){ applyForm.reportValidity(); return; }
    const applied = new Set(JSON.parse(localStorage.getItem('cn_applied') || '[]'));
    applied.add(currentApplyId);
    localStorage.setItem('cn_applied', JSON.stringify([...applied]));
    applyForm.classList.add('hidden');
    applySuccess.classList.remove('hidden');
    toast('Application submitted!');
    setTimeout(() => applyModal.classList.add('hidden'), 1800);
  });
  // Open via URL ?open=
  const openId = parseInt(params.get('open'));
  render();
  if(openId) setTimeout(() => cnOpenJob(openId), 200);
})();
