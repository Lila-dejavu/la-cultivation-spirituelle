/**
 * Character Panel - 角色面板
 * Displays detailed character information
 * 顯示角色詳細資訊
 */

export class CharacterPanel {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.character = null;
    }

    /**
     * Initialize panel / 初始化面板
     * @param {Object} character - Character data
     */
    initialize(character) {
        this.character = character;
        this.render();
    }

    /**
     * Render character panel / 渲染角色面板
     */
    render() {
        const panel = document.getElementById('character-panel');
        if (!panel || !this.character) return;

        panel.innerHTML = `
            <div class="panel-section">
                <h2 class="panel-title">角色資訊</h2>
                <div class="character-header">
                    <div class="character-portrait">
                        <div class="portrait-icon">🧙</div>
                    </div>
                    <div class="character-basic-info">
                        <h3 class="character-name">${this.character.name}</h3>
                        <p class="character-level">等級 ${this.character.level}</p>
                        <p class="character-realm">${this.getRealmDisplay()}</p>
                    </div>
                </div>
            </div>

            <div class="panel-section">
                <h2 class="panel-title">基礎屬性</h2>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-icon">❤️</div>
                        <div class="stat-info">
                            <span class="stat-name">生命值</span>
                            <span class="stat-value">${this.character.stats.health} / ${this.character.stats.maxHealth}</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">💙</div>
                        <div class="stat-info">
                            <span class="stat-name">靈力</span>
                            <span class="stat-value">${this.character.stats.mana} / ${this.character.stats.maxMana}</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">⚔️</div>
                        <div class="stat-info">
                            <span class="stat-name">攻擊力</span>
                            <span class="stat-value">${this.character.stats.attack}</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">🛡️</div>
                        <div class="stat-info">
                            <span class="stat-name">防禦力</span>
                            <span class="stat-value">${this.character.stats.defense}</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">⚡</div>
                        <div class="stat-info">
                            <span class="stat-name">速度</span>
                            <span class="stat-value">${this.character.stats.speed}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="panel-section">
                <h2 class="panel-title">靈根與命格</h2>
                <div class="special-info">
                    <div class="info-card">
                        <h4>🌟 靈根</h4>
                        <p><strong>${this.getRootTypeName()}</strong> - ${this.getRootQualityName()}</p>
                        <p class="info-desc">元素：${this.getRootElements()}</p>
                        <p class="info-desc">修煉速度：${this.character.spiritualRoot.cultivationSpeed}x</p>
                    </div>
                    <div class="info-card">
                        <h4>✨ 命格</h4>
                        <p><strong>${this.getDestinyName()}</strong></p>
                        <p class="info-desc">命運值：${this.character.destiny.value}</p>
                        <p class="info-desc">業力：${this.character.destiny.karma}</p>
                    </div>
                </div>
            </div>

            <div class="panel-section">
                <h2 class="panel-title">裝備</h2>
                <div class="equipment-grid">
                    ${this.renderEquipment()}
                </div>
            </div>

            <div class="panel-section">
                <h2 class="panel-title">修煉統計</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">修為</span>
                        <span class="info-value">${Math.floor(this.character.cultivation.spiritualPower)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">領悟</span>
                        <span class="info-value">${this.character.cultivation.comprehension || 0}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">經驗值</span>
                        <span class="info-value">${this.character.experience} / ${this.character.nextLevelExp}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">擊敗敵人</span>
                        <span class="info-value">0</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render equipment slots / 渲染裝備槽位
     * @returns {string} HTML string
     */
    renderEquipment() {
        const equipment = this.character.resources?.equipment || {};
        const slots = [
            { key: 'weapon', name: '武器', icon: '⚔️' },
            { key: 'armor', name: '護甲', icon: '🛡️' },
            { key: 'accessory', name: '飾品', icon: '💍' }
        ];

        return slots.map(slot => {
            const item = equipment[slot.key];
            return `
                <div class="equipment-slot ${item ? 'equipped' : 'empty'}">
                    <div class="slot-icon">${slot.icon}</div>
                    <div class="slot-info">
                        <p class="slot-name">${slot.name}</p>
                        ${item ? `
                            <p class="item-name">${item.name}</p>
                            <p class="item-bonus">+${item.attack || item.defense || 0}</p>
                        ` : `
                            <p class="empty-text">空</p>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Update panel / 更新面板
     */
    update() {
        if (this.character) {
            this.render();
        }
    }

    // Helper methods
    getRealmDisplay() {
        const realmNames = {
            qi_condensation: '凝氣期',
            foundation: '築基期',
            golden_core: '金丹期'
        };
        const stageNames = {
            early: '初期',
            middle: '中期',
            late: '後期',
            peak: '圓滿'
        };
        return `${realmNames[this.character.cultivation.realm]} ${stageNames[this.character.cultivation.stage]}`;
    }

    getRootTypeName() {
        const names = {
            single: '單靈根',
            mutant: '變異靈根',
            dual: '雙靈根'
        };
        return names[this.character.spiritualRoot.type] || '未知';
    }

    getRootQualityName() {
        const names = { 1: '凡品', 2: '普通', 3: '上品', 4: '天品', 5: '神品' };
        return names[this.character.spiritualRoot.quality] || '未知';
    }

    getRootElements() {
        const names = { metal: '金', fire: '火', thunder: '雷', water: '水', wood: '木' };
        return this.character.spiritualRoot.elements.map(e => names[e] || e).join('、');
    }

    getDestinyName() {
        const names = {
            protagonist: '主角命格',
            genius: '天才命格',
            ordinary: '普通命格'
        };
        return names[this.character.destiny.type] || '未知命格';
    }
}

// Add CSS
const style = document.createElement('style');
style.textContent = `
    .character-header {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        padding: 1rem;
    }
    
    .character-portrait {
        width: 100px;
        height: 100px;
    }
    
    .portrait-icon {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        background: var(--bg-elevated);
        border: 3px solid var(--gold-primary);
        border-radius: 50%;
        box-shadow: 0 0 20px var(--gold-glow);
    }
    
    .character-basic-info h3 {
        font-size: 2rem;
        color: var(--gold-primary);
        margin-bottom: 0.5rem;
    }
    
    .character-level, .character-realm {
        color: var(--text-secondary);
        margin-bottom: 0.25rem;
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .stat-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--bg-elevated);
        border-radius: var(--radius-md);
        border: 1px solid var(--spirit-primary);
    }
    
    .stat-icon {
        font-size: 2rem;
    }
    
    .stat-info {
        display: flex;
        flex-direction: column;
    }
    
    .stat-name {
        color: var(--text-secondary);
        font-size: 0.875rem;
    }
    
    .stat-value {
        color: var(--text-primary);
        font-size: 1.25rem;
        font-weight: bold;
    }
    
    .special-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }
    
    .info-card {
        padding: 1.5rem;
        background: var(--bg-elevated);
        border-radius: var(--radius-md);
        border: 2px solid var(--spirit-primary);
    }
    
    .info-card h4 {
        color: var(--gold-primary);
        margin-bottom: 1rem;
        font-size: 1.25rem;
    }
    
    .info-card p {
        margin-bottom: 0.5rem;
    }
    
    .info-desc {
        color: var(--text-secondary);
        font-size: 0.875rem;
    }
    
    .equipment-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .equipment-slot {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--bg-elevated);
        border-radius: var(--radius-md);
        border: 2px dashed var(--text-dim);
    }
    
    .equipment-slot.equipped {
        border-style: solid;
        border-color: var(--gold-primary);
    }
    
    .slot-icon {
        font-size: 2rem;
    }
    
    .slot-name {
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin-bottom: 0.25rem;
    }
    
    .item-name {
        color: var(--text-primary);
        font-weight: bold;
        margin-bottom: 0.25rem;
    }
    
    .item-bonus {
        color: var(--success);
        font-size: 0.875rem;
    }
    
    .empty-text {
        color: var(--text-dim);
        font-style: italic;
    }
`;
document.head.appendChild(style);

export default CharacterPanel;
