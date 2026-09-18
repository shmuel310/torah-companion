// ══════════════════════════════════════════════
// READING PLAN VIEW — 54-Week Parashat HaShavua
// ══════════════════════════════════════════════

(function() {

const STORAGE_KEY = 'torah_parashot_completed';

function getCompleted() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function saveCompleted(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {}
}

function updateProgress(doneCount, total) {
  const label = document.getElementById('rpProgLabel');
  const fill = document.getElementById('rpProgFill');
  const pct = Math.round((doneCount / total) * 100);
  const lang = I18N.get();

  if (label) {
    label.textContent = lang === 'zh'
      ? `${doneCount} / ${total} 篇已研讀 (${pct}%)`
      : `${doneCount} of ${total} portions completed (${pct}%)`;
  }
  if (fill) {
    fill.style.width = `${pct}%`;
  }
}

function buildReadingPlan() {
  if (typeof PARASHOT === 'undefined') return;
  const container = document.getElementById('readingList');
  if (!container) return;
  container.innerHTML = '';

  const lang = I18N.get();
  const completed = getCompleted();
  const total = PARASHOT.length;

  updateProgress(completed.length, total);

  // Group Parashot by Book
  const books = [
    { key: 'Gen', name_zh: '創世記篇章 (12 篇)', name_en: 'Genesis (12 Portions)', color: 'var(--gen)' },
    { key: 'Exo', name_zh: '出埃及記篇章 (11 篇)', name_en: 'Exodus (11 Portions)', color: 'var(--exo)' },
    { key: 'Lev', name_zh: '利未記篇章 (10 篇)', name_en: 'Leviticus (10 Portions)', color: 'var(--lev)' },
    { key: 'Num', name_zh: '民數記篇章 (10 篇)', name_en: 'Numbers (10 Portions)', color: 'var(--num)' },
    { key: 'Deu', name_zh: '申命記篇章 (11 篇)', name_en: 'Deuteronomy (11 Portions)', color: 'var(--deu)' }
  ];

  books.forEach(b => {
    const list = PARASHOT.filter(p => p.book === b.key);
    if (list.length === 0) return;

    const groupEl = document.createElement('div');
    groupEl.className = 'rp-book-group';

    const groupTitle = lang === 'zh' ? b.name_zh : b.name_en;
    groupEl.innerHTML = `
      <div class="rp-book-header" style="background:${b.color}">
        <span>${groupTitle}</span>
        <span>${list.reduce((acc, p) => acc + (p.count || 0), 0)} ${lang === 'zh' ? '條誡命' : 'mitzvot'}</span>
      </div>
      <div class="rp-cards"></div>
    `;

    const cardsEl = groupEl.querySelector('.rp-cards');

    list.forEach(p => {
      const isDone = completed.includes(p.id);
      const card = document.createElement('div');
      card.className = 'rp-parashah-card';
      card.dataset.id = p.id;

      const title = lang === 'zh' ? `${p.name_zh} (${p.name})` : p.name;
      const range = lang === 'zh' ? p.range_zh : `${BOOKS[p.book].name_en} ${p.range}`;
      const countLabel = lang === 'zh' ? `${p.count || 0} 條誡命` : `${p.count || 0} commandments`;
      const btnViewText = lang === 'zh' ? '查看誡命 ▼' : 'View Mitzvot ▼';
      const btnHideText = lang === 'zh' ? '收起 ▲' : 'Collapse ▲';
      const btnTooltip = lang === 'zh' ? '查看涵蓋之誡命' : 'View included commandments';
      const cbTooltip = lang === 'zh' ? '標記為已讀' : 'Mark as completed';

      card.innerHTML = `
        <div class="rp-cb ${isDone ? 'checked' : ''}" title="${cbTooltip}"></div>
        <div class="rp-num">${p.id}</div>
        <div class="rp-info">
          <div class="rp-name">${title}</div>
          <div class="rp-sub">${range} · <span style="color:var(--text);font-weight:600">${countLabel}</span></div>
        </div>
        ${p.count > 0 ? `<button class="rp-tag" style="cursor:pointer" title="${btnTooltip}">${btnViewText}</button>` : ''}
      `;

      // Checkbox handler
      const cb = card.querySelector('.rp-cb');
      cb.addEventListener('click', (e) => {
        e.stopPropagation();
        const cur = getCompleted();
        let next;
        if (cur.includes(p.id)) {
          next = cur.filter(x => x !== p.id);
          cb.classList.remove('checked');
        } else {
          next = [...cur, p.id];
          cb.classList.add('checked');
        }
        saveCompleted(next);
        updateProgress(next.length, total);
      });

      // Expand commandments button
      const tagBtn = card.querySelector('.rp-tag');
      if (tagBtn && p.commandments && p.commandments.length > 0) {
        let drawer = null;
        tagBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (drawer) {
            drawer.remove();
            drawer = null;
            tagBtn.textContent = btnViewText;
          } else {
            drawer = document.createElement('div');
            drawer.style.cssText = 'background:var(--bg);padding:10px 14px;border:1px solid var(--border);border-top:none;margin-bottom:2px;display:flex;flex-direction:column;gap:6px;';
            const cmdObjs = COMMANDMENTS.filter(c => p.commandments.includes(c.id));
            drawer.innerHTML = cmdObjs.map(c => {
              const t = lang === 'zh' ? (c.title_zh || c.title_en) : c.title_en;
              const r = lang === 'zh' ? c.ref_zh : c.ref;
              const polColor = c.type === 'positive' ? '#16A34A' : '#DC2626';
              const polLabel = c.type === 'positive' ? (lang === 'zh' ? '當行' : 'Do') : (lang === 'zh' ? '不可' : 'Don\'t');
              return `<div style="display:flex;align-items:center;gap:8px;font-size:11px;cursor:pointer;padding:4px 6px;border-radius:4px;background:var(--card)" data-id="${c.id}" class="rp-cmd-row">
                <span style="font-weight:700;color:#9CA3AF;width:24px">#${c.id}</span>
                <span style="font-size:8.5px;padding:1px 5px;border-radius:3px;background:${polColor}20;color:${polColor};font-weight:700">${polLabel}</span>
                <span style="flex:1">${t}</span>
                <span style="color:var(--muted);font-size:10px">${r}</span>
              </div>`;
            }).join('');

            drawer.querySelectorAll('.rp-cmd-row').forEach(row => {
              row.addEventListener('click', () => {
                if (window.openCmdModal) window.openCmdModal(row.dataset.id);
              });
            });

            card.after(drawer);
            tagBtn.textContent = btnHideText;
          }
        });
      }

      cardsEl.appendChild(card);
    });

    container.appendChild(groupEl);
  });
}

document.addEventListener('DOMContentLoaded', buildReadingPlan);
window.renderReadingPlan = buildReadingPlan;

})();
