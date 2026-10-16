// EduNique "Start Here" concept: four questions -> suggestion -> details -> sent -> continue.
// Rules-based routing, mocked submission. Nothing leaves the browser.

const RING = '<svg class="ring" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true"><path d="M34 10 C 90 0, 178 4, 193 32 C 205 58, 150 77, 96 76 C 38 75, 3 62, 7 39 C 11 18, 52 8, 120 7"/></svg>';

const Q = [
  { id: 'age', title: 'How old is your child?', why: 'So we only suggest things made for their age.', layout: 'row',
    opts: [['2-4', '2–4 years'], ['5-6', '5–6 years'], ['7-8', '7–8 years'], ['9-10', '9–10 years'], ['11-13', '11–13 years'], ['14+', '14 or older']] },
  { id: 'help', title: 'What would you most like help with?', why: 'This shapes the suggestion and tells our team where to begin.', layout: 'stack',
    opts: [['school', 'School subjects and marks'], ['confidence', 'Confidence and speaking'], ['making', 'Curiosity, science and making things'], ['tech', 'Coding and technology'], ['open', 'Not sure yet']] },
  { id: 'mode', title: 'How would your child learn best right now?', why: 'This decides which of our two teams can help.', layout: 'stack',
    opts: [['teacher', 'With a teacher guiding them', 'Live classes with EduNique'], ['home', 'Hands-on at home, at their own pace', 'Skill Boxes and kits from Skillioneer'], ['unsure', "I'd like help deciding", 'A person from EduNique talks it through']] },
  { id: 'when', title: 'When would you like to start?', why: "So we don't chase you if you're only looking.", layout: 'row',
    opts: [['week', 'This week'], ['month', 'This month'], ['looking', 'Just looking for now']] },
];

const label = (qi, v) => (Q[qi].opts.find(o => o[0] === v) || [])[1] || '';
const state = { step: 0, a: {}, lead: {} };
const sheet = document.getElementById('sheet');

const SKILLBOX = { '2-4': '2-4-years', '5-6': '5-6-years', '7-8': '7-8-years', '9-10': '9-10-years' };

function route() {
  const { mode, age } = state.a;
  if (mode === 'teacher') return { key: 'teacher', cls: 'route-teacher', btn: 'btn-ink',
    tag: 'A good place to start', title: 'A free first conversation with an EduNique teacher',
    body: 'They will suggest a class that fits ' + label(1, state.a.help).toLowerCase() + ' for a ' + label(0, age).replace(' years', '-year-old').replace('14 or older', 'teenager') + '.',
    img: null, dest: 'EduNique', url: 'https://edunique.in/', send: 'Send and continue to EduNique' };
  if (mode === 'home') {
    const box = SKILLBOX[age];
    return { key: 'home', cls: 'route-home', btn: 'btn-mari', tag: 'A good place to start',
      title: box ? 'The Skill Box for ' + label(0, age) : 'Skillioneer kits for ' + label(0, age),
      body: box ? 'Activities, cards and books for this age, done at home at your child’s pace. Contents and price on the Skillioneer page.' : 'A selection EduNique chooses for older children. Kits and books, done at home.',
      img: box ? '/concept-v3/img/skillbox-cover-' + age + '.webp' : '/concept-v3/img/skillbox-backpack.webp', dest: 'Skillioneer',
      url: box ? 'https://skillioneer.theedunique.com/product/skill-box-' + box + '/' : 'https://skillioneer.theedunique.com/shop/',
      send: 'Send and continue to Skillioneer' };
  }
  return { key: 'unsure', cls: 'route-unsure', btn: 'btn-pink', tag: 'Let’s work it out together',
    title: 'A short call with someone from EduNique',
    body: 'They will ask a few questions and suggest either a teacher or learning at home. No obligation.',
    img: null, dest: null, url: null, send: 'Ask EduNique to contact me' };
}

function tally(n) {
  return '<div class="tally"><span>' + (n <= 4 ? 'Question ' + n + ' of 4' : '') + '</span><span class="marks" aria-hidden="true">' +
    [1, 2, 3, 4].map(i => '<i class="' + (i <= Math.min(n, 4) && (i < n || n > 4 || state.a[Q[i - 1].id]) ? 'on' : '') + '"></i>').join('') + '</span></div>';
}

function sheetHead(n, backTo) {
  return '<div class="sheet-top"><button class="back" type="button" data-back="' + backTo + '"' + (backTo < 0 ? ' hidden' : '') +
    '><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>Back</button>' + tally(n) + '</div>';
}

function renderQuestion(i) {
  const q = Q[i], cur = state.a[q.id];
  sheet.innerHTML = sheetHead(i + 1, i - 1) +
    '<form id="qf" novalidate><fieldset style="border:0;padding:0;margin:0"><legend class="q-title" tabindex="-1">' + q.title + '</legend>' +
    '<p class="q-why">' + q.why + '</p>' +
    '<p class="err" id="qerr" hidden>Choose one answer to continue.</p>' +
    '<div class="chips ' + (q.layout === 'stack' ? 'stack' : q.id === 'age' ? 'tiles' : '') + '" role="radiogroup">' +
    q.opts.map(o => '<label class="chip' + (cur === o[0] ? ' is-on' : '') + '"><input type="radio" name="' + q.id + '" value="' + o[0] + '"' + (cur === o[0] ? ' checked' : '') +
      '><span class="tick" aria-hidden="true"></span>' + (q.id === 'age' ? '<span class="num">' + o[1].replace(' years', '').replace(' or older', '+') + '</span><span class="unit">' + (o[0] === '14+' ? 'and older' : 'years') + '</span>' : '<span>' + o[1] + (o[2] ? '<small>' + o[2] + '</small>' : '') + '</span>') + RING + '</label>').join('') +
    '</div></fieldset><div class="row-actions"><button class="btn btn-ink" type="submit">' + (i === 3 ? 'See my suggestion' : 'Continue') + '</button></div></form>';
  const f = sheet.querySelector('#qf');
  f.addEventListener('change', e => {
    state.a[q.id] = e.target.value;
    f.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-on', c.querySelector('input').checked));
    sheet.querySelector('#qerr').hidden = true;
    sheet.querySelector('.tally').outerHTML = tally(i + 1);
  });
  f.addEventListener('submit', e => {
    e.preventDefault();
    if (!state.a[q.id]) { const er = sheet.querySelector('#qerr'); er.hidden = false; f.querySelector('input').focus(); return; }
    go(i + 1);
  });
}

function renderResult() {
  const r = route();
  sheet.innerHTML = sheetHead(5, 3) +
    '<span class="result-tag" style="color:' + (r.key === 'home' ? '#9A5B00' : r.key === 'unsure' ? 'var(--pink)' : 'var(--ink)') + '">' + r.tag + '</span>' +
    '<h2 class="q-title" tabindex="-1" style="font-size:28px">Here is where we’d begin</h2>' +
    '<div class="route-card ' + r.cls + '"><div><h3>' + r.title + '</h3><p>' + r.body + '</p></div>' + (r.img ? '<img src="' + r.img + '" alt="">' : '') + '</div>' +
    '<ul class="echo" aria-label="Your answers">' +
    Q.map((q, i) => '<li><span>' + ['Age', 'Help with', 'Learns best', 'Start'][i] + '</span><b style="font-weight:600">' + label(i, state.a[q.id]) + '</b> <button class="link" type="button" data-change="' + i + '" style="font-size:14px">Change</button></li>').join('') +
    '</ul><p class="disclaimer">This suggestion is based only on your answers. It is not an assessment of your child.</p>' +
    '<div class="row-actions"><button class="btn ' + r.btn + '" type="button" data-next="form">' + (r.key === 'unsure' ? 'Choose how we contact you' : 'Send me this and continue') + '</button></div>';
}

function renderForm(errs) {
  const r = route(), L = state.lead;
  const ageOpts = Q[0].opts.map(o => '<option value="' + o[0] + '"' + (state.a.age === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('');
  const fe = k => errs && errs[k] ? '<span class="ferr" id="e-' + k + '">' + errs[k] + '</span>' : '';
  sheet.innerHTML = sheetHead(6, 4) +
    '<h2 class="q-title" tabindex="-1" style="font-size:26px">Where should we send your suggestion?</h2>' +
    '<p class="q-why">The ' + (r.dest || 'EduNique') + ' team will message you on WhatsApp <span class="tbc">reply time TBC</span>.</p>' +
    '<div class="form-sum" id="fsum" tabindex="-1"' + (errs ? '' : ' hidden') + '>' + (errs ? 'Fix ' + Object.keys(errs).length + ' thing' + (Object.keys(errs).length > 1 ? 's' : '') + ' to send.' : '') + '</div>' +
    '<form id="lf" novalidate>' +
    '<div class="field' + (errs && errs.name ? ' has-err' : '') + '"><label for="f-name">Your name</label>' + fe('name') + '<input id="f-name" name="name" autocomplete="name" value="' + (L.name || '') + '"' + (errs && errs.name ? ' aria-invalid="true" aria-describedby="e-name"' : '') + '></div>' +
    '<div class="field' + (errs && errs.phone ? ' has-err' : '') + '"><label for="f-phone">WhatsApp number</label><span class="hint">Only for this enquiry.</span>' + fe('phone') + '<div class="tel"><span>+91</span><input id="f-phone" type="tel" inputmode="numeric" autocomplete="tel-national" value="' + (L.phone || '') + '"' + (errs && errs.phone ? ' aria-invalid="true" aria-describedby="e-phone"' : '') + '></div></div>' +
    '<div class="field"><label for="f-email">Email <span style="font-weight:400;color:var(--muted)">(optional)</span></label><input id="f-email" type="email" autocomplete="email" spellcheck="false" value="' + (L.email || '') + '"></div>' +
    '<div class="field"><label for="f-age">Child’s age</label><select id="f-age">' + ageOpts + '</select></div>' +
    '<input class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" name="website">' +
    '<label class="check"><input type="checkbox" id="f-consent"' + (L.consent ? ' checked' : '') + '><span>I am this child’s parent or guardian, and EduNique may contact me about this enquiry. <a href="#">Privacy policy</a></span></label>' + fe('consent') +
    '<label class="check"><input type="checkbox" id="f-news"' + (L.news ? ' checked' : '') + '><span>Also send me occasional updates (optional).</span></label>' +
    '<div class="row-actions" style="margin-top:8px"><button class="btn ' + r.btn + '" type="submit">' + r.send + '</button></div></form>';
  const f = sheet.querySelector('#lf');
  f.addEventListener('submit', e => {
    e.preventDefault();
    const v = id => sheet.querySelector(id).value.trim();
    Object.assign(state.lead, { name: v('#f-name'), phone: v('#f-phone').replace(/\D/g, ''), email: v('#f-email'), consent: sheet.querySelector('#f-consent').checked, news: sheet.querySelector('#f-news').checked });
    state.a.age = v('#f-age');
    const er = {};
    if (!state.lead.name) er.name = 'Enter your name.';
    if (!/^[6-9]\d{9}$/.test(state.lead.phone)) er.phone = 'Enter a 10-digit mobile number.';
    if (!state.lead.consent) er.consent = 'Tick this box so we can contact you.';
    if (Object.keys(er).length) { renderForm(er); sheet.querySelector('#fsum').focus(); return; }
    const b = f.querySelector('button[type=submit]'); b.disabled = true; b.textContent = 'Sending…';
    setTimeout(() => go('sent'), 700);
  });
}

function renderSent() {
  const r = route(), first = state.lead.name.split(' ')[0];
  sheet.innerHTML = '<div class="sheet-top"><div class="tally"><span>Done</span><span class="marks" aria-hidden="true"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></span></div></div>' +
    '<span class="result-tag" style="color:var(--ink)">Thank you, ' + first + '</span>' +
    '<h2 class="q-title" tabindex="-1" style="font-size:28px">Your answers are with the ' + (r.dest || 'EduNique') + ' team</h2>' +
    '<ol class="next-steps"><li>A person from the team reads your four answers.</li><li>They message you on WhatsApp at +91 ' + state.lead.phone.replace(/(\d{5})(\d{5})/, '$1 $2') + ' <span class="tbc">reply time TBC</span>.</li>' +
    (r.dest ? '<li>Meanwhile, you can look around ' + r.dest + '.</li>' : '<li>On the call, they suggest a teacher or learning at home. No obligation.</li>') + '</ol>' +
    (r.url ? '<div class="row-actions"><a class="btn ' + r.btn + '" href="' + r.url + '" target="_blank" rel="noopener">Continue to ' + r.dest + '</a></div>' : '<div class="row-actions"><button class="btn btn-ink" type="button" data-restart>Done</button></div>') +
    '<p class="disclaimer" style="margin-top:16px">Prototype: nothing was sent. In the live page this goes to one inbox EduNique chooses.</p>';
}

function go(step, focus = true) {
  state.step = step;
  if (typeof step === 'number' && step < 4) renderQuestion(step);
  else if (step === 4) renderResult();
  else if (step === 'form') renderForm();
  else if (step === 'sent') renderSent();
  if (focus) { const h = sheet.querySelector('[tabindex="-1"]'); if (h) h.focus({ preventScroll: true }); if (window.innerWidth < 900) sheet.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
}

sheet.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.back !== undefined) { const b = +t.dataset.back; go(b === 4 ? 4 : b); }
  if (t.dataset.change !== undefined) go(+t.dataset.change);
  if (t.dataset.next === 'form') go('form');
  if (t.dataset.restart !== undefined) { state.a = {}; go(0); }
});

go(0, false);

// mobile sticky start bar: shown only when the sheet is off-screen
const sticky = document.getElementById('sticky');
new IntersectionObserver(([en]) => sticky.classList.toggle('show', !en.isIntersecting && state.step !== 'sent'), { threshold: 0 }).observe(sheet);

// testing hooks
window.__proto = { state, go, route };
