# 社交系統 (Social System)

## 系統概述 (System Overview)

社交系統管理角色之間的關係、勢力劃分、聲望系統和結盟機制。

The Social System manages character relationships, faction divisions, reputation system, and alliance mechanisms.

## 主要組件 (Main Components)

### 1. relationship.js - 關係系統
管理角色間的各種關係。

**關係類型:**
- 好友 (Friend)
- 對手 (Rival)
- 師父 (Master)
- 弟子 (Disciple)
- 盟友 (Ally)
- 仇敵 (Enemy)
- 愛人 (Lover)
- 家人 (Family)

**親密度系統:**
- 0-100的親密度值
- 影響互動和對話選項
- 高親密度解鎖特殊事件

### 2. faction.js - 勢力系統
管理各大勢力和組織。

**勢力類型:**
- 正道 (Righteous)
- 魔道 (Demonic)
- 中立 (Neutral)
- 隱世 (Hidden)

### 3. reputation.js - 聲望系統
管理角色在不同群體中的聲望。

**聲望等級:**
- 崇敬 (Revered) - ≥1000
- 尊敬 (Honored) - ≥500
- 友好 (Friendly) - ≥100
- 中立 (Neutral) - -100到100
- 不友好 (Unfriendly) - ≥-500
- 敵對 (Hostile) - <-500

### 4. alliance.js - 結盟系統
管理群體間的同盟關係。

**同盟類型:**
- 貿易同盟 (Trade)
- 軍事同盟 (Military)
- 外交同盟 (Diplomatic)
- 聯姻同盟 (Marriage)

## 核心功能 (Core Features)

### 關係管理
```javascript
import RelationshipSystem from './relationship.js';

const relSystem = new RelationshipSystem();
relSystem.createRelationship(char1, char2, RELATIONSHIP_TYPES.FRIEND);
relSystem.updateAffinity(relationshipId, 10);
```

### 勢力操作
```javascript
import FactionSystem from './faction.js';

const factionSystem = new FactionSystem();
factionSystem.createFaction({ name: '天劍盟', type: FACTION_TYPES.RIGHTEOUS });
factionSystem.joinFaction(factionId, characterId);
```

### 聲望管理
```javascript
import ReputationSystem from './reputation.js';

const repSystem = new ReputationSystem();
repSystem.addReputation(characterId, groupId, 50);
```

### 結盟操作
```javascript
import AllianceSystem from './alliance.js';

const allianceSystem = new AllianceSystem();
allianceSystem.createAlliance(group1, group2, ALLIANCE_TYPES.MILITARY);
```

## 與其他系統的互動

- 宗門系統：宗門關係影響外交
- 任務系統：聲望影響可接任務
- 戰鬥系統：勢力關係影響戰鬥選項

## 參考資料

詳細社交數據請參考 `src/data/social/`
