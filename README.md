# 靈修之路 (La Cultivation Spirituelle)

一款修仙主題的回合制戰棋遊戲 | A cultivation-themed turn-based tactical game

## 專案簡介 (Project Overview)

《靈修之路》是一款融合東方修仙文化的回合制戰棋遊戲。玩家將扮演一位修仙者，從凝氣期開始，逐步修煉至大乘期，最終飛升仙界。遊戲包含完整的修煉系統、宗門管理、煉丹煉器、戰鬥系統等豐富的遊戲內容。

La Cultivation Spirituelle is a turn-based tactical game that incorporates Eastern cultivation culture. Players will take the role of a cultivator, starting from Qi Condensation and gradually cultivating to Mahayana, ultimately ascending to the immortal realm. The game features a complete cultivation system, sect management, alchemy and artifact refining, combat system, and rich gameplay content.

## 核心特色 (Core Features)

### 🌟 修煉系統 (Cultivation System)
- **八大境界**：從凝氣期到大乘期的完整修仙之路
- **靈根系統**：天靈根、單靈根、變異靈根等多種天賦
- **突破機制**：驚險刺激的境界突破體驗
- **天劫系統**：高階突破需要渡過天劫考驗
- **道悟系統**：領悟劍道、丹道等多種道的真諦

### ⚔️ 戰鬥系統 (Combat System)
- **回合制戰棋**：策略性的回合制戰鬥
- **五行相剋**：木剋土、土剋水、水剋火、火剋金、金剋木
- **元素反應**：超載、冰凍、蒸發等連鎖反應
- **陣法系統**：多人協作布下強大陣法
- **技能連鎖**：組合技能產生強大效果

### 💎 寶物系統 (Treasure System)
- **法寶裝備**：從凡品到混沌至寶的完整裝備體系
- **丹藥系統**：各種用途的丹藥和丹毒機制
- **靈石貨幣**：五個品階的靈石系統
- **天材地寶**：豐富的材料收集系統
- **神器認主**：獨特的神器認主和覺醒機制

### 🏛️ 宗門系統 (Sect System)
- **宗門管理**：創建和管理自己的宗門
- **貢獻度系統**：完成任務獲得貢獻兌換獎勵
- **宗門功法**：學習宗門專屬的強大功法
- **師徒系統**：收徒傳道或拜師學藝
- **宗門戰爭**：與其他宗門爭奪資源和地盤

### 🧪 煉丹煉器 (Alchemy & Refining)
- **煉丹系統**：學習丹方，煉製各種丹藥
- **煉器系統**：精煉裝備，提升屬性
- **材料採集**：探索世界收集珍貴材料
- **配方研究**：研究新配方創造獨特丹藥

### 📜 任務系統 (Quest System)
- **主線劇情**：引人入勝的修仙故事
- **支線任務**：豐富的可選內容
- **宗門任務**：獲得貢獻度的主要途徑
- **隨機事件**：充滿驚喜的隨機遭遇
- **命運之戰**：改變命運的特殊任務

## 專案結構 (Project Structure)

```
la-cultivation-spirituelle/
├── src/
│   ├── systems/          # 遊戲系統
│   │   ├── cultivation/  # 修煉系統
│   │   ├── treasure/     # 寶物系統
│   │   ├── alchemy/      # 煉丹系統
│   │   ├── sect/         # 宗門系統
│   │   ├── quest/        # 任務系統
│   │   ├── social/       # 社交系統
│   │   ├── character/    # 角色系統
│   │   ├── skill/        # 技能系統
│   │   ├── map/          # 地圖系統
│   │   └── combat/       # 戰鬥系統
│   ├── data/             # 遊戲數據
│   │   ├── realms/       # 境界配置
│   │   ├── skills/       # 技能數據
│   │   ├── treasures/    # 寶物數據
│   │   ├── characters/   # 角色數據
│   │   ├── enemies/      # 敵人數據
│   │   ├── quests/       # 任務數據
│   │   └── sects/        # 宗門數據
│   ├── ui/               # 使用者介面
│   │   ├── menu/         # 選單系統
│   │   └── hud/          # HUD元素
│   └── scenes/           # 遊戲場景
├── docs/                 # 文檔
│   ├── CULTIVATION_GUIDE.md  # 修煉系統指南
│   ├── BATTLE_SYSTEM.md      # 戰鬥系統說明
│   ├── TREASURE_GUIDE.md     # 寶物收集指南
│   ├── STORY_OUTLINE.md      # 故事大綱
│   ├── ARCHITECTURE.md       # 架構文檔
│   └── CONTRIBUTING.md       # 貢獻指南
└── assets/               # 遊戲資源
```

## 快速開始 (Quick Start)

### 安裝依賴 (Install Dependencies)
```bash
npm install
```

### 開發模式 (Development Mode)
```bash
npm run dev
```

### 建置專案 (Build Project)
```bash
npm run build
```

### 執行測試 (Run Tests)
```bash
npm test
```

### 圖形優化測試 (Graphics Optimization Test)
```bash
# 在瀏覽器中打開測試頁面
open graphics-optimization-test.html
```

## 圖形優化 (Graphics Optimization)

本遊戲實施了多項圖形性能優化技術以提供流暢的遊戲體驗：

### 主要優化功能 / Key Optimization Features

- **Canvas 渲染優化**: 使用優化的 context 選項和批量渲染技術
- **粒子系統對象池**: 減少 GC 壓力，提高粒子效果性能
- **圖像資源管理**: 支持圖像預加載、緩存和精靈圖系統
- **CSS 性能提升**: 使用硬件加速和 CSS containment
- **性能監控**: 實時 FPS 監控和性能指標追蹤

詳細信息請參閱 [圖形優化指南](docs/GRAPHICS_OPTIMIZATION.md)

### 使用示例 / Usage Example

```javascript
import { setupCompleteGraphicsOptimization } from './graphics-optimization-integration.js';

// 初始化所有圖形優化系統
const systems = await setupCompleteGraphicsOptimization();

// 使用動畫系統
systems.animationSystem.createSpiritualParticles(x, y, options);

// 監控性能
console.log('FPS:', systems.perfMonitor.getFPS());
```

## 文檔導航 (Documentation)

- [修煉系統完整指南](docs/CULTIVATION_GUIDE.md) - 境界、突破、靈根、道悟、天劫
- [戰鬥系統說明](docs/BATTLE_SYSTEM.md) - 回合制戰棋、五行相剋、陣法系統
- [寶物收集指南](docs/TREASURE_GUIDE.md) - 法寶、丹藥、天材地寶、煉器煉丹
- [圖形優化指南](docs/GRAPHICS_OPTIMIZATION.md) - 性能優化、渲染技術、最佳實踐
- [故事大綱](docs/STORY_OUTLINE.md) - 世界觀、主要角色、劇情走向
- [架構文檔](docs/ARCHITECTURE.md) - 系統架構、技術選型
- [貢獻指南](docs/CONTRIBUTING.md) - 如何參與開發

## 技術棧 (Tech Stack)

- **語言**: JavaScript (ES6+)
- **遊戲引擎**: 待定
- **資料格式**: JSON
- **版本控制**: Git

## 開發計劃 (Development Roadmap)

### Phase 1: 核心系統 ✅
- [x] 修煉系統
- [x] 寶物系統
- [x] 煉丹系統
- [x] 宗門系統
- [x] 任務系統
- [x] 社交系統

### Phase 2: 戰鬥與角色 ✅
- [x] 角色系統擴展
- [x] 技能系統
- [x] 地圖系統
- [x] 戰鬥系統

### Phase 3: 資料與介面 ✅
- [x] 遊戲資料結構
- [x] UI系統基礎
- [x] 場景系統

### Phase 4: 完善與優化 (進行中)
- [x] 圖形性能優化
  - [x] Canvas 渲染優化
  - [x] 粒子系統對象池
  - [x] 圖像資源管理
  - [x] CSS 性能提升
  - [x] 性能監控工具
- [ ] 遊戲平衡調整
- [ ] 美術資源整合
- [ ] 音效系統
- [ ] 存檔系統

### Phase 5: 測試與發布 (計劃中)
- [ ] Beta測試
- [ ] Bug修復
- [ ] 正式發布

## 貢獻 (Contributing)

歡迎所有形式的貢獻！請閱讀 [CONTRIBUTING.md](docs/CONTRIBUTING.md) 了解如何參與開發。

We welcome all forms of contribution! Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) to learn how to participate in development.

## 授權 (License)

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 聯絡方式 (Contact)

- 問題回報：[GitHub Issues](https://github.com/Lila-dejavu/la-cultivation-spirituelle/issues)
- 討論區：[GitHub Discussions](https://github.com/Lila-dejavu/la-cultivation-spirituelle/discussions)

## 致謝 (Acknowledgments)

感謝所有為這個專案做出貢獻的開發者和玩家！

Thanks to all developers and players who contributed to this project!

---

**注意**：本專案目前處於早期開發階段，功能和內容會持續更新。

**Note**: This project is currently in early development stage, features and content will be continuously updated.