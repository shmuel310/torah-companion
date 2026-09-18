// ══════════════════════════════════════════════
// CATEGORY GRID VIEW — 14 Categories × 5 Books
// ══════════════════════════════════════════════

(function() {

function buildCategoryGrid() {
  if (typeof COMMANDMENTS === 'undefined' || typeof MT_CATEGORIES === 'undefined') return;
  const wrap = document.getElementById('categoryGridWrap');
  const detailPanel = document.getElementById('categoryGridDetail');
  if (!wrap) return;

  const lang = I18N.get();

  let html = `
    <table class="cg-table">
      <thead>
        <tr>
          <th>${lang === 'zh' ? '14 大法典主題領域' : 'Mishneh Torah Category'}</th>
          ${BOOK_KEYS.map(k => `
            <th style="color:${BOOKS[k].main}">${lang === 'zh' ? BOOKS[k].name_zh : BOOKS[k].name_en}</th>
          `).join('')}
          <th>${lang === 'zh' ? '總計' : 'Total'}</th>
        </tr>
      </thead>
      <tbody>
  `;

  MT_CATEGORIES.forEach(cat => {
    const catCmds = COMMANDMENTS.filter(c => c.category === cat.id);
    const catTotal = catCmds.length;

    html += `
      <tr>
        <td>
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${cat.color};margin-right:6px"></span>
          <strong>${cat.num}.</strong> ${lang === 'zh' ? cat.title_zh : cat.title_en}
        </td>
        ${BOOK_KEYS.map(k => {
          const count = catCmds.filter(c => c.books && c.books[k]).length;
          const bubbleSize = count > 0 ? Math.max(18, Math.min(36, 16 + count * 0.4)) : 0;
          const catTitle = lang === 'zh' ? cat.title_zh : cat.title_en;
          const bkName = lang === 'zh' ? BOOKS[k].name_zh : BOOKS[k].name_en;
          const countLabel = lang === 'zh' ? `${count} 條` : `${count} mitzvot`;
          return `
            <td>
              ${count > 0 ? `
                <div class="cg-bubble" style="width:${bubbleSize}px;height:${bubbleSize}px;background:${cat.color}"
                     data-cat="${cat.id}" data-book="${k}" title="${catTitle} × ${bkName}: ${countLabel}">
                  ${count}
                </div>
              ` : `<span style="color:#D4CFC8;font-size:10px">-</span>`}
            </td>
          `;
        }).join('')}
        <td><strong>${catTotal}</strong></td>
      </tr>
    `;
  });

  // Footer Row with Book Totals
  html += `
      <tr style="background:#F5F3EE;font-weight:700">
        <td>${lang === 'zh' ? '各卷書總計' : 'Book Totals'}</td>
        ${BOOK_KEYS.map(k => {
          const bTotal = COMMANDMENTS.filter(c => c.books && c.books[k]).length;
          return `<td>${bTotal}</td>`;
        }).join('')}
        <td>613</td>
      </tr>
    </tbody>
  </table>
  `;

  wrap.innerHTML = html;

  // Click bubble handler to show detail list
  wrap.querySelectorAll('.cg-bubble').forEach(b => {
    b.addEventListener('click', () => {
      const catId = b.dataset.cat;
      const bookKey = b.dataset.book;
      showCategoryBookDetail(catId, bookKey);
    });
  });

  // Select initial cell (Leviticus × Book of Holiness or Service)
  showCategoryBookDetail('kedushah', 'Lev');
}

function showCategoryBookDetail(catId, bookKey) {
  const panel = document.getElementById('categoryGridDetail');
  if (!panel || typeof COMMANDMENTS === 'undefined') return;

  const lang = I18N.get();
  const cat = MT_CATEGORIES.find(c => c.id === catId);
  const bk = BOOKS[bookKey];
  const cmds = COMMANDMENTS.filter(c => c.category === catId && c.books && c.books[bookKey]);

  const catName = lang === 'zh' ? cat.title_zh : cat.title_en;
  const bkName = lang === 'zh' ? bk.name_zh : bk.name_en;

  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid var(--border);padding-bottom:8px">
      <h4 style="font-size:13px;font-weight:700;color:var(--text)">
        <span style="color:${cat.color}">● ${catName}</span> × <span style="color:${bk.main}">${bkName}</span>
        (${cmds.length} ${lang === 'zh' ? '條誡命' : 'commandments'})
      </h4>
      <span style="font-size:11px;color:var(--muted)">${lang === 'zh' ? '點擊條目開啟經文詳情' : 'Click item to view scripture details'}</span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      ${cmds.map(c => {
        const title = lang === 'zh' ? (c.title_zh || c.title_en) : c.title_en;
        const ref = lang === 'zh' ? c.ref_zh : c.ref;
        const pName = lang === 'zh' ? (c.parashah_zh || c.parashah) : (c.parashah || c.parashah_zh);
        const typeColor = c.type === 'positive' ? '#16A34A' : '#DC2626';
        const typeLabel = c.type === 'positive' ? (lang === 'zh' ? '當行' : 'Do') : (lang === 'zh' ? '不可' : 'Don\'t');

        return `
          <div class="cg-cmd-card" data-id="${c.id}" style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:8px 10px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:background .15s">
            <span style="font-size:10px;font-weight:700;color:#9CA3AF;width:26px">#${c.id}</span>
            <span style="font-size:8px;padding:1px 5px;border-radius:3px;background:${typeColor}20;color:${typeColor};font-weight:700">${typeLabel}</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:11.5px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${title}</div>
              <div style="font-size:9.5px;color:var(--muted)">${ref} · ${pName}</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  panel.querySelectorAll('.cg-cmd-card').forEach(card => {
    card.addEventListener('click', () => {
      if (window.openCmdModal) window.openCmdModal(card.dataset.id);
    });
  });
}

document.addEventListener('DOMContentLoaded', buildCategoryGrid);
window.renderCategoryGrid = buildCategoryGrid;

})();
