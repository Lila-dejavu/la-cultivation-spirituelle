/**
 * Skill Interface - 技能介面
 * Manages skills and abilities display
 * 管理技能和能力顯示
 */

export class SkillInterface {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.character = null;
    }

    /**
     * Initialize interface / 初始化介面
     * @param {Object} character - Character data
     */
    initialize(character) {
        this.character = character;
        this.render();
    }

    /**
     * Render skill panel / 渲染技能面板
     */
    render() {
        const panel = document.getElementById('skills-panel');
        if (!panel || !this.character) return;

        panel.innerHTML = `
            <div class="panel-section">
                <h2 class="panel-title">已學技能</h2>
                <div class="skills-grid">
                    ${this.renderSkills()}
                </div>
            </div>

            <div class="panel-section">
                <h2 class="panel-title">技能分類</h2>
                <div class="skill-categories">
                    <div class="category-card">
                        <h4>⚔️ 劍訣</h4>
                        <p class="category-count">${this.countSkillsByType('sword')}</p>
                    </div>
                    <div class="category-card">
                        <h4>🔥 法術</h4>
                        <p class="category-count">${this.countSkillsByType('spell')}</p>
                    </div>
                    <div class="category-card">
                        <h4>✨ 神通</h4>
                        <p class="category-count">${this.countSkillsByType('divine')}</p>
                    </div>
                    <div class="category-card">
                        <h4>🛡️ 輔助</h4>
                        <p class="category-count">${this.countSkillsByType('support')}</p>
                    </div>
                </div>
            </div>

            <div class="panel-section">
                <h2 class="panel-title">技能說明</h2>
                <div class="skill-info-box">
                    <p style="color: var(--text-secondary); text-align: center;">
                        點擊技能查看詳細資訊
                    </p>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    /**
     * Setup event listeners / 設置事件監聽
     */
    setupEventListeners() {
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach(card => {
            card.addEventListener('click', () => {
                const skillIndex = parseInt(card.dataset.skillIndex);
                this.showSkillDetails(skillIndex);
            });
        });
    }

    /**
     * Render skills / 渲染技能
     * @returns {string} HTML string
     */
    renderSkills() {
        const skills = this.character.skills || [];
        
        if (skills.length === 0) {
            return `
                <div class="empty-skills">
                    <p>尚未學習任何技能</p>
                </div>
            `;
        }

        return skills.map((skill, index) => {
            return this.renderSkillCard(skill, index);
        }).join('');
    }

    /**
     * Render skill card / 渲染技能卡片
     * @param {Object} skill - Skill data
     * @param {number} index - Skill index
     * @returns {string} HTML string
     */
    renderSkillCard(skill, index) {
        const icon = this.getSkillIcon(skill);
        const element = skill.element ? this.getElementBadge(skill.element) : '';
        
        return `
            <div class="skill-card ${skill.type}" data-skill-index="${index}">
                <div class="skill-icon">${icon}</div>
                <div class="skill-content">
                    <h4 class="skill-name">${skill.name}</h4>
                    ${element}
                    ${skill.manaCost ? `
                        <div class="skill-cost">
                            <span>💙 ${skill.manaCost}</span>
                        </div>
                    ` : ''}
                    <p class="skill-type-label">${this.getSkillTypeLabel(skill.type)}</p>
                </div>
            </div>
        `;
    }

    /**
     * Get skill icon / 獲取技能圖示
     * @param {Object} skill - Skill data
     * @returns {string} Icon emoji
     */
    getSkillIcon(skill) {
        if (skill.type === 'basic') return '⚔️';
        if (skill.element === 'fire') return '🔥';
        if (skill.element === 'water') return '💧';
        if (skill.element === 'thunder') return '⚡';
        if (skill.element === 'ice') return '❄️';
        if (skill.element === 'wind') return '💨';
        return '✨';
    }

    /**
     * Get element badge / 獲取元素徽章
     * @param {string} element - Element type
     * @returns {string} HTML string
     */
    getElementBadge(element) {
        const elementNames = {
            fire: '火',
            water: '水',
            thunder: '雷',
            metal: '金',
            wood: '木',
            earth: '土',
            ice: '冰',
            wind: '風'
        };
        
        const name = elementNames[element] || element;
        return `<span class="element-badge ${element}">${name}</span>`;
    }

    /**
     * Get skill type label / 獲取技能類型標籤
     * @param {string} type - Skill type
     * @returns {string} Label
     */
    getSkillTypeLabel(type) {
        const labels = {
            basic: '基礎',
            spell: '法術',
            sword: '劍訣',
            divine: '神通',
            support: '輔助'
        };
        return labels[type] || type;
    }

    /**
     * Count skills by type / 統計類型技能數量
     * @param {string} type - Skill type
     * @returns {number} Count
     */
    countSkillsByType(type) {
        const skills = this.character.skills || [];
        return skills.filter(skill => skill.type === type).length;
    }

    /**
     * Show skill details / 顯示技能詳情
     * @param {number} index - Skill index
     */
    showSkillDetails(index) {
        const skill = this.character.skills[index];
        if (!skill) return;

        const icon = this.getSkillIcon(skill);
        const element = skill.element ? this.getElementBadge(skill.element) : '';
        
        this.uiManager.showDialog({
            title: '技能詳情',
            content: `
                <div style="text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">${icon}</div>
                    <h3 style="color: var(--gold-primary); margin-bottom: 0.5rem;">${skill.name}</h3>
                    ${element}
                    <div style="margin: 1.5rem 0;">
                        <div style="display: inline-block; margin: 0 1rem;">
                            <p style="color: var(--text-secondary); font-size: 0.875rem;">類型</p>
                            <p style="font-weight: bold;">${this.getSkillTypeLabel(skill.type)}</p>
                        </div>
                        ${skill.manaCost ? `
                            <div style="display: inline-block; margin: 0 1rem;">
                                <p style="color: var(--text-secondary); font-size: 0.875rem;">消耗</p>
                                <p style="font-weight: bold; color: var(--info);">💙 ${skill.manaCost}</p>
                            </div>
                        ` : ''}
                    </div>
                    <hr style="margin: 1rem 0; border-color: var(--spirit-primary);">
                    <p style="color: var(--text-secondary); line-height: 1.6;">
                        ${this.getSkillDescription(skill)}
                    </p>
                </div>
            `,
            showCancel: false,
            confirmText: '關閉'
        });
    }

    /**
     * Get skill description / 獲取技能描述
     * @param {Object} skill - Skill data
     * @returns {string} Description
     */
    getSkillDescription(skill) {
        const descriptions = {
            basic_attack: '普通攻擊，對單一敵人造成物理傷害。',
            fireball: '凝聚靈火，化為火球攻擊敵人，造成火屬性傷害。'
        };
        return descriptions[skill.id] || '強大的修仙技能。';
    }

    /**
     * Update panel / 更新面板
     */
    update() {
        if (this.character) {
            this.render();
        }
    }
}

// Add CSS
const style = document.createElement('style');
style.textContent = `
    .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
    }
    
    .skill-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--bg-elevated);
        border: 2px solid var(--spirit-primary);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .skill-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
        border-color: var(--gold-primary);
    }
    
    .skill-icon {
        font-size: 2.5rem;
        min-width: 50px;
        text-align: center;
    }
    
    .skill-content {
        flex: 1;
    }
    
    .skill-name {
        color: var(--text-primary);
        font-size: 1.125rem;
        margin-bottom: 0.25rem;
    }
    
    .element-badge {
        display: inline-block;
        padding: 0.125rem 0.5rem;
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        font-weight: bold;
        margin-bottom: 0.25rem;
    }
    
    .element-badge.fire {
        background: rgba(239, 68, 68, 0.2);
        color: var(--element-fire);
    }
    
    .element-badge.water {
        background: rgba(59, 130, 246, 0.2);
        color: var(--element-water);
    }
    
    .element-badge.thunder {
        background: rgba(234, 179, 8, 0.2);
        color: #eab308;
    }
    
    .element-badge.metal {
        background: rgba(192, 192, 192, 0.2);
        color: var(--element-metal);
    }
    
    .skill-cost {
        font-size: 0.875rem;
        color: var(--info);
        margin-bottom: 0.25rem;
    }
    
    .skill-type-label {
        font-size: 0.75rem;
        color: var(--text-dim);
    }
    
    .empty-skills {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        color: var(--text-dim);
        font-size: 1.125rem;
    }
    
    .skill-categories {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
    }
    
    .category-card {
        padding: 1.5rem;
        background: var(--bg-elevated);
        border: 2px solid var(--spirit-primary);
        border-radius: var(--radius-md);
        text-align: center;
    }
    
    .category-card h4 {
        color: var(--gold-primary);
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
    }
    
    .category-count {
        color: var(--text-primary);
        font-size: 2rem;
        font-weight: bold;
    }
    
    .skill-info-box {
        padding: 2rem;
        background: var(--bg-elevated);
        border-radius: var(--radius-md);
        border: 2px dashed var(--spirit-primary);
        min-height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
document.head.appendChild(style);

export default SkillInterface;
