# 任務系統 (Quest System)

## 系統概述 (System Overview)

任務系統管理遊戲中的各種任務和事件，包括主線任務、支線任務、宗門任務、隨機事件和命運之戰。

The Quest System manages various quests and events in the game, including main quests, side quests, sect missions, random events, and destiny quests.

## 主要組件 (Main Components)

### 1. main-quest.js - 主線任務
管理主線劇情任務。

**任務狀態:**
- 鎖定 (Locked)
- 可接取 (Available)
- 進行中 (Active)
- 已完成 (Completed)
- 失敗 (Failed)

### 2. side-quest.js - 支線任務
管理可選的支線任務。

**任務類型:**
- 收集 (Collection)
- 探索 (Exploration)
- 戰鬥 (Combat)
- 社交 (Social)
- 製作 (Crafting)

### 3. sect-mission.js - 宗門任務
管理宗門相關任務。

**任務等級:**
- D級 - 10貢獻度
- C級 - 25貢獻度
- B級 - 50貢獻度
- A級 - 100貢獻度
- S級 - 250貢獻度

### 4. random-event.js - 隨機事件
管理隨機遭遇和事件。

**事件類型:**
- 遭遇 (Encounter)
- 發現 (Discovery)
- 挑戰 (Challenge)
- 機遇 (Opportunity)
- 危機 (Crisis)

### 5. destiny-quest.js - 命運之戰
管理與命運相關的特殊任務。

**特點:**
- 需要特定命格和業力
- 影響角色命運
- 獨特獎勵和後果

## 與其他系統的互動

- 宗門系統：宗門任務提供貢獻度
- 修煉系統：任務獎勵包含修煉資源
- 寶物系統：任務獎勵包含裝備和材料
- 社交系統：任務影響聲望和關係

## 參考資料

詳細任務數據請參考 `src/data/quests/`
