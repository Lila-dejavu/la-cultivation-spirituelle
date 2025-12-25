# 寶物系統 (Treasure System)

## 系統概述 (System Overview)

寶物系統管理遊戲中的各種裝備、丹藥、靈石、材料和神器，包含裝備系統、煉器系統、丹藥系統等關鍵要素。

The Treasure System manages various equipment, elixirs, spirit stones, materials, and artifacts in the game, including equipment system, refining system, elixir system, and other key elements.

## 主要組件 (Main Components)

### 1. equipment.js - 法寶裝備系統
管理角色的裝備和法寶。

Manages character equipment and magical treasures.

**裝備類型 (Equipment Types):**
- 武器 (Weapon)
- 護甲 (Armor)
- 飾品 (Accessory)
- 飛行法寶 (Flying Treasure)
- 防禦法寶 (Defensive Treasure)

**裝備品階 (Equipment Grades):**
- 凡品 (Mortal) - 基礎裝備
- 靈器 (Spiritual) - 靈氣灌注
- 法寶 (Treasure) - 法力凝聚
- 天器 (Heaven) - 天地認可
- 神器 (Divine) - 神力加持
- 仙器 (Immortal) - 仙界至寶
- 混沌至寶 (Chaos) - 開天闢地

**裝備槽位 (Equipment Slots):**
- 主手、副手 (Main Hand, Off Hand)
- 頭部、胸甲、腿部、鞋子 (Head, Chest, Legs, Feet)
- 戒指×2、護身符 (Ring×2, Amulet)
- 飛行法寶 (Flying Treasure)

### 2. elixir.js - 丹藥系統
管理丹藥的使用和效果。

Manages elixir usage and effects.

**丹藥類型 (Elixir Types):**
- 治療丹 (Healing Pill)
- 靈力丹 (Spiritual Power Pill)
- 突破丹 (Breakthrough Pill)
- 屬性丹 (Attribute Pill)
- 悟道丹 (Comprehension Pill)
- 延壽丹 (Longevity Pill)
- 解毒丹 (Antidote Pill)

**丹藥品階 (Elixir Grades):**
- 下品 (Low) - 1.0x效力
- 中品 (Middle) - 2.0x效力
- 上品 (High) - 3.5x效力
- 極品 (Supreme) - 6.0x效力
- 神品 (Divine) - 10.0x效力
- 仙品 (Immortal) - 20.0x效力

**丹毒系統 (Toxicity System):**
- 服用丹藥會累積丹毒
- 丹毒過高會影響效果甚至造成傷害
- 需要通過冥想或解毒丹清除

### 3. spirit-stone.js - 靈石系統
管理靈石作為貨幣和修煉資源。

Manages spirit stones as currency and cultivation resources.

**靈石品階 (Spirit Stone Grades):**
- 下品靈石 (Low) - 1靈力
- 中品靈石 (Middle) - 100靈力
- 上品靈石 (High) - 10,000靈力
- 極品靈石 (Supreme) - 1,000,000靈力
- 神品靈石 (Divine) - 100,000,000靈力

**特殊屬性靈石 (Attributed Spirit Stones):**
- 五行靈石：金、木、水、火、土
- 特殊靈石：雷、風、冰、暗、光
- 與靈根匹配使用有額外加成

**靈石用途 (Spirit Stone Uses):**
- 交易貨幣 (Trading currency)
- 吸收修煉 (Cultivation absorption)
- 陣法能源 (Formation power)
- 煉器煉丹 (Refining and alchemy)

### 4. heavenly-material.js - 天材地寶系統
管理稀有材料的收集和使用。

Manages rare material collection and usage.

**材料類型 (Material Types):**
- 靈草 (Spiritual Herb)
- 礦石 (Ore)
- 妖獸內丹 (Beast Core)
- 骨骼、鱗片 (Bone, Scale)
- 靈木 (Spirit Wood)
- 晶石 (Crystal)
- 靈液 (Spirit Liquid)

**材料品階 (Material Grades):**
- 普通 (Common) - 50%掉落率
- 罕見 (Uncommon) - 30%掉落率
- 稀有 (Rare) - 15%掉落率
- 史詩 (Epic) - 4%掉落率
- 傳說 (Legendary) - 0.9%掉落率
- 神話 (Mythical) - 0.1%掉落率

### 5. artifact.js - 神器系統
管理神器和傳說寶物。

Manages divine artifacts and legendary treasures.

**神器類型 (Artifact Types):**
- 攻擊型 (Offensive)
- 防禦型 (Defensive)
- 輔助型 (Support)
- 領域型 (Domain)
- 封印型 (Seal)
- 陣法型 (Formation)

**神器等級 (Artifact Ranks):**
- 偽神器 (Pseudo-Artifact)
- 下品神器 (Low Divine)
- 中品神器 (Middle Divine)
- 上品神器 (High Divine)
- 極品神器 (Supreme Divine)
- 混沌至寶 (Chaos Treasure)
- 先天至寶 (Primordial Treasure)

**神器狀態 (Artifact States):**
- 沉睡 (Dormant) - 未認主
- 甦醒中 (Awakening) - 初步認主
- 活躍 (Active) - 部分覺醒
- 共鳴 (Resonating) - 完美共鳴
- 超越 (Transcendent) - 完全覺醒

**認主系統 (Master Recognition):**
- 認主程度：0-100%
- 影響可使用的能力
- 需要通過戰鬥和修煉提升

### 6. refining.js - 煉器系統
管理裝備和法寶的精煉強化。

Manages equipment and artifact refinement.

**精煉類型 (Refinement Types):**
- 等級提升 (Level Up) - 提升精煉等級
- 開孔 (Socket) - 增加寶石孔位
- 屬性強化 (Enhancement) - 強化特定屬性
- 品質提升 (Quality) - 提升裝備品階

**精煉結果 (Refinement Results):**
- 大成功 (Great Success) - 等級+2
- 成功 (Success) - 等級+1
- 失敗 (Failure) - 保持不變
- 損壞 (Break) - 等級-1，耐久降低

**精煉成功率 (Success Rate):**
- 基礎成功率隨精煉等級遞減
- +10以上成功率減半
- +15以上再次減半
- 可使用保護道具防止降級

## 核心功能 (Core Features)

### 裝備管理 (Equipment Management)
```javascript
import EquipmentSystem from './equipment.js';

const equipmentSystem = new EquipmentSystem();
const sword = equipmentSystem.createEquipment({
  name: '飛虹劍',
  type: EQUIPMENT_TYPES.WEAPON,
  slot: EQUIPMENT_SLOTS.MAIN_HAND,
  grade: EQUIPMENT_GRADES.TREASURE,
  attributes: { attack: 500, speed: 30 }
});

equipmentSystem.equipItem(character, sword);
```

### 丹藥使用 (Elixir Usage)
```javascript
import ElixirSystem from './elixir.js';

const elixirSystem = new ElixirSystem();
const healingPill = elixirSystem.createElixir({
  name: '回春丹',
  type: ELIXIR_TYPES.HEALING,
  grade: ELIXIR_GRADES.HIGH,
  effects: { healing: 1000 }
});

const result = elixirSystem.useElixir(character, healingPill);
```

### 靈石管理 (Spirit Stone Management)
```javascript
import SpiritStoneSystem from './spirit-stone.js';

const stoneSystem = new SpiritStoneSystem();
stoneSystem.addSpiritStones(character, 'middle', 100);
stoneSystem.cultivateWithSpiritStones(character, 'high', 10);
stoneSystem.pay(character, 10000); // Auto-converts stones
```

### 材料收集 (Material Gathering)
```javascript
import HeavenlyMaterialSystem from './heavenly-material.js';

const materialSystem = new HeavenlyMaterialSystem();
const result = materialSystem.gatherMaterial(character, location);
materialSystem.refineMaterial(character, materialId, 10); // Upgrade quality
```

### 神器認主 (Artifact Binding)
```javascript
import ArtifactSystem from './artifact.js';

const artifactSystem = new ArtifactSystem();
const artifact = artifactSystem.createArtifact({
  name: '混沌鐘',
  type: ARTIFACT_TYPES.DOMAIN,
  rank: ARTIFACT_RANKS.CHAOS
});

const bindResult = artifactSystem.bindArtifact(character, artifact);
artifactSystem.useArtifactAbility(character, artifact.id, abilityId);
```

### 煉器強化 (Refining)
```javascript
import RefiningSystem from './refining.js';

const refiningSystem = new RefiningSystem();
const result = refiningSystem.refineEquipment(character, equipment, materials, forge);
refiningSystem.addSocket(character, equipment);
refiningSystem.embedGem(equipment, socketId, gem);
```

## 與其他系統的互動 (Interactions with Other Systems)

### 修煉系統 (Cultivation System)
- 突破丹提高突破成功率
- 靈石用於修煉
- 神器提供修煉加成

### 煉丹系統 (Alchemy System)
- 材料用於煉製丹藥
- 丹爐影響煉丹品質

### 戰鬥系統 (Combat System)
- 裝備提供戰鬥屬性
- 神器能力可在戰鬥中使用

### 角色系統 (Character System)
- 裝備需求基於角色等級和境界
- 神器認主受角色屬性影響

### 任務系統 (Quest System)
- 任務獎勵包含裝備和材料
- 特殊任務可獲得神器

## TODO 列表

- [ ] 實現裝備套裝效果 (Implement equipment set bonuses)
- [ ] 添加寶石系統 (Add gem system)
- [ ] 實現裝備升階系統 (Implement equipment grade upgrade)
- [ ] 完善神器器靈系統 (Enhance artifact spirit system)
- [ ] 添加裝備外觀系統 (Add equipment appearance system)
- [ ] 實現裝備綁定和交易限制 (Implement binding and trade restrictions)
- [ ] 添加特殊效果觸發機制 (Add special effect triggers)
- [ ] 實現裝備耐久度修復 (Implement durability repair)
- [ ] 添加限時裝備和神器 (Add time-limited equipment and artifacts)

## 參考資料 (References)

- 詳細的寶物數據請參考 `src/data/treasures/`
- 寶物收集完整指南請參考 `docs/TREASURE_GUIDE.md`
- 煉器煉丹說明請參考 `docs/TREASURE_GUIDE.md`
