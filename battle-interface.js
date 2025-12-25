/**
 * Battle Interface - 戰鬥介面
 * Manages tactical battle system
 * 管理戰術戰鬥系統
 */

export class BattleInterface {
    constructor(uiManager, animationSystem) {
        this.uiManager = uiManager;
        this.animationSystem = animationSystem;
        this.character = null;
        this.currentEnemy = null;
        this.battleState = 'idle'; // idle, player_turn, enemy_turn, victory, defeat
        this.gridSize = { rows: 5, cols: 5 };
        this.playerPosition = { row: 2, col: 1 };
        this.enemyPosition = { row: 2, col: 3 };
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
                <h2 class="panel-title">戰鬥系統</h2>
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
                    <h3>選擇對手</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                        測試您的修為，挑戰妖獸
                    </p>
                </div>
                
                <div class="enemy-selection">
                    <div class="enemy-card" data-enemy="spirit_wolf">
                        <div class="enemy-icon">🐺</div>
                        <h4>靈狼</h4>
                        <p class="enemy-level">等級 5</p>
                        <p class="enemy-desc">低級妖獸，速度較快</p>
                        <div class="enemy-stats">
                            <span>❤️ 500</span>
                            <span>⚔️ 40</span>
                        </div>
                        <button class="btn primary btn-challenge" data-enemy="spirit_wolf">
                            挑戰
                        </button>
                    </div>
                    
                    <div class="enemy-card disabled">
                        <div class="enemy-icon">🐯</div>
                        <h4>烈焰虎</h4>
                        <p class="enemy-level">等級 50</p>
                        <p class="enemy-desc">中級妖獸，火屬性</p>
                        <div class="enemy-stats">
                            <span>❤️ 5000</span>
                            <span>⚔️ 400</span>
                        </div>
                        <button class="btn secondary" disabled>
                            等級不足
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
            <div class="battlefield">
                <div class="battle-info">
                    <div class="combatant player">
                        <div class="combatant-avatar">🧙</div>
                        <div class="combatant-info">
                            <h4>${this.character.name}</h4>
                            <div class="health-bar">
                                <div class="health-fill" style="width: ${this.getHealthPercentage('player')}%"></div>
                                <span class="health-text">${this.character.stats.health}/${this.character.stats.maxHealth}</span>
                            </div>
                            <div class="mana-bar-small">
                                <div class="mana-fill" style="width: ${this.getManaPercentage()}%"></div>
                                <span class="mana-text">${this.character.stats.mana}/${this.character.stats.maxMana}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="vs-indicator">VS</div>
                    
                    <div class="combatant enemy">
                        <div class="combatant-avatar">🐺</div>
                        <div class="combatant-info">
                            <h4>${this.currentEnemy?.name || '靈狼'}</h4>
                            <div class="health-bar">
                                <div class="health-fill" style="width: ${this.getHealthPercentage('enemy')}%"></div>
                                <span class="health-text">${this.currentEnemy?.health || 500}/${this.currentEnemy?.maxHealth || 500}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="battle-grid">
                    ${this.renderGrid()}
                </div>
                
                <div class="battle-actions">
                    <h4>戰鬥操作</h4>
                    <div class="action-buttons">
                        <button class="action-btn" id="btn-basic-attack">
                            <span class="action-icon">⚔️</span>
                            <span class="action-name">基礎攻擊</span>
                        </button>
                        <button class="action-btn" id="btn-skill-fireball">
                            <span class="action-icon">🔥</span>
                            <span class="action-name">火球術</span>
                            <span class="action-cost">💙 30</span>
                        </button>
                        <button class="action-btn secondary" id="btn-defend">
                            <span class="action-icon">🛡️</span>
                            <span class="action-name">防禦</span>
                        </button>
                        <button class="action-btn danger" id="btn-flee">
                            <span class="action-icon">🏃</span>
                            <span class="action-name">逃跑</span>
                        </button>
                    </div>
                </div>
                
                <div class="battle-log" id="battle-log">
                    <p class="log-entry">戰鬥開始！</p>
                </div>
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
                const hasPlayer = row === this.playerPosition.row && col === this.playerPosition.col;
                const hasEnemy = row === this.enemyPosition.row && col === this.enemyPosition.col;
                
                let cellClass = 'grid-cell';
                let content = '';
                
                if (hasPlayer) {
                    cellClass += ' player-cell';
                    content = '<div class="grid-unit player">🧙</div>';
                } else if (hasEnemy) {
                    cellClass += ' enemy-cell';
                    content = '<div class="grid-unit enemy">🐺</div>';
                }
                
                html += `<div class="${cellClass}" data-row="${row}" data-col="${col}">${content}</div>`;
            }
        }
        return html;
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

        // Battle action buttons
        const basicAttackBtn = document.getElementById('btn-basic-attack');
        if (basicAttackBtn) {
            basicAttackBtn.addEventListener('click', () => this.performAction('basic_attack'));
        }

        const fireballBtn = document.getElementById('btn-skill-fireball');
        if (fireballBtn) {
            fireballBtn.addEventListener('click', () => this.performAction('fireball'));
        }

        const defendBtn = document.getElementById('btn-defend');
        if (defendBtn) {
            defendBtn.addEventListener('click', () => this.performAction('defend'));
        }

        const fleeBtn = document.getElementById('btn-flee');
        if (fleeBtn) {
            fleeBtn.addEventListener('click', () => this.fleeBattle());
        }
    }

    /**
     * Start battle / 開始戰鬥
     * @param {string} enemyId - Enemy ID
     */
    startBattle(enemyId) {
        // Initialize enemy
        this.currentEnemy = {
            id: enemyId,
            name: '靈狼',
            level: 5,
            health: 500,
            maxHealth: 500,
            attack: 40,
            defense: 30,
            speed: 50
        };

        this.battleState = 'player_turn';
        this.render();
        this.setupEventListeners();
        this.addBattleLog('戰鬥開始！');
    }

    /**
     * Perform action / 執行動作
     * @param {string} action - Action type
     */
    performAction(action) {
        if (this.battleState !== 'player_turn') return;

        switch (action) {
            case 'basic_attack':
                this.playerBasicAttack();
                break;
            case 'fireball':
                this.playerFireball();
                break;
            case 'defend':
                this.playerDefend();
                break;
        }
    }

    /**
     * Player basic attack / 玩家基礎攻擊
     */
    playerBasicAttack() {
        const damage = Math.floor(this.character.stats.attack * (1 + Math.random() * 0.2));
        this.currentEnemy.health -= damage;
        
        this.addBattleLog(`${this.character.name} 使用基礎攻擊，造成 ${damage} 點傷害！`);
        
        // Create attack animation
        if (this.animationSystem) {
            const playerEl = document.querySelector('.player-cell');
            const enemyEl = document.querySelector('.enemy-cell');
            if (playerEl && enemyEl) {
                const playerRect = playerEl.getBoundingClientRect();
                const enemyRect = enemyEl.getBoundingClientRect();
                this.animationSystem.createSkillCastEffect(
                    { x: playerRect.left + playerRect.width / 2, y: playerRect.top + playerRect.height / 2 },
                    { x: enemyRect.left + enemyRect.width / 2, y: enemyRect.top + enemyRect.height / 2 },
                    'metal'
                );
            }
        }
        
        this.checkBattleEnd() || this.enemyTurn();
    }

    /**
     * Player fireball / 玩家火球術
     */
    playerFireball() {
        const manaCost = 30;
        
        if (this.character.stats.mana < manaCost) {
            this.addBattleLog('靈力不足！', 'warning');
            return;
        }
        
        this.character.stats.mana -= manaCost;
        
        // Calculate damage with element bonus
        const baseDamage = 100;
        const elementBonus = 1.5; // Fire is strong against some elements
        const damage = Math.floor(baseDamage * elementBonus * (1 + Math.random() * 0.2));
        
        this.currentEnemy.health -= damage;
        
        this.addBattleLog(`${this.character.name} 釋放火球術，造成 ${damage} 點火屬性傷害！`, 'fire');
        
        // Create fireball animation
        if (this.animationSystem) {
            const playerEl = document.querySelector('.player-cell');
            const enemyEl = document.querySelector('.enemy-cell');
            if (playerEl && enemyEl) {
                const playerRect = playerEl.getBoundingClientRect();
                const enemyRect = enemyEl.getBoundingClientRect();
                this.animationSystem.createSkillCastEffect(
                    { x: playerRect.left + playerRect.width / 2, y: playerRect.top + playerRect.height / 2 },
                    { x: enemyRect.left + enemyRect.width / 2, y: enemyRect.top + enemyRect.height / 2 },
                    'fire'
                );
            }
        }
        
        this.checkBattleEnd() || this.enemyTurn();
    }

    /**
     * Player defend / 玩家防禦
     */
    playerDefend() {
        this.addBattleLog(`${this.character.name} 進入防禦姿態`, 'info');
        this.enemyTurn();
    }

    /**
     * Enemy turn / 敵人回合
     */
    enemyTurn() {
        this.battleState = 'enemy_turn';
        
        setTimeout(() => {
            const damage = Math.floor(this.currentEnemy.attack * (0.8 + Math.random() * 0.4));
            this.character.stats.health -= damage;
            
            this.addBattleLog(`${this.currentEnemy.name} 攻擊，造成 ${damage} 點傷害！`, 'enemy');
            
            this.checkBattleEnd() || this.playerTurn();
        }, 1000);
    }

    /**
     * Player turn / 玩家回合
     */
    playerTurn() {
        this.battleState = 'player_turn';
        this.addBattleLog('你的回合', 'info');
        this.updateBattleDisplay();
    }

    /**
     * Check battle end / 檢查戰鬥結束
     * @returns {boolean} Is battle ended
     */
    checkBattleEnd() {
        if (this.currentEnemy.health <= 0) {
            this.victory();
            return true;
        }
        
        if (this.character.stats.health <= 0) {
            this.defeat();
            return true;
        }
        
        this.updateBattleDisplay();
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
        
        this.uiManager.showDialog({
            title: '戰鬥勝利！',
            content: `
                <div style="text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                    <h3 style="color: var(--gold-primary);">擊敗 ${this.currentEnemy.name}！</h3>
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
                    <h3 style="color: var(--danger);">被 ${this.currentEnemy.name} 擊敗</h3>
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
     * Flee battle / 逃跑
     */
    fleeBattle() {
        this.uiManager.showDialog({
            title: '逃跑',
            content: '確定要逃離戰鬥嗎？',
            confirmText: '確認',
            cancelText: '取消',
            onConfirm: () => {
                this.battleState = 'idle';
                this.addBattleLog('逃離戰鬥', 'info');
                this.render();
                this.setupEventListeners();
            }
        });
    }

    /**
     * Add battle log / 添加戰鬥日誌
     * @param {string} message - Log message
     * @param {string} type - Log type
     */
    addBattleLog(message, type = '') {
        const logEl = document.getElementById('battle-log');
        if (!logEl) return;
        
        const entry = document.createElement('p');
        entry.className = `log-entry ${type}`;
        entry.textContent = message;
        
        logEl.appendChild(entry);
        logEl.scrollTop = logEl.scrollHeight;
    }

    /**
     * Update battle display / 更新戰鬥顯示
     */
    updateBattleDisplay() {
        // Update health bars
        const playerHealthBar = document.querySelector('.combatant.player .health-fill');
        if (playerHealthBar) {
            playerHealthBar.style.width = `${this.getHealthPercentage('player')}%`;
        }
        
        const playerHealthText = document.querySelector('.combatant.player .health-text');
        if (playerHealthText) {
            playerHealthText.textContent = `${this.character.stats.health}/${this.character.stats.maxHealth}`;
        }
        
        const enemyHealthBar = document.querySelector('.combatant.enemy .health-fill');
        if (enemyHealthBar) {
            enemyHealthBar.style.width = `${this.getHealthPercentage('enemy')}%`;
        }
        
        const enemyHealthText = document.querySelector('.combatant.enemy .health-text');
        if (enemyHealthText) {
            enemyHealthText.textContent = `${this.currentEnemy.health}/${this.currentEnemy.maxHealth}`;
        }
        
        // Update mana
        const manaBar = document.querySelector('.mana-fill');
        if (manaBar) {
            manaBar.style.width = `${this.getManaPercentage()}%`;
        }
        
        const manaText = document.querySelector('.mana-text');
        if (manaText) {
            manaText.textContent = `${this.character.stats.mana}/${this.character.stats.maxMana}`;
        }
    }

    /**
     * Get health percentage / 獲取生命值百分比
     * @param {string} target - Target (player/enemy)
     * @returns {number} Percentage
     */
    getHealthPercentage(target) {
        if (target === 'player') {
            return (this.character.stats.health / this.character.stats.maxHealth) * 100;
        } else {
            return (this.currentEnemy.health / this.currentEnemy.maxHealth) * 100;
        }
    }

    /**
     * Get mana percentage / 獲取靈力百分比
     * @returns {number} Percentage
     */
    getManaPercentage() {
        return (this.character.stats.mana / this.character.stats.maxMana) * 100;
    }

    /**
     * Update panel / 更新面板
     */
    update() {
        if (this.character) {
            if (this.battleState !== 'idle') {
                this.updateBattleDisplay();
            }
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
    
    .battlefield {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .battle-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background: var(--bg-elevated);
        border-radius: var(--radius-md);
    }
    
    .combatant {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
    }
    
    .combatant-avatar {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        background: var(--bg-tertiary);
        border: 2px solid var(--gold-primary);
        border-radius: 50%;
    }
    
    .combatant-info {
        flex: 1;
    }
    
    .combatant-info h4 {
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }
    
    .health-bar, .mana-bar-small {
        position: relative;
        height: 20px;
        background: var(--bg-tertiary);
        border-radius: var(--radius-sm);
        margin-bottom: 0.25rem;
        overflow: hidden;
        border: 1px solid var(--text-dim);
    }
    
    .health-fill {
        height: 100%;
        background: linear-gradient(90deg, #ef4444, #dc2626);
        transition: width 0.5s ease;
    }
    
    .mana-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #2563eb);
        transition: width 0.5s ease;
    }
    
    .health-text, .mana-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.75rem;
        font-weight: bold;
        color: var(--text-primary);
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    }
    
    .vs-indicator {
        font-size: 2rem;
        font-weight: bold;
        color: var(--gold-primary);
        padding: 0 2rem;
    }
    
    .battle-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 4px;
        padding: 1rem;
        background: var(--bg-elevated);
        border-radius: var(--radius-md);
    }
    
    .grid-cell {
        aspect-ratio: 1;
        background: var(--bg-tertiary);
        border: 1px solid var(--text-dim);
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .grid-cell.player-cell {
        background: rgba(79, 209, 197, 0.2);
        border-color: var(--spirit-primary);
    }
    
    .grid-cell.enemy-cell {
        background: rgba(239, 68, 68, 0.2);
        border-color: var(--danger);
    }
    
    .grid-unit {
        font-size: 2rem;
    }
    
    .battle-actions {
        padding: 1rem;
        background: var(--bg-elevated);
        border-radius: var(--radius-md);
    }
    
    .battle-actions h4 {
        color: var(--gold-primary);
        margin-bottom: 1rem;
    }
    
    .action-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 0.5rem;
    }
    
    .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        background: var(--bg-tertiary);
        border: 2px solid var(--spirit-primary);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .action-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: var(--gold-primary);
    }
    
    .action-btn.secondary {
        border-color: var(--text-dim);
    }
    
    .action-btn.danger {
        border-color: var(--danger);
    }
    
    .action-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
    
    .action-name {
        font-size: 0.875rem;
        font-weight: bold;
        margin-bottom: 0.25rem;
    }
    
    .action-cost {
        font-size: 0.75rem;
        color: var(--info);
    }
    
    .battle-log {
        max-height: 200px;
        overflow-y: auto;
        padding: 1rem;
        background: var(--bg-elevated);
        border-radius: var(--radius-md);
        border: 1px solid var(--spirit-primary);
    }
    
    .log-entry {
        padding: 0.5rem;
        margin-bottom: 0.25rem;
        border-left: 3px solid var(--spirit-primary);
        padding-left: 0.75rem;
        color: var(--text-secondary);
        font-size: 0.875rem;
    }
    
    .log-entry.fire {
        border-color: var(--element-fire);
        color: var(--element-fire);
    }
    
    .log-entry.enemy {
        border-color: var(--danger);
        color: var(--text-primary);
    }
    
    .log-entry.success {
        border-color: var(--success);
        color: var(--success);
    }
    
    .log-entry.warning {
        border-color: var(--warning);
        color: var(--warning);
    }
    
    .log-entry.error {
        border-color: var(--danger);
        color: var(--danger);
    }
`;
document.head.appendChild(style);

export default BattleInterface;
