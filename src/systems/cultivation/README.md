# 修煉系統 (Cultivation System)

## 系統概述 (System Overview)

修煉系統是遊戲的核心機制，管理角色的修仙進程，包括境界提升、突破、靈根天賦、道悟和天劫等關鍵要素。

The Cultivation System is the core mechanic of the game, managing the character's immortal cultivation progression, including realm advancement, breakthrough, spiritual root talent, Dao comprehension, and heavenly tribulations.

## 主要組件 (Main Components)

### 1. realm-system.js - 境界系統
管理修煉境界的進階和屬性加成。

Manages cultivation realm progression and attribute bonuses.

**境界列表 (Realm List):**
- 凝氣期 (Qi Condensation) - Levels 1-40
- 築基期 (Foundation Establishment) - Levels 41-80
- 金丹期 (Golden Core) - Levels 81-120
- 元嬰期 (Nascent Soul) - Levels 121-160
- 化神期 (Soul Transformation) - Levels 161-200
- 合體期 (Body Integration) - Levels 201-240
- 渡劫期 (Tribulation Crossing) - Levels 241-280
- 大乘期 (Mahayana) - Levels 281-320

**每個境界分為四個階段 (Each realm has 4 stages):**
- 初期 (Early Stage)
- 中期 (Middle Stage)
- 後期 (Late Stage)
- 圓滿 (Peak Stage)

### 2. breakthrough.js - 突破系統
處理境界突破的機制和風險。

Handles realm breakthrough mechanics and risks.

**突破條件 (Breakthrough Requirements):**
- 達到當前境界的圓滿階段 (Reach peak stage of current realm)
- 充足的靈力 (Sufficient spiritual power)
- 足夠的悟性 (Adequate comprehension)
- 必要的突破資源 (Necessary breakthrough resources)

**突破結果 (Breakthrough Results):**
- 成功 (Success) - 突破到下一個境界
- 部分成功 (Partial) - 提升階段但未突破境界
- 失敗 (Failure) - 損失部分修為
- 嚴重失敗 (Critical Failure) - 走火入魔，身受重傷

### 3. spiritual-root.js - 靈根系統
管理角色的天生修煉天賦。

Manages character's innate cultivation talent.

**靈根類型 (Spiritual Root Types):**
- 天靈根 (Heavenly Root) - 最稀有，5倍修煉速度
- 單靈根 (Single Root) - 3倍修煉速度
- 變異靈根 (Mutant Root) - 特殊元素，2.5倍速度
- 雙靈根 (Dual Root) - 2倍修煉速度
- 三靈根 (Tri Root) - 1.5倍修煉速度
- 四靈根 (Quad Root) - 1.2倍修煉速度
- 五靈根 (Penta Root) - 基礎速度

**元素類型 (Element Types):**
- 五行：金、木、水、火、土 (Five Elements: Metal, Wood, Water, Fire, Earth)
- 特殊：雷、風、冰、暗、光 (Special: Thunder, Wind, Ice, Darkness, Light)

**靈根品質 (Root Quality):**
- 神品 (Divine) - 最高品質
- 天品 (Heaven Grade)
- 上品 (Superior)
- 普通 (Common)
- 凡品 (Mortal)

### 4. dao-comprehension.js - 道悟系統
管理對不同道的理解和掌握。

Manages understanding and mastery of different Dao paths.

**道的類型 (Dao Types):**
- 劍道 (Sword Dao)
- 丹道 (Alchemy Dao)
- 陣道 (Formation Dao)
- 符道 (Talisman Dao)
- 生命之道 (Life Dao)
- 死亡之道 (Death Dao)
- 時間之道 (Time Dao)
- 空間之道 (Space Dao)
- 因果之道 (Karma Dao)
- 混沌之道 (Chaos Dao)

**領悟等級 (Comprehension Levels):**
1. 初窺門徑 (Initiate) - Just beginning
2. 略有小成 (Novice) - Small achievement
3. 融會貫通 (Adept) - Thorough understanding
4. 大成境界 (Expert) - Great achievement
5. 登峰造極 (Master) - Peak mastery
6. 返璞歸真 (Grandmaster) - Return to simplicity
7. 天人合一 (Sage) - Unity with heaven
8. 道法自然 (Immortal) - Natural law

### 5. tribulation.js - 天劫系統
管理修煉過程中的天劫考驗。

Manages heavenly tribulation trials during cultivation.

**需要渡劫的境界 (Realms Requiring Tribulation):**
- 元嬰期 (Nascent Soul) - 3波劫雷
- 化神期 (Soul Transformation) - 6波劫雷
- 合體期 (Body Integration) - 9波劫雷
- 渡劫期 (Tribulation Crossing) - 12波劫雷
- 大乘期 (Mahayana) - 18波劫雷（九九天劫）

**天劫類型 (Tribulation Types):**
- 雷劫 (Thunder Tribulation)
- 心魔劫 (Heart Demon Tribulation)
- 元素劫 (Elemental Tribulation)
- 天火劫 (Heavenly Fire Tribulation)
- 九天神雷 (Nine Heaven Divine Thunder)

## 核心功能 (Core Features)

### 修煉進程 (Cultivation Progression)
```javascript
import RealmSystem from './realm-system.js';

const realmSystem = new RealmSystem();
const realmConfig = realmSystem.getRealmConfig('qi_condensation');
const bonuses = realmSystem.getRealmBonuses('foundation', 'peak');
```

### 境界突破 (Realm Breakthrough)
```javascript
import BreakthroughSystem from './breakthrough.js';

const breakthroughSystem = new BreakthroughSystem(realmSystem);
const result = breakthroughSystem.attemptBreakthrough(character, {
  elixir: breakthroughPill,
  location: spiritualVein,
  masterGuidance: true
});
```

### 靈根生成 (Spiritual Root Generation)
```javascript
import SpiritualRootSystem from './spiritual-root.js';

const rootSystem = new SpiritualRootSystem();
const spiritualRoot = rootSystem.generateSpiritualRoot();
const description = rootSystem.getSpiritualRootDescription(spiritualRoot);
```

### 道悟提升 (Dao Comprehension)
```javascript
import DaoComprehensionSystem from './dao-comprehension.js';

const daoSystem = new DaoComprehensionSystem();
daoSystem.addComprehension(character, 'sword', 100);
const enlightenment = daoSystem.triggerEnlightenment(character);
```

### 渡劫 (Tribulation)
```javascript
import TribulationSystem from './tribulation.js';

const tribulationSystem = new TribulationSystem();
const tribulation = tribulationSystem.initiateTribulation(character, 'nascent_soul');
const result = tribulationSystem.progressTribulation(tribulation.id, {
  artifact: protectionArtifact,
  formation: defenseFormation
});
```

## 與其他系統的互動 (Interactions with Other Systems)

### 角色系統 (Character System)
- 境界決定角色的基礎屬性 (Realm determines base attributes)
- 靈根影響修煉速度 (Spiritual root affects cultivation speed)
- 道悟提供額外加成 (Dao comprehension provides additional bonuses)

### 戰鬥系統 (Combat System)
- 境界差距影響傷害計算 (Realm difference affects damage calculation)
- 道悟增強技能威力 (Dao comprehension enhances skill power)
- 天劫淬體提供永久屬性 (Tribulation tempering provides permanent attributes)

### 寶物系統 (Treasure System)
- 突破需要特定丹藥和法寶 (Breakthrough requires specific elixirs and artifacts)
- 渡劫時裝備影響存活率 (Equipment affects survival rate during tribulation)

### 技能系統 (Skill System)
- 境界限制可學習的技能 (Realm limits learnable skills)
- 道悟解鎖特殊技能 (Dao comprehension unlocks special skills)

### 任務系統 (Quest System)
- 突破和渡劫可觸發特殊劇情 (Breakthrough and tribulation trigger special events)
- 道悟頓悟可產生隨機事件 (Dao enlightenment generates random events)

## TODO 列表

- [ ] 實現境界配置檔案載入 (Implement realm config file loading)
- [ ] 完善突破失敗的後果系統 (Enhance breakthrough failure consequence system)
- [ ] 添加更多特殊靈根類型 (Add more special spiritual root types)
- [ ] 實現道悟的視覺效果 (Implement visual effects for Dao comprehension)
- [ ] 完善天劫戰鬥機制 (Enhance tribulation combat mechanics)
- [ ] 添加閉關修煉系統 (Add secluded cultivation system)
- [ ] 實現修煉瓶頸機制 (Implement cultivation bottleneck mechanics)
- [ ] 添加逆天改命機制 (Add fate-defying mechanics)

## 參考資料 (References)

- 詳細的境界系統配置請參考 `src/data/realms/realm-config.json`
- 天劫詳細說明請參考 `docs/CULTIVATION_GUIDE.md`
- 道悟系統完整指南請參考 `docs/CULTIVATION_GUIDE.md`
