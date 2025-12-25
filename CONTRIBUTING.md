# 開發規範 / Development Guidelines

## 目錄結構規範 / Directory Structure Rules

### 源代碼組織 / Source Code Organization

1. **系統模塊** (Systems)
   - 每個系統應該是獨立且可測試的
   - 使用清晰的接口定義
   - 避免循環依賴

2. **數據文件** (Data)
   - 使用 JSON 或 YAML 格式
   - 遵循統一的命名規範
   - 添加 schema 驗證

3. **UI組件** (UI)
   - 保持 UI 和邏輯分離
   - 使用可重用的組件
   - 響應式設計

### 命名規範 / Naming Conventions

```javascript
// Classes: PascalCase
class CharacterController { }

// Functions: camelCase
function calculateDamage() { }

// Constants: UPPER_SNAKE_CASE
const MAX_HEALTH = 100;

// Files: kebab-case
// character-controller.js
// damage-calculator.js
```

## 代碼風格 / Code Style

### 基本原則 / Basic Principles

1. **可讀性優先** - 寫出易懂的代碼
2. **DRY原則** - Don't Repeat Yourself
3. **單一職責** - 每個函數/類只做一件事
4. **註釋適量** - 複雜邏輯需要註釋

### 示例代碼 / Example Code

```javascript
// Good: Clear and descriptive
function calculateAttackDamage(attacker, defender, skill) {
  const baseDamage = attacker.attack * skill.power;
  const defense = defender.defense;
  const finalDamage = Math.max(1, baseDamage - defense);
  return finalDamage;
}

// Bad: Unclear and cryptic
function calc(a, d, s) {
  return Math.max(1, a.atk * s.pow - d.def);
}
```

## Git工作流程 / Git Workflow

### 分支管理 / Branch Management

- `main` - 穩定的生產代碼
- `develop` - 開發分支
- `feature/*` - 新功能分支
- `bugfix/*` - 錯誤修復分支

### 提交信息 / Commit Messages

```
類型: 簡短描述 (不超過50字符)

詳細說明需要時添加，解釋what和why，而不是how

Types:
- feat: 新功能
- fix: 修復bug
- docs: 文檔更新
- style: 代碼格式化
- refactor: 重構
- test: 添加測試
- chore: 構建/工具更改
```

示例:
```
feat: 添加角色技能系統

- 實現技能數據結構
- 添加技能學習機制
- 支持主動和被動技能
```

## 測試要求 / Testing Requirements

### 測試覆蓋 / Test Coverage

- 核心系統: ≥80% 覆蓋率
- 工具函數: 100% 覆蓋率
- UI組件: 基本功能測試

### 測試類型 / Test Types

1. **單元測試** (Unit Tests)
   - 測試獨立函數和類
   - 快速執行
   - 不依賴外部資源

2. **整合測試** (Integration Tests)
   - 測試系統間交互
   - 測試完整的遊戲流程
   - 可能較慢

### 測試示例 / Test Example

```javascript
describe('DamageCalculator', () => {
  test('should calculate basic damage correctly', () => {
    const attacker = { attack: 50 };
    const defender = { defense: 20 };
    const skill = { power: 1.5 };
    
    const damage = calculateAttackDamage(attacker, defender, skill);
    
    expect(damage).toBe(55); // (50 * 1.5) - 20 = 55
  });
  
  test('should deal minimum 1 damage', () => {
    const attacker = { attack: 10 };
    const defender = { defense: 100 };
    const skill = { power: 1.0 };
    
    const damage = calculateAttackDamage(attacker, defender, skill);
    
    expect(damage).toBe(1); // Minimum damage
  });
});
```

## 性能優化 / Performance Optimization

### 最佳實踐 / Best Practices

1. **對象池** - 重用對象而非頻繁創建
2. **延遲加載** - 按需加載資源
3. **批量處理** - 減少API調用
4. **緩存** - 緩存計算結果

### 避免的問題 / Common Pitfalls

```javascript
// Bad: Creating objects in loop
for (let i = 0; i < 1000; i++) {
  const obj = { x: i, y: i };
  process(obj);
}

// Good: Reuse objects
const obj = { x: 0, y: 0 };
for (let i = 0; i < 1000; i++) {
  obj.x = i;
  obj.y = i;
  process(obj);
}
```

## 文檔要求 / Documentation Requirements

### README文件 / README Files

每個主要模塊應包含:
- 模塊目的和功能
- 主要組件列表
- 使用示例
- API文檔 (如適用)

### 代碼註釋 / Code Comments

```javascript
/**
 * 計算攻擊傷害
 * 
 * @param {Character} attacker - 攻擊者
 * @param {Character} defender - 防禦者
 * @param {Skill} skill - 使用的技能
 * @returns {number} 最終傷害值
 */
function calculateAttackDamage(attacker, defender, skill) {
  // Implementation
}
```

## 發布流程 / Release Process

1. 功能開發完成
2. 所有測試通過
3. 代碼審查
4. 更新文檔
5. 創建發布標籤
6. 部署/發布

## 資源 / Resources

- [Git最佳實踐](https://git-scm.com/book/en/v2)
- [JavaScript風格指南](https://github.com/airbnb/javascript)
- [測試最佳實踐](https://testingjavascript.com/)

## 問題反饋 / Issue Reporting

發現bug或有建議時:
1. 檢查是否已有相關issue
2. 使用issue模板
3. 提供詳細描述和復現步驟
4. 附上錯誤日誌和截圖
