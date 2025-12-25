# 煉丹系統 (Alchemy System)

## 系統概述 (System Overview)

煉丹系統管理丹藥的煉製過程，包括配方學習、材料收集、丹爐管理和煉丹機制。

The Alchemy System manages the pill crafting process, including formula learning, material gathering, furnace management, and crafting mechanics.

## 主要組件 (Main Components)

### 1. pill-crafting.js - 煉丹機制
管理煉丹的實際過程和結果。

Manages the actual pill crafting process and results.

**煉丹階段 (Crafting States):**
1. 準備階段 (Preparation) - 準備材料和丹爐
2. 材料處理 (Material Processing) - 處理和提煉材料
3. 融合階段 (Fusion) - 材料融合
4. 凝丹階段 (Condensation) - 凝聚成丹
5. 完成階段 (Completion) - 收丹

**煉丹結果 (Crafting Results):**
- 完美 (Perfect) - 神品丹藥，數量×1.5
- 極品 (Excellent) - 上等丹藥，數量×1.2
- 成功 (Success) - 標準丹藥
- 中等 (Mediocre) - 品質較差，數量×0.7
- 失敗 (Failure) - 材料損毀
- 炸爐 (Explosion) - 丹爐損壞，角色受傷

**煉丹控制 (Crafting Control):**
- 增加火力 (Increase Fire) - 提升品質但降低穩定
- 減少火力 (Decrease Fire) - 提升穩定但降低品質
- 添加輔料 (Add Auxiliary) - 提升品質
- 穩定 (Stabilize) - 大幅提升穩定性
- 專注 (Focus) - 小幅提升品質

### 2. formula.js - 丹方系統
管理丹藥配方的學習和研究。

Manages pill formula learning and research.

**配方類別 (Formula Categories):**
- 治療類 (Healing)
- 修煉類 (Cultivation)
- 突破類 (Breakthrough)
- 增強類 (Enhancement)
- 恢復類 (Recovery)
- 特殊類 (Special)

**配方稀有度 (Formula Rarities):**
- 常見配方 (Common)
- 罕見配方 (Uncommon)
- 稀有配方 (Rare)
- 史詩配方 (Epic)
- 傳說配方 (Legendary)
- 仙級配方 (Immortal)

**配方獲取方式 (Discovery Methods):**
- 購買 (Purchase) - 從商店購買
- 任務獎勵 (Quest Reward)
- 研究 (Research) - 改良現有配方
- 組合 (Combination) - 組合多個配方
- 頓悟 (Enlightenment) - 隨機獲得

### 3. furnace.js - 丹爐管理
管理煉丹爐的屬性和升級。

Manages alchemy furnace properties and upgrades.

**丹爐品階 (Furnace Grades):**
- 凡品丹爐 (Mortal) - 無加成
- 靈品丹爐 (Spiritual) - +10%加成
- 法寶丹爐 (Treasure) - +25%加成
- 天階丹爐 (Heaven) - +50%加成
- 神品丹爐 (Divine) - +100%加成
- 仙品丹爐 (Immortal) - +200%加成

**丹爐類型 (Furnace Types):**
- 標準型 (Standard) - 平衡型
- 火屬性專精 (Fire) - 火系丹藥加成
- 木屬性專精 (Wood) - 木系丹藥加成
- 快速煉製 (Rapid) - 縮短煉製時間
- 穩定型 (Stable) - 提高成功率
- 多爐同煉 (Multi) - 可同時煉製多爐

**丹爐屬性 (Furnace Attributes):**
- 穩定加成 (Stability Bonus)
- 品質加成 (Quality Bonus)
- 速度加成 (Speed Bonus)
- 產量加成 (Yield Bonus)

### 4. material-gather.js - 材料收集
管理煉丹材料的採集和獲取。

Manages alchemy material gathering and acquisition.

**採集方式 (Gathering Methods):**
- 採集 (Harvest) - 採集靈草
- 挖掘 (Mining) - 挖掘礦石
- 狩獵 (Hunting) - 獵取妖獸材料
- 購買 (Purchase) - 商店購買
- 任務 (Quest) - 任務獎勵
- 交易 (Trade) - 與NPC交易

**採集地點特性 (Location Properties):**
- 材料種類和稀有度
- 等級要求
- 所需工具
- 刷新時間

## 核心功能 (Core Features)

### 煉丹過程 (Pill Crafting)
```javascript
import PillCraftingSystem from './pill-crafting.js';

const craftingSystem = new PillCraftingSystem();

// Start crafting
const session = craftingSystem.startCrafting(character, formula, furnace, materials);

// Progress crafting
const result = craftingSystem.progressCrafting(session.sessionId, {
  type: 'increase_fire'
});

// Complete crafting automatically when progress reaches 100%
```

### 配方學習和研究 (Formula Learning and Research)
```javascript
import FormulaSystem from './formula.js';

const formulaSystem = new FormulaSystem();

// Learn formula
formulaSystem.learnFormula(character, formulaId);

// Research new formula
const research = formulaSystem.researchFormula(character, baseFormulaId, {
  materials: { additionalMaterial: 1 }
});

// Combine formulas
const combined = formulaSystem.combineFormulas(character, [formulaId1, formulaId2]);
```

### 丹爐管理 (Furnace Management)
```javascript
import FurnaceSystem from './furnace.js';

const furnaceSystem = new FurnaceSystem();

// Create furnace
const furnace = furnaceSystem.createFurnace({
  name: '八卦爐',
  grade: FURNACE_GRADES.DIVINE,
  type: FURNACE_TYPES.STABLE
});

// Upgrade furnace
furnaceSystem.upgradeFurnace(furnace, materials);

// Get bonuses
const bonuses = furnaceSystem.getFurnaceBonuses(furnace);
```

### 材料採集 (Material Gathering)
```javascript
import MaterialGatherSystem from './material-gather.js';

const gatherSystem = new MaterialGatherSystem();

// Register location
gatherSystem.registerLocation({
  name: '藥王谷',
  type: 'herb_field',
  materials: [...]
});

// Start gathering
const gathering = gatherSystem.startGathering(character, locationId);

// Progress gathering
const progress = gatherSystem.progressGathering(gathering.gatheringId);
```

## 煉丹技巧 (Crafting Tips)

### 提升成功率 (Increase Success Rate)
1. 使用高品階丹爐
2. 提升煉丹技能等級
3. 在適當時機調整火力
4. 使用穩定型丹爐
5. 提升丹道領悟

### 提升丹藥品質 (Increase Pill Quality)
1. 使用高品質材料
2. 適時增加火力
3. 添加輔助材料
4. 保持高專注度
5. 提升煉丹技能

### 避免炸爐 (Avoid Explosion)
1. 保持穩定性在安全範圍
2. 不要過度增加火力
3. 及時使用穩定技能
4. 選擇適合自己等級的配方
5. 使用穩定型丹爐

## 與其他系統的互動 (Interactions with Other Systems)

### 寶物系統 (Treasure System)
- 材料來自天材地寶系統
- 煉製出的丹藥進入丹藥系統

### 修煉系統 (Cultivation System)
- 丹道領悟提升煉丹能力
- 境界影響可煉製的丹藥等級

### 角色系統 (Character System)
- 煉丹技能隨經驗提升
- 屬性影響煉丹成功率

### 任務系統 (Quest System)
- 任務可獲得配方和材料
- 特殊任務解鎖稀有配方

## TODO 列表

- [ ] 實現丹藥副作用系統 (Implement pill side effects)
- [ ] 添加煉丹心得系統 (Add alchemy insights system)
- [ ] 實現配方拍賣系統 (Implement formula auction)
- [ ] 添加丹劫機制 (Add pill tribulation)
- [ ] 實現丹靈系統 (Implement pill spirit system)
- [ ] 添加煉丹比賽 (Add alchemy competitions)
- [ ] 實現師徒傳承系統 (Implement master-apprentice system)
- [ ] 添加煉丹宗門任務 (Add sect alchemy missions)

## 參考資料 (References)

- 配方數據請參考 `src/data/alchemy/formulas.json`
- 材料數據請參考 `src/data/treasures/materials.json`
- 煉丹完整指南請參考 `docs/TREASURE_GUIDE.md`
