const fs = require('fs');
const path = require('path');

// Read CSV
const csvPath = path.join(__dirname, 'raw', 'commandments.csv');
const csv = fs.readFileSync(csvPath, 'utf-8');
const lines = csv.split('\n').filter(l => l.trim());
const header = lines[0].split(',');

// Simple CSV parser that handles quoted fields
function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else if (ch !== '\r') {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

// Map Mishneh Torah book numbers to our category IDs
const MT_MAP = {
  '1': 'madda', '2': 'ahavah', '3': 'zemanim', '4': 'nashim',
  '5': 'kedushah', '6': 'haflaah', '7': 'zeraim', '8': 'avodah',
  '9': 'korbanot', '10': 'taharah', '11': 'nezikin', '12': 'kinyan',
  '13': 'mishpatim', '14': 'shoftim'
};

// Parse reference_id like "EXO 20:2" or "LEV 19:3" into our books format
function parseRef(refId) {
  if (!refId) return {};
  const bookMap = {
    'GEN': 'Gen', 'EXO': 'Exo', 'LEV': 'Lev', 'NUM': 'Num', 'DEU': 'Deu'
  };
  const parts = refId.trim().split(' ');
  if (parts.length < 2) return {};
  const bookKey = bookMap[parts[0]];
  if (!bookKey) return {};
  const books = { Gen: null, Exo: null, Lev: null, Num: null, Deu: null };
  books[bookKey] = parts[1];
  return books;
}

// Chinese translations for common commandment concepts
// We'll generate a basic Chinese title from the English concept
function translateTitle(concept) {
  // Clean up the concept
  let title = concept.replace(/\s+/g, ' ').trim();
  if (title.endsWith(' ')) title = title.trim();
  return title;
}

// Chinese translation lookup - build comprehensive mapping
const ZH_TITLES = {};

// We'll generate Chinese titles inline in the output using a mapping approach
// For now, use a transliteration function
function getZhTitle(id, concept) {
  // Return a simple Chinese description based on the English concept
  // In production, this would be a full translation table
  return concept.trim();
}

// Parse all commandments
const commandments = [];
for (let i = 1; i < lines.length; i++) {
  const fields = parseCSVLine(lines[i]);
  if (fields.length < 12) continue;
  
  const num = parseInt(fields[0]);
  if (isNaN(num)) continue;
  
  const concept = fields[1].trim();
  const polarity = fields[2].trim(); // P or N
  const refId = fields[3].trim();
  const mtBookNum = fields[9].trim();
  const mtCategory = fields[11].trim();
  
  const books = parseRef(refId);
  const category = MT_MAP[mtBookNum] || 'madda';
  
  commandments.push({
    id: num,
    type: polarity === 'P' ? 'positive' : 'negative',
    title_en: concept,
    title_zh: concept, // placeholder - will be replaced with actual translations
    books: books,
    category: category,
    subcategory: mtCategory.toLowerCase().replace(/\s+/g, '_'),
    ref: refId
  });
}

console.log(`Parsed ${commandments.length} commandments`);

// Now generate the JS file with Chinese translations
// We'll create a comprehensive Chinese translation for each commandment
const ZH_MAP = {
  1: "認識神的存在", 2: "不可信奉他神", 3: "認識神是獨一的", 4: "愛神",
  5: "敬畏神", 6: "使神的名成聖", 7: "不可褻瀆神的名", 8: "不可毀壞聖物",
  9: "聆聽奉神名說話的先知", 10: "不可試探神",
  11: "效法神的道路", 12: "親近妥拉學者", 13: "不可憐憫引誘人拜偶像者",
  14: "不可使被引誘者回歸", 15: "不可為引誘者辯護",
  16: "不可隱瞞不利引誘者的證據", 17: "不可制造偶像", 18: "不可為自己造偶像",
  19: "不可為他人造偶像", 20: "不可崇拜偶像",
  21: "不可向偶像下拜", 22: "不可獻祭給偶像", 23: "不可用火獻子給摩洛",
  24: "不可行占卜", 25: "不可觀兆", 26: "不可用法術",
  27: "不可行邪術", 28: "不可交鬼", 29: "不可求問死人",
  30: "不可立柱像", 31: "不可獻有瑕疵的石頭", 32: "不可在聖地栽種樹木",
  33: "拆毀偶像及其附屬物", 34: "不可從偶像崇拜中獲益",
  35: "不可從偶像城市的財物中獲益", 36: "不可與偶像崇拜者立約",
  37: "不可喜愛偶像崇拜者", 38: "不可讓偶像崇拜者定居在我們的土地上",
  39: "不可效法偶像崇拜者的習俗", 40: "不可行占卜",
  41: "祈禱神", 42: "不可佩戴含偶像的裝飾品",
  43: "不可傳播偶像崇拜", 44: "每天兩次誦讀示瑪",
  45: "學習妥拉並教導妥拉", 46: "繫經文匣在頭上", 47: "繫經文匣在手上",
  48: "在門柱上安置經文匣", 49: "寫一卷妥拉", 50: "王要為自己寫一卷妥拉",
  51: "飯後感恩祈禱", 52: "在衣服邊上做繸子",
  53: "每天祈禱", 54: "祭司要祝福以色列人",
  55: "佩戴經文匣（非祭司）", 56: "安息日不可工作",
  // ... continue for all 613 - for now we'll use English as fallback
};

// Build final output
let output = 'const COMMANDMENTS = [\n';
commandments.forEach((c, i) => {
  const zhTitle = ZH_MAP[c.id] || c.title_en;
  const booksStr = JSON.stringify(c.books);
  output += `  {id:${c.id},type:"${c.type}",title_en:${JSON.stringify(c.title_en)},title_zh:${JSON.stringify(zhTitle)},books:${booksStr},category:"${c.category}",ref:${JSON.stringify(c.ref)}}`;
  if (i < commandments.length - 1) output += ',';
  output += '\n';
});
output += '];\n';

const outPath = path.join(__dirname, '..', 'data', 'commandments.js');
fs.writeFileSync(outPath, output, 'utf-8');
console.log(`Written ${commandments.length} commandments to ${outPath}`);
console.log(`File size: ${(fs.statSync(outPath).size / 1024).toFixed(1)}KB`);
