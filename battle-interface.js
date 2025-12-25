/**
 * Battle Interface - 戰鬥介面
 * Manages tactical battle system (SRPG)
 * 管理戰術戰鬥系統（戰棋遊戲）
 */

/**
 * Terrain System - 地形系統
 */
class TerrainSystem {
    constructor() {
        this.terrainTypes = {
            plain: { name: '平地', defense: 0, evasion: 0, moveCost: 1, color: '#3a4a3a' },
            forest: { name: '森林', defense: 10, evasion: 10, moveCost: 2, color: '#2d5016' },
            mountain: { name: '山地', defense: 20, evasion: 5, moveCost: 3, color: '#5a4a3a' },
            river: { name: '河流', defense: 0, evasion: 20, moveCost: 4, color: '#1e3a5f' },
            castle: { name: '城堡', defense: 30, evasion: 10, moveCost: 1, color: '#4a3a5a' }
        };
    }

    generateTerrain(rows, cols) {
        const terrain = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Random terrain generation with weighted probabilities
                const rand = Math.random();
                let type = 'plain';
                
                if (rand < 0.2) type = 'forest';
                else if (rand < 0.3) type = 'mountain';
                else if (rand < 0.35) type = 'river';
                else if (rand < 0.38) type = 'castle';
                
                terrain.push({ row, col, type });
            }
        }
        return terrain;
    }

    getTerrainAt(terrain, row, col) {
        return terrain.find(t => t.row === row && t.col === col);
    }

    getTerrainData(type) {
        return this.terrainTypes[type] || this.terrainTypes.plain;
    }
}

/**
 * Movement System - 移動系統
 */
class MovementSystem {
    calculateMoveRange(unit, terrain, allUnits, terrainSystem) {
        const range = [];
        const visited = new Set();
        const queue = [{ row: unit.row, col: unit.col, cost: 0 }];
        
        visited.add(`${unit.row},${unit.col}`);
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            // Add adjacent cells
            const directions = [
                { row: -1, col: 0 }, { row: 1, col: 0 },
                { row: 0, col: -1 }, { row: 0, col: 1 }
            ];
            
            for (const dir of directions) {
                const newRow = current.row + dir.row;
                const newCol = current.col + dir.col;
                const key = `${newRow},${newCol}`;
                
                if (visited.has(key)) continue;
                
                // Check bounds
                if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) continue;
                
                // Check if occupied by another unit
                const occupied = allUnits.some(u => u.row === newRow && u.col === newCol && u !== unit);
                if (occupied) continue;
                
                // Get terrain cost
                const terrainTile = terrainSystem.getTerrainAt(terrain, newRow, newCol);
                const terrainData = terrainSystem.getTerrainData(terrainTile?.type || 'plain');
                let moveCost = terrainData.moveCost;
                
                // Flying units ignore terrain
                if (unit.type === 'flying') moveCost = 1;
                
                const newCost = current.cost + moveCost;
                
                if (newCost <= unit.movement) {
                    visited.add(key);
                    range.push({ row: newRow, col: newCol, cost: newCost });
                    queue.push({ row: newRow, col: newCol, cost: newCost });
                }
            }
        }
        
        return range;
    }

    findPath(startRow, startCol, endRow, endCol, terrain, allUnits, terrainSystem, unit) {
        // Simple A* pathfinding
        const openSet = [{ row: startRow, col: startCol, g: 0, h: this.heuristic(startRow, startCol, endRow, endCol), parent: null }];
        const closedSet = new Set();
        
        while (openSet.length > 0) {
            // Find node with lowest f score
            openSet.sort((a, b) => (a.g + a.h) - (b.g + b.h));
            const current = openSet.shift();
            
            if (current.row === endRow && current.col === endCol) {
                // Reconstruct path
                const path = [];
                let node = current;
                while (node) {
                    path.unshift({ row: node.row, col: node.col });
                    node = node.parent;
                }
                return path;
            }
            
            closedSet.add(`${current.row},${current.col}`);
            
            // Check neighbors
            const directions = [
                { row: -1, col: 0 }, { row: 1, col: 0 },
                { row: 0, col: -1 }, { row: 0, col: 1 }
            ];
            
            for (const dir of directions) {
                const newRow = current.row + dir.row;
                const newCol = current.col + dir.col;
                const key = `${newRow},${newCol}`;
                
                if (closedSet.has(key)) continue;
                if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) continue;
                
                // Check if occupied (except destination)
                const occupied = allUnits.some(u => u.row === newRow && u.col === newCol && 
                    u !== unit && (newRow !== endRow || newCol !== endCol));
                if (occupied) continue;
                
                const terrainTile = terrainSystem.getTerrainAt(terrain, newRow, newCol);
                const terrainData = terrainSystem.getTerrainData(terrainTile?.type || 'plain');
                const moveCost = unit.type === 'flying' ? 1 : terrainData.moveCost;
                
                const g = current.g + moveCost;
                const h = this.heuristic(newRow, newCol, endRow, endCol);
                
                const existing = openSet.find(n => n.row === newRow && n.col === newCol);
                if (!existing || g < existing.g) {
                    if (existing) {
                        existing.g = g;
                        existing.parent = current;
                    } else {
                        openSet.push({ row: newRow, col: newCol, g, h, parent: current });
                    }
                }
            }
        }
        
        return null; // No path found
    }

    heuristic(row1, col1, row2, col2) {
        return Math.abs(row1 - row2) + Math.abs(col1 - col2);
    }
}

/**
 * Combat Calculator - 戰鬥計算器
 */
class CombatCalculator {
    calculateDamage(attacker, defender, terrain, terrainSystem, isCounter = false, isBackstab = false) {
        const baseDamage = attacker.attack - defender.defense;
        
        // Get terrain defense bonus
        const terrainTile = terrainSystem.getTerrainAt(terrain, defender.row, defender.col);
        const terrainData = terrainSystem.getTerrainData(terrainTile?.type || 'plain');
        const terrainDefense = terrainData.defense;
        
        // Backstab bonus
        const backstabMultiplier = isBackstab ? 1.5 : 1.0;
        
        // Counter penalty
        const counterMultiplier = isCounter ? 0.8 : 1.0;
        
        const finalDamage = Math.max(1, Math.floor(
            baseDamage * backstabMultiplier * counterMultiplier * (100 - terrainDefense) / 100
        ));
        
        return finalDamage;
    }

    calculateHitRate(attacker, defender, terrain, terrainSystem, isBackstab = false) {
        let hitRate = 90;
        
        // Skill difference
        hitRate += (attacker.skill || 0) - (defender.skill || 0);
        
        // Terrain evasion
        const terrainTile = terrainSystem.getTerrainAt(terrain, defender.row, defender.col);
        const terrainData = terrainSystem.getTerrainData(terrainTile?.type || 'plain');
        hitRate -= terrainData.evasion;
        
        // Defender evasion
        hitRate -= (defender.evasion || 0);
        
        // Backstab bonus
        if (isBackstab) hitRate += 30;
        
        return Math.max(10, Math.min(100, hitRate));
    }

    isBackstab(attackerRow, attackerCol, defenderRow, defenderCol, defenderFacing) {
        // Calculate attack direction
        const dRow = defenderRow - attackerRow;
        const dCol = defenderCol - attackerCol;
        
        let attackDir = 'front';
        if (Math.abs(dRow) > Math.abs(dCol)) {
            attackDir = dRow > 0 ? 'south' : 'north';
        } else {
            attackDir = dCol > 0 ? 'east' : 'west';
        }
        
        // Check if attacking from behind
        const oppositeDir = {
            'north': 'south',
            'south': 'north',
            'east': 'west',
            'west': 'east'
        };
        
        return attackDir === oppositeDir[defenderFacing || 'south'];
    }
}

/**
 * Battle AI - 戰鬥 AI
 */
class BattleAI {
    constructor(movementSystem, combatCalculator) {
        this.movementSystem = movementSystem;
        this.combatCalculator = combatCalculator;
    }

    executeTurn(unit, playerUnits, allUnits, terrain, terrainSystem) {
        // Find nearest player unit
        const target = this.findNearestTarget(unit, playerUnits);
        if (!target) return null;
        
        // Check if in attack range
        const attackRange = this.calculateAttackRange(unit, allUnits);
        const canAttack = attackRange.some(pos => pos.row === target.row && pos.col === target.col);
        
        if (canAttack) {
            return { action: 'attack', target };
        } else {
            // Move towards target
            const moveRange = this.movementSystem.calculateMoveRange(unit, terrain, allUnits, terrainSystem);
            const bestMove = this.findBestMoveTowards(unit, target, moveRange);
            
            if (bestMove) {
                return { action: 'move', destination: bestMove };
            }
        }
        
        return { action: 'wait' };
    }

    findNearestTarget(unit, playerUnits) {
        let nearest = null;
        let minDist = Infinity;
        
        for (const target of playerUnits) {
            const dist = Math.abs(unit.row - target.row) + Math.abs(unit.col - target.col);
            if (dist < minDist) {
                minDist = dist;
                nearest = target;
            }
        }
        
        return nearest;
    }

    calculateAttackRange(unit, allUnits) {
        const range = [];
        const minRange = unit.attackRange?.min || 1;
        const maxRange = unit.attackRange?.max || 1;
        
        for (let row = unit.row - maxRange; row <= unit.row + maxRange; row++) {
            for (let col = unit.col - maxRange; col <= unit.col + maxRange; col++) {
                if (row < 0 || row >= 15 || col < 0 || col >= 15) continue;
                
                const dist = Math.abs(unit.row - row) + Math.abs(unit.col - col);
                if (dist >= minRange && dist <= maxRange) {
                    range.push({ row, col });
                }
            }
        }
        
        return range;
    }

    findBestMoveTowards(unit, target, moveRange) {
        let bestPos = null;
        let minDist = Infinity;
        
        for (const pos of moveRange) {
            const dist = Math.abs(pos.row - target.row) + Math.abs(pos.col - target.col);
            if (dist < minDist) {
                minDist = dist;
                bestPos = pos;
            }
        }
        
        return bestPos;
    }
}

export class BattleInterface {
    constructor(uiManager, animationSystem) {
        this.uiManager = uiManager;
        this.animationSystem = animationSystem;
        this.character = null;
        
        // Initialize systems
        this.terrainSystem = new TerrainSystem();
        this.movementSystem = new MovementSystem();
        this.combatCalculator = new CombatCalculator();
        this.battleAI = new BattleAI(this.movementSystem, this.combatCalculator);
        
        // Battle state
        this.battleState = 'idle'; // idle, player_turn, enemy_turn, victory, defeat
        this.gridSize = { rows: 15, cols: 15 };
        this.terrain = [];
        this.units = [];
        this.playerUnits = [];
        this.enemyUnits = [];
        this.selectedUnit = null;
        this.showingMoveRange = false;
        this.showingAttackRange = false;
        this.moveRange = [];
        this.attackRange = [];
        this.turnCount = 1;
        this.currentPreview = null;
    }

    /**
     * Initialize interface / 初始化介面
     * @param {Object} character - Character data
     */
    initialize(character) {
        this.character = character;
        this.render();
        this.setupEventListeners();
    }

    /**
     * Render battle panel / 渲染戰鬥面板
     */
    render() {
        const panel = document.getElementById('battle-panel');
        if (!panel || !this.character) return;

        panel.innerHTML = `
            <div class="panel-section">
                <h2 class="panel-title">戰鬥系統 (SRPG)</h2>
                ${this.battleState === 'idle' ? this.renderBattleMenu() : this.renderBattleField()}
            </div>
        `;
    }

    /**
     * Render battle menu / 渲染戰鬥選單
     * @returns {string} HTML string
     */
    renderBattleMenu() {
        return `
            <div class="battle-menu">
                <div class="battle-intro">
                    <h3>選擇關卡</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                        測試您的戰術，挑戰妖獸
                    </p>
                </div>
                
                <div class="enemy-selection">
                    <div class="enemy-card" data-enemy="test_battle">
                        <div class="enemy-icon">⚔️</div>
                        <h4>測試關卡</h4>
                        <p class="enemy-level">15x15 戰棋</p>
                        <p class="enemy-desc">2隻靈狼，多種地形</p>
                        <div class="enemy-stats">
                            <span>👥 1 vs 2</span>
                        </div>
                        <button class="btn primary btn-challenge" data-enemy="test_battle">
                            開始戰鬥
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render battlefield / 渲染戰場
     * @returns {string} HTML string
     */
    renderBattleField() {
        return `
            <div class="battlefield-srpg">
                <div class="battle-header">
                    <div class="turn-info">
                        <span class="turn-label">回合 ${this.turnCount}</span>
                        <span class="turn-phase">${this.battleState === 'player_turn' ? '玩家回合' : '敵人回合'}</span>
                    </div>
                    <button class="btn primary" id="btn-end-turn" ${this.battleState !== 'player_turn' ? 'disabled' : ''}>
                        結束回合
                    </button>
                </div>
                
                <div class="battle-main">
                    <div class="battle-grid-srpg" id="battle-grid">
                        ${this.renderGrid()}
                    </div>
                    
                    <div class="battle-sidebar">
                        <div class="unit-info-panel" id="unit-info">
                            ${this.renderUnitInfo()}
                        </div>
                        
                        <div class="battle-log" id="battle-log">
                            <h4>戰鬥記錄</h4>
                            <div class="log-entries" id="log-entries">
                                <p class="log-entry">戰鬥開始！</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                ${this.currentPreview ? this.renderBattlePreview() : ''}
            </div>
        `;
    }

    /**
     * Render grid / 渲染格子
     * @returns {string} HTML string
     */
    renderGrid() {
        let html = '';
        for (let row = 0; row < this.gridSize.rows; row++) {
            for (let col = 0; col < this.gridSize.cols; col++) {
                const terrainTile = this.terrainSystem.getTerrainAt(this.terrain, row, col);
                const terrainData = this.terrainSystem.getTerrainData(terrainTile?.type || 'plain');
                const unit = this.units.find(u => u.row === row && u.col === col);
                
                // Check if cell is in move or attack range
                const inMoveRange = this.showingMoveRange && this.moveRange.some(p => p.row === row && p.col === col);
                const inAttackRange = this.showingAttackRange && this.attackRange.some(p => p.row === row && p.col === col);
                
                let cellClass = 'grid-cell-srpg';
                if (inMoveRange) cellClass += ' movable';
                if (inAttackRange) cellClass += ' attackable';
                if (unit && this.selectedUnit === unit) cellClass += ' selected';
                if (unit && unit.hasActed) cellClass += ' acted';
                
                let content = '';
                if (unit) {
                    const unitClass = unit.isPlayer ? 'player' : 'enemy';
                    content = `<div class="grid-unit ${unitClass}">${unit.icon}</div>`;
                }
                
                html += `
                    <div class="${cellClass}" 
                         data-row="${row}" 
                         data-col="${col}"
                         style="background-color: ${terrainData.color};"
                         title="${terrainData.name}">
                        ${content}
                    </div>
                `;
            }
        }
        return html;
    }

    /**
     * Render unit info / 渲染單位資訊
     * @returns {string} HTML string
     */
    renderUnitInfo() {
        if (!this.selectedUnit) {
            return '<p style="color: var(--text-secondary); padding: 1rem;">點擊單位查看資訊</p>';
        }
        
        const unit = this.selectedUnit;
        const terrainTile = this.terrainSystem.getTerrainAt(this.terrain, unit.row, unit.col);
        const terrainData = this.terrainSystem.getTerrainData(terrainTile?.type || 'plain');
        
        return `
            <div class="unit-details">
                <div class="unit-header">
                    <span class="unit-icon-large">${unit.icon}</span>
                    <h3>${unit.name}</h3>
                </div>
                <div class="unit-stats">
                    <div class="stat-row">
                        <span>❤️ HP:</span>
                        <span>${unit.hp}/${unit.maxHp}</span>
                    </div>
                    <div class="stat-row">
                        <span>⚔️ 攻擊:</span>
                        <span>${unit.attack}</span>
                    </div>
                    <div class="stat-row">
                        <span>🛡️ 防禦:</span>
                        <span>${unit.defense}</span>
                    </div>
                    <div class="stat-row">
                        <span>🏃 移動:</span>
                        <span>${unit.movement}</span>
                    </div>
                    <div class="stat-row">
                        <span>🎯 技巧:</span>
                        <span>${unit.skill || 0}</span>
                    </div>
                    <div class="stat-row">
                        <span>💨 迴避:</span>
                        <span>${unit.evasion || 0}</span>
                    </div>
                </div>
                <div class="terrain-info">
                    <h4>地形：${terrainData.name}</h4>
                    <p>防禦：+${terrainData.defense}</p>
                    <p>迴避：+${terrainData.evasion}</p>
                </div>
            </div>
        `;
    }

    /**
     * Render battle preview / 渲染戰鬥預測
     * @returns {string} HTML string
     */
    renderBattlePreview() {
        if (!this.currentPreview) return '';
        
        const { attacker, defender, damage, counterDamage, hitRate, counterHitRate } = this.currentPreview;
        
        return `
            <div class="battle-preview-window">
                <h4>戰鬥預測</h4>
                <div class="preview-combatants">
                    <div class="preview-unit">
                        <div class="preview-icon">${attacker.icon}</div>
                        <div class="preview-name">${attacker.name}</div>
                        <div class="preview-damage">傷害: ${damage}</div>
                        <div class="preview-hit">命中: ${hitRate}%</div>
                    </div>
                    <div class="preview-vs">VS</div>
                    <div class="preview-unit">
                        <div class="preview-icon">${defender.icon}</div>
                        <div class="preview-name">${defender.name}</div>
                        <div class="preview-damage">傷害: ${counterDamage || 0}</div>
                        <div class="preview-hit">命中: ${counterHitRate || 0}%</div>
                    </div>
                </div>
                <div class="preview-actions">
                    <button class="btn danger" id="btn-confirm-attack">確認攻擊</button>
                    <button class="btn secondary" id="btn-cancel-attack">取消</button>
                </div>
            </div>
        `;
    }

    /**
     * Setup event listeners / 設置事件監聽
     */
    setupEventListeners() {
        // Challenge buttons
        const challengeBtns = document.querySelectorAll('.btn-challenge');
        challengeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.startBattle(btn.dataset.enemy);
            });
        });

        // Grid cell clicks
        const gridCells = document.querySelectorAll('.grid-cell-srpg');
        gridCells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                this.handleCellClick(row, col);
            });
            
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                this.handleCellRightClick(row, col);
            });
        });

        // End turn button
        const endTurnBtn = document.getElementById('btn-end-turn');
        if (endTurnBtn) {
            endTurnBtn.addEventListener('click', () => this.endPlayerTurn());
        }

        // Battle preview buttons
        const confirmAttackBtn = document.getElementById('btn-confirm-attack');
        if (confirmAttackBtn) {
            confirmAttackBtn.addEventListener('click', () => this.executeAttack());
        }

        const cancelAttackBtn = document.getElementById('btn-cancel-attack');
        if (cancelAttackBtn) {
            cancelAttackBtn.addEventListener('click', () => this.cancelAttack());
        }
    }

    /**
     * Start battle / 開始戰鬥
     * @param {string} battleId - Battle ID
     */
    startBattle(battleId) {
        // Generate terrain
        this.terrain = this.terrainSystem.generateTerrain(this.gridSize.rows, this.gridSize.cols);
        
        // Initialize units
        this.units = [];
        
        // Player unit (swordsman at bottom-left)
        const playerUnit = {
            id: 'player_1',
            name: this.character.name,
            icon: '🧙',
            row: 13,
            col: 1,
            isPlayer: true,
            hp: this.character.stats.maxHealth || 100,
            maxHp: this.character.stats.maxHealth || 100,
            attack: this.character.stats.attack || 30,
            defense: this.character.stats.defense || 20,
            movement: 5,
            skill: 10,
            evasion: 5,
            type: 'infantry',
            attackRange: { min: 1, max: 1 },
            facing: 'north',
            hasActed: false
        };
        this.units.push(playerUnit);
        this.playerUnits.push(playerUnit);
        
        // Enemy units (2 spirit wolves on right side)
        const enemy1 = {
            id: 'enemy_1',
            name: '靈狼',
            icon: '🐺',
            row: 3,
            col: 12,
            isPlayer: false,
            hp: 80,
            maxHp: 80,
            attack: 25,
            defense: 15,
            movement: 6,
            skill: 8,
            evasion: 10,
            type: 'infantry',
            attackRange: { min: 1, max: 1 },
            facing: 'west',
            hasActed: false
        };
        
        const enemy2 = {
            id: 'enemy_2',
            name: '靈狼',
            icon: '🐺',
            row: 10,
            col: 13,
            isPlayer: false,
            hp: 80,
            maxHp: 80,
            attack: 25,
            defense: 15,
            movement: 6,
            skill: 8,
            evasion: 10,
            type: 'infantry',
            attackRange: { min: 1, max: 1 },
            facing: 'west',
            hasActed: false
        };
        
        this.units.push(enemy1, enemy2);
        this.enemyUnits.push(enemy1, enemy2);
        
        this.battleState = 'player_turn';
        this.turnCount = 1;
        this.selectedUnit = null;
        this.showingMoveRange = false;
        this.showingAttackRange = false;
        
        this.render();
        this.setupEventListeners();
        this.addBattleLog('戰鬥開始！玩家回合');
    }

    /**
     * Handle cell click / 處理格子點擊
     */
    handleCellClick(row, col) {
        if (this.battleState !== 'player_turn') return;
        
        const clickedUnit = this.units.find(u => u.row === row && u.col === col);
        
        // If clicking on a unit
        if (clickedUnit) {
            // If it's a player unit
            if (clickedUnit.isPlayer && !clickedUnit.hasActed) {
                this.selectUnit(clickedUnit);
            }
            // If it's an enemy unit and we have a unit selected with attack range showing
            else if (!clickedUnit.isPlayer && this.selectedUnit && this.showingAttackRange) {
                // Check if enemy is in attack range
                const inRange = this.attackRange.some(p => p.row === row && p.col === col);
                if (inRange) {
                    this.showBattlePreview(this.selectedUnit, clickedUnit);
                }
            }
        }
        // If clicking on empty cell
        else {
            if (this.selectedUnit && this.showingMoveRange) {
                // Check if cell is in move range
                const inRange = this.moveRange.some(p => p.row === row && p.col === col);
                if (inRange) {
                    this.moveUnit(this.selectedUnit, row, col);
                }
            }
        }
    }

    /**
     * Handle cell right click / 處理格子右鍵點擊
     */
    handleCellRightClick(row, col) {
        const unit = this.units.find(u => u.row === row && u.col === col);
        if (unit) {
            this.selectedUnit = unit;
            this.showingMoveRange = false;
            this.showingAttackRange = false;
            this.refreshGrid();
        }
    }

    /**
     * Select unit / 選擇單位
     */
    selectUnit(unit) {
        this.selectedUnit = unit;
        this.showingMoveRange = true;
        this.showingAttackRange = false;
        
        // Calculate move range
        this.moveRange = this.movementSystem.calculateMoveRange(
            unit, this.terrain, this.units, this.terrainSystem
        );
        
        this.refreshGrid();
        this.addBattleLog(`選擇了 ${unit.name}`);
    }

    /**
     * Move unit / 移動單位
     */
    moveUnit(unit, targetRow, targetCol) {
        unit.row = targetRow;
        unit.col = targetCol;
        
        // Update facing based on movement
        this.showingMoveRange = false;
        this.showingAttackRange = true;
        
        // Calculate attack range from new position
        this.attackRange = this.calculateAttackRange(unit);
        
        this.refreshGrid();
        this.addBattleLog(`${unit.name} 移動到 (${targetRow}, ${targetCol})`);
    }

    /**
     * Calculate attack range / 計算攻擊範圍
     */
    calculateAttackRange(unit) {
        const range = [];
        const minRange = unit.attackRange?.min || 1;
        const maxRange = unit.attackRange?.max || 1;
        
        for (let row = unit.row - maxRange; row <= unit.row + maxRange; row++) {
            for (let col = unit.col - maxRange; col <= unit.col + maxRange; col++) {
                if (row < 0 || row >= 15 || col < 0 || col >= 15) continue;
                if (row === unit.row && col === unit.col) continue;
                
                const dist = Math.abs(unit.row - row) + Math.abs(unit.col - col);
                if (dist >= minRange && dist <= maxRange) {
                    range.push({ row, col });
                }
            }
        }
        
        return range;
    }

    /**
     * Show battle preview / 顯示戰鬥預測
     */
    showBattlePreview(attacker, defender) {
        const isBackstab = this.combatCalculator.isBackstab(
            attacker.row, attacker.col, defender.row, defender.col, defender.facing
        );
        
        const damage = this.combatCalculator.calculateDamage(
            attacker, defender, this.terrain, this.terrainSystem, false, isBackstab
        );
        
        const hitRate = this.combatCalculator.calculateHitRate(
            attacker, defender, this.terrain, this.terrainSystem, isBackstab
        );
        
        // Check if defender can counter
        let counterDamage = 0;
        let counterHitRate = 0;
        const dist = Math.abs(attacker.row - defender.row) + Math.abs(attacker.col - defender.col);
        const canCounter = dist >= (defender.attackRange?.min || 1) && dist <= (defender.attackRange?.max || 1);
        
        if (canCounter) {
            counterDamage = this.combatCalculator.calculateDamage(
                defender, attacker, this.terrain, this.terrainSystem, true, false
            );
            counterHitRate = this.combatCalculator.calculateHitRate(
                defender, attacker, this.terrain, this.terrainSystem, false
            );
        }
        
        this.currentPreview = {
            attacker,
            defender,
            damage,
            hitRate,
            counterDamage,
            counterHitRate,
            isBackstab
        };
        
        this.render();
        this.setupEventListeners();
    }

    /**
     * Execute attack / 執行攻擊
     */
    executeAttack() {
        if (!this.currentPreview) return;
        
        const { attacker, defender, damage, hitRate, counterDamage, counterHitRate, isBackstab } = this.currentPreview;
        
        // Attacker attacks
        const hit = Math.random() * 100 < hitRate;
        if (hit) {
            defender.hp = Math.max(0, defender.hp - damage);
            this.addBattleLog(
                `${attacker.name} 攻擊 ${defender.name}，造成 ${damage} 點傷害！${isBackstab ? ' (背擊!)' : ''}`,
                'attack'
            );
            this.createDamageNumber(defender.row, defender.col, damage, isBackstab);
        } else {
            this.addBattleLog(`${attacker.name} 攻擊失手！`, 'miss');
        }
        
        // Counter attack if defender is alive
        if (defender.hp > 0 && counterDamage > 0) {
            const counterHit = Math.random() * 100 < counterHitRate;
            if (counterHit) {
                attacker.hp = Math.max(0, attacker.hp - counterDamage);
                this.addBattleLog(`${defender.name} 反擊，造成 ${counterDamage} 點傷害！`, 'counter');
                this.createDamageNumber(attacker.row, attacker.col, counterDamage, false);
            } else {
                this.addBattleLog(`${defender.name} 反擊失手！`, 'miss');
            }
        }
        
        // Mark unit as acted
        attacker.hasActed = true;
        this.selectedUnit = null;
        this.showingAttackRange = false;
        this.currentPreview = null;
        
        // Check battle end
        this.checkBattleEnd();
        
        this.refreshGrid();
    }

    /**
     * Cancel attack / 取消攻擊
     */
    cancelAttack() {
        this.currentPreview = null;
        this.render();
        this.setupEventListeners();
    }

    /**
     * Create damage number animation / 創建傷害數字動畫
     */
    createDamageNumber(row, col, damage, isCritical) {
        const grid = document.getElementById('battle-grid');
        if (!grid) return;
        
        const cell = grid.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (!cell) return;
        
        const rect = cell.getBoundingClientRect();
        const damageEl = document.createElement('div');
        damageEl.className = `damage-number ${isCritical ? 'critical' : ''}`;
        damageEl.textContent = `-${damage}`;
        damageEl.style.left = `${rect.left + rect.width / 2}px`;
        damageEl.style.top = `${rect.top}px`;
        
        document.body.appendChild(damageEl);
        
        setTimeout(() => damageEl.remove(), 1000);
    }

    /**
     * End player turn / 結束玩家回合
     */
    endPlayerTurn() {
        this.selectedUnit = null;
        this.showingMoveRange = false;
        this.showingAttackRange = false;
        
        // Reset all player units
        this.playerUnits.forEach(unit => unit.hasActed = false);
        
        this.battleState = 'enemy_turn';
        this.addBattleLog('敵人回合開始', 'turn');
        this.refreshGrid();
        
        // Execute enemy turn after a short delay
        setTimeout(() => this.executeEnemyTurn(), 1000);
    }

    /**
     * Execute enemy turn / 執行敵人回合
     */
    async executeEnemyTurn() {
        for (const enemy of this.enemyUnits) {
            if (enemy.hp <= 0) continue;
            
            await this.delay(500);
            
            const action = this.battleAI.executeTurn(
                enemy, this.playerUnits, this.units, this.terrain, this.terrainSystem
            );
            
            if (action.action === 'attack') {
                this.executeEnemyAttack(enemy, action.target);
            } else if (action.action === 'move') {
                enemy.row = action.destination.row;
                enemy.col = action.destination.col;
                this.addBattleLog(`${enemy.name} 移動到 (${enemy.row}, ${enemy.col})`, 'enemy');
                this.refreshGrid();
                
                // Check if can attack after moving
                const attackRange = this.calculateAttackRange(enemy);
                const target = this.playerUnits.find(u => 
                    attackRange.some(p => p.row === u.row && p.col === u.col) && u.hp > 0
                );
                
                if (target) {
                    await this.delay(300);
                    this.executeEnemyAttack(enemy, target);
                }
            }
            
            await this.delay(300);
        }
        
        // End enemy turn
        this.endEnemyTurn();
    }

    /**
     * Execute enemy attack / 執行敵人攻擊
     */
    executeEnemyAttack(attacker, defender) {
        const isBackstab = this.combatCalculator.isBackstab(
            attacker.row, attacker.col, defender.row, defender.col, defender.facing
        );
        
        const damage = this.combatCalculator.calculateDamage(
            attacker, defender, this.terrain, this.terrainSystem, false, isBackstab
        );
        
        const hitRate = this.combatCalculator.calculateHitRate(
            attacker, defender, this.terrain, this.terrainSystem, isBackstab
        );
        
        const hit = Math.random() * 100 < hitRate;
        if (hit) {
            defender.hp = Math.max(0, defender.hp - damage);
            this.addBattleLog(`${attacker.name} 攻擊 ${defender.name}，造成 ${damage} 點傷害！`, 'enemy');
            this.createDamageNumber(defender.row, defender.col, damage, isBackstab);
        } else {
            this.addBattleLog(`${attacker.name} 攻擊失手！`, 'miss');
        }
        
        // Counter
        const dist = Math.abs(attacker.row - defender.row) + Math.abs(attacker.col - defender.col);
        const canCounter = defender.hp > 0 && 
            dist >= (defender.attackRange?.min || 1) && dist <= (defender.attackRange?.max || 1);
        
        if (canCounter) {
            const counterDamage = this.combatCalculator.calculateDamage(
                defender, attacker, this.terrain, this.terrainSystem, true, false
            );
            const counterHitRate = this.combatCalculator.calculateHitRate(
                defender, attacker, this.terrain, this.terrainSystem, false
            );
            
            const counterHit = Math.random() * 100 < counterHitRate;
            if (counterHit) {
                attacker.hp = Math.max(0, attacker.hp - counterDamage);
                this.addBattleLog(`${defender.name} 反擊，造成 ${counterDamage} 點傷害！`, 'counter');
                this.createDamageNumber(attacker.row, attacker.col, counterDamage, false);
            }
        }
        
        this.checkBattleEnd();
        this.refreshGrid();
    }

    /**
     * End enemy turn / 結束敵人回合
     */
    endEnemyTurn() {
        this.turnCount++;
        this.battleState = 'player_turn';
        this.addBattleLog(`第 ${this.turnCount} 回合 - 玩家回合`, 'turn');
        this.refreshGrid();
    }

    /**
     * Check battle end / 檢查戰鬥結束
     */
    checkBattleEnd() {
        // Check if all enemies defeated
        const aliveEnemies = this.enemyUnits.filter(u => u.hp > 0);
        if (aliveEnemies.length === 0) {
            this.victory();
            return true;
        }
        
        // Check if all players defeated
        const alivePlayers = this.playerUnits.filter(u => u.hp > 0);
        if (alivePlayers.length === 0) {
            this.defeat();
            return true;
        }
        
        return false;
    }

    /**
     * Victory / 勝利
     */
    victory() {
        this.battleState = 'victory';
        this.addBattleLog('戰鬥勝利！', 'success');
        
        // Rewards
        const expGain = 100;
        const stonesGain = 10;
        
        this.character.experience += expGain;
        this.character.resources.spiritStones += stonesGain;
        
        // Restore player unit HP to character
        const playerUnit = this.playerUnits[0];
        if (playerUnit) {
            this.character.stats.health = playerUnit.hp;
        }
        
        this.uiManager.showDialog({
            title: '戰鬥勝利！',
            content: `
                <div style="text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                    <h3 style="color: var(--gold-primary);">擊敗所有敵人！</h3>
                    <div style="margin: 2rem 0;">
                        <p>獲得經驗：${expGain}</p>
                        <p>獲得靈石：${stonesGain}</p>
                    </div>
                </div>
            `,
            showCancel: false,
            confirmText: '確認',
            onConfirm: () => {
                this.battleState = 'idle';
                this.render();
                this.setupEventListeners();
                this.uiManager.updateHUD(this.character);
                
                // Save
                const event = new CustomEvent('saveGame');
                document.dispatchEvent(event);
            }
        });
    }

    /**
     * Defeat / 失敗
     */
    defeat() {
        this.battleState = 'defeat';
        this.addBattleLog('戰鬥失敗...', 'error');
        
        this.uiManager.showDialog({
            title: '戰鬥失敗',
            content: `
                <div style="text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">💀</div>
                    <h3 style="color: var(--danger);">全軍覆沒</h3>
                    <p style="margin: 2rem 0; color: var(--text-secondary);">
                        修煉不足，需要繼續努力
                    </p>
                </div>
            `,
            showCancel: false,
            confirmText: '返回',
            onConfirm: () => {
                // Restore some health
                this.character.stats.health = Math.floor(this.character.stats.maxHealth * 0.5);
                this.battleState = 'idle';
                this.render();
                this.setupEventListeners();
                this.uiManager.updateHUD(this.character);
            }
        });
    }

    /**
     * Refresh grid / 刷新格子
     */
    refreshGrid() {
        this.render();
        this.setupEventListeners();
    }

    /**
     * Add battle log / 添加戰鬥日誌
     * @param {string} message - Log message
     * @param {string} type - Log type
     */
    addBattleLog(message, type = '') {
        const logEl = document.getElementById('log-entries');
        if (!logEl) return;
        
        const entry = document.createElement('p');
        entry.className = `log-entry ${type}`;
        entry.textContent = message;
        
        logEl.appendChild(entry);
        logEl.scrollTop = logEl.scrollHeight;
    }

    /**
     * Delay helper / 延遲輔助函數
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Update panel / 更新面板
     */
    update() {
        if (this.character && this.battleState !== 'idle') {
            // Could add continuous animations here
        }
    }
}

// Add CSS
const style = document.createElement('style');
style.textContent = `
    .battle-menu {
        padding: 2rem;
    }
    
    .battle-intro {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .battle-intro h3 {
        color: var(--gold-primary);
        font-size: 1.5rem;
    }
    
    .enemy-selection {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }
    
    .enemy-card {
        padding: 1.5rem;
        background: var(--bg-elevated);
        border: 2px solid var(--spirit-primary);
        border-radius: var(--radius-lg);
        text-align: center;
        transition: all 0.3s ease;
    }
    
    .enemy-card:hover:not(.disabled) {
        transform: translateY(-4px);
        box-shadow: var(--shadow-glow);
    }
    
    .enemy-card.disabled {
        opacity: 0.5;
    }
    
    .enemy-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }
    
    .enemy-card h4 {
        color: var(--text-primary);
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
    }
    
    .enemy-level {
        color: var(--gold-primary);
        margin-bottom: 0.5rem;
    }
    
    .enemy-desc {
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin-bottom: 1rem;
    }
    
    .enemy-stats {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1rem;
        color: var(--text-secondary);
    }
    
    .btn-challenge {
        width: 100%;
    }
    
    /* SRPG Battlefield */
    .battlefield-srpg {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        height: calc(100vh - 200px);
        overflow: hidden;
    }
    
    .battle-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--bg-elevated);
        border-radius: var(--radius-md);
    }
    
    .turn-info {
        display: flex;
        gap: 1rem;
        align-items: center;
    }
    
    .turn-label {
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--gold-primary);
    }
    
    .turn-phase {
        color: var(--spirit-primary);
        font-size: 1rem;
    }
    
    .battle-main {
        display: flex;
        gap: 1rem;
        flex: 1;
        overflow: hidden;
    }
    
    .battle-grid-srpg {
        display: grid;
        grid-template-columns: repeat(15, 1fr);
        gap: 2px;
        padding: 0.5rem;
        background: var(--bg-elevated);
        border-radius: var(--radius-md);
        flex: 1;
        overflow: auto;
        aspect-ratio: 1;
        max-height: calc(100vh - 300px);
    }
    
    .grid-cell-srpg {
        aspect-ratio: 1;
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .grid-cell-srpg:hover {
        filter: brightness(1.2);
        transform: scale(1.05);
        z-index: 1;
    }
    
    .grid-cell-srpg.movable {
        background-color: rgba(59, 130, 246, 0.3) !important;
        border: 2px solid #3b82f6;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    }
    
    .grid-cell-srpg.attackable {
        background-color: rgba(239, 68, 68, 0.3) !important;
        border: 2px solid #ef4444;
        box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
    }
    
    .grid-cell-srpg.selected {
        border: 3px solid var(--gold-primary);
        box-shadow: 0 0 15px rgba(251, 191, 36, 0.8);
        z-index: 2;
    }
    
    .grid-cell-srpg.acted {
        opacity: 0.5;
        filter: grayscale(0.7);
    }
    
    .grid-unit {
        font-size: 1.5rem;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        pointer-events: none;
    }
    
    .grid-unit.player {
        filter: drop-shadow(0 0 5px #4fd1c5);
    }
    
    .grid-unit.enemy {
        filter: drop-shadow(0 0 5px #ef4444);
    }
    
    .battle-sidebar {
        width: 300px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: hidden;
    }
    
    .unit-info-panel {
        padding: 1rem;
        background: var(--bg-elevated);
        border-radius: var(--radius-md);
        border: 2px solid var(--spirit-primary);
    }
    
    .unit-details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .unit-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }
    
    .unit-icon-large {
        font-size: 2.5rem;
    }
    
    .unit-details h3 {
        color: var(--gold-primary);
        font-size: 1.2rem;
    }
    
    .unit-stats {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .stat-row {
        display: flex;
        justify-content: space-between;
        padding: 0.25rem;
        background: var(--bg-tertiary);
        border-radius: var(--radius-sm);
        font-size: 0.875rem;
    }
    
    .terrain-info {
        margin-top: 0.5rem;
        padding: 0.5rem;
        background: var(--bg-tertiary);
        border-radius: var(--radius-sm);
    }
    
    .terrain-info h4 {
        color: var(--spirit-primary);
        margin-bottom: 0.25rem;
        font-size: 0.875rem;
    }
    
    .terrain-info p {
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin: 0.1rem 0;
    }
    
    .battle-log {
        flex: 1;
        padding: 1rem;
        background: var(--bg-elevated);
        border-radius: var(--radius-md);
        border: 2px solid var(--spirit-primary);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    
    .battle-log h4 {
        color: var(--gold-primary);
        margin-bottom: 0.5rem;
        font-size: 1rem;
    }
    
    .log-entries {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .log-entry {
        padding: 0.5rem;
        border-left: 3px solid var(--spirit-primary);
        padding-left: 0.75rem;
        color: var(--text-secondary);
        font-size: 0.75rem;
        background: var(--bg-tertiary);
        border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    }
    
    .log-entry.attack {
        border-color: var(--danger);
        color: var(--text-primary);
    }
    
    .log-entry.counter {
        border-color: var(--warning);
        color: var(--warning);
    }
    
    .log-entry.miss {
        border-color: var(--text-dim);
        color: var(--text-dim);
    }
    
    .log-entry.enemy {
        border-color: var(--danger);
        color: var(--danger);
    }
    
    .log-entry.turn {
        border-color: var(--gold-primary);
        color: var(--gold-primary);
        font-weight: bold;
    }
    
    .log-entry.success {
        border-color: var(--success);
        color: var(--success);
    }
    
    .log-entry.error {
        border-color: var(--danger);
        color: var(--danger);
    }
    
    /* Battle Preview Window */
    .battle-preview-window {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--bg-elevated);
        border: 3px solid var(--gold-primary);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        z-index: 1000;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
        min-width: 400px;
    }
    
    .battle-preview-window h4 {
        color: var(--gold-primary);
        text-align: center;
        margin-bottom: 1rem;
        font-size: 1.25rem;
    }
    
    .preview-combatants {
        display: flex;
        justify-content: space-around;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .preview-unit {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .preview-icon {
        font-size: 3rem;
    }
    
    .preview-name {
        font-weight: bold;
        color: var(--text-primary);
    }
    
    .preview-damage {
        color: var(--danger);
        font-weight: bold;
        font-size: 1.1rem;
    }
    
    .preview-hit {
        color: var(--info);
        font-size: 0.9rem;
    }
    
    .preview-vs {
        font-size: 2rem;
        font-weight: bold;
        color: var(--gold-primary);
    }
    
    .preview-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    
    .preview-actions button {
        flex: 1;
    }
    
    /* Damage Number Animation */
    .damage-number {
        position: fixed;
        font-size: 2rem;
        font-weight: bold;
        color: #ef4444;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        pointer-events: none;
        z-index: 9999;
        animation: damageFloat 1s ease-out forwards;
    }
    
    .damage-number.critical {
        color: #fbbf24;
        font-size: 2.5rem;
        text-shadow: 0 0 10px rgba(251, 191, 36, 0.8);
    }
    
    @keyframes damageFloat {
        0% {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

export default BattleInterface;
