// ══════════════════════════════════════════════
// i18n — Bilingual Toggle (中文 / English)
// ══════════════════════════════════════════════
const I18N = (() => {
  let lang = localStorage.getItem('torah-lang') || 'zh';

  function apply() {
    document.querySelectorAll('[data-en][data-zh]').forEach(el => {
      el.textContent = el.getAttribute(`data-${lang}`);
    });
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';

    // Update search placeholders
    const searchCmd = document.getElementById('cmdSearchInput');
    if (searchCmd) {
      searchCmd.placeholder = lang === 'zh' ? '搜尋誡命內容、經文或編號...' : 'Search commandments, refs, or numbers...';
    }
    const searchNar = document.getElementById('narSearchInput');
    if (searchNar) {
      searchNar.placeholder = lang === 'zh' ? '搜尋歷史事件、人物或經文...' : 'Search narrative events, people, or refs...';
    }

    if (window.updateStatPills) window.updateStatPills();
  }

  function toggle(newLang) {
    lang = newLang;
    localStorage.setItem('torah-lang', lang);
    apply();

    // Re-render views if registered
    if (window.updateStatPills) window.updateStatPills();
    if (window.buildCoverageGrid) window.buildCoverageGrid();
    if (window.rebuildTimelines) window.rebuildTimelines();
    if (window.renderMatrix) window.renderMatrix();
    if (window.renderStats) window.renderStats();
    if (window.renderReadingPlan) window.renderReadingPlan();
    if (window.renderJourneyMap) window.renderJourneyMap();
    if (window.renderTorahWheel) window.renderTorahWheel();
    if (window.renderCategoryGrid) window.renderCategoryGrid();
  }

  function get() { return lang; }

  function t(obj, field) {
    if (!obj) return '';
    const zhKey = field + '_zh';
    const enKey = field + '_en';
    return lang === 'zh' ? (obj[zhKey] || obj[enKey] || '') : (obj[enKey] || obj[zhKey] || '');
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.addEventListener('click', () => toggle(b.dataset.lang));
    });
  });

  return { apply, toggle, get, t };
})();
