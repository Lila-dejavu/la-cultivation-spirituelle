# 戰鬥系統 (Combat System)

## 系統概述 (System Overview)

戰鬥系統管理修仙主題的戰鬥機制，包括陣法系統和元素連鎖反應。

The Combat System manages cultivation-themed combat mechanics, including formation system and elemental chain reactions.

## 主要組件 (Main Components)

### 1. formation.js - 陣法系統
管理戰術陣型和陣法。

**陣法類型:**
- 攻擊陣 (Offensive)
- 防禦陣 (Defensive)
- 輔助陣 (Support)
- 封印陣 (Sealing)
- 幻術陣 (Illusion)

**特點:**
- 需要多人協作
- 提供團隊加成
- 境界越高效果越強

### 2. chain-reaction.js - 連鎖反應
管理五行相剋的元素反應系統。

**元素反應:**
- 增幅 (Amplify) - 同元素疊加
- 超載 (Overload) - 雷+水/火
- 冰凍 (Freeze) - 水+冰
- 蒸發 (Vaporize) - 火+水
- 融化 (Melt) - 火+冰
- 結晶 (Crystallize) - 土系防禦

**五行相剋:**
- 木剋土 (Wood overcomes Earth)
- 土剋水 (Earth overcomes Water)
- 水剋火 (Water overcomes Fire)
- 火剋金 (Fire overcomes Metal)
- 金剋木 (Metal overcomes Wood)

## 核心功能 (Core Features)

### 陣法布置
```javascript
import FormationSystem from './formation.js';

const formationSystem = new FormationSystem();
const result = formationSystem.activateFormation(partyMembers, formationId);
```

### 元素連鎖
```javascript
import ChainReactionSystem from './chain-reaction.js';

const chainSystem = new ChainReactionSystem();
const reaction = chainSystem.checkReaction(targetId, 'fire');
```

## 與其他系統的互動

- 技能系統：技能包含元素屬性
- 角色系統：靈根影響元素傷害
- 宗門系統：宗門功法包含陣法

## 參考資料

詳細戰鬥機制請參考 `docs/BATTLE_SYSTEM.md`
