// ══════════════════════════════════════════════
// STATISTICS VIEW — Advanced Insights
// ══════════════════════════════════════════════

(function() {

function buildStats() {
  if (typeof COMMANDMENTS === 'undefined' || typeof MT_CATEGORIES === 'undefined') return;
  const container = document.getElementById('statsContent');
  if (!container) return;

  const lang = I18N.get();
  const total = COMMANDMENTS.length;
  const pct = n => Math.round(n / total * 100);

  // Book totals
  const counts = {};
  BOOK_KEYS.forEach(k => {
    counts[k] = COMMANDMENTS.filter(c => c.books && c.books[k]).length;
  });

  // Positive / Negative
  const posCount = COMMANDMENTS.filter(c => c.type === 'positive').length;
  const negCount = COMMANDMENTS.filter(c => c.type === 'negative').length;

  // Category breakdown
  const catCounts = MT_CATEGORIES.map(cat => ({
    ...cat,
    count: COMMANDMENTS.filter(c => c.category === cat.id).length
  })).sort((a, b) => b.count - a.count);

  // Top Parashot with most commandments
  const paraCounts = {};
  COMMANDMENTS.forEach(c => {
    const p = lang === 'zh' ? (c.parashah_zh || c.parashah) : (c.parashah || c.parashah_zh);
    paraCounts[p] = (paraCounts[p] || 0) + 1;
  });
  const topParashot = Object.entries(paraCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  container.innerHTML = `
    <div style="max-width:960px;margin:0 auto;padding:28px 16px 80px">

      <!-- BOOK COVERAGE -->
      <div class="stat-card" style="margin-bottom:20px">
        <h3>${lang === 'zh' ? '五卷書誡命總量分佈 — 613 條誡命在各卷書的出處' : 'Commandments Distribution by Book'}</h3>
        <div class="big-five">
          ${BOOK_KEYS.map(k => `
            <div class="big-num" style="background:${BOOKS[k].light};border-radius:10px;padding:14px 8px">
              <div class="n" style="color:${BOOKS[k].main}">${counts[k]}</div>
              <div class="pct" style="color:${BOOKS[k].main}">${pct(counts[k])}%</div>
              <div class="lbl">${lang === 'zh' ? BOOKS[k].name_zh : BOOKS[k].name_en}</div>
            </div>`).join('')}
        </div>
        <div style="margin-top:16px;display:flex;flex-direction:column;gap:8px">
          ${BOOK_KEYS.map(k => `
            <div class="dist-row">
              <span class="dist-label" style="font-size:11px">${lang === 'zh' ? BOOKS[k].name_zh : BOOKS[k].name_en}</span>
              <div class="dist-bar-wrap"><div class="dist-bar" style="width:${pct(counts[k])}%;background:${BOOKS[k].main}"></div></div>
              <span class="dist-stat">${counts[k]} / ${total}</span>
            </div>`).join('')}
        </div>
      </div>

      <div class="stats-grid">

        <!-- POSITIVE vs NEGATIVE -->
        <div class="stat-card">
          <h3>${lang === 'zh' ? '積極誡命 vs 消極禁令' : 'Positive vs Negative Commandments'}</h3>
          <div class="dist-row" style="margin-bottom:12px">
            <span class="dist-label" style="color:#16A34A">${lang === 'zh' ? '積極（當行之事）' : 'Positive (Mitzvot Aseh)'}</span>
            <div class="dist-bar-wrap"><div class="dist-bar" style="width:${pct(posCount)}%;background:#16A34A"></div></div>
            <span class="dist-stat" style="color:#16A34A">${posCount} · ${pct(posCount)}%</span>
          </div>
          <div class="dist-row">
            <span class="dist-label" style="color:#DC2626">${lang === 'zh' ? '消極（禁止之令）' : 'Negative (Mitzvot Lo Ta\'aseh)'}</span>
            <div class="dist-bar-wrap"><div class="dist-bar" style="width:${pct(negCount)}%;background:#DC2626"></div></div>
            <span class="dist-stat" style="color:#DC2626">${negCount} · ${pct(negCount)}%</span>
          </div>
          <p style="font-size:11px;color:var(--muted);margin-top:16px;line-height:1.6">
            ${lang === 'zh'
              ? '猶太傳統認為 248 條積極誡命對應人體的骨骼關節數，365 條消極禁令對應一年的太陽曆天數，意指全人全時段遵行神的心意。'
              : 'Tradition maps the 248 positive mitzvot to the limbs of the human body, and the 365 negative mitzvot to the solar days of the year.'}
          </p>
        </div>

        <!-- TOP PARASHOT -->
        <div class="stat-card">
          <h3>${lang === 'zh' ? '包含最多誡命的讀經篇章 Top 8' : 'Top 8 Torah Portions by Mitzvot Count'}</h3>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${topParashot.map(([name, cnt]) => `
              <div class="dist-row">
                <span class="dist-label" style="font-size:11px">${name}</span>
                <div class="dist-bar-wrap"><div class="dist-bar" style="width:${Math.round(cnt/74*100)}%;background:var(--text)"></div></div>
                <span class="dist-stat">${cnt} ${lang === 'zh' ? '條' : 'mitzvot'}</span>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- CATEGORY BREAKDOWN -->
      <div class="stat-card" style="margin-top:20px">
        <h3>${lang === 'zh' ? '14 大法典主題領域誡命分佈 (Mishneh Torah)' : 'Commandment Breakdown Across 14 Legal Domains'}</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;margin-top:12px">
          ${catCounts.map(cat => `
            <div class="dist-row">
              <span class="dist-label" style="font-size:11px;min-width:140px;color:${cat.color}">
                <strong>${cat.num}.</strong> ${lang === 'zh' ? cat.title_zh : cat.title_en}
              </span>
              <div class="dist-bar-wrap"><div class="dist-bar" style="width:${Math.round(cat.count/100*100)}%;background:${cat.color}"></div></div>
              <span class="dist-stat">${cat.count}</span>
            </div>
          `).join('')}
        </div>
      </div>

    </div>`;
}

document.addEventListener('DOMContentLoaded', buildStats);
window.renderStats = buildStats;

})();
