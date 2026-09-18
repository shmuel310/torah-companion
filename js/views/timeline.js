// ══════════════════════════════════════════════
// TIMELINE VIEW — Commandments + Narratives
// ══════════════════════════════════════════════

(function() {

let cmdBookFilter = 'all';
let cmdTypeFilter = 'all';
let cmdSearchQuery = '';
let cmdSortMode = 'category'; // 'category' | 'scripture' | 'polarity'

function buildCmdTimeline() {
  if (typeof COMMANDMENTS === 'undefined' || typeof MT_CATEGORIES === 'undefined') return;
  const main = document.getElementById('cmdMain');
  if (!main) return;
  main.innerHTML = '';

  const lang = I18N.get();

  if (cmdSortMode === 'category') {
    // ── Group by 14 Mishneh Torah categories ──
    MT_CATEGORIES.forEach(cat => {
      const cmds = COMMANDMENTS.filter(c => c.category === cat.id);
      if (cmds.length === 0) return;

      const partEl = document.createElement('div');
      partEl.className = 'part';

      const catTitle = lang === 'zh' ? cat.title_zh : cat.title_en;
      const subText = `${cmds.length} ${lang === 'zh' ? '條誡命' : 'commandments'}`;

      partEl.innerHTML = `
        <div class="pheader" style="background:${cat.color}">
          <div class="pnum">${cat.num}</div>
          <div class="pinfo">
            <div class="ptitle">${catTitle}</div>
            <div class="psub">${subText}</div>
          </div>
          <div class="pchev">▼</div>
        </div>
        <div class="pbody">
          ${renderCmdList(cmds, lang)}
        </div>`;

      setupCollapse(partEl);
      main.appendChild(partEl);
    });
  } else if (cmdSortMode === 'polarity') {
    // ── Group by Positive (248) vs Negative (365) ──
    const groups = [
      { id: 'pos', title: lang === 'zh' ? '積極誡命（當行之事）' : 'Positive Commandments (Mitzvot Aseh)', color: '#16A34A', count: 248, list: COMMANDMENTS.filter(c => c.type === 'positive') },
      { id: 'neg', title: lang === 'zh' ? '消極禁令（禁止之事）' : 'Negative Commandments (Mitzvot Lo Ta\'aseh)', color: '#DC2626', count: 365, list: COMMANDMENTS.filter(c => c.type === 'negative') }
    ];
    groups.forEach((grp, idx) => {
      const partEl = document.createElement('div');
      partEl.className = 'part';
      partEl.innerHTML = `
        <div class="pheader" style="background:${grp.color}">
          <div class="pnum">${idx + 1}</div>
          <div class="pinfo">
            <div class="ptitle">${grp.title}</div>
            <div class="psub">${grp.count} ${lang === 'zh' ? '條誡命' : 'commandments'}</div>
          </div>
          <div class="pchev">▼</div>
        </div>
        <div class="pbody">
          ${renderCmdList(grp.list, lang)}
        </div>`;
      setupCollapse(partEl);
      main.appendChild(partEl);
    });
  } else {
    // ── Group by Five Books (Scripture Order) ──
    BOOK_KEYS.forEach(bk => {
      const cmds = COMMANDMENTS.filter(c => c.book === bk);
      if (cmds.length === 0) return;

      const partEl = document.createElement('div');
      partEl.className = 'part';
      const bkInfo = BOOKS[bk];
      const bkTitle = lang === 'zh' ? bkInfo.name_zh : bkInfo.name_en;

      partEl.innerHTML = `
        <div class="pheader" style="background:${bkInfo.main}">
          <div class="pnum">${bkInfo.abbr}</div>
          <div class="pinfo">
            <div class="ptitle">${bkTitle}</div>
            <div class="psub">${cmds.length} ${lang === 'zh' ? '條誡命' : 'commandments'}</div>
          </div>
          <div class="pchev">▼</div>
        </div>
        <div class="pbody">
          ${renderCmdList(cmds, lang)}
        </div>`;
      setupCollapse(partEl);
      main.appendChild(partEl);
    });
  }

  // Wire click events to open modal
  main.querySelectorAll('.si').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      if (id && window.openCmdModal) window.openCmdModal(id);
    });
  });

  applyCmdFilters();
}

function renderCmdList(cmds, lang) {
  return cmds.map(c => {
    const title = lang === 'zh' ? (c.title_zh || c.title_en) : c.title_en;
    const ref = lang === 'zh' ? c.ref_zh : c.ref;
    const typeColor = c.type === 'positive' ? '#16A34A' : '#DC2626';
    const typeLabel = c.type === 'positive'
      ? (lang === 'zh' ? '當行 (248)' : 'Do')
      : (lang === 'zh' ? '不可 (365)' : 'Don\'t');
    const hasGen = c.books && c.books.Gen ? '1' : '0';
    const hasExo = c.books && c.books.Exo ? '1' : '0';
    const hasLev = c.books && c.books.Lev ? '1' : '0';
    const hasNum = c.books && c.books.Num ? '1' : '0';
    const hasDeu = c.books && c.books.Deu ? '1' : '0';

      const pName = lang === 'zh' ? (c.parashah_zh || c.parashah) : (c.parashah || c.parashah_zh);
      return `<div class="si" id="cmd${c.id}" data-id="${c.id}"
        data-gen="${hasGen}" data-exo="${hasExo}" data-lev="${hasLev}"
        data-num="${hasNum}" data-deu="${hasDeu}" data-type="${c.type}"
        data-title="${(c.title_zh + ' ' + c.title_en + ' ' + c.ref).toLowerCase()}">
        <div class="snum">${c.id}</div>
        <div class="stitle">${title}<div class="srefs">${ref} · ${pName}</div></div>
        <span class="type-tag" style="background:${typeColor}18;color:${typeColor}">${typeLabel}</span>
        ${allBadges(c)}
      </div>`;
  }).join('');
}

function setupCollapse(partEl) {
  partEl.querySelector('.pheader').addEventListener('click', () => {
    const body = partEl.querySelector('.pbody');
    const chev = partEl.querySelector('.pchev');
    if (!chev.classList.contains('up')) {
      body.style.display = 'none';
      chev.classList.add('up');
    } else {
      body.style.display = 'block';
      chev.classList.remove('up');
    }
  });
}

function applyCmdFilters() {
  const query = cmdSearchQuery.trim().toLowerCase();

  document.querySelectorAll('#view-cmd-timeline .si').forEach(el => {
    let bookOk = cmdBookFilter === 'all';
    if (!bookOk) {
      const key = cmdBookFilter.toLowerCase();
      bookOk = el.dataset[key] === '1';
    }
    const typeOk = cmdTypeFilter === 'all' || el.dataset.type === cmdTypeFilter;
    const searchOk = !query || el.dataset.title.includes(query) || el.dataset.id === query;

    el.classList.toggle('dimmed', !(bookOk && typeOk && searchOk));
  });

  // Update visible progress counter
  const visible = document.querySelectorAll('#view-cmd-timeline .si:not(.dimmed)').length;
  const total = typeof COMMANDMENTS !== 'undefined' ? COMMANDMENTS.length : 0;
  const wrap = document.getElementById('cmdProgWrap');
  if (wrap) {
    const lang = I18N.get();
    wrap.textContent = `${visible} / ${total} ${lang === 'zh' ? '條誡命顯示中' : 'commandments'}`;
  }
}

// ── Narratives Timeline ──
let narBookFilter = 'all';
let narSearchQuery = '';

function buildNarTimeline() {
  if (typeof NARRATIVES === 'undefined') return;
  const main = document.getElementById('narMain');
  if (!main) return;
  main.innerHTML = '';

  const lang = I18N.get();

  // Group by periods
  const periods = [
    { id: 'primeval', title_zh: '太古歷史（亞當至挪亞）', title_en: 'Primeval History (Genesis 1–11)', color: '#2B2B2B' },
    { id: 'abraham', title_zh: '亞伯拉罕生平之約', title_en: 'Patriarch Abraham (Genesis 12–25)', color: '#4A5D73' },
    { id: 'isaac_jacob', title_zh: '以撒與雅各生平', title_en: 'Isaac and Jacob (Genesis 25–36)', color: '#3E5064' },
    { id: 'joseph', title_zh: '約瑟生平與以色列入埃及', title_en: 'Joseph in Egypt (Genesis 37–50)', color: '#5D7289' },
    { id: 'exodus', title_zh: '出埃及與過紅海', title_en: 'The Exodus & Red Sea (Exodus 1–18)', color: '#934B43' },
    { id: 'sinai', title_zh: '西奈山立約與建造會幕', title_en: 'Sinai Covenant & Tabernacle (Exodus 19–40)', color: '#7D3E37' },
    { id: 'leviticus', title_zh: '利未記：祭司條例與聖潔生活', title_en: 'Leviticus: Offerings & Holiness (Leviticus 1–27)', color: '#C8A96A' },
    { id: 'wilderness', title_zh: '曠野四十年流浪', title_en: 'Wilderness Wanderings (Numbers 1–36)', color: '#D6A84C' },
    { id: 'deuteronomy', title_zh: '摩押平原重申律法與摩西離世', title_en: 'Plains of Moab & Moses\' Farewell (Deuteronomy 1–34)', color: '#526851' }
  ];

  periods.forEach((p, idx) => {
    const events = NARRATIVES.filter(n => n.period === p.id);
    if (events.length === 0) return;

    const partEl = document.createElement('div');
    partEl.className = 'part';
    const title = lang === 'zh' ? p.title_zh : p.title_en;

    partEl.innerHTML = `
      <div class="pheader" style="background:${p.color}">
        <div class="pnum">${idx + 1}</div>
        <div class="pinfo">
          <div class="ptitle">${title}</div>
          <div class="psub">${events.length} ${lang === 'zh' ? '個事件' : 'events'}</div>
        </div>
        <div class="pchev">▼</div>
      </div>
      <div class="pbody">
        ${events.map(ev => {
          const t = lang === 'zh' ? (ev.title_zh || ev.title_en) : ev.title_en;
          const refs = refsText(ev.books);
          const chars = (ev.characters || []).join(' · ');
          const hasGen = ev.books && ev.books.Gen ? '1' : '0';
          const hasExo = ev.books && ev.books.Exo ? '1' : '0';
          const hasLev = ev.books && ev.books.Lev ? '1' : '0';
          const hasNum = ev.books && ev.books.Num ? '1' : '0';
          const hasDeu = ev.books && ev.books.Deu ? '1' : '0';

          return `<div class="si" id="nar${ev.id}"
            data-gen="${hasGen}" data-exo="${hasExo}" data-lev="${hasLev}"
            data-num="${hasNum}" data-deu="${hasDeu}"
            data-title="${(t + ' ' + (chars || '') + ' ' + (refs || '')).toLowerCase()}">
            <div class="snum">${ev.id}</div>
            <div class="stitle">${t}${refs ? `<div class="srefs">${refs}${chars ? ` · ${lang === 'zh' ? '人物: ' : 'People: '}${chars}` : ''}</div>` : ''}</div>
            <span class="type-tag" style="background:#78716C20;color:#78716C">${lang === 'zh' ? (ev.type || '敘事') : 'Narrative'}</span>
            ${allBadges(ev)}
          </div>`;
        }).join('')}
      </div>`;

    setupCollapse(partEl);
    main.appendChild(partEl);
  });

  applyNarFilters();
}

function applyNarFilters() {
  const query = narSearchQuery.trim().toLowerCase();

  document.querySelectorAll('#view-nar-timeline .si').forEach(el => {
    let bookOk = narBookFilter === 'all';
    if (!bookOk) {
      const key = narBookFilter.toLowerCase();
      bookOk = el.dataset[key] === '1';
    }
    const searchOk = !query || el.dataset.title.includes(query);
    el.classList.toggle('dimmed', !(bookOk && searchOk));
  });
}

// ── Event Listeners ──
document.addEventListener('DOMContentLoaded', () => {
  buildCmdTimeline();
  buildNarTimeline();

  // Book filters
  document.querySelectorAll('#cmdBookFilters .fbtn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#cmdBookFilters .fbtn').forEach(btn => btn.classList.remove('fa'));
      b.classList.add('fa');
      cmdBookFilter = b.dataset.f;
      applyCmdFilters();
    });
  });

  // Type filters
  document.querySelectorAll('#typeFilters .tfbtn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#typeFilters .tfbtn').forEach(btn => btn.classList.remove('active', 'tfa'));
      b.classList.add(b.dataset.type === 'all' ? 'tfa' : 'active');
      cmdTypeFilter = b.dataset.type;
      applyCmdFilters();
    });
  });

  // Search input
  const searchInput = document.getElementById('cmdSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      cmdSearchQuery = e.target.value;
      applyCmdFilters();
    });
  }

  // Sort/grouping select
  const sortSelect = document.getElementById('cmdSortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      cmdSortMode = e.target.value;
      buildCmdTimeline();
    });
  }

  // Narrative book filters
  document.querySelectorAll('#narFilters .fbtn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#narFilters .fbtn').forEach(btn => btn.classList.remove('fa'));
      b.classList.add('fa');
      narBookFilter = b.dataset.f;
      applyNarFilters();
    });
  });

  // Narrative search
  const narSearch = document.getElementById('narSearchInput');
  if (narSearch) {
    narSearch.addEventListener('input', (e) => {
      narSearchQuery = e.target.value;
      applyNarFilters();
    });
  }
});

window.rebuildTimelines = function() {
  buildCmdTimeline();
  buildNarTimeline();
};

})();
