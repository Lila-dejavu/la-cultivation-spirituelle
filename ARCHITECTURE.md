# 系統架構 / System Architecture

## 核心架構圖 / Core Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Game Core                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Game Loop   │  │ Event System │  │   Resources  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│    Systems   │   │      UI      │   │    Scenes    │
├──────────────┤   ├──────────────┤   ├──────────────┤
│ • Combat     │   │ • HUD        │   │ • Battle     │
│ • Character  │   │ • Menu       │   │ • Menu       │
│ • Map        │   │ • Dialog     │   │ • Cutscene   │
│ • Inventory  │   │ • Battle UI  │   └──────────────┘
│ • Skill      │   └──────────────┘
│ • AI         │
└──────────────┘
        │
        ▼
┌──────────────┐
│     Data     │
├──────────────┤
│ • Characters │
│ • Skills     │
│ • Items      │
│ • Maps       │
│ • Enemies    │
└──────────────┘
```

## 戰鬥系統流程 / Combat System Flow

```
Start Battle
     │
     ▼
Initialize Battle
     │
     ├─→ Load Map & Terrain
     ├─→ Position Characters
     └─→ Set Turn Order
     │
     ▼
┌─────────────────┐
│  Battle Loop    │
│                 │
│  1. Check Win   │◄─────┐
│  2. Next Turn   │      │
│  3. AI/Player   │      │
│     Input       │      │
│  4. Execute     │      │
│     Action      │      │
│  5. Update      │──────┘
│     Status      │
└─────────────────┘
     │
     ▼
Battle End
     │
     ├─→ Calculate Rewards
     ├─→ Update Stats
     └─→ Save Progress
```

## 角色系統關係 / Character System Relations

```
Character
   │
   ├─→ Stats (HP, MP, ATK, DEF, SPD, etc.)
   │
   ├─→ Class
   │    └─→ Abilities & Bonuses
   │
   ├─→ Skills
   │    ├─→ Active Skills
   │    └─→ Passive Skills
   │
   ├─→ Equipment
   │    ├─→ Weapon
   │    ├─→ Armor
   │    └─→ Accessories
   │
   └─→ Experience
        └─→ Level & Progression
```

## 數據流 / Data Flow

```
Game Data Files (JSON/YAML)
         │
         ▼
   Data Loader
         │
         ▼
   Game Systems
         │
         ▼
    Game State
         │
         ├─→ Render (UI)
         │
         └─→ Save System
```

## 模塊依賴關係 / Module Dependencies

```
Low Level (No Dependencies)
├─ Utils
└─ Data

Mid Level
├─ Core (uses: Utils, Data)
├─ Systems (uses: Utils, Data, Core)
└─ Assets (independent)

High Level
├─ UI (uses: Systems, Core, Assets)
└─ Scenes (uses: Systems, UI, Core)

Test Level
└─ Tests (tests all above)
```

## 開發優先順序 / Development Priority

1. **Phase 1: Foundation**
   - Core engine setup
   - Data structures
   - Utilities

2. **Phase 2: Core Systems**
   - Character system
   - Map system
   - Combat system (basic)

3. **Phase 3: Gameplay**
   - Skills & abilities
   - AI system
   - Inventory system

4. **Phase 4: Polish**
   - UI/UX
   - Audio/Visual effects
   - Balance & testing
