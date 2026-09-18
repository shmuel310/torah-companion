// ══════════════════════════════════════════════
// RADIAL VIEW — Torah Wheel (Enhanced UX)
// ══════════════════════════════════════════════

(function() {

let currentMode = 'category'; // 'category' | 'book'
let activeIndex = 0;
let sortedCmds = [];
let accumDelta = 0;

const CX = 270;
const CY = 270;
const R_INNER = 88;
const R_CAT = 145;
const R_TICKS = 230;

function getSortedCommandments() {
  if (typeof COMMANDMENTS === 'undefined') return [];
  const list = [...COMMANDMENTS];
  if (currentMode === 'book') {
    list.sort((a, b) => {
      const idxA = BOOK_KEYS.indexOf(a.book);
      const idxB = BOOK_KEYS.indexOf(b.book);
      return idxA !== idxB ? idxA - idxB : a.id - b.id;
    });
  } else {
    // category mode
    list.sort((a, b) => {
      const catA = MT_CATEGORIES.findIndex(c => c.id === a.category);
      const catB = MT_CATEGORIES.findIndex(c => c.id === b.category);
      return catA !== catB ? catA - catB : a.id - b.id;
    });
  }
  return list;
}

function getSectors(cmds) {
  const lang = I18N.get();
  const total = cmds.length;
  if (currentMode === 'book') {
    return BOOK_KEYS.map(k => {
      const count = cmds.filter(c => c.book === k).length;
      return {
        id: k,
        title: lang === 'zh' ? (BOOKS[k] ? BOOKS[k].name_zh : k) : (BOOKS[k] ? BOOKS[k].name_en : k),
        color: BOOKS[k] ? BOOKS[k].main : '#4A5D73',
        count
      };
    }).filter(s => s.count > 0);
  } else {
    return MT_CATEGORIES.map(cat => {
      const count = cmds.filter(c => c.category === cat.id).length;
      return {
        id: cat.id,
        title: lang === 'zh' ? cat.title_zh : cat.title_en,
        color: cat.color,
        count
      };
    }).filter(s => s.count > 0);
  }
}

function buildTorahWheel() {
  const wrap = document.getElementById('radialSvgWrap');
  if (!wrap || typeof COMMANDMENTS === 'undefined' || typeof MT_CATEGORIES === 'undefined') return;

  const lang = I18N.get();
  sortedCmds = getSortedCommandments();
  const total = sortedCmds.length;
  if (total === 0) return;

  // Clamp activeIndex
  if (activeIndex < 0) activeIndex = 0;
  if (activeIndex >= total) activeIndex = total - 1;

  const sectors = getSectors(sortedCmds);

  // Build SVG
  let svg = `
    <svg id="torahWheelSvg" viewBox="0 0 540 540" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="radShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="5" flood-color="#2B2B2B" flood-opacity="0.14"/>
        </filter>
        <filter id="needleGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#C8A96A" flood-opacity="0.6"/>
        </filter>
      </defs>

      <!-- Background guide circles -->
      <circle cx="${CX}" cy="${CY}" r="${R_TICKS}" fill="none" stroke="#EAE6DC" stroke-width="1"/>
      <circle cx="${CX}" cy="${CY}" r="${R_CAT}" fill="none" stroke="#EAE6DC" stroke-width="1"/>

      <!-- 613 Commandment Rays -->
      <g id="radRaysGroup">
  `;

  sortedCmds.forEach((c, i) => {
    const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
    const x1 = CX + (R_CAT + 4) * Math.cos(angle);
    const y1 = CY + (R_CAT + 4) * Math.sin(angle);
    const x2 = CX + R_TICKS * Math.cos(angle);
    const y2 = CY + R_TICKS * Math.sin(angle);
    const bk = c.book || 'Exo';
    const color = BOOKS[bk] ? BOOKS[bk].main : '#4A5D73';

    svg += `<line class="rad-ray" id="radRay_${i}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"
      stroke="${color}" stroke-width="1.4" stroke-linecap="round" data-idx="${i}" data-id="${c.id}" opacity="0.75" />`;
  });

  svg += `</g>`;

  // Middle Category / Book Arcs
  let curCount = 0;
  svg += `<g id="radArcsGroup">`;
  sectors.forEach(s => {
    const startAngle = (curCount / total) * Math.PI * 2 - Math.PI / 2;
    curCount += s.count;
    const endAngle = (curCount / total) * Math.PI * 2 - Math.PI / 2;

    const x1 = CX + R_CAT * Math.cos(startAngle);
    const y1 = CY + R_CAT * Math.sin(startAngle);
    const x2 = CX + R_CAT * Math.cos(endAngle);
    const y2 = CY + R_CAT * Math.sin(endAngle);

    const x3 = CX + R_INNER * Math.cos(endAngle);
    const y3 = CY + R_INNER * Math.sin(endAngle);
    const x4 = CX + R_INNER * Math.cos(startAngle);
    const y4 = CY + R_INNER * Math.sin(startAngle);

    const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;
    const d = `M ${x1} ${y1} A ${R_CAT} ${R_CAT} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${R_INNER} ${R_INNER} 0 ${largeArc} 0 ${x4} ${y4} Z`;

    svg += `<path class="rad-sector-path" d="${d}" fill="${s.color}" opacity="0.9" stroke="white" stroke-width="1.5" />`;

    if (s.count >= 14) {
      const midAngle = (startAngle + endAngle) / 2;
      const rText = (R_CAT + R_INNER) / 2;
      const tx = CX + rText * Math.cos(midAngle);
      const ty = CY + rText * Math.sin(midAngle) + 3.5;
      const shortTitle = lang === 'zh' ? s.title.split(' ')[0].substring(0, 4) : s.title.split(' ')[0];
      svg += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" font-size="9" font-weight="700" fill="white" font-family="Noto Sans TC, sans-serif" pointer-events="none">${shortTitle}</text>`;
    }
  });
  svg += `</g>`;

  // Dynamic Needle / Pointer Line & Tip
  svg += `
    <g id="radNeedleGroup" filter="url(#needleGlow)" pointer-events="none">
      <line id="radNeedleLine" x1="${CX}" y1="${CY - R_INNER}" x2="${CX}" y2="${CY - R_TICKS - 6}" stroke="#C8A96A" stroke-width="3" stroke-linecap="round"/>
      <circle id="radNeedleTip" cx="${CX}" cy="${CY - R_TICKS - 6}" r="4.5" fill="#C8A96A" stroke="white" stroke-width="1.5"/>
    </g>
  `;

  // Center Circle (Clear & Readable Focal Hub)
  svg += `
    <g id="radCenterHub" style="cursor:pointer" title="${lang === 'zh' ? '點擊開啟經文詳情' : 'Click to view details'}">
      <circle cx="${CX}" cy="${CY}" r="${R_INNER - 6}" fill="#FFFFFF" filter="url(#radShadow)" stroke="#EAE6DC" stroke-width="2.5"/>
      <circle id="radCenterRing" cx="${CX}" cy="${CY}" r="${R_INNER - 10}" fill="none" stroke="#C8A96A" stroke-width="1.2" stroke-dasharray="3,3"/>
      <text id="radCenterId" x="${CX}" y="${CY - 22}" text-anchor="middle" font-size="21" font-weight="800" fill="#2B2B2B">#1</text>
      <rect id="radCenterBookBg" x="${CX - 36}" y="${CY - 10}" width="72" height="18" rx="9" fill="#4A5D73"/>
      <text id="radCenterBookText" x="${CX}" y="${CY + 3}" text-anchor="middle" font-size="10.5" font-weight="700" fill="white">創世記</text>
      <text id="radCenterType" x="${CX}" y="${CY + 22}" text-anchor="middle" font-size="10.5" font-weight="600" fill="#78716C">✓ 當行 Positive</text>
      <text id="radCenterAction" x="${CX}" y="${CY + 38}" text-anchor="middle" font-size="9" fill="#A8A29E">${lang === 'zh' ? '點擊查看詳情 ↗' : 'Click for Details ↗'}</text>
    </g>
  `;

  svg += `</svg>`;
  wrap.innerHTML = svg;

  // Center hub click opens modal
  const centerHub = document.getElementById('radCenterHub');
  if (centerHub) {
    centerHub.addEventListener('click', () => {
      const activeCmd = sortedCmds[activeIndex];
      if (activeCmd && window.openCmdModal) window.openCmdModal(activeCmd.id);
    });
  }

  // Update initial active state
  updateActiveState(activeIndex);
}

function updateActiveState(idx) {
  if (!sortedCmds || sortedCmds.length === 0) return;
  const total = sortedCmds.length;
  activeIndex = Math.max(0, Math.min(total - 1, idx));
  const cmd = sortedCmds[activeIndex];
  if (!cmd) return;

  const lang = I18N.get();
  const angle = (activeIndex / total) * Math.PI * 2 - Math.PI / 2;

  // Update Needle in SVG
  const needleLine = document.getElementById('radNeedleLine');
  const needleTip = document.getElementById('radNeedleTip');
  if (needleLine && needleTip) {
    const x1 = CX + (R_INNER - 2) * Math.cos(angle);
    const y1 = CY + (R_INNER - 2) * Math.sin(angle);
    const x2 = CX + (R_TICKS + 8) * Math.cos(angle);
    const y2 = CY + (R_TICKS + 8) * Math.sin(angle);

    needleLine.setAttribute('x1', x1.toFixed(1));
    needleLine.setAttribute('y1', y1.toFixed(1));
    needleLine.setAttribute('x2', x2.toFixed(1));
    needleLine.setAttribute('y2', y2.toFixed(1));

    needleTip.setAttribute('cx', x2.toFixed(1));
    needleTip.setAttribute('cy', y2.toFixed(1));

    const bkColor = BOOKS[cmd.book] ? BOOKS[cmd.book].main : '#C8A96A';
    needleLine.setAttribute('stroke', bkColor);
    needleTip.setAttribute('fill', bkColor);
  }

  // Update Center Hub in SVG
  const centerId = document.getElementById('radCenterId');
  const centerBookBg = document.getElementById('radCenterBookBg');
  const centerBookText = document.getElementById('radCenterBookText');
  const centerType = document.getElementById('radCenterType');

  if (centerId) centerId.textContent = `#${cmd.id}`;
  const bkColor = BOOKS[cmd.book] ? BOOKS[cmd.book].main : '#4A5D73';
  if (centerBookBg) centerBookBg.setAttribute('fill', bkColor);
  if (centerBookText) {
    centerBookText.textContent = lang === 'zh'
      ? (BOOKS[cmd.book] ? BOOKS[cmd.book].name_zh : cmd.book)
      : (BOOKS[cmd.book] ? BOOKS[cmd.book].name_en : cmd.book);
  }
  if (centerType) {
    centerType.textContent = cmd.type === 'positive'
      ? (lang === 'zh' ? '✓ 當行 (248)' : '✓ Positive (248)')
      : (lang === 'zh' ? '✕ 禁戒 (365)' : '✕ Negative (365)');
    centerType.setAttribute('fill', cmd.type === 'positive' ? '#C8A96A' : '#78716C');
  }

  // Update Scrubber Range & Label
  const scrubber = document.getElementById('radScrubber');
  const scrubText = document.getElementById('radCurrentScrubText');
  if (scrubber) scrubber.value = activeIndex + 1;
  if (scrubText) scrubText.textContent = `#${cmd.id} (${activeIndex + 1} / ${total})`;

  // Update Rich Inspector Card
  updateInspectorCard(cmd);
}

function updateInspectorCard(cmd) {
  const card = document.getElementById('radialInspectorCard');
  if (!card || !cmd) return;

  const lang = I18N.get();
  const bkColor = BOOKS[cmd.book] ? BOOKS[cmd.book].main : '#4A5D73';
  const bkName = lang === 'zh'
    ? (BOOKS[cmd.book] ? BOOKS[cmd.book].name_zh : cmd.book)
    : (BOOKS[cmd.book] ? BOOKS[cmd.book].name_en : cmd.book);

  const catObj = MT_CATEGORIES.find(c => c.id === cmd.category);
  const catName = catObj ? (lang === 'zh' ? catObj.title_zh : catObj.title_en) : (cmd.category_zh || cmd.category_name || '');

  const isPos = cmd.type === 'positive';
  const typeText = isPos
    ? (lang === 'zh' ? '✓ 積極當行 · 248' : '✓ Positive Mitzvah · 248')
    : (lang === 'zh' ? '✕ 消極禁戒 · 365' : '✕ Negative Mitzvah · 365');

  const titleZh = cmd.title_zh || cmd.title_en;
  const titleEn = cmd.title_en || cmd.title_zh;
  const ref = lang === 'zh' ? cmd.ref_zh : (cmd.ref || cmd.ref_zh);
  const parashah = lang === 'zh' ? (cmd.parashah_zh || cmd.parashah) : (cmd.parashah || cmd.parashah_zh);

  card.innerHTML = `
    <div class="rad-card-badges">
      <span class="rad-badge-id">#${cmd.id}</span>
      <span class="rad-badge-book" style="background:${bkColor}">${bkName}</span>
      <span class="rad-badge-type ${isPos ? 'pos' : 'neg'}">${typeText}</span>
      <span class="rad-badge-cat">${catName}</span>
    </div>

    <div class="rad-card-title-zh">${titleZh}</div>
    <div class="rad-card-title-en">${titleEn}</div>

    <div class="rad-card-ref">
      <span>📖 <strong>${ref}</strong></span>
      ${parashah ? `<span>· 每週篇章：${parashah}</span>` : ''}
    </div>

    <div class="rad-scripture-box">
      ${cmd.scripture_zh ? `<div class="rad-scripture-zh">${cmd.scripture_zh}</div>` : ''}
      ${cmd.scripture_en ? `<div class="rad-scripture-en">"${cmd.scripture_en}"</div>` : ''}
      ${cmd.scripture_he ? `<div class="rad-scripture-he" dir="rtl">${cmd.scripture_he}</div>` : ''}
    </div>

    <button class="rad-open-modal-btn" id="radOpenModalBtn">
      <span>${lang === 'zh' ? '查看完整經文詳情與拉比釋經' : 'View Full Scripture & Rabbinic Details'}</span>
      <span>↗</span>
    </button>
  `;

  const btn = document.getElementById('radOpenModalBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      if (window.openCmdModal) window.openCmdModal(cmd.id);
    });
  }
}

function handleWheel(e) {
  e.preventDefault();
  accumDelta += e.deltaY;
  const stepThreshold = 18;
  if (Math.abs(accumDelta) >= stepThreshold) {
    const steps = Math.sign(accumDelta);
    accumDelta = 0;
    const total = sortedCmds.length;
    if (total > 0) {
      const nextIdx = (activeIndex + steps + total) % total;
      updateActiveState(nextIdx);
    }
  }
}

function handlePointerMove(e) {
  const svg = document.getElementById('torahWheelSvg');
  if (!svg || sortedCmds.length === 0) return;

  const rect = svg.getBoundingClientRect();
  const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
  const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

  // Convert to SVG coordinates (540x540)
  const scale = 540 / rect.width;
  const x = (clientX - rect.left) * scale;
  const y = (clientY - rect.top) * scale;

  const dist = Math.hypot(x - CX, y - CY);
  // Only track when cursor is in active wheel radius
  if (dist >= R_INNER - 15 && dist <= R_TICKS + 30) {
    let angle = Math.atan2(y - CY, x - CX) + Math.PI / 2;
    if (angle < 0) angle += 2 * Math.PI;

    const total = sortedCmds.length;
    const targetIdx = Math.round((angle / (2 * Math.PI)) * total) % total;
    if (targetIdx !== activeIndex) {
      updateActiveState(targetIdx);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  buildTorahWheel();

  // Mode toggle buttons (category / book)
  const btnGroup = document.getElementById('radToggleGroup');
  if (btnGroup) {
    btnGroup.querySelectorAll('.rad-tog').forEach(btn => {
      btn.addEventListener('click', () => {
        btnGroup.querySelectorAll('.rad-tog').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        buildTorahWheel();
      });
    });
  }

  // Wheel interaction on SVG container (wheel event scrubbing)
  const wrap = document.getElementById('radialSvgWrap');
  if (wrap) {
    wrap.addEventListener('wheel', handleWheel, { passive: false });
    wrap.addEventListener('pointermove', handlePointerMove);
  }

  // Range Scrubber
  const scrubber = document.getElementById('radScrubber');
  if (scrubber) {
    scrubber.addEventListener('input', (e) => {
      const idx = Number(e.target.value) - 1;
      updateActiveState(idx);
    });
  }

  // Prev / Next Step Buttons
  const prevBtn = document.getElementById('radPrevBtn');
  const nextBtn = document.getElementById('radNextBtn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const total = sortedCmds.length;
      if (total > 0) updateActiveState((activeIndex - 1 + total) % total);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const total = sortedCmds.length;
      if (total > 0) updateActiveState((activeIndex + 1) % total);
    });
  }

  // Quick jump book pills
  document.querySelectorAll('.rad-bpill').forEach(pill => {
    pill.addEventListener('click', () => {
      const book = pill.dataset.book;
      const idx = sortedCmds.findIndex(c => c.book === book);
      if (idx !== -1) {
        updateActiveState(idx);
      }
    });
  });
});

window.renderTorahWheel = buildTorahWheel;

})();
