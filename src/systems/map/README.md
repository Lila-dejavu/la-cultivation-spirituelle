# 地圖系統 (Map System)

## 系統概述 (System Overview)

地圖系統管理修仙世界的地理要素，包括靈脈和秘境。

The Map System manages geographical elements of the cultivation world, including spiritual veins and secret realms.

## 主要組件 (Main Components)

### 1. spiritual-vein.js - 靈脈系統
管理靈氣礦脈和修煉地點。

**靈脈品階:**
- 下品靈脈 (Low) - 1.0x密度
- 中品靈脈 (Middle) - 2.0x密度
- 上品靈脈 (High) - 4.0x密度
- 極品靈脈 (Supreme) - 8.0x密度
- 神品靈脈 (Divine) - 16.0x密度

**功能:**
- 在靈脈修煉獲得加成
- 宗門可控制靈脈
- 靈脈戰爭

### 2. secret-realm.js - 秘境系統
管理秘境和隱藏地城。

**秘境類型:**
- 傳承秘境 (Inheritance)
- 寶藏秘境 (Treasure)
- 試煉秘境 (Trial)
- 上古遺跡 (Ancient Ruins)
- 仙境福地 (Mystic Land)

**特點:**
- 需要特定修為才能進入
- 限時開放
- 豐厚獎勵

## 參考資料

詳細地圖數據請參考 `src/data/maps/`
