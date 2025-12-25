# 角色系統 (Character System)

## 系統概述 (System Overview)

角色系統管理角色的修煉屬性、命格和隊友系統，整合修仙元素到角色數據中。

The Character System manages character cultivation attributes, destiny, and companion system, integrating cultivation elements into character data.

## 主要組件 (Main Components)

### 1. cultivation-stats.js - 修煉屬性
管理角色的修煉專屬屬性。

**核心屬性:**
- 境界和階段 (Realm and Stage)
- 靈力 (Spiritual Power)
- 悟性 (Comprehension)
- 道行 (Dao Progress)
- 修煉速度 (Cultivation Speed)

### 2. destiny.js - 命格系統
管理角色的命運和命格。

**命格類型:**
- 主角命格 (Protagonist)
- 天才命格 (Genius)
- 受詛命格 (Cursed)
- 受祝福命格 (Blessed)
- 重生者 (Reincarnator)
- 穿越者 (Transmigrator)
- 天選之人 (Chosen One)
- 普通命格 (Ordinary)

### 3. companion.js - 隊友系統
管理隊伍成員和夥伴。

**隊友類型:**
- 修士 (Cultivator)
- 靈獸 (Spirit Beast)
- 器靈 (Artifact Spirit)
- 召喚物 (Summon)

## 核心功能 (Core Features)

### 修煉屬性管理
```javascript
import CultivationStatsSystem from './cultivation-stats.js';

const statsSystem = new CultivationStatsSystem();
statsSystem.initializeCultivationStats(character);
statsSystem.updateSpiritualPower(character, 100);
```

### 命格系統
```javascript
import DestinySystem from './destiny.js';

const destinySystem = new DestinySystem();
destinySystem.assignDestiny(character, DESTINY_TYPES.PROTAGONIST);
destinySystem.addFatePoints(character, 10);
```

### 隊友管理
```javascript
import CompanionSystem from './companion.js';

const companionSystem = new CompanionSystem();
companionSystem.addCompanion(character, companionData);
companionSystem.increaseBond(companionId, 5);
```

## 與其他系統的互動

- 修煉系統：提供修煉相關的角色屬性
- 戰鬥系統：隊友參與戰鬥
- 任務系統：命格影響任務觸發

## 參考資料

詳細角色數據請參考 `src/data/characters/`
