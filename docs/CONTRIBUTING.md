# 貢獻指南 (Contributing Guide)

## 歡迎貢獻！(Welcome!)

感謝您對《靈修之路》的興趣！我們歡迎所有形式的貢獻。

Thank you for your interest in La Cultivation Spirituelle! We welcome all forms of contribution.

## 如何貢獻 (How to Contribute)

### 1. 回報問題 (Report Issues)
如果您發現bug或有功能建議：
1. 檢查是否已有相同的issue
2. 創建新的issue，詳細描述問題
3. 如果是bug，請提供重現步驟

### 2. 提交程式碼 (Submit Code)
1. Fork本專案
2. 創建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟Pull Request

### 3. 改善文檔 (Improve Documentation)
- 修正錯別字
- 補充說明
- 翻譯文檔
- 添加範例

## 程式碼規範 (Code Standards)

### JavaScript風格指南

#### 命名規範
```javascript
// 類別使用大駝峰 (PascalCase)
class RealmSystem { }

// 函式和變數使用小駝峰 (camelCase)
function calculatePower() { }
const spiritualPower = 100;

// 常數使用全大寫加底線 (UPPER_SNAKE_CASE)
const MAX_REALM_LEVEL = 320;
```

#### 註釋規範
```javascript
/**
 * 計算突破成功率
 * Calculate breakthrough success rate
 * @param {Object} character - 角色物件
 * @param {Object} options - 突破選項
 * @returns {number} 成功率 (0-1)
 */
function calculateSuccessRate(character, options) {
  // 實現邏輯...
}
```

#### 檔案結構
```javascript
// 1. 匯入依賴
import SomeModule from './some-module.js';

// 2. 常數定義
export const CONSTANTS = { };

// 3. 類別定義
export class MyClass {
  constructor() { }
  
  // 公開方法
  publicMethod() { }
  
  // 私有方法 (使用_前綴)
  _privateMethod() { }
}

// 4. 匯出
export default MyClass;
```

### 修仙主題命名規範

#### 中英文對照
專案使用雙語註釋，請保持中英文對照：

```javascript
// 境界系統 (Realm System)
export const REALMS = {
  QI_CONDENSATION: 'qi_condensation',     // 凝氣期
  FOUNDATION_ESTABLISHMENT: 'foundation', // 築基期
  GOLDEN_CORE: 'golden_core',             // 金丹期
};
```

#### 資料格式規範

##### JSON檔案格式
```json
{
  "id": "unique_id",
  "name": "中文名稱",
  "name_en": "English Name",
  "type": "category",
  "attributes": {
    "attribute1": 100
  },
  "description": "詳細描述"
}
```

##### 境界資料格式
```json
{
  "id": "realm_id",
  "name": "境界名稱",
  "name_en": "Realm Name",
  "tier": 1,
  "levels": {
    "min": 1,
    "max": 40
  },
  "breakthrough": {
    "requirements": {}
  }
}
```

## 提交規範 (Commit Guidelines)

### 提交訊息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type類型
- `feat`: 新功能
- `fix`: 修復bug
- `docs`: 文檔更新
- `style`: 程式碼格式調整
- `refactor`: 重構
- `test`: 測試相關
- `chore`: 建置過程或輔助工具的變動

### 範例
```
feat(cultivation): add breakthrough system

- Implement breakthrough calculation
- Add success rate formula
- Add failure handling

Closes #123
```

## 開發流程 (Development Workflow)

### 本地開發
1. Clone專案
2. 安裝依賴：`npm install`
3. 創建功能分支
4. 開發並測試
5. 提交Pull Request

### 測試
- 執行測試：`npm test`
- 檢查程式碼：`npm run lint`
- 確保所有測試通過

## 文檔規範 (Documentation Standards)

### README結構
每個系統目錄都應包含README.md：
1. 系統概述（中英文）
2. 主要組件列表
3. 核心功能說明
4. 使用範例
5. 與其他系統的互動

### 註釋要求
- 所有公開函式必須有JSDoc註釋
- 複雜邏輯必須有行內註釋
- 註釋使用繁體中文和英文雙語

## 社群準則 (Community Guidelines)

### 行為準則
- 尊重所有貢獻者
- 保持友善和專業
- 建設性的反饋
- 包容不同意見

### 溝通渠道
- GitHub Issues: 問題回報和功能建議
- GitHub Discussions: 一般討論和問答
- Pull Requests: 程式碼審查和討論

## 許可證 (License)

貢獻到本專案的程式碼將採用MIT許可證。

Code contributed to this project will be licensed under the MIT License.

## 問題？(Questions?)

如有任何問題，歡迎：
- 創建GitHub Issue
- 在Discussions中提問
- 查看現有文檔

感謝您的貢獻！(Thank you for your contribution!)
