# 宗門系統 (Sect System)

## 系統概述 (System Overview)

宗門系統管理修仙宗門的運營、成員管理、貢獻度、宗門功法、師徒關係和宗門戰爭。

The Sect System manages cultivation sect operations, member management, contribution points, sect techniques, master-disciple relationships, and sect wars.

## 主要組件 (Main Components)

### 1. sect-manager.js - 宗門管理
管理宗門的創建、成員和設施。

Manages sect creation, members, and facilities.

**宗門等級 (Sect Ranks):**
- 小門派 (Minor) - 最多50人
- 中型宗門 (Medium) - 最多200人
- 大宗門 (Major) - 最多1000人
- 超級宗門 (Super) - 最多5000人
- 聖地 (Sacred) - 最多20000人

**宗門職位 (Sect Positions):**
- 掌門 (Sect Master)
- 長老 (Elder)
- 峰主 (Peak Master)
- 核心弟子 (Core Disciple)
- 內門弟子 (Inner Disciple)
- 外門弟子 (Outer Disciple)

**宗門設施 (Sect Facilities):**
- 藏經閣 (Library)
- 寶庫 (Treasury)
- 練功場 (Training Grounds)
- 煉丹堂 (Alchemy Hall)
- 煉器堂 (Refining Hall)

### 2. contribution.js - 貢獻度系統
管理宗門貢獻點數和獎勵兌換。

Manages sect contribution points and reward redemption.

**貢獻來源 (Contribution Sources):**
- 完成任務 (Mission)
- 捐獻資源 (Donation)
- 教導弟子 (Teaching)
- 宗門戰鬥 (Battle)
- 發現秘境 (Discovery)

**貢獻用途 (Contribution Uses):**
- 兌換功法 (Exchange techniques)
- 兌換寶物 (Exchange treasures)
- 兌換丹藥 (Exchange elixirs)
- 使用設施 (Use facilities)
- 晉升職位 (Promotion)

### 3. sect-skills.js - 宗門功法
管理宗門專屬的功法和技能。

Manages sect-exclusive techniques and skills.

**功法等級 (Skill Tiers):**
- 基礎功法 (Basic)
- 中級功法 (Intermediate)
- 高級功法 (Advanced)
- 核心功法 (Core)
- 不傳之秘 (Secret)

### 4. master-disciple.js - 師徒系統
管理師徒關係和傳承。

Manages master-disciple relationships and inheritance.

**師徒互動 (Master-Disciple Interactions):**
- 收徒 (Accept Disciple)
- 傳授功法 (Teach Techniques)
- 賞賜寶物 (Grant Treasures)
- 指點修煉 (Guide Cultivation)

**親密度系統 (Affinity System):**
- 親密度影響教學效果
- 高親密度解鎖特殊傳承
- 師徒共同任務增加親密度

### 5. sect-war.js - 宗門戰爭
管理宗門間的衝突和戰爭。

Manages conflicts and wars between sects.

**戰爭狀態 (War States):**
- 準備期 (Preparation)
- 交戰中 (Active)
- 停戰 (Truce)
- 已結束 (Concluded)

**戰爭要素 (War Elements):**
- 戰鬥記錄 (Battle Records)
- 傷亡統計 (Casualties)
- 領土變更 (Territory Changes)
- 停戰條款 (Truce Terms)

## 核心功能 (Core Features)

### 創建和管理宗門 (Create and Manage Sect)
```javascript
import SectManagerSystem from './sect-manager.js';

const sectManager = new SectManagerSystem();

// Create sect
const sect = sectManager.createSect({
  name: '天劍宗',
  founder: character,
  rank: SECT_RANKS.MINOR
});

// Add member
sectManager.addMember(sect, newDisciple, SECT_POSITIONS.OUTER_DISCIPLE);

// Upgrade facility
sectManager.upgradeFacility(sect, 'library');
```

### 貢獻度管理 (Contribution Management)
```javascript
import ContributionSystem from './contribution.js';

const contributionSystem = new ContributionSystem();

// Add contribution
contributionSystem.addContribution(sectId, characterId, 100, CONTRIBUTION_SOURCES.MISSION);

// Redeem reward
contributionSystem.redeemReward(sectId, characterId, rewardId, 500);
```

### 學習宗門功法 (Learn Sect Skills)
```javascript
import SectSkillsSystem from './sect-skills.js';

const skillSystem = new SectSkillsSystem();

// Create sect skill
const skill = skillSystem.createSectSkill({
  name: '天劍訣',
  tier: SKILL_TIERS.CORE,
  sectId: sectId,
  contributionCost: 1000
});

// Learn skill
skillSystem.learnSectSkill(character, skillId, currentContribution);
```

### 師徒關係 (Master-Disciple)
```javascript
import MasterDiscipleSystem from './master-disciple.js';

const mdSystem = new MasterDiscipleSystem();

// Establish relationship
mdSystem.establishRelationship(masterId, discipleId);

// Teach disciple
mdSystem.teachDisciple(relationshipId, teaching);
```

### 宗門戰爭 (Sect War)
```javascript
import SectWarSystem from './sect-war.js';

const warSystem = new SectWarSystem();

// Declare war
const war = warSystem.declareWar(attackerSectId, defenderSectId, '領土爭端');

// Conduct battle
warSystem.conductBattle(warId, battleData);

// Conclude war
warSystem.concludeWar(warId, victorSectId);
```

## 與其他系統的互動 (Interactions with Other Systems)

### 角色系統 (Character System)
- 宗門職位影響角色地位
- 宗門功法提供額外能力

### 任務系統 (Quest System)
- 宗門任務獲得貢獻度
- 特殊任務影響宗門聲望

### 修煉系統 (Cultivation System)
- 宗門設施加速修煉
- 師父指導提高突破成功率

### 戰鬥系統 (Combat System)
- 宗門戰爭觸發大規模戰鬥
- 宗門功法提供戰鬥加成

### 社交系統 (Social System)
- 同門關係影響互動
- 宗門聯盟影響外交

## TODO 列表

- [ ] 實現宗門領地系統 (Implement sect territory system)
- [ ] 添加宗門任務板 (Add sect mission board)
- [ ] 實現宗門競賽 (Implement sect competitions)
- [ ] 添加宗門排行榜 (Add sect rankings)
- [ ] 實現宗門商店 (Implement sect shop)
- [ ] 添加宗門外交系統 (Add sect diplomacy)
- [ ] 實現宗門秘境 (Implement sect secret realms)
- [ ] 添加宗門傳承系統 (Add sect inheritance system)

## 參考資料 (References)

- 宗門數據請參考 `src/data/sects/sect-data.json`
- 完整宗門指南請參考 `docs/SECT_GUIDE.md`
