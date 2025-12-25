# 遊戲啟動指南 (Game Setup Guide)

## 如何運行遊戲 (How to Run)

### 方法一：直接開啟 (Direct Open)
1. 直接在瀏覽器中開啟 `index.html` 檔案
2. 推薦使用 Chrome、Firefox 或 Edge 等現代瀏覽器

### 方法二：使用本地伺服器 (Using Local Server)
推薦使用本地伺服器以避免 CORS 問題（如果需要載入 JSON 資料）

#### 使用 Python:
```bash
# Python 3
python -m http.server 8000

# 然後在瀏覽器開啟：
# http://localhost:8000
```

#### 使用 Node.js (http-server):
```bash
# 安裝 http-server (如果還沒安裝)
npm install -g http-server

# 運行伺服器
http-server -p 8000

# 然後在瀏覽器開啟：
# http://localhost:8000
```

#### 使用 VS Code Live Server:
1. 安裝 "Live Server" 擴充套件
2. 右鍵點擊 `index.html`
3. 選擇 "Open with Live Server"

## 遊戲功能 (Game Features)

### 已實現功能 (Implemented Features)
- ✅ 主選單系統
- ✅ 角色創建（靈根、命格選擇）
- ✅ 修煉系統（累積靈力、境界突破）
- ✅ 角色面板（屬性、裝備查看）
- ✅ 背包系統（物品使用）
- ✅ 技能系統（技能查看）
- ✅ 戰鬥系統（戰棋格子、技能釋放）
- ✅ 存檔系統（localStorage）
- ✅ 動畫效果（粒子、突破特效）

### 遊戲流程 (Game Flow)
1. **開始遊戲** → 創建角色（選擇道號、靈根、命格）
2. **修煉** → 累積靈力 → 突破境界
3. **查看角色** → 檢視屬性、裝備、命格
4. **管理背包** → 使用丹藥恢復生命和靈力
5. **查看技能** → 了解已學會的技能
6. **挑戰戰鬥** → 對戰靈狼，測試戰鬥系統

## 初始設定 (Initial Setup)

### 預設角色資料
- **名字**: 林逸
- **靈根**: 劍靈根（單靈根 - 上品）
- **命格**: 主角命格
- **境界**: 凝氣期 初期
- **等級**: 1

### 初始資源
- 下品靈石: 100
- 回春丹（下品）: 5
- 靈力丹（下品）: 5
- 凡鐵劍（武器）: 1

### 初始技能
- 基礎攻擊
- 火球術（消耗 30 靈力）

## 遊戲操作 (Controls)

### 修煉面板
- **開始修煉**: 自動累積靈力
- **停止修煉**: 停止累積
- **嘗試突破**: 當靈力達到上限時可突破
- **使用靈石**: 消耗靈石快速獲得靈力

### 戰鬥系統
- **基礎攻擊**: 普通物理攻擊
- **火球術**: 火屬性法術攻擊（消耗靈力）
- **防禦**: 降低受到的傷害
- **逃跑**: 逃離戰鬥

## 技術細節 (Technical Details)

### 技術棧
- 純原生 JavaScript (ES6+)
- CSS3 動畫
- HTML5
- localStorage（存檔）
- Canvas（粒子效果）

### 架構
- 模組化設計
- 事件驅動
- MVC 模式
- 觀察者模式

### 檔案結構
```
la-cultivation-spirituelle/
├── index.html              # 遊戲入口
├── style.css               # 主樣式表
├── game.js                 # 遊戲主控制器
├── ui-manager.js           # UI 管理器
├── animation-system.js     # 動畫系統
├── game-data-manager.js    # 資料管理器
├── main-menu-scene.js      # 主選單
├── character-creation.js   # 角色創建
├── cultivation-interface.js # 修煉介面
├── character-panel.js      # 角色面板
├── inventory-interface.js  # 背包介面
├── skill-interface.js      # 技能介面
├── battle-interface.js     # 戰鬥介面
├── audio-manager.js        # 音效管理器
└── src/                    # 遊戲系統（已存在）
    ├── systems/
    ├── data/
    └── ...
```

## 瀏覽器兼容性 (Browser Compatibility)

### 推薦瀏覽器
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

### 需要的功能
- ES6 Modules 支援
- localStorage 支援
- CSS Grid 支援
- CSS Flexbox 支援

## 已知問題 (Known Issues)

1. **JSON 資料載入**: 如果直接開啟 HTML 檔案，可能無法載入 JSON 資料（CORS 問題）
   - 解決方案：使用本地伺服器運行

2. **音效**: 音效管理器已實現但需要實際的音頻檔案
   - 目前音效功能不會影響遊戲運行

## 後續開發 (Future Development)

### 計劃功能
- [ ] 更多境界和突破內容
- [ ] 更多敵人和戰鬥
- [ ] 宗門系統整合
- [ ] 煉丹系統整合
- [ ] 任務系統
- [ ] 音效和音樂
- [ ] 更多動畫效果
- [ ] 新手引導

## 反饋與貢獻 (Feedback & Contribution)

如有問題或建議，歡迎提交 Issue 或 Pull Request！

---

**享受修仙之旅！🌟**
