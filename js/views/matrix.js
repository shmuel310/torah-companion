// ══════════════════════════════════════════════
// MATRIX VIEW — 613 Commandments × 5 Books
// ══════════════════════════════════════════════

(function() {

function buildMatrix() {
  if (typeof COMMANDMENTS === 'undefined' || typeof MT_CATEGORIES === 'undefined') return;
  const tbody = document.getElementById('matrixBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const lang = I18N.get();
  const bookAbbrs = lang === 'zh'
    ? { Gen:'創', Exo:'出', Lev:'利', Num:'民', Deu:'申' }
    : { Gen:'Gen', Exo:'Exo', Lev:'Lev', Num:'Num', Deu:'Deu' };

  MT_CATEGORIES.forEach(cat => {
    const cmds = COMMANDMENTS.filter(c => c.category === cat.id);
    if (cmds.length === 0) return;

    const catTitle = lang === 'zh' ? cat.title_zh : cat.title_en;
    const catRow = document.createElement('tr');
    catRow.className = 'matrix-cat-row';
    catRow.innerHTML = `<td colspan="7" style="background:${cat.color}">${cat.num}. ${catTitle} (${cmds.length})</td>`;
    tbody.appendChild(catRow);

    cmds.forEach(c => {
      const title = lang === 'zh' ? (c.title_zh || c.title_en) : c.title_en;
      const ref = lang === 'zh' ? c.ref_zh : c.ref;
      const pName = lang === 'zh' ? (c.parashah_zh || c.parashah) : (c.parashah || c.parashah_zh);
      const tr = document.createElement('tr');
      tr.className = 'matrix-section-row';
      tr.dataset.id = c.id;
      tr.style.cursor = 'pointer';
      tr.title = lang === 'zh' ? `點擊查看 #${c.id} 詳情` : `Click to view #${c.id} details`;

      tr.innerHTML = `
        <td class="mn">${c.id}</td>
        <td class="mt"><div class="mtitle">${title}</div><div class="mrefs">${ref} · ${pName}</div></td>
        ${BOOK_KEYS.map(k => {
          const has = c.books && c.books[k];
          const abbr = bookAbbrs[k];
          return `<td class="gcell">${has
            ? `<span class="gc-on" style="background:var(--${k.toLowerCase()})">${abbr}</span>`
            : `<span class="gc-off">${abbr}</span>`
          }</td>`;
        }).join('')}`;

      tr.addEventListener('click', () => {
        if (window.openCmdModal) window.openCmdModal(c.id);
      });

      tbody.appendChild(tr);
    });
  });
}

document.addEventListener('DOMContentLoaded', buildMatrix);
window.renderMatrix = buildMatrix;

})();
