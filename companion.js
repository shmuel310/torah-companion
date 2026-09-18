// ═════════════════════════════════════════════════════════════════════════
// 《2026–2027 猶太讀經循環：年度通讀手冊與伴讀工具包》互動邏輯
// 品牌：釐經伴道 @shmuel310 (基督信仰 · 聖經詮釋 · AI應用)
// ═════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  const STORAGE_KEY = 'torah_companion_5787_done';

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

  function updateProgress() {
    const done = getCompleted();
    const total = (typeof COMPANION_DATA !== 'undefined' && COMPANION_DATA.parashot) ? COMPANION_DATA.parashot.length : 54;
    const count = done.length;
    const pct = Math.round((count / total) * 100);

    const pill = document.getElementById('progressPill');
    if (pill) {
      pill.textContent = `${count} / ${total} 篇已通讀 (${pct}%)`;
    }

    const p3Stat = document.getElementById('p3ProgressStat');
    if (p3Stat) {
      p3Stat.textContent = `年度通讀進度：${count} / ${total} 篇 (${pct}%)`;
    }
  }

  function renderCalendarGrid() {
    if (typeof COMPANION_DATA === 'undefined' || !COMPANION_DATA.parashot) return;
    const parashot = COMPANION_DATA.parashot;
    const completed = getCompleted();

    const col1 = document.getElementById('calCol1');
    const col2 = document.getElementById('calCol2');
    const col3 = document.getElementById('calCol3');

    if (!col1 || !col2 || !col3) return;

    col1.innerHTML = '';
    col2.innerHTML = '';
    col3.innerHTML = '';

    // 18 per column for 54 total
    parashot.forEach((p, index) => {
      const isDone = completed.includes(p.id);
      const row = document.createElement('div');
      row.className = `parashah-row-item ${isDone ? 'done' : ''}`;
      row.dataset.id = p.id;
      row.title = `${p.name_zh} (${p.name}) · ${p.range_zh}\n${p.note}`;

      // Tool class mapping
      let toolClass = 'tag-explorer';
      let toolLabel = '全覽';
      if (p.tool === 'lifespan') { toolClass = 'tag-lifespan'; toolLabel = '壽命'; }
      else if (p.tool === 'genfam') { toolClass = 'tag-genfam'; toolLabel = '家族'; }
      else if (p.tool === 'calendar') { toolClass = 'tag-calendar'; toolLabel = '曆法'; }

      // Gregorian date format: MM/DD
      const gDateParts = p.gdate.split('-');
      const gDateStr = `${gDateParts[1]}/${gDateParts[2]}`;

      row.innerHTML = `
        <div class="cal-check-box" data-id="${p.id}" title="點擊標記本週已讀"></div>
        <div class="p-num">${String(p.id).padStart(2, '0')}</div>
        <div class="p-main-info">
          <div class="p-title-line">
            <span class="p-title">${p.name_zh}</span>
            <span class="p-hebrew">${p.name_he}</span>
          </div>
          <div class="p-range">${p.range_zh}</div>
        </div>
        <div class="p-date-greg">${gDateStr}</div>
        <div class="p-date-heb">${p.hdate}</div>
        <div class="p-tool-tag ${toolClass}" title="推薦搭配：${p.tool_name}">${toolLabel}</div>
      `;

      // Click to toggle done
      row.addEventListener('click', (e) => {
        // Avoid double trigger if clicking directly on child elements
        const cur = getCompleted();
        let next;
        if (cur.includes(p.id)) {
          next = cur.filter(id => id !== p.id);
          row.classList.remove('done');
        } else {
          next = [...cur, p.id];
          row.classList.add('done');
        }
        saveCompleted(next);
        updateProgress();
      });

      if (index < 18) {
        col1.appendChild(row);
      } else if (index < 36) {
        col2.appendChild(row);
      } else {
        col3.appendChild(row);
      }
    });

    updateProgress();
  }

  function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-page-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Update active button on scroll
    const pages = document.querySelectorAll('.guide-page');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navButtons.forEach(b => {
              if (b.getAttribute('href') === `#${id}`) {
                b.classList.add('active');
              } else {
                b.classList.remove('active');
              }
            });
          }
        });
      }, { threshold: 0.4 });

      pages.forEach(p => observer.observe(p));
    }
  }

  function setupPrintButton() {
    const printBtn = document.getElementById('printGuideBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderCalendarGrid();
    setupNavigation();
    setupPrintButton();
  });

})();
