// ══════════════════════════════════════════════
// JOURNEY MAP VIEW — Authoritative Historical Biblical Cartography
// ══════════════════════════════════════════════

(function() {

let currentEra = 'all'; // 'all' | 'patriarchs' | 'joseph' | 'exodus' | 'conquest'
let currentViewport = 'macro'; // 'macro' | 'canaan'
let activeStationIdx = 0;

// ── Geographic Projection Engine (Equirectangular) ──
// Lat: 27.0° N to 37.5° N (10.5° span)
// Lon: 30.5° E to 48.5° E (18.0° span)
const SVG_W = 1000;
const SVG_H = 620;
const LAT_MIN = 27.0;
const LAT_MAX = 37.5;
const LON_MIN = 30.5;
const LON_MAX = 48.5;

function project(lat, lon) {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * SVG_W;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * SVG_H;
  return [Number(x.toFixed(1)), Number(y.toFixed(1))];
}

function polylineToPath(points) {
  if (!points || points.length === 0) return '';
  const coords = points.map(pt => project(pt[0], pt[1]));
  let d = `M ${coords[0][0]} ${coords[0][1]}`;
  for (let i = 1; i < coords.length; i++) {
    d += ` L ${coords[i][0]} ${coords[i][1]}`;
  }
  return d;
}

// ── 27 Chronological Historical Stations (with Verified Coordinates) ──
const STATIONS = [
  // ── ERA 1: PATRIARCHS (列祖時期 · 吾珥至迦南) ──
  {
    id: "st-ur",
    era: "patriarchs",
    name_zh: "迦勒底的吾珥 (Ur of the Chaldees)",
    name_en: "Ur of the Chaldees",
    ref_zh: "創世記 11:27-31, 15:7, 尼希米記 9:7",
    ref_en: "Genesis 11:27-31, 15:7, Nehemiah 9:7",
    lat: 30.96, lon: 46.10,
    summary_zh: "亞伯拉罕的故鄉，位於幼發拉底河下游古代蘇美爾繁榮之城。神在此對亞伯蘭發出救贖歷史最初的呼召，他與父親他拉、妻子撒萊、姪兒羅得起行離開吾珥，踏上信心之旅前往應許之地。",
    summary_en: "Abraham's birthplace in lower Mesopotamia near the Persian Gulf. God called Abram to leave this ancient city and journey by faith toward Canaan.",
    commandments: []
  },
  {
    id: "st-babel",
    era: "patriarchs",
    name_zh: "巴別與示拿地 (Babel / Babylon)",
    name_en: "Babel / Shinar (Babylon)",
    ref_zh: "創世記 11:1-9",
    ref_en: "Genesis 11:1-9",
    lat: 32.54, lon: 44.42,
    summary_zh: "美索不達米亞平原古城。古代世人企圖建造一座通天高塔以傳揚己名，神在此變亂全地人類的語言，並將世人分散在全地面上，開啟列國列族的歷史轉折點。",
    summary_en: "The plain of Shinar where humans attempted to build the Tower of Babel. God confused their languages and scattered the nations.",
    commandments: []
  },
  {
    id: "st-haran",
    era: "patriarchs",
    name_zh: "哈蘭與巴旦亞蘭 (Haran / Paddan-Aram)",
    name_en: "Haran / Paddan-Aram",
    ref_zh: "創世記 11:31-32, 12:1-4, 28:10",
    ref_en: "Genesis 11:31-32, 12:1-4, 28:10",
    lat: 36.86, lon: 39.03,
    summary_zh: "美索不達米亞北部重要的商業十字路口。他拉在此去世。亞伯蘭75歲時在此領受神的立約呼召：『你要離開本地、本族、父家，往我所要指示你的地去；我必叫你成為大國！』日後雅各亦逃至此服事舅父拉班二十年。",
    summary_en: "Northern crossroads where Terah died and God commanded 75-year-old Abram: 'Go from your country... and I will make of you a great nation.' Later Jacob dwelt here serving Laban.",
    commandments: []
  },
  {
    id: "st-damascus",
    era: "patriarchs",
    name_zh: "大馬士革與何把 (Damascus & Hobah)",
    name_en: "Damascus & Hobah",
    ref_zh: "創世記 14:14-16, 15:2",
    ref_en: "Genesis 14:14-16, 15:2",
    lat: 33.51, lon: 36.29,
    summary_zh: "古代敘利亞重鎮。四王擄走姪兒羅得後，亞伯蘭率精練壯丁318人追趕至大馬士革左邊的何把，將羅得及所有財物全數奪回；亞伯蘭忠心的大管家以利以謝亦來自此地。",
    summary_en: "Abraham pursued the Mesopotamian confederacy to Hobah north of Damascus to rescue Lot; Abraham's faithful chief servant Eliezer was of Damascus.",
    commandments: []
  },
  {
    id: "st-shechem",
    era: "patriarchs",
    name_zh: "示劍與摩利橡樹 (Shechem & Moreh)",
    name_en: "Shechem & Oak of Moreh",
    ref_zh: "創世記 12:6-7, 33:18-20, 約書亞記 24:1-25",
    ref_en: "Genesis 12:6-7, 33:18-20, Joshua 24:1-25",
    lat: 32.21, lon: 35.28,
    summary_zh: "亞伯蘭進入迦南的第一站！耶和華向他顯現應許：『我要把這地賜給你的後裔。』亞伯蘭便在此為神築了第一座壇。雅各日後歸回在此買地築壇；約書亞臨終前在此召聚全會眾立石重申聖約。",
    summary_en: "Abraham's first stop in Canaan where God appeared and promised the land; Abraham built his first altar here. Jacob later bought land here, and Joshua renewed the covenant here.",
    commandments: []
  },
  {
    id: "st-bethel",
    era: "patriarchs",
    name_zh: "伯特利與艾城 (Bethel & Ai)",
    name_en: "Bethel & Ai",
    ref_zh: "創世記 12:8, 13:3-4, 28:10-19",
    ref_en: "Genesis 12:8, 13:3-4, 28:10-19",
    lat: 31.93, lon: 35.22,
    summary_zh: "亞伯蘭在此支搭帳棚，在伯特利與艾城之間為耶和華築壇求告主名。雅各逃亡時在此枕石而睡，夢見天梯與天使升降，神重申亞伯拉罕之約，雅各稱此地為『伯特利（神的家）』。",
    summary_en: "Abraham pitched tent and built an altar between Bethel and Ai. Jacob dreamed of the ladder to heaven, receiving God's covenant renewal and naming the place Beth-El ('House of God').",
    commandments: []
  },
  {
    id: "st-moriah",
    era: "patriarchs",
    name_zh: "摩利亞山 / 耶路撒冷 (Mount Moriah / Jerusalem)",
    name_en: "Mount Moriah / Jerusalem",
    ref_zh: "創世記 14:18-20, 22:1-19",
    ref_en: "Genesis 14:18-20, 22:1-19",
    lat: 31.78, lon: 35.23,
    summary_zh: "救贖啟示的聖山。亞伯蘭在此遇見至高神的祭司撒冷王麥基洗德並獻上十分之一；神在此試驗亞伯拉罕獻以撒，天使制止並賜公羊代替獻祭，神宣告『耶和華以勒（在主的山上必有預備）』。後為聖殿山所在地。",
    summary_en: "Abraham met Melchizedek king of Salem here. God tested Abraham with offering Isaac on Mount Moriah, providing the substitute ram ('Jehovah Jireh'). Later the Temple Mount.",
    commandments: []
  },
  {
    id: "st-hebron",
    era: "patriarchs",
    name_zh: "希伯崙 / 幔利橡樹與麥比拉洞 (Hebron / Machpelah)",
    name_en: "Hebron / Cave of Machpelah",
    ref_zh: "創世記 13:18, 23:1-20, 49:29-32",
    ref_en: "Genesis 13:18, 23:1-20, 49:29-32",
    lat: 31.53, lon: 35.10,
    summary_zh: "列祖生平的核心居所。亞伯拉罕在幔利橡樹旁支搭帳棚，在此接待三位天使並為所多瑪代求；撒拉死後，亞伯拉罕買下麥比拉洞作為家族墓地。亞伯拉罕、撒拉、以撒、利百加、雅各、利亞皆葬於此。",
    summary_en: "Patriarchal home by the Oaks of Mamre where Abraham interceded for Sodom and purchased the Cave of Machpelah as the resting tomb for Sarah, Abraham, Isaac, Rebekah, Leah, and Jacob.",
    commandments: []
  },
  {
    id: "st-beersheba",
    era: "patriarchs",
    name_zh: "別是巴盟誓之井 (Beersheba)",
    name_en: "Beersheba ('Well of the Oath')",
    ref_zh: "創世記 21:31-33, 26:23-33, 46:1-5",
    ref_en: "Genesis 21:31-33, 26:23-33, 46:1-5",
    lat: 31.25, lon: 34.79,
    summary_zh: "迦南最南方的盟誓之井。亞伯拉罕在此與非利士王立約並栽植垂絲柳樹求告永生神的名。以撒在此挖得水井築壇；雅各全家下埃及前在此向神獻祭，神在異象中應許『不要害怕下去，我必使你成為大族』。",
    summary_en: "Southern border oasis where Abraham and Isaac made peace treaties and planted tamarisk trees. Jacob offered sacrifices here before his journey down to Egypt, receiving God's reassurance.",
    commandments: []
  },

  // ── ERA 2: JOSEPH IN EGYPT (約瑟生平與入埃及) ──
  {
    id: "st-dothan",
    era: "joseph",
    name_zh: "多坍 (Dothan)",
    name_en: "Dothan",
    ref_zh: "創世記 37:12-28",
    ref_en: "Genesis 37:12-28",
    lat: 32.42, lon: 35.24, // North of Shechem in the Dothan plain
    summary_zh: "約瑟尋找哥哥們來到多坍（位於示劍北方25公里之多坍平原，緊鄰沿海國際商道 Via Maris）。哥哥們將他剝去彩衣扔入深坑，最後以二十舍客勒銀子將約瑟賣給前往埃及的米甸駱駝商隊，開啟全家下埃及的序幕。",
    summary_en: "Joseph found his brothers grazing flocks in the Dothan plain north of Shechem. They stripped his coat of many colors, cast him into a cistern, and sold him for 20 silver pieces to a caravan bound for Egypt.",
    commandments: []
  },
  {
    id: "st-goshen",
    era: "joseph",
    name_zh: "埃及歌珊地與蘭塞 (Goshen / Rameses)",
    name_en: "Goshen / Rameses",
    ref_zh: "創世記 46:28–47:12, 出埃及記 1:11, 12:37",
    ref_en: "Genesis 46:28–47:12, Exodus 1:11, 12:37",
    lat: 30.79, lon: 31.83,
    summary_zh: "埃及尼羅河三角洲東部的肥沃草場。約瑟在此迎接年邁的雅各，以色列全家70人在此繁衍成大族；數百年後新法老嚴酷逼迫百姓作苦工造城。經歷十災與宰殺逾越節羊羔之夜，以色列大軍浩浩蕩蕩踏出埃及！",
    summary_en: "The fertile eastern Nile Delta where Joseph settled his father Jacob. Centuries later Israelites were enslaved building treasure cities; site of the first Passover before the great Exodus.",
    commandments: [109, 110, 111, 112, 113, 114, 115, 120, 276, 277, 278, 404, 408, 410, 411, 412, 414, 415, 417]
  },

  // ── ERA 3: EXODUS & WILDERNESS (出埃及與曠野四十載) ──
  {
    id: "st-succoth",
    era: "exodus",
    name_zh: "疏割與以倘 (Succoth & Etham)",
    name_en: "Succoth & Etham",
    ref_zh: "出埃及記 13:20-22",
    ref_en: "Exodus 13:20-22",
    lat: 30.55, lon: 32.25,
    summary_zh: "曠野邊界的安營處。耶和華在他們前面行，日間在雲柱中領他們的路，夜間在火柱中光照他們，使他們日夜都可以行走。",
    summary_en: "Camp on the edge of the wilderness where the pillar of cloud by day and pillar of fire by night first appeared to guide Israel.",
    commandments: [79, 80]
  },
  {
    id: "st-redsea",
    era: "exodus",
    name_zh: "紅海過海處 (Red Sea Crossing)",
    name_en: "Red Sea Crossing",
    ref_zh: "出埃及記 14:10-31, 15:1-21",
    ref_en: "Exodus 14:10-31, 15:1-21",
    lat: 30.02, lon: 32.55,
    summary_zh: "前有大海、後有追兵。摩西向海伸杖，大東風將海水分開立起成壘，百姓下海中走乾地；埃及法老全軍入海全數淹沒。摩西與米利暗在此擊鼓唱響千古得勝救贖凱歌！",
    summary_en: "God parted the waters through Moses' staff; Israel crossed on dry ground while Pharaoh's chariots were engulfed. Moses and Miriam sang triumphant songs of deliverance.",
    commandments: []
  },
  {
    id: "st-marah",
    era: "exodus",
    name_zh: "瑪拉苦水 (Marah)",
    name_en: "Marah (Bitter Waters)",
    ref_zh: "出埃及記 15:22-26",
    ref_en: "Exodus 15:22-26",
    lat: 29.58, lon: 32.92,
    summary_zh: "在書珥曠野走了三天找不著水，到了瑪拉因水苦不能喝。神指示摩西一棵樹丟入水中，水就變甜了。神在此為百姓定下律例典章，宣告『我是醫治你的耶和華』。",
    summary_en: "Bitter water sweetened by a tree; God declared 'I am the LORD who heals you' and instituted ordinances.",
    commandments: []
  },
  {
    id: "st-elim",
    era: "exodus",
    name_zh: "以琳十二水泉 (Elim)",
    name_en: "Elim (12 Springs, 70 Palms)",
    ref_zh: "出埃及記 15:27",
    ref_en: "Exodus 15:27",
    lat: 29.33, lon: 32.97,
    summary_zh: "曠野中的甘美綠洲，那裡有十二股水泉，七十棵棕樹；以色列百姓就在那裡的水邊安營休整舒暢。",
    summary_en: "Oasis in the wilderness with twelve springs of water and seventy date palms where Israel rested.",
    commandments: []
  },
  {
    id: "st-rephidim",
    era: "exodus",
    name_zh: "汛的曠野與利非訂 (Sin & Rephidim)",
    name_en: "Wilderness of Sin & Rephidim",
    ref_zh: "出埃及記 16:1-36, 17:1-16, 18:1-27",
    ref_en: "Exodus 16:1-36, 17:1-16, 18:1-27",
    lat: 28.71, lon: 33.62,
    summary_zh: "神每日自天降下嗎哪與鵪鶉供應百姓四十年；在利非訂何烈磐石擊石出水；約書亞在山下爭戰擊敗亞瑪力人，摩西在山頂舉杖禱告立壇『耶和華尼西（主是我旌旗）』；葉忒羅獻策建立司法審判官制。",
    summary_en: "Daily manna and quails from heaven; water from the rock at Rephidim; victory over Amalek (Jehovah Nissi); Jethro advises legal court structure.",
    commandments: [87, 88, 90, 540, 598, 599, 600]
  },
  {
    id: "st-sinai",
    era: "exodus",
    name_zh: "西奈山 / 何烈山 (Mount Sinai / Horeb)",
    name_en: "Mount Sinai / Horeb",
    ref_zh: "出埃及記 19–40章, 利未記全卷, 民數記 1–10章",
    ref_en: "Exodus 19–40, Leviticus, Numbers 1–10",
    lat: 28.54, lon: 33.97,
    summary_zh: "妥拉啟示與立約的最高峰！雷轟閃電密雲中神降臨親頒十誡；頒布約書與會幕樣式；金牛犢悔改後重刻石版立約；頒布利未記全卷聖潔法典；立起榮耀會幕並完成民數記首次數點人口。",
    summary_en: "The peak covenant sanctuary: God manifested in fire and thick cloud giving the Ten Commandments, Covenant Code, Tabernacle blueprint, and the entire Leviticus priestly holiness law.",
    commandments: [1, 2, 6, 29, 88, 91, 160, 210, 301, 302, 307, 312, 313, 318, 331, 336, 348, 350, 352, 355, 359, 361, 373, 374, 377, 378, 381, 421, 444, 473, 476, 482, 576, 584]
  },
  {
    id: "st-kadesh",
    era: "exodus",
    name_zh: "加低斯巴尼亞 (Kadesh-Barnea)",
    name_en: "Kadesh-Barnea",
    ref_zh: "民數記 13–14章, 15–20章",
    ref_en: "Numbers 13–14, 15–20",
    lat: 30.65, lon: 34.42,
    summary_zh: "曠野流浪38載的關鍵樞紐。摩西打發12探子窺探迦南，十探子報惡信引致會眾反叛，神命第一代在曠野漂流至死；可拉黨叛亂；亞倫之杖發芽；米利暗去世；摩西擊打磐石兩次被阻進迦南。",
    summary_en: "Sent 12 spies into Canaan; Israel's faithless rebellion caused 38 years wandering. Korah's rebellion, budding of Aaron's rod, death of Miriam, and Moses striking the rock at Meribah.",
    commandments: [84, 253, 260, 273, 305, 314, 444, 445]
  },
  {
    id: "st-punon",
    era: "exodus",
    name_zh: "普嫩與銅蛇 (Punon & Bronze Serpent)",
    name_en: "Punon & the Bronze Serpent",
    ref_zh: "民數記 21:4-9",
    ref_en: "Numbers 21:4-9",
    lat: 30.62, lon: 35.35,
    summary_zh: "繞行以東地路途漫長艱辛，百姓心裡煩躁怨讟神，火蛇進入擊殺多人。神命摩西製造一條銅蛇掛在杆子上，凡被蛇咬的只要望這銅蛇就必得活，預表十架仰望救贖恩典。",
    summary_en: "Complaining brought fiery serpents; Moses lifted the Bronze Serpent on a pole so all who looked upon it lived, foreshadowing Christ on the cross.",
    commandments: []
  },
  {
    id: "st-arnon",
    era: "exodus",
    name_zh: "亞嫩河谷與外約旦征服 (Arnon River)",
    name_en: "Arnon River & Transjordan",
    ref_zh: "民數記 21:13-35, 申命記 2–3章",
    ref_en: "Numbers 21:13-35, Deuteronomy 2–3",
    lat: 31.47, lon: 35.57,
    summary_zh: "摩押與亞摩利人天然界河。以色列大敗希實本王西宏與巴珊王噩，征服整個約旦河東廣闊高原，將其分給流便、迦得與瑪拿西半支派作產業，開啟戰略反攻態勢。",
    summary_en: "Deep gorge boundary where Israel defeated Amorite king Sihon and Og of Bashan, conquering Transjordan for Reuben, Gad, and half-Manasseh.",
    commandments: []
  },
  {
    id: "st-moab",
    era: "exodus",
    name_zh: "摩押平原 / 什亭 (Plains of Moab / Shittim)",
    name_en: "Plains of Moab / Shittim",
    ref_zh: "民數記 22–36章, 申命記 1–33章",
    ref_en: "Numbers 22–36, Deuteronomy 1–33",
    lat: 31.83, lon: 35.68,
    summary_zh: "進迦南前的至大講台！巴蘭四度受阻轉發宏大祝福；非尼哈熱心止住瘟疫獲立永遠平安之約；第二次戶口普查；摩西在此向新一代以色列人重述整部妥拉律法（申命記重申誡命）！",
    summary_en: "Grand encampment across Jericho: Balaam's four blessings, Phinehas' zeal, census of the second generation, and Moses delivering the entire Book of Deuteronomy before Jordan.",
    commandments: [3, 4, 5, 8, 9, 10, 11, 12, 14, 22, 53, 56, 57, 82, 83, 85, 247, 248, 249, 250, 252, 261, 272, 285, 563, 571, 578, 579, 580, 581, 591, 592, 593, 594, 595, 596, 597, 602, 604, 608, 611, 612, 613]
  },
  {
    id: "st-nebo",
    era: "exodus",
    name_zh: "尼波山與毘斯迦頂 (Mount Nebo / Pisgah)",
    name_en: "Mount Nebo / Pisgah",
    ref_zh: "申命記 34:1-12",
    ref_en: "Deuteronomy 34:1-12",
    lat: 31.77, lon: 35.73,
    summary_zh: "摩西120歲登上尼波山頂，神將迦南應許全地直到但與西海指給他觀看。耶和華的僕人摩西死在摩押地，神親自埋葬他；以色列中再沒有興起先知像摩西是耶和華面對面所認識的。",
    summary_en: "Moses climbed Nebo at age 120, viewed the Promised Land across Jordan, and died in the presence of God. 'No prophet has arisen in Israel like Moses, whom the LORD knew face to face.'",
    commandments: []
  },

  // ── ERA 4: CONQUEST OF CANAAN (征服應許迦南美地) ──
  {
    id: "st-jordan-gilgal",
    era: "conquest",
    name_zh: "約旦河渡口與吉甲 (Jordan River & Gilgal)",
    name_en: "Jordan River & Gilgal",
    ref_zh: "約書亞記 3–5章",
    ref_en: "Joshua 3–5",
    lat: 31.88, lon: 35.50,
    summary_zh: "祭司抬約櫃踏入約旦河，河水在亞當城立起成壘，全以色列走乾地順利過約旦河！在吉甲立十二塊紀念石；行割禮滾去埃及羞辱；守迦南地第一次逾越節，次日嗎哪停止，開始享用美地土產！",
    summary_en: "Priests carried the Ark into the overflowing Jordan, water stood in a heap, and Israel crossed on dry ground. Twelve stones set at Gilgal; circumcision renewed; manna ceased.",
    commandments: []
  },
  {
    id: "st-jericho",
    era: "conquest",
    name_zh: "耶利哥城破 (Jericho Conquered)",
    name_en: "Jericho Conquered",
    ref_zh: "約書亞記 6:1-27",
    ref_en: "Joshua 6:1-27",
    lat: 31.86, lon: 35.45,
    summary_zh: "迦南門戶第一大堅固城。祭司吹角抬約櫃，百姓連續繞城六日；第七天繞城七次齊聲大呼喊，堅固的耶利哥城牆瞬間崩塌！妓女喇合因信全家蒙拯救，得入彌賽亞家譜。",
    summary_en: "First city taken in Canaan: 7 days marching around walls with shofars and the Ark; on the 7th day the wall collapsed at their shout. Rahab the harlot was saved by faith.",
    commandments: []
  },
  {
    id: "st-ai-ebal",
    era: "conquest",
    name_zh: "艾城與以巴路山宣律法 (Ai & Mount Ebal)",
    name_en: "Ai & Mount Ebal Covenant",
    ref_zh: "約書亞記 7–8章",
    ref_en: "Joshua 7–8",
    lat: 31.91, lon: 35.26,
    summary_zh: "除掉當滅之物後，約書亞設伏大破艾城；隨後率領全以色列在以巴路山築未經鐵器之石壇獻祭，將摩西律法抄寫於石上，六支派立於基利心山宣祝福、六支派立於以巴路山宣咒詛，一字不漏宣讀妥拉！",
    summary_en: "Conquest of Ai followed by Joshua building an uncut stone altar on Mount Ebal, copying the Law of Moses on stones, and reading all blessings and curses before the tribes.",
    commandments: []
  },
  {
    id: "st-gibeon",
    era: "conquest",
    name_zh: "基遍與日頭停留 (Gibeon & Aijalon)",
    name_en: "Gibeon (Sun Stands Still)",
    ref_zh: "約書亞記 9:1–10:15",
    ref_en: "Joshua 9:1–10:15",
    lat: 31.85, lon: 35.19,
    summary_zh: "基遍人設假象與以色列立約。亞摩利五王聯軍圍攻基遍，約書亞急行軍夜襲，神自天降大冰雹；約書亞禱告：『日頭啊，你要停在基遍；月亮啊，你要止在亞雅崙谷！』神為以色列爭戰，日頭在一日之中不落。",
    summary_en: "Southern coalition attacked Gibeon; Joshua marched all night, God cast hailstones, and Joshua prayed: 'Sun, stand still at Gibeon.' The sun stopped in mid-heaven for an entire day.",
    commandments: []
  },
  {
    id: "st-hazor",
    era: "conquest",
    name_zh: "夏瑣與北方平定 (Hazor Conquered)",
    name_en: "Hazor Conquered (Northern Victory)",
    ref_zh: "約書亞記 11:1-23",
    ref_en: "Joshua 11:1-23",
    lat: 33.02, lon: 35.57,
    summary_zh: "北方諸王聯盟首領夏瑣王耶賓率大批鐵車與多如海沙之軍隊集結米倫水邊。神使約書亞全勝敵軍，攻取並焚燒北方諸國之首夏瑣城，奪取迦南全地，全境國中太平，得享安息！",
    summary_en: "Decisive northern victory against the massive confederacy at the waters of Merom. Hazor was burned, northern kings defeated, and the land finally had rest from war.",
    commandments: []
  }
];

const ERA_COLORS = {
  patriarchs: "#4A5D73", // Slate Blue
  joseph: "#D6A84C",      // Amber
  exodus: "#934B43",      // Terracotta
  conquest: "#526851"     // Olive
};

// ── Geographic Waterway & Coastline Paths ──
const MED_COAST = [
  [37.5, 30.5], [31.3, 30.5], [31.4, 30.8], [31.5, 31.8], [31.25, 32.3],
  [31.1, 33.8], [31.5, 34.46], [32.05, 34.76], [32.82, 34.98], [33.27, 35.20],
  [33.89, 35.50], [34.8, 35.85], [35.52, 35.78], [36.7, 35.8], [37.5, 35.5]
];

const GULF_SUEZ = [
  [29.97, 32.55], [29.5, 32.7], [28.8, 33.1], [28.2, 33.6], [27.72, 34.25],
  [27.72, 34.1], [28.2, 33.5], [28.9, 33.0], [29.6, 32.5], [29.97, 32.55]
];

const GULF_AQABA = [
  [27.72, 34.25], [28.5, 34.45], [29.0, 34.7], [29.55, 34.97],
  [29.55, 35.05], [29.0, 34.8], [28.5, 34.55], [27.72, 34.25]
];

const DEAD_SEA = [
  [31.78, 35.50], [31.60, 35.52], [31.45, 35.48], [31.30, 35.40],
  [31.05, 35.38], [31.05, 35.33], [31.30, 35.35], [31.50, 35.38],
  [31.70, 35.45], [31.78, 35.50]
];

const GALILEE = [
  [32.88, 35.58], [32.85, 35.62], [32.78, 35.60], [32.72, 35.57],
  [32.78, 35.53], [32.85, 35.54], [32.88, 35.58]
];

const EUPHRATES = [
  [37.5, 37.8], [36.8, 38.0], [35.95, 39.0], [35.34, 40.14], [34.45, 40.92],
  [33.64, 42.82], [33.35, 43.78], [32.54, 44.42], [31.3, 45.3], [30.96, 46.10],
  [30.7, 47.7], [29.9, 48.5]
];

const TIGRIS = [
  [37.5, 41.2], [36.35, 43.15], [35.45, 43.26], [34.2, 43.88], [33.32, 44.38],
  [32.5, 45.8], [31.84, 47.15], [31.0, 47.4], [30.5, 47.8], [29.9, 48.5]
];

// ── Realistic Ancient Biblical Routes ──
const ROUTE_PATRIARCHS = [
  [30.96, 46.10], // Ur
  [32.54, 44.42], // Babylon
  [33.64, 42.82], // Euphrates valley
  [34.45, 40.92], // Mari
  [35.95, 39.00], // Balikh river
  [36.86, 39.03], // Haran
  [35.00, 37.50], // Upper Syria
  [33.51, 36.29], // Damascus
  [32.50, 35.80], // Gilead / Jabbok entry
  [32.21, 35.28], // Shechem
  [31.93, 35.22], // Bethel & Ai
  [31.78, 35.23], // Moriah / Jerusalem
  [31.53, 35.10], // Hebron
  [31.25, 34.79]  // Beersheba
];

const ROUTE_JOSEPH = [
  [31.53, 35.10], // Hebron
  [32.21, 35.28], // Shechem
  [32.42, 35.24], // Dothan
  [32.45, 34.90], // Through Dothan Pass to Via Maris
  [32.05, 34.76], // Sharon Coastal Highway
  [31.50, 34.46], // Gaza
  [31.10, 33.80], // Northern Sinai coastal route
  [30.79, 31.83]  // Goshen / Rameses
];

const ROUTE_EXODUS = [
  [30.79, 31.83], // Goshen / Rameses
  [30.55, 32.25], // Succoth & Etham
  [30.02, 32.55], // Red Sea Crossing
  [29.58, 32.92], // Marah
  [29.33, 32.97], // Elim
  [28.90, 33.30], // Wilderness of Sin
  [28.71, 33.62], // Rephidim
  [28.54, 33.97], // Mount Sinai / Horeb
  [29.30, 34.30], // Northward departure
  [30.65, 34.42], // Kadesh-Barnea
  [30.30, 35.00], // Southward around Edom through Arabah
  [29.55, 34.97], // Way of the Red Sea / Gulf of Aqaba
  [30.62, 35.35], // Punon (Bronze Serpent)
  [31.00, 35.70], // Eastern border of Edom/Moab
  [31.47, 35.57], // Arnon River gorge
  [31.83, 35.68], // Plains of Moab / Shittim
  [31.77, 35.73]  // Mount Nebo
];

const ROUTE_CONQUEST = [
  [31.83, 35.68], // Plains of Moab / Shittim
  [31.87, 35.54], // Jordan River Crossing
  [31.88, 35.50], // Gilgal
  [31.86, 35.45], // Jericho
  [31.91, 35.26], // Ai
  [32.21, 35.28], // Mount Ebal / Gerizim (Shechem)
  [31.85, 35.19], // Gibeon (Battle of Aijalon)
  [32.50, 35.50], // Jordan valley northward campaign
  [33.02, 35.57]  // Hazor
];

function buildJourneyMap() {
  const container = document.getElementById('mapSvgContainer');
  const legendRow = document.getElementById('mapLegendRow');
  const zoomBtn = document.getElementById('mapZoomToggleBtn');
  if (!container) return;

  const lang = I18N.get();

  // ViewBox depending on currentViewport
  // Macro: Entire Fertile Crescent (0 0 1000 620)
  // Canaan: High-resolution regional zoom on Canaan, Sinai & Delta (15 220 340 385)
  const isCanaanFocus = currentViewport === 'canaan';
  const activeViewBox = isCanaanFocus ? "15 220 340 385" : "0 0 1000 620";

  // Filter stations based on currentEra
  const visibleStations = STATIONS.filter(st => currentEra === 'all' || st.era === currentEra);

  // Scale parameters for markers depending on zoom
  const rHalo = isCanaanFocus ? 4.2 : 7.5;
  const rDot = isCanaanFocus ? 2.6 : 4.8;
  const rInner = isCanaanFocus ? 1.0 : 1.8;
  const fontSize = isCanaanFocus ? 4.6 : 8.5;
  const labelOffsetX = isCanaanFocus ? 5 : 9;
  const labelOffsetY = isCanaanFocus ? 1.8 : 3.2;

  // Render SVG Map
  container.innerHTML = `
    <svg id="journeyMapSvg" viewBox="${activeViewBox}" xmlns="http://www.w3.org/2000/svg" style="background:#F5F3EE;border-radius:12px;">
      <defs>
        <linearGradient id="seaGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#C5E0ED"/>
          <stop offset="100%" stop-color="#93C5DE"/>
        </linearGradient>
        <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#EFECE5"/>
          <stop offset="100%" stop-color="#E2DCD1"/>
        </linearGradient>
        <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" flood-color="#2B2B2B" flood-opacity="0.25"/>
        </filter>
      </defs>

      <!-- Base Landmass -->
      <rect width="${SVG_W}" height="${SVG_H}" fill="url(#landGrad)"/>

      <!-- ── HYDROGRAPHY (Water Bodies) ── -->
      <!-- Mediterranean Sea -->
      <path d="${polylineToPath(MED_COAST)} Z" fill="url(#seaGrad)" opacity="0.95"/>
      <text x="${isCanaanFocus ? 80 : 120}" y="${isCanaanFocus ? 280 : 120}" font-size="${isCanaanFocus ? 8 : 13}" fill="#3D738A" font-weight="700" letter-spacing="2">
        ${lang === 'zh' ? '大海 / 地中海 (Great Sea)' : 'Mediterranean Sea'}
      </text>

      <!-- Persian Gulf (South-East) -->
      <path d="M 960,450 Q 980,440 1000,450 L 1000,620 L 880,620 Q 920,530 960,450 Z" fill="url(#seaGrad)" opacity="0.95"/>
      <text x="910" y="580" font-size="11" fill="#3D738A" font-weight="700">${lang === 'zh' ? '波斯灣' : 'Persian Gulf'}</text>

      <!-- Red Sea - Gulf of Suez -->
      <path d="${polylineToPath(GULF_SUEZ)} Z" fill="url(#seaGrad)" opacity="0.95"/>
      <text x="128" y="520" font-size="${isCanaanFocus ? 4.5 : 8}" fill="#3D738A" font-weight="600" transform="rotate(70 128 520)">${lang === 'zh' ? '蘇伊士灣' : 'Gulf of Suez'}</text>

      <!-- Red Sea - Gulf of Aqaba -->
      <path d="${polylineToPath(GULF_AQABA)} Z" fill="url(#seaGrad)" opacity="0.95"/>
      <text x="238" y="520" font-size="${isCanaanFocus ? 4.5 : 8}" fill="#3D738A" font-weight="600" transform="rotate(-78 238 520)">${lang === 'zh' ? '亞喀巴灣' : 'Gulf of Aqaba'}</text>

      <!-- Dead Sea -->
      <path d="${polylineToPath(DEAD_SEA)} Z" fill="url(#seaGrad)"/>
      <text x="${isCanaanFocus ? 281 : 282}" y="360" font-size="${isCanaanFocus ? 4.5 : 7.5}" fill="#3D738A" font-weight="600">${lang === 'zh' ? '死海' : 'Dead Sea'}</text>

      <!-- Sea of Galilee -->
      <path d="${polylineToPath(GALILEE)} Z" fill="url(#seaGrad)"/>
      <text x="${isCanaanFocus ? 287 : 290}" y="278" font-size="${isCanaanFocus ? 4.2 : 7}" fill="#3D738A" font-weight="600">${lang === 'zh' ? '加利利海' : 'Galilee'}</text>

      <!-- Jordan River (Direct connection from Galilee to Dead Sea) -->
      <path d="M 281.7 282.2 L 277.8 337.8" fill="none" stroke="#68A5BF" stroke-width="${isCanaanFocus ? 1.6 : 2.5}" stroke-linecap="round"/>
      <text x="${isCanaanFocus ? 282 : 284}" y="310" font-size="${isCanaanFocus ? 3.8 : 7}" fill="#3D738A" font-weight="600">${lang === 'zh' ? '約旦河' : 'Jordan'}</text>

      <!-- Euphrates River -->
      <path d="${polylineToPath(EUPHRATES)}" fill="none" stroke="#68A5BF" stroke-width="2.8" stroke-linecap="round" opacity="0.8"/>
      <text x="640" y="210" font-size="10" fill="#3D738A" font-weight="700" transform="rotate(35 640 210)">${lang === 'zh' ? '幼發拉底河 / 伯拉大河 (Euphrates)' : 'Euphrates River'}</text>

      <!-- Tigris River -->
      <path d="${polylineToPath(TIGRIS)}" fill="none" stroke="#7EB3CB" stroke-width="2.2" stroke-linecap="round" opacity="0.65"/>
      <text x="735" y="190" font-size="9" fill="#4B8299" font-weight="600" transform="rotate(45 735 190)">${lang === 'zh' ? '底格里斯河 (Tigris)' : 'Tigris River'}</text>

      <!-- Nile Delta Streams -->
      <path d="M 50 440 Q 65 400 73 380 M 40 430 Q 55 395 65 375" fill="none" stroke="#7EB3CB" stroke-width="${isCanaanFocus ? 1.5 : 2.2}" opacity="0.7"/>
      <text x="30" y="415" font-size="${isCanaanFocus ? 6 : 10.5}" fill="#2E6278" font-weight="700">${lang === 'zh' ? '尼羅河三角洲 / 埃及' : 'Nile Delta / Egypt'}</text>

      <!-- ── MOUNTAIN PEAKS ── -->
      <!-- Mount Sinai (Horeb) -->
      <path d="M 188 533 L 193 523 L 198 533 Z" fill="#C8A96A" stroke="#B8995A" stroke-width="0.8"/>
      <text x="193" y="${isCanaanFocus ? 538 : 542}" font-size="${isCanaanFocus ? 4.2 : 7.5}" fill="#78716C" text-anchor="middle" font-weight="600">${lang === 'zh' ? '西奈山' : 'Mt Sinai'}</text>

      <!-- Mount Nebo -->
      <path d="M 288 341 L 291 334 L 294 341 Z" fill="#C8A96A" stroke="#B8995A" stroke-width="0.8"/>
      <text x="${isCanaanFocus ? 297 : 302}" y="339" font-size="${isCanaanFocus ? 4.2 : 7.5}" fill="#78716C" font-weight="600">${lang === 'zh' ? '尼波山' : 'Mt Nebo'}</text>

      <!-- ── HISTORICAL ROUTE PATHS (True Cartography) ── -->
      <!-- 1. Patriarchs Route (Ur -> Haran -> Shechem -> Bethel -> Hebron -> Beersheba) -->
      <path id="route-patriarchs"
        d="${polylineToPath(ROUTE_PATRIARCHS)}"
        fill="none" stroke="${ERA_COLORS.patriarchs}" stroke-width="${currentEra === 'patriarchs' ? (isCanaanFocus ? 2.5 : 4.0) : (isCanaanFocus ? 1.2 : 2.2)}"
        stroke-dasharray="${isCanaanFocus ? '4,2' : '6,3'}" stroke-linecap="round" stroke-linejoin="round"
        opacity="${currentEra === 'all' || currentEra === 'patriarchs' ? 0.95 : 0.2}" />

      <!-- 2. Joseph Route (Hebron -> Dothan -> Coastal Highway -> Goshen) -->
      <path id="route-joseph"
        d="${polylineToPath(ROUTE_JOSEPH)}"
        fill="none" stroke="${ERA_COLORS.joseph}" stroke-width="${currentEra === 'joseph' ? (isCanaanFocus ? 2.5 : 4.0) : (isCanaanFocus ? 1.2 : 2.2)}"
        stroke-dasharray="${isCanaanFocus ? '4,2' : '5,3'}" stroke-linecap="round" stroke-linejoin="round"
        opacity="${currentEra === 'all' || currentEra === 'joseph' ? 0.95 : 0.2}" />

      <!-- 3. Exodus & Wilderness Route (Goshen -> Red Sea -> Sinai -> Kadesh -> Moab) -->
      <path id="route-exodus"
        d="${polylineToPath(ROUTE_EXODUS)}"
        fill="none" stroke="${ERA_COLORS.exodus}" stroke-width="${currentEra === 'exodus' ? (isCanaanFocus ? 2.5 : 4.0) : (isCanaanFocus ? 1.2 : 2.2)}"
        stroke-dasharray="${isCanaanFocus ? '4,2' : '6,3'}" stroke-linecap="round" stroke-linejoin="round"
        opacity="${currentEra === 'all' || currentEra === 'exodus' ? 0.95 : 0.2}" />

      <!-- 4. Conquest Route (Moab -> Jordan/Gilgal -> Jericho -> Ai/Ebal -> Gibeon -> Hazor) -->
      <path id="route-conquest"
        d="${polylineToPath(ROUTE_CONQUEST)}"
        fill="none" stroke="${ERA_COLORS.conquest}" stroke-width="${currentEra === 'conquest' ? (isCanaanFocus ? 2.5 : 4.0) : (isCanaanFocus ? 1.2 : 2.2)}"
        stroke-dasharray="${isCanaanFocus ? '4,2' : '5,2.5'}" stroke-linecap="round" stroke-linejoin="round"
        opacity="${currentEra === 'all' || currentEra === 'conquest' ? 0.95 : 0.2}" />

      <!-- ── STATION MARKERS (Mathematically Projected) ── -->
      <g id="stationMarkersGroup">
        ${visibleStations.map(st => {
          const [sx, sy] = project(st.lat, st.lon);
          const color = ERA_COLORS[st.era] || '#2B2B2B';
          const globalIdx = STATIONS.findIndex(s => s.id === st.id);
          const shortName = lang === 'zh' ? st.name_zh.split(' ')[0] : st.name_en.split(' ')[0];

          return `
            <g class="map-station-node" id="mapNode_${st.id}" data-id="${st.id}" data-idx="${globalIdx}" style="cursor:pointer">
              <circle class="st-halo" cx="${sx}" cy="${sy}" r="${rHalo}" fill="white" filter="url(#mapShadow)"/>
              <circle class="st-dot" cx="${sx}" cy="${sy}" r="${rDot}" fill="${color}"/>
              <circle cx="${sx}" cy="${sy}" r="${rInner}" fill="white"/>
              <text x="${sx + labelOffsetX}" y="${sy + labelOffsetY}" font-size="${fontSize}" font-weight="700" fill="#2B2B2B" font-family="Noto Sans TC, Poppins, sans-serif"
                    paint-order="stroke" stroke="#F5F3EE" stroke-width="${isCanaanFocus ? 1.5 : 2.5}" stroke-linecap="round" stroke-linejoin="round">
                ${globalIdx + 1}. ${shortName}
              </text>
            </g>
          `;
        }).join('')}
      </g>
    </svg>
  `;

  // Render Legend
  if (legendRow) {
    legendRow.innerHTML = `
      <div class="map-leg-item">
        <span class="map-leg-dot" style="background:${ERA_COLORS.patriarchs}"></span>
        <span>${lang === 'zh' ? '列祖時期 (吾珥→哈蘭→迦南)' : 'Patriarchs (Ur → Canaan)'}</span>
      </div>
      <div class="map-leg-item">
        <span class="map-leg-dot" style="background:${ERA_COLORS.joseph}"></span>
        <span>${lang === 'zh' ? '約瑟生平 (迦南→埃及歌珊)' : 'Joseph (Canaan → Egypt)'}</span>
      </div>
      <div class="map-leg-item">
        <span class="map-leg-dot" style="background:${ERA_COLORS.exodus}"></span>
        <span>${lang === 'zh' ? '出埃及與曠野四十載' : 'Exodus & Wilderness'}</span>
      </div>
      <div class="map-leg-item">
        <span class="map-leg-dot" style="background:${ERA_COLORS.conquest}"></span>
        <span>${lang === 'zh' ? '征服迦南美地' : 'Conquest of Canaan'}</span>
      </div>
    `;
  }

  // Update Zoom Toggle Button Text
  if (zoomBtn) {
    if (isCanaanFocus) {
      zoomBtn.textContent = lang === 'zh' ? '🌍 視野：新月沃土全景 (Macro View)' : '🌍 View: Fertile Crescent Macro';
      zoomBtn.style.background = 'rgba(74,93,115,.12)';
      zoomBtn.style.color = '#4A5D73';
      zoomBtn.style.borderColor = '#4A5D73';
    } else {
      zoomBtn.textContent = lang === 'zh' ? '🔍 視野：迦南與西奈特寫 (Levant Detail)' : '🔍 View: Canaan & Sinai Detail';
      zoomBtn.style.background = 'rgba(200,169,106,.12)';
      zoomBtn.style.color = '#8A6D3B';
      zoomBtn.style.borderColor = '#C8A96A';
    }
  }

  // Attach click events on SVG nodes
  container.querySelectorAll('.map-station-node').forEach(node => {
    node.addEventListener('click', () => {
      const idx = Number(node.dataset.idx);
      selectStation(idx);
    });
  });

  // Select initial station
  if (visibleStations.length > 0) {
    const firstIdx = STATIONS.findIndex(s => s.id === visibleStations[0].id);
    selectStation(firstIdx !== -1 ? firstIdx : 0);
  }
}

function selectStation(idx) {
  const st = STATIONS[idx];
  if (!st) return;
  activeStationIdx = idx;

  const lang = I18N.get();
  const card = document.getElementById('stationCard');
  if (!card) return;

  const isCanaanFocus = currentViewport === 'canaan';
  const rActiveHalo = isCanaanFocus ? 6.0 : 11.0;
  const rNormalHalo = isCanaanFocus ? 4.2 : 7.5;
  const rActiveDot = isCanaanFocus ? 3.8 : 6.5;
  const rNormalDot = isCanaanFocus ? 2.6 : 4.8;

  // Highlight active node in SVG
  document.querySelectorAll('.map-station-node').forEach(node => {
    const i = Number(node.dataset.idx);
    const halo = node.querySelector('.st-halo');
    const dot = node.querySelector('.st-dot');
    if (i === idx) {
      if (halo) {
        halo.setAttribute('r', String(rActiveHalo));
        halo.setAttribute('stroke', ERA_COLORS[st.era] || '#C8A96A');
        halo.setAttribute('stroke-width', isCanaanFocus ? '1.5' : '2.5');
      }
      if (dot) dot.setAttribute('r', String(rActiveDot));
    } else {
      if (halo) {
        halo.setAttribute('r', String(rNormalHalo));
        halo.removeAttribute('stroke');
        halo.removeAttribute('stroke-width');
      }
      if (dot) dot.setAttribute('r', String(rNormalDot));
    }
  });

  // Render card details
  const title = lang === 'zh' ? st.name_zh : st.name_en;
  const summary = lang === 'zh' ? st.summary_zh : st.summary_en;
  const ref = lang === 'zh' ? st.ref_zh : (st.ref_en || st.ref_zh);
  const eraLabel = getEraLabel(st.era, lang);
  const eraColor = ERA_COLORS[st.era] || '#2B2B2B';

  let lawsHtml = '';
  if (st.commandments && st.commandments.length > 0 && typeof COMMANDMENTS !== 'undefined') {
    const cmds = COMMANDMENTS.filter(c => st.commandments.includes(c.id));
    lawsHtml = `
      <div class="st-laws-title" style="margin-top:14px;color:${eraColor}">${lang === 'zh' ? `在此處頒布/關聯的律法誡命 (${cmds.length})` : `Laws & Commandments Given Here (${cmds.length})`}</div>
      <div style="display:flex;flex-direction:column;gap:6px;max-height:220px;overflow-y:auto;padding-right:2px;">
        ${cmds.map(c => `
          <div class="st-law-item" data-id="${c.id}" title="${lang === 'zh' ? '點擊查看誡命詳情' : 'Click to view commandment details'}">
            <strong>#${c.id}</strong> ${lang === 'zh' ? (c.title_zh || c.title_en) : c.title_en}
            <div style="font-size:9.5px;color:var(--muted)">${lang === 'zh' ? c.ref_zh : c.ref}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  card.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
      <span class="st-num">${lang === 'zh' ? `第 ${idx + 1} 站點 · 救贖軌跡` : `Station #${idx + 1}`}</span>
      <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:${eraColor};color:white;">${eraLabel}</span>
    </div>
    <div class="st-title">${title}</div>
    <div class="st-ref">📖 ${ref}</div>
    <div style="font-size:10px;color:var(--gold);margin-bottom:8px;">📍 座標：${st.lat.toFixed(2)}°N, ${st.lon.toFixed(2)}°E</div>
    <div class="st-desc">${summary}</div>
    ${lawsHtml}
  `;

  // Wire law item clicks to open modal
  card.querySelectorAll('.st-law-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      if (id && window.openCmdModal) window.openCmdModal(id);
    });
  });
}

function getEraLabel(era, lang) {
  if (era === 'patriarchs') return lang === 'zh' ? '列祖時期' : 'Patriarchs';
  if (era === 'joseph') return lang === 'zh' ? '約瑟生平' : 'Joseph';
  if (era === 'exodus') return lang === 'zh' ? '出埃及與曠野' : 'Exodus';
  if (era === 'conquest') return lang === 'zh' ? '征服迦南' : 'Conquest';
  return '';
}

document.addEventListener('DOMContentLoaded', () => {
  buildJourneyMap();

  // Historical Era filter buttons
  const eraBar = document.getElementById('mapEraFilters');
  if (eraBar) {
    eraBar.querySelectorAll('.map-era-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        eraBar.querySelectorAll('.map-era-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentEra = btn.dataset.era;

        // Auto-adapt viewport according to era
        if (currentEra === 'all' || currentEra === 'patriarchs') {
          currentViewport = 'macro';
        } else {
          currentViewport = 'canaan';
        }

        buildJourneyMap();
      });
    });
  }

  // Viewport Zoom Toggle Button
  const zoomBtn = document.getElementById('mapZoomToggleBtn');
  if (zoomBtn) {
    zoomBtn.addEventListener('click', () => {
      currentViewport = currentViewport === 'macro' ? 'canaan' : 'macro';
      buildJourneyMap();
    });
  }
});

window.renderJourneyMap = buildJourneyMap;

})();


