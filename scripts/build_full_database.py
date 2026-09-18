# -*- coding: utf-8 -*-
"""
Builds torah-explorer/data/commandments.js and torah-explorer/data/parashot.js
from torah-explorer/scripts/raw/commandments.csv with accurate Traditional Chinese translations.
"""

import csv
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SCRIPT_DIR)
CSV_PATH = os.path.join(SCRIPT_DIR, "raw", "commandments.csv")
ZH_PATH = os.path.join(SCRIPT_DIR, "raw", "zh_translations.json")
OUT_CMD_PATH = os.path.join(BASE_DIR, "data", "commandments.js")
OUT_PARA_PATH = os.path.join(BASE_DIR, "data", "parashot.js")

MT_MAP = {
    '1': 'madda', '2': 'ahavah', '3': 'zemanim', '4': 'nashim',
    '5': 'kedushah', '6': 'haflaah', '7': 'zeraim', '8': 'avodah',
    '9': 'korbanot', '10': 'taharah', '11': 'nezikin', '12': 'kinyan',
    '13': 'mishpatim', '14': 'shoftim'
}

MT_NAME_ZH = {
    'madda': '知識之書', 'ahavah': '愛之書', 'zemanim': '節令之書', 'nashim': '婦女之書',
    'kedushah': '聖潔之書', 'haflaah': '誓言之書', 'zeraim': '種子之書', 'avodah': '聖殿服侍之書',
    'korbanot': '獻祭之書', 'taharah': '潔淨之書', 'nezikin': '損害之書', 'kinyan': '買賣之書',
    'mishpatim': '典章之書', 'shoftim': '士師之書'
}

BOOK_MAP = {'GEN': 'Gen', 'EXO': 'Exo', 'LEV': 'Lev', 'NUM': 'Num', 'DEU': 'Deu'}
BOOK_NAME_ZH = {'Gen': '創世記', 'Exo': '出埃及記', 'Lev': '利未記', 'Num': '民數記', 'Deu': '申命記'}

PARASHAH_ZH = {
    "Bereshit": "起初篇", "Noach": "挪亞篇", "Lech-Lecha": "你要離開篇", "Vayera": "顯現篇",
    "Chayei Sara": "撒拉的壽數篇", "Toldot": "後代篇", "Vayetzei": "雅各出發篇", "Vayishlach": "打發篇",
    "Vayeshev": "住下篇", "Miketz": "過了兩年篇", "Vayigash": "挨近篇", "Vayechi": "活在篇",
    "Shemot": "名字篇", "Vaera": "我顯現篇", "Bo": "去見法老篇", "Beshalach": "容百姓去篇",
    "Yitro": "葉忒羅篇", "Mishpatim": "典章篇", "Terumah": "禮物篇", "Tetzaveh": "你要吩咐篇",
    "Ki Tisa": "你要數點篇", "Vayakhel": "招聚篇", "Pekudei": "數算篇",
    "Vayikra": "呼叫篇", "Tzav": "吩咐篇", "Shemini": "第八天篇", "Tazria": "懷孕篇",
    "Metzora": "大麻風篇", "Acharei Mot": "死後篇", "Kedoshim": "聖潔篇", "Emor": "你說篇",
    "Behar": "在西奈山篇", "B'har": "在西奈山篇", "Bechukotai": "遵行律例篇", "Bamidbar": "在曠野篇", "Naso": "數點篇",
    "Behaalotecha": "點燈篇", "Shelach": "打發探子篇", "Korach": "可拉篇", "Chukat": "律例篇",
    "Balak": "巴勒篇", "Pinchas": "非尼哈篇", "Matot": "支派篇", "Masei": "行程篇",
    "Devarim": "話語篇", "Vaetchanan": "我懇求篇", "Vaet Chanan": "我懇求篇", "Eikev": "因為聽從篇", "Ekev": "因為聽從篇",
    "Reeh": "看哪篇", "Re'eh": "看哪篇", "Shoftim": "士師篇", "Ki Tetze": "你出去出戰篇", "Ki Tetzei": "你出去出戰篇", "Ki Tavo": "你進去篇",
    "Nitzavim": "今日站立篇", "Vayelech": "摩西去說篇", "Haazinu": "側耳而聽篇", "VZot HaBerachah": "這是祝福篇",
    "B'shalach": "容百姓去篇", "Mattot": "支派篇", "B'ha'alot'cha": "點燈篇", "Metzorah": "大麻風篇", "B'chukotai": "遵行律例篇"
}

# 54 Parashot
PARASHOT_54 = [
    # Genesis (12)
    {"id": 1, "name": "Bereshit", "name_zh": "起初篇", "book": "Gen", "book_zh": "創世記", "range": "1:1-6:8", "range_zh": "創世記 1:1-6:8"},
    {"id": 2, "name": "Noach", "name_zh": "挪亞篇", "book": "Gen", "book_zh": "創世記", "range": "6:9-11:32", "range_zh": "創世記 6:9-11:32"},
    {"id": 3, "name": "Lech-Lecha", "name_zh": "你要離開篇", "book": "Gen", "book_zh": "創世記", "range": "12:1-17:27", "range_zh": "創世記 12:1-17:27"},
    {"id": 4, "name": "Vayera", "name_zh": "顯現篇", "book": "Gen", "book_zh": "創世記", "range": "18:1-22:24", "range_zh": "創世記 18:1-22:24"},
    {"id": 5, "name": "Chayei Sara", "name_zh": "撒拉的壽數篇", "book": "Gen", "book_zh": "創世記", "range": "23:1-25:18", "range_zh": "創世記 23:1-25:18"},
    {"id": 6, "name": "Toldot", "name_zh": "後代篇", "book": "Gen", "book_zh": "創世記", "range": "25:19-28:9", "range_zh": "創世記 25:19-28:9"},
    {"id": 7, "name": "Vayetzei", "name_zh": "雅各出發篇", "book": "Gen", "book_zh": "創世記", "range": "28:10-32:3", "range_zh": "創世記 28:10-32:3"},
    {"id": 8, "name": "Vayishlach", "name_zh": "打發篇", "book": "Gen", "book_zh": "創世記", "range": "32:4-36:43", "range_zh": "創世記 32:4-36:43"},
    {"id": 9, "name": "Vayeshev", "name_zh": "住下篇", "book": "Gen", "book_zh": "創世記", "range": "37:1-40:23", "range_zh": "創世記 37:1-40:23"},
    {"id": 10, "name": "Miketz", "name_zh": "過了兩年篇", "book": "Gen", "book_zh": "創世記", "range": "41:1-44:17", "range_zh": "創世記 41:1-44:17"},
    {"id": 11, "name": "Vayigash", "name_zh": "挨近篇", "book": "Gen", "book_zh": "創世記", "range": "44:18-47:27", "range_zh": "創世記 44:18-47:27"},
    {"id": 12, "name": "Vayechi", "name_zh": "活在篇", "book": "Gen", "book_zh": "創世記", "range": "47:28-50:26", "range_zh": "創世記 47:28-50:26"},
    # Exodus (11)
    {"id": 13, "name": "Shemot", "name_zh": "名字篇", "book": "Exo", "book_zh": "出埃及記", "range": "1:1-6:1", "range_zh": "出埃及記 1:1-6:1"},
    {"id": 14, "name": "Vaera", "name_zh": "我顯現篇", "book": "Exo", "book_zh": "出埃及記", "range": "6:2-9:35", "range_zh": "出埃及記 6:2-9:35"},
    {"id": 15, "name": "Bo", "name_zh": "去見法老篇", "book": "Exo", "book_zh": "出埃及記", "range": "10:1-13:16", "range_zh": "出埃及記 10:1-13:16"},
    {"id": 16, "name": "Beshalach", "name_zh": "容百姓去篇", "book": "Exo", "book_zh": "出埃及記", "range": "13:17-17:16", "range_zh": "出埃及記 13:17-17:16"},
    {"id": 17, "name": "Yitro", "name_zh": "葉忒羅篇", "book": "Exo", "book_zh": "出埃及記", "range": "18:1-20:23", "range_zh": "出埃及記 18:1-20:23"},
    {"id": 18, "name": "Mishpatim", "name_zh": "典章篇", "book": "Exo", "book_zh": "出埃及記", "range": "21:1-24:18", "range_zh": "出埃及記 21:1-24:18"},
    {"id": 19, "name": "Terumah", "name_zh": "禮物篇", "book": "Exo", "book_zh": "出埃及記", "range": "25:1-27:19", "range_zh": "出埃及記 25:1-27:19"},
    {"id": 20, "name": "Tetzaveh", "name_zh": "你要吩咐篇", "book": "Exo", "book_zh": "出埃及記", "range": "27:20-30:10", "range_zh": "出埃及記 27:20-30:10"},
    {"id": 21, "name": "Ki Tisa", "name_zh": "你要數點篇", "book": "Exo", "book_zh": "出埃及記", "range": "30:11-34:35", "range_zh": "出埃及記 30:11-34:35"},
    {"id": 22, "name": "Vayakhel", "name_zh": "招聚篇", "book": "Exo", "book_zh": "出埃及記", "range": "35:1-38:20", "range_zh": "出埃及記 35:1-38:20"},
    {"id": 23, "name": "Pekudei", "name_zh": "數算篇", "book": "Exo", "book_zh": "出埃及記", "range": "38:21-40:38", "range_zh": "出埃及記 38:21-40:38"},
    # Leviticus (10)
    {"id": 24, "name": "Vayikra", "name_zh": "呼叫篇", "book": "Lev", "book_zh": "利未記", "range": "1:1-5:26", "range_zh": "利未記 1:1-5:26"},
    {"id": 25, "name": "Tzav", "name_zh": "吩咐篇", "book": "Lev", "book_zh": "利未記", "range": "6:1-8:36", "range_zh": "利未記 6:1-8:36"},
    {"id": 26, "name": "Shemini", "name_zh": "第八天篇", "book": "Lev", "book_zh": "利未記", "range": "9:1-11:47", "range_zh": "利未記 9:1-11:47"},
    {"id": 27, "name": "Tazria", "name_zh": "懷孕篇", "book": "Lev", "book_zh": "利未記", "range": "12:1-13:59", "range_zh": "利未記 12:1-13:59"},
    {"id": 28, "name": "Metzora", "name_zh": "大麻風篇", "book": "Lev", "book_zh": "利未記", "range": "14:1-15:33", "range_zh": "利未記 14:1-15:33"},
    {"id": 29, "name": "Acharei Mot", "name_zh": "死後篇", "book": "Lev", "book_zh": "利未記", "range": "16:1-18:30", "range_zh": "利未記 16:1-18:30"},
    {"id": 30, "name": "Kedoshim", "name_zh": "聖潔篇", "book": "Lev", "book_zh": "利未記", "range": "19:1-20:27", "range_zh": "利未記 19:1-20:27"},
    {"id": 31, "name": "Emor", "name_zh": "你說篇", "book": "Lev", "book_zh": "利未記", "range": "21:1-24:23", "range_zh": "利未記 21:1-24:23"},
    {"id": 32, "name": "Behar", "name_zh": "在西奈山篇", "book": "Lev", "book_zh": "利未記", "range": "25:1-26:2", "range_zh": "利未記 25:1-26:2"},
    {"id": 33, "name": "Bechukotai", "name_zh": "遵行律例篇", "book": "Lev", "book_zh": "利未記", "range": "26:3-27:34", "range_zh": "利未記 26:3-27:34"},
    # Numbers (10)
    {"id": 34, "name": "Bamidbar", "name_zh": "在曠野篇", "book": "Num", "book_zh": "民數記", "range": "1:1-4:20", "range_zh": "民數記 1:1-4:20"},
    {"id": 35, "name": "Naso", "name_zh": "數點篇", "book": "Num", "book_zh": "民數記", "range": "4:21-7:89", "range_zh": "民數記 4:21-7:89"},
    {"id": 36, "name": "Behaalotecha", "name_zh": "點燈篇", "book": "Num", "book_zh": "民數記", "range": "8:1-12:16", "range_zh": "民數記 8:1-12:16"},
    {"id": 37, "name": "Shelach", "name_zh": "打發探子篇", "book": "Num", "book_zh": "民數記", "range": "13:1-15:41", "range_zh": "民數記 13:1-15:41"},
    {"id": 38, "name": "Korach", "name_zh": "可拉篇", "book": "Num", "book_zh": "民數記", "range": "16:1-18:32", "range_zh": "民數記 16:1-18:32"},
    {"id": 39, "name": "Chukat", "name_zh": "律例篇", "book": "Num", "book_zh": "民數記", "range": "19:1-22:1", "range_zh": "民數記 19:1-22:1"},
    {"id": 40, "name": "Balak", "name_zh": "巴勒篇", "book": "Num", "book_zh": "民數記", "range": "22:2-25:9", "range_zh": "民數記 22:2-25:9"},
    {"id": 41, "name": "Pinchas", "name_zh": "非尼哈篇", "book": "Num", "book_zh": "民數記", "range": "25:10-30:1", "range_zh": "民數記 25:10-30:1"},
    {"id": 42, "name": "Matot", "name_zh": "支派篇", "book": "Num", "book_zh": "民數記", "range": "30:2-32:42", "range_zh": "民數記 30:2-32:42"},
    {"id": 43, "name": "Masei", "name_zh": "行程篇", "book": "Num", "book_zh": "民數記", "range": "33:1-36:13", "range_zh": "民數記 33:1-36:13"},
    # Deuteronomy (11)
    {"id": 44, "name": "Devarim", "name_zh": "話語篇", "book": "Deu", "book_zh": "申命記", "range": "1:1-3:22", "range_zh": "申命記 1:1-3:22"},
    {"id": 45, "name": "Vaetchanan", "name_zh": "我懇求篇", "book": "Deu", "book_zh": "申命記", "range": "3:23-7:11", "range_zh": "申命記 3:23-7:11"},
    {"id": 46, "name": "Eikev", "name_zh": "因為聽從篇", "book": "Deu", "book_zh": "申命記", "range": "7:12-11:25", "range_zh": "申命記 7:12-11:25"},
    {"id": 47, "name": "Reeh", "name_zh": "看哪篇", "book": "Deu", "book_zh": "申命記", "range": "11:26-16:17", "range_zh": "申命記 11:26-16:17"},
    {"id": 48, "name": "Shoftim", "name_zh": "士師篇", "book": "Deu", "book_zh": "申命記", "range": "16:18-21:9", "range_zh": "申命記 16:18-21:9"},
    {"id": 49, "name": "Ki Tetzei", "name_zh": "你出去出戰篇", "book": "Deu", "book_zh": "申命記", "range": "21:10-25:19", "range_zh": "申命記 21:10-25:19"},
    {"id": 50, "name": "Ki Tavo", "name_zh": "你進去篇", "book": "Deu", "book_zh": "申命記", "range": "26:1-29:8", "range_zh": "申命記 26:1-29:8"},
    {"id": 51, "name": "Nitzavim", "name_zh": "今日站立篇", "book": "Deu", "book_zh": "申命記", "range": "29:9-30:20", "range_zh": "申命記 29:9-30:20"},
    {"id": 52, "name": "Vayelech", "name_zh": "摩西去說篇", "book": "Deu", "book_zh": "申命記", "range": "31:1-30", "range_zh": "申命記 31:1-30"},
    {"id": 53, "name": "Haazinu", "name_zh": "側耳而聽篇", "book": "Deu", "book_zh": "申命記", "range": "32:1-52", "range_zh": "申命記 32:1-52"},
    {"id": 54, "name": "VZot HaBerachah", "name_zh": "這是祝福篇", "book": "Deu", "book_zh": "申命記", "range": "33:1-34:12", "range_zh": "申命記 33:1-34:12"}
]

# Load Chinese translations
with open(ZH_PATH, "r", encoding="utf-8") as f:
    zh_map = json.load(f)

# Load CUV Torah Chinese verses
CUV_TORAH_PATH = os.path.join(SCRIPT_DIR, "raw", "cuv_torah.json")
with open(CUV_TORAH_PATH, "r", encoding="utf-8") as f:
    cuv_torah = json.load(f)

CUV_BOOK_IDX = {'GEN': 0, 'EXO': 1, 'LEV': 2, 'NUM': 3, 'DEU': 4}

import re
def get_cuv_verse(ref_id):
    parts = ref_id.strip().split()
    b_name = parts[0]
    cv = parts[1].split(':')
    chap = int(cv[0])
    verse = int(cv[1])
    b_idx = CUV_BOOK_IDX.get(b_name, 1)
    raw_v = cuv_torah[b_idx]['chapters'][chap - 1][verse - 1]
    # Remove spaces between CJK chars and punctuation
    cleaned = re.sub(r'(?<=[\u4e00-\u9fff\u3000-\u303f\uff01-\uff5e])\s+(?=[\u4e00-\u9fff\u3000-\u303f\uff01-\uff5e])', '', raw_v).strip()
    return cleaned

# Load CSV
with open(CSV_PATH, "r", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

commandments = []
for r in rows:
    num = int(r["commandment_number"])
    concept = r["commandment_concept"].strip()
    pol = r["commandment_polarity"].strip()
    ref_id = r["reference_id"].strip()
    parts = ref_id.split()
    book_raw = parts[0] if len(parts) > 0 else "EXO"
    chap_verse = parts[1] if len(parts) > 1 else ""
    
    book_key = BOOK_MAP.get(book_raw, "Exo")
    book_zh = BOOK_NAME_ZH.get(book_key, "出埃及記")
    ref_zh = f"{book_zh} {chap_verse}"
    
    books_dict = {"Gen": None, "Exo": None, "Lev": None, "Num": None, "Deu": None}
    books_dict[book_key] = chap_verse
    
    mt_book_num = r["mishneh_torah_book_number"].strip()
    category_id = MT_MAP.get(mt_book_num, "madda")
    category_zh = MT_NAME_ZH.get(category_id, "知識之書")
    
    parashah_raw = r["scripture_parashah"].strip()
    parashah_zh = PARASHAH_ZH.get(parashah_raw, parashah_raw)
    
    chinuch_str = r["sefer_hachinuch_number"].strip()
    chinuch_val = int(chinuch_str) if chinuch_str.isdigit() else None
    
    title_zh = zh_map.get(str(num), concept)
    
    # Clean up scripture strings
    scrip_en = r["scripture_english"].strip().strip('"')
    scrip_he = r["scripture_hebrew"].strip()
    scrip_zh = get_cuv_verse(ref_id)
    
    commandments.append({
        "id": num,
        "num": num,
        "type": "positive" if pol == 'P' else "negative",
        "polarity": pol,
        "title_en": concept,
        "title_zh": title_zh,
        "ref": ref_id,
        "ref_zh": ref_zh,
        "book": book_key,
        "books": books_dict,
        "category": category_id,
        "category_name": r["mishneh_torah_book_name"].strip(),
        "category_zh": category_zh,
        "subcategory": r["mishneh_torah_category"].strip(),
        "parashah": parashah_raw,
        "parashah_zh": parashah_zh,
        "chinuch": chinuch_val,
        "scripture_zh": scrip_zh,
        "scripture_en": scrip_en,
        "scripture_he": scrip_he
    })

# Compute Parashot commandments count & list
para_map = {}
for p in PARASHOT_54:
    p_copy = dict(p)
    p_copy["commandments"] = []
    para_map[p["name"].lower()] = p_copy

for cmd in commandments:
    p_key = cmd["parashah"].lower()
    # Normalize common variations
    if p_key in ["b'har", "behar"]:
        p_key = "behar"
    elif p_key in ["reeh", "re'eh"]:
        p_key = "reeh"
    elif p_key in ["vaet chanan", "vaetchanan"]:
        p_key = "vaetchanan"
    elif p_key in ["ki tetze", "ki tetzei"]:
        p_key = "ki tetzei"
        
    if p_key in para_map:
        para_map[p_key]["commandments"].append(cmd["id"])

parashot_out = list(para_map.values())
for p in parashot_out:
    p["count"] = len(p["commandments"])

# Write out commandments.js
with open(OUT_CMD_PATH, "w", encoding="utf-8") as f:
    f.write("// 613 Commandments (Taryag Mitzvot) Database\n")
    f.write("// Based on Maimonides' Sefer HaMitzvot / Mishneh Torah order\n")
    f.write("const COMMANDMENTS = ")
    json.dump(commandments, f, ensure_ascii=False, indent=2)
    f.write(";\n")
print(f"Generated {OUT_CMD_PATH} with {len(commandments)} commandments.")

# Write out parashot.js
with open(OUT_PARA_PATH, "w", encoding="utf-8") as f:
    f.write("// 54 Weekly Torah Portions (Parashat HaShavua)\n")
    f.write("const PARASHOT = ")
    json.dump(parashot_out, f, ensure_ascii=False, indent=2)
    f.write(";\n")
print(f"Generated {OUT_PARA_PATH} with {len(parashot_out)} Parashot.")
