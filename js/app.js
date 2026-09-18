// ══════════════════════════════════════════════
// APP.JS — Core Logic & Navigation
// ══════════════════════════════════════════════

// ── Book metadata ──
const BOOKS = {
  Gen: { abbr:'創', abbr_en:'Gen', main:'#4A5D73', light:'#E8ECF1', name_en:'Genesis',      name_zh:'創世記' },
  Exo: { abbr:'出', abbr_en:'Exo', main:'#934B43', light:'#F7ECEB', name_en:'Exodus',       name_zh:'出埃及記' },
  Lev: { abbr:'利', abbr_en:'Lev', main:'#C8A96A', light:'#FAF4E8', name_en:'Leviticus',    name_zh:'利未記' },
  Num: { abbr:'民', abbr_en:'Num', main:'#D6A84C', light:'#FAF3E5', name_en:'Numbers',      name_zh:'民數記' },
  Deu: { abbr:'申', abbr_en:'Deu', main:'#526851', light:'#EEF2EE', name_en:'Deuteronomy',  name_zh:'申命記' }
};
const BOOK_KEYS = ['Gen','Exo','Lev','Num','Deu'];

// ── Helpers ──
function bookCount(item) {
  return BOOK_KEYS.filter(k => item.books && item.books[k]).length;
}

function refsText(books) {
  if (!books) return '';
  const lang = I18N.get();
  return BOOK_KEYS
    .filter(k => books[k])
    .map(k => `${lang === 'zh' ? BOOKS[k].name_zh : BOOKS[k].name_en} ${books[k]}`)
    .join(' · ');
}

function dotClass(item) {
  const n = bookCount(item);
  if (n >= 5) return 'd5';
  if (n === 4) return 'd4';
  if (n === 3) return 'd3';
  if (n === 2) return 'd2';
  for (const k of BOOK_KEYS) {
    if (item.books && item.books[k]) return 'd1-' + k.toLowerCase();
  }
  return 'd2';
}

function bookBadge(item, bookKey) {
  const has = item.books && item.books[bookKey];
  const lang = typeof I18N !== 'undefined' ? I18N.get() : 'zh';
  const abbr = lang === 'zh' ? BOOKS[bookKey].abbr : (BOOKS[bookKey].abbr_en || BOOKS[bookKey].abbr);
  return has
    ? `<div class="badge b-${bookKey.toLowerCase()}-on">${abbr}</div>`
    : `<div class="badge b-off">${abbr}</div>`;
}

function allBadges(item) {
  return `<div class="badges">${BOOK_KEYS.map(k => bookBadge(item, k)).join('')}</div>`;
}

// ── Detail Modal ──
function openCmdModal(cmdId) {
  if (typeof COMMANDMENTS === 'undefined') return;
  const cmd = COMMANDMENTS.find(c => c.id === Number(cmdId));
  if (!cmd) return;

  const modal = document.getElementById('cmdModal');
  if (!modal) return;

  const lang = I18N.get();

  // Header badges
  const idBadge = document.getElementById('modalIdBadge');
  idBadge.textContent = `#${cmd.id}`;
  idBadge.style.background = '#2B2B2B';
  idBadge.style.color = 'white';

  const typeBadge = document.getElementById('modalTypeBadge');
  const isPos = cmd.type === 'positive';
  typeBadge.textContent = isPos
    ? (lang === 'zh' ? '積極誡命 (當行 · 248)' : 'Positive Mitzvah (Do · 248)')
    : (lang === 'zh' ? '消極禁令 (不可 · 365)' : 'Negative Mitzvah (Don\'t · 365)');
  typeBadge.style.background = isPos ? '#16A34A' : '#DC2626';
  typeBadge.style.color = 'white';

  const bookBadgeEl = document.getElementById('modalBookBadge');
  const bk = cmd.book || 'Exo';
  bookBadgeEl.textContent = lang === 'zh' ? BOOKS[bk].name_zh : BOOKS[bk].name_en;
  bookBadgeEl.style.background = BOOKS[bk].main;
  bookBadgeEl.style.color = 'white';

  const catBadge = document.getElementById('modalCategoryBadge');
  catBadge.textContent = lang === 'zh' ? cmd.category_zh : cmd.category_name;
  catBadge.style.background = '#78716C';
  catBadge.style.color = 'white';

  // Title and Reference
  document.getElementById('modalTitle').textContent = lang === 'zh' ? (cmd.title_zh || cmd.title_en) : cmd.title_en;
  document.getElementById('modalRef').textContent = lang === 'zh' ? cmd.ref_zh : cmd.ref;

  // Scripture texts
  const zhEl = document.getElementById('modalChinese');
  if (zhEl) zhEl.textContent = cmd.scripture_zh || '無和合本經文';
  document.getElementById('modalEnglish').textContent = cmd.scripture_en || 'No translation available';
  document.getElementById('modalHebrew').textContent = cmd.scripture_he || '無原文經文';

  // Meta items
  document.getElementById('modalParashah').textContent = lang === 'zh' ? `${cmd.parashah_zh} (${cmd.parashah})` : cmd.parashah;
  document.getElementById('modalSubcategory').textContent = cmd.subcategory || '-';
  document.getElementById('modalChinuch').textContent = cmd.chinuch ? `#${cmd.chinuch}` : '-';

  modal.style.display = 'flex';
}

function closeCmdModal() {
  const modal = document.getElementById('cmdModal');
  if (modal) modal.style.display = 'none';
}

// ── Stats pills ──
function updateStatPills() {
  if (typeof COMMANDMENTS === 'undefined') return;
  const lang = typeof I18N !== 'undefined' ? I18N.get() : 'zh';
  BOOK_KEYS.forEach(k => {
    const el = document.getElementById('s' + k);
    if (el) {
      const count = COMMANDMENTS.filter(c => c.books && c.books[k]).length;
      const abbr = lang === 'zh' ? BOOKS[k].abbr : BOOKS[k].abbr_en;
      el.textContent = `${abbr}: ${count}`;
    }
  });
}

// ── Coverage Grid ──
function buildCoverageGrid() {
  if (typeof COMMANDMENTS === 'undefined') return;
  const grid = document.getElementById('covGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const lang = typeof I18N !== 'undefined' ? I18N.get() : 'zh';
  COMMANDMENTS.forEach(c => {
    const d = document.createElement('div');
    d.className = `cdot ${dotClass(c)}`;
    const ref = lang === 'zh' ? c.ref_zh : c.ref;
    d.title = `#${c.id}: ${I18N.t(c, 'title')} (${ref})`;
    d.addEventListener('click', () => {
      openCmdModal(c.id);
    });
    grid.appendChild(d);
  });
}

// ── View Tabs ──
function showView(name) {
  document.querySelectorAll('.vtab').forEach(b => b.classList.toggle('active', b.dataset.view === name));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === `view-${name}`));
  
  const covStrip = document.querySelector('.coverage-strip');
  if (covStrip) covStrip.style.display = (name === 'cmd-timeline' || name === 'matrix') ? '' : 'none';

  const sel = document.getElementById('viewSelect');
  if (sel) sel.value = name;

  // Trigger view renderers if necessary
  if (name === 'map' && window.renderJourneyMap) window.renderJourneyMap();
  if (name === 'radial' && window.renderTorahWheel) window.renderTorahWheel();
  if (name === 'category-grid' && window.renderCategoryGrid) window.renderCategoryGrid();
  if (name === 'reading' && window.renderReadingPlan) window.renderReadingPlan();
}

// ── DOM Initialization ──
document.addEventListener('DOMContentLoaded', () => {
  buildCoverageGrid();
  updateStatPills();

  // Tab click and hover
  const tabHint = document.getElementById('tab-hint');
  document.querySelectorAll('.vtab').forEach(b => {
    b.addEventListener('click', () => showView(b.dataset.view));
    b.addEventListener('mouseenter', (e) => {
      const lang = I18N.get();
      const desc = b.getAttribute(`data-desc-${lang}`);
      if (desc && tabHint) {
        tabHint.textContent = desc;
        tabHint.style.opacity = '1';
        const rect = b.getBoundingClientRect();
        tabHint.style.left = `${Math.max(10, rect.left + rect.width / 2 - 170)}px`;
        tabHint.style.top = `${rect.bottom + 6}px`;
      }
    });
    b.addEventListener('mouseleave', () => {
      if (tabHint) tabHint.style.opacity = '0';
    });
  });

  // Mobile select
  const sel = document.getElementById('viewSelect');
  if (sel) {
    sel.addEventListener('change', () => showView(sel.value));
  }

  // Modal close handlers
  const closeBtn = document.getElementById('modalCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeCmdModal);

  const modal = document.getElementById('cmdModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeCmdModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCmdModal();
  });
});

window.buildCoverageGrid = buildCoverageGrid;
window.updateStatPills = updateStatPills;
window.openCmdModal = openCmdModal;
window.closeCmdModal = closeCmdModal;
window.showView = showView;

