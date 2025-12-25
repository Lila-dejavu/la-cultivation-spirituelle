/**
 * Cultivation Interface - 修煉介面
 * Manages cultivation panel UI
 * 管理修煉面板UI
 */

import { REALMS, REALM_STAGES } from './src/systems/cultivation/realm-system.js';

export class CultivationInterface {
    constructor(uiManager, animationSystem) {
        this.uiManager = uiManager;
        this.animationSystem = animationSystem;
        this.character = null;
        this.isCultivating = false;
        this.cultivationInterval = null;
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
     * Render cultivation panel / 渲染修煉面板
     */
    render() {
        const panel = document.getElementById('cultivation-panel');
        if (!panel || !this.character) return;

        panel.innerHTML = `
            <div class="panel-section">
                <h2 class="panel-title">修煉境界</h2>
                <div class="realm-info">
                    <div class="realm-display-large">
                        <div class="realm-icon">🧘</div>
                        <div class="realm-text">
                            <h3 id="current-realm">${this.getRealmName()}</h3>
                            <p id="current-stage">${this.getStageName()}</p>
                        </div>
                    </div>
                    
                    <div class="cultivation-progress">
                        <div class="progress-label">
                            <span>修為進度</span>
                            <span id="cultivation-progress-text">0%</span>
                        </div>
                        <div class="progress-bar-large">
                            <div class="progress-fill" id="cultivation-progress-bar" style="width: 0%"></div>
                        </div>
                    </div>

                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">靈力</span>
                            <span class="info-value" id="spiritual-power">0 / 1000</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">修煉速度</span>
                            <span class="info-value" id="cultivation-speed">1.0x</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">領悟</span>
                            <span class="info-value" id="comprehension">0</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">下一階段</span>
                            <span class="info-value" id="next-stage">${this.getNextStageName()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="panel-section">
                <h2 class="panel-title">修煉操作</h2>
                <div class="cultivation-actions">
                    <button class="btn primary btn-large" id="btn-cultivate">
                        <span class="btn-icon">🧘</span>
                        <span>開始修煉</span>
                    </button>
                    <button class="btn secondary btn-large" id="btn-breakthrough" disabled>
                        <span class="btn-icon">⚡</span>
                        <span>嘗試突破</span>
                    </button>
                </div>
                <div id="cultivation-status" class="cultivation-status"></div>
            </div>

            <div class="panel-section">
                <h2 class="panel-title">靈根資訊</h2>
                <div class="spiritual-root-info">
                    <div class="root-display">
                        <div class="root-icon-large">${this.getRootIcon()}</div>
                        <div class="root-details">
                            <h4>${this.getRootTypeName()}</h4>
                            <p class="root-quality">${this.getRootQualityName()}</p>
                            <p class="root-elements">元素親和：${this.getRootElements()}</p>
                            <p class="root-speed">修煉速度加成：${this.character.spiritualRoot.cultivationSpeed}x</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="panel-section">
                <h2 class="panel-title">修煉資源</h2>
                <div class="resource-grid">
                    <div class="resource-card">
                        <div class="resource-icon">💎</div>
                        <div class="resource-info">
                            <p class="resource-name">下品靈石</p>
                            <p class="resource-amount" id="spirit-stones-count">${this.character.resources.spiritStones}</p>
                        </div>
                        <button class="btn secondary btn-sm" id="btn-use-stones">使用</button>
                    </div>
                </div>
            </div>
        `;

        this.updateDisplay();
    }

    /**
     * Setup event listeners / 設置事件監聽
     */
    setupEventListeners() {
        // Cultivate button
        const cultivateBtn = document.getElementById('btn-cultivate');
        if (cultivateBtn) {
            cultivateBtn.addEventListener('click', () => {
                this.toggleCultivation();
            });
        }

        // Breakthrough button
        const breakthroughBtn = document.getElementById('btn-breakthrough');
        if (breakthroughBtn) {
            breakthroughBtn.addEventListener('click', () => {
                this.attemptBreakthrough();
            });
        }

        // Use spirit stones button
        const useStonesBtn = document.getElementById('btn-use-stones');
        if (useStonesBtn) {
            useStonesBtn.addEventListener('click', () => {
                this.useSpritStones();
            });
        }
    }

    /**
     * Toggle cultivation / 切換修煉狀態
     */
    toggleCultivation() {
        if (this.isCultivating) {
            this.stopCultivation();
        } else {
            this.startCultivation();
        }
    }

    /**
     * Start cultivation / 開始修煉
     */
    startCultivation() {
        this.isCultivating = true;
        
        const cultivateBtn = document.getElementById('btn-cultivate');
        if (cultivateBtn) {
            cultivateBtn.textContent = '停止修煉';
            cultivateBtn.classList.add('active');
        }

        this.updateStatus('正在修煉中...', 'info');

        // Start cultivation loop
        this.cultivationInterval = setInterval(() => {
            this.cultivate();
        }, 1000);
    }

    /**
     * Stop cultivation / 停止修煉
     */
    stopCultivation() {
        this.isCultivating = false;
        
        const cultivateBtn = document.getElementById('btn-cultivate');
        if (cultivateBtn) {
            cultivateBtn.innerHTML = '<span class="btn-icon">🧘</span><span>開始修煉</span>';
            cultivateBtn.classList.remove('active');
        }

        this.updateStatus('已停止修煉', 'info');

        if (this.cultivationInterval) {
            clearInterval(this.cultivationInterval);
            this.cultivationInterval = null;
        }
    }

    /**
     * Perform cultivation / 執行修煉
     */
    cultivate() {
        if (!this.character) return;

        // Calculate spiritual power gain
        const baseGain = 10;
        const speedMultiplier = this.character.spiritualRoot.cultivationSpeed;
        const gain = baseGain * speedMultiplier;

        // Add spiritual power
        this.character.cultivation.spiritualPower += gain;
        
        // Check if can breakthrough
        if (this.character.cultivation.spiritualPower >= this.character.cultivation.maxSpiritualPower) {
            this.character.cultivation.spiritualPower = this.character.cultivation.maxSpiritualPower;
            this.stopCultivation();
            this.updateStatus('靈力已達上限，可以嘗試突破！', 'success');
            
            // Enable breakthrough button
            const breakthroughBtn = document.getElementById('btn-breakthrough');
            if (breakthroughBtn) {
                breakthroughBtn.disabled = false;
            }
        }

        this.updateDisplay();
        
        // Save progress
        this.saveProgress();
    }

    /**
     * Attempt breakthrough / 嘗試突破
     */
    attemptBreakthrough() {
        if (!this.character) return;

        // Check if at max spiritual power
        if (this.character.cultivation.spiritualPower < this.character.cultivation.maxSpiritualPower) {
            this.uiManager.showNotification('靈力尚未達到突破要求', 'warning');
            return;
        }

        this.uiManager.showDialog({
            title: '境界突破',
            content: `
                <p>當前境界：${this.getRealmName()} ${this.getStageName()}</p>
                <p>突破後：${this.getRealmName()} ${this.getNextStageName()}</p>
                <br>
                <p style="color: var(--warning);">突破存在失敗風險，是否繼續？</p>
            `,
            confirmText: '開始突破',
            cancelText: '取消',
            onConfirm: () => {
                this.performBreakthrough();
            }
        });
    }

    /**
     * Perform breakthrough / 執行突破
     */
    performBreakthrough() {
        // Calculate success rate
        const baseRate = 0.7; // 70% base success rate
        const destinyBonus = (this.character.destiny.value / 100) * 0.2;
        const successRate = Math.min(0.95, baseRate + destinyBonus);

        const success = Math.random() < successRate;

        if (success) {
            this.breakthroughSuccess();
        } else {
            this.breakthroughFailure();
        }
    }

    /**
     * Handle breakthrough success / 處理突破成功
     */
    breakthroughSuccess() {
        // Advance stage
        this.advanceStage();
        
        // Reset spiritual power
        this.character.cultivation.spiritualPower = 0;
        
        // Update display
        this.updateDisplay();
        
        // Show effects
        const realmDisplay = document.querySelector('.realm-display-large');
        if (realmDisplay && this.animationSystem) {
            this.animationSystem.createBreakthroughEffect(realmDisplay);
        }
        
        // Notification
        this.uiManager.showNotification('突破成功！', 'success');
        this.updateStatus(`成功突破至 ${this.getRealmName()} ${this.getStageName()}！`, 'success');
        
        // Disable breakthrough button
        const breakthroughBtn = document.getElementById('btn-breakthrough');
        if (breakthroughBtn) {
            breakthroughBtn.disabled = true;
        }
        
        // Save progress
        this.saveProgress();
    }

    /**
     * Handle breakthrough failure / 處理突破失敗
     */
    breakthroughFailure() {
        // Lose some spiritual power
        this.character.cultivation.spiritualPower *= 0.7;
        
        // Update display
        this.updateDisplay();
        
        // Notification
        this.uiManager.showNotification('突破失敗...', 'error');
        this.updateStatus('突破失敗，損失部分靈力', 'error');
        
        // Disable breakthrough button
        const breakthroughBtn = document.getElementById('btn-breakthrough');
        if (breakthroughBtn) {
            breakthroughBtn.disabled = true;
        }
        
        // Save progress
        this.saveProgress();
    }

    /**
     * Advance cultivation stage / 提升修煉階段
     */
    advanceStage() {
        const stages = ['early', 'middle', 'late', 'peak'];
        const currentIndex = stages.indexOf(this.character.cultivation.stage);
        
        if (currentIndex < stages.length - 1) {
            // Advance to next stage
            this.character.cultivation.stage = stages[currentIndex + 1];
            this.character.cultivation.maxSpiritualPower *= 1.5;
        } else {
            // Advance to next realm
            // This would require realm system integration
            this.uiManager.showNotification('已達當前境界圓滿！', 'success');
        }
    }

    /**
     * Use spirit stones / 使用靈石
     */
    useSpritStones() {
        if (this.character.resources.spiritStones <= 0) {
            this.uiManager.showNotification('靈石不足', 'warning');
            return;
        }

        this.uiManager.showDialog({
            title: '使用靈石修煉',
            content: '消耗 10 下品靈石，獲得 500 點靈力',
            confirmText: '使用',
            cancelText: '取消',
            onConfirm: () => {
                if (this.character.resources.spiritStones >= 10) {
                    this.character.resources.spiritStones -= 10;
                    this.character.cultivation.spiritualPower += 500;
                    
                    if (this.character.cultivation.spiritualPower > this.character.cultivation.maxSpiritualPower) {
                        this.character.cultivation.spiritualPower = this.character.cultivation.maxSpiritualPower;
                    }
                    
                    this.updateDisplay();
                    this.uiManager.showNotification('使用靈石成功', 'success');
                    this.saveProgress();
                } else {
                    this.uiManager.showNotification('靈石不足', 'warning');
                }
            }
        });
    }

    /**
     * Update display / 更新顯示
     */
    updateDisplay() {
        if (!this.character) return;

        // Update spiritual power
        const powerEl = document.getElementById('spiritual-power');
        if (powerEl) {
            powerEl.textContent = `${Math.floor(this.character.cultivation.spiritualPower)} / ${this.character.cultivation.maxSpiritualPower}`;
        }

        // Update progress bar
        const progressBar = document.getElementById('cultivation-progress-bar');
        const progressText = document.getElementById('cultivation-progress-text');
        if (progressBar && progressText) {
            const percentage = (this.character.cultivation.spiritualPower / this.character.cultivation.maxSpiritualPower) * 100;
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${Math.floor(percentage)}%`;
        }

        // Update cultivation speed
        const speedEl = document.getElementById('cultivation-speed');
        if (speedEl) {
            speedEl.textContent = `${this.character.spiritualRoot.cultivationSpeed}x`;
        }

        // Update spirit stones
        const stonesEl = document.getElementById('spirit-stones-count');
        if (stonesEl) {
            stonesEl.textContent = this.character.resources.spiritStones;
        }

        // Update HUD
        this.uiManager.updateHUD(this.character);
    }

    /**
     * Update status message / 更新狀態訊息
     */
    updateStatus(message, type = 'info') {
        const statusEl = document.getElementById('cultivation-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `cultivation-status ${type}`;
        }
    }

    /**
     * Save progress / 儲存進度
     */
    saveProgress() {
        const event = new CustomEvent('saveGame');
        document.dispatchEvent(event);
    }

    // Helper methods for display names
    getRealmName() {
        const names = {
            qi_condensation: '凝氣期',
            foundation: '築基期',
            golden_core: '金丹期'
        };
        return names[this.character.cultivation.realm] || '未知';
    }

    getStageName() {
        const names = {
            early: '初期',
            middle: '中期',
            late: '後期',
            peak: '圓滿'
        };
        return names[this.character.cultivation.stage] || '未知';
    }

    getNextStageName() {
        const stages = ['early', 'middle', 'late', 'peak'];
        const currentIndex = stages.indexOf(this.character.cultivation.stage);
        if (currentIndex < stages.length - 1) {
            const names = { early: '初期', middle: '中期', late: '後期', peak: '圓滿' };
            return names[stages[currentIndex + 1]];
        }
        return '築基期 初期';
    }

    getRootIcon() {
        const icons = {
            metal: '⚔️',
            fire: '🔥',
            thunder: '⚡',
            water: '💧',
            wood: '🌿'
        };
        return icons[this.character.spiritualRoot.elements[0]] || '✨';
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
        const names = {
            1: '凡品',
            2: '普通',
            3: '上品',
            4: '天品',
            5: '神品'
        };
        return names[this.character.spiritualRoot.quality] || '未知';
    }

    getRootElements() {
        const names = {
            metal: '金',
            fire: '火',
            thunder: '雷',
            water: '水',
            wood: '木'
        };
        return this.character.spiritualRoot.elements.map(e => names[e] || e).join('、');
    }
}

// Add additional CSS
const style = document.createElement('style');
style.textContent = `
    .realm-display-large {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        background: var(--bg-elevated);
        border-radius: var(--radius-lg);
        border: 2px solid var(--gold-primary);
        margin-bottom: 1.5rem;
    }
    
    .realm-icon {
        font-size: 4rem;
    }
    
    .realm-text h3 {
        font-size: 2rem;
        color: var(--gold-primary);
        margin-bottom: 0.5rem;
    }
    
    .cultivation-progress {
        margin-bottom: 1.5rem;
    }
    
    .progress-label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
    }
    
    .progress-bar-large {
        height: 30px;
        background: var(--bg-tertiary);
        border-radius: var(--radius-md);
        overflow: hidden;
        border: 2px solid var(--spirit-primary);
        position: relative;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--spirit-secondary), var(--spirit-primary));
        transition: width 0.3s ease;
        box-shadow: 0 0 15px var(--spirit-glow);
    }
    
    .cultivation-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .btn-large {
        padding: 1rem;
        font-size: 1.125rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
    
    .btn-large .btn-icon {
        font-size: 1.5rem;
    }
    
    .btn.active {
        background: var(--danger);
        border-color: var(--danger);
    }
    
    .cultivation-status {
        padding: 1rem;
        border-radius: var(--radius-md);
        text-align: center;
        font-weight: bold;
    }
    
    .cultivation-status.info {
        background: var(--bg-elevated);
        color: var(--info);
    }
    
    .cultivation-status.success {
        background: rgba(16, 185, 129, 0.1);
        color: var(--success);
    }
    
    .cultivation-status.error {
        background: rgba(239, 68, 68, 0.1);
        color: var(--danger);
    }
    
    .spiritual-root-info {
        padding: 1rem;
    }
    
    .root-display {
        display: flex;
        gap: 1.5rem;
        align-items: center;
    }
    
    .root-icon-large {
        font-size: 5rem;
    }
    
    .root-details h4 {
        font-size: 1.5rem;
        color: var(--spirit-primary);
        margin-bottom: 0.5rem;
    }
    
    .root-details p {
        color: var(--text-secondary);
        margin-bottom: 0.25rem;
    }
    
    .resource-grid {
        display: grid;
        gap: 1rem;
    }
    
    .resource-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--bg-elevated);
        border-radius: var(--radius-md);
        border: 1px solid var(--spirit-primary);
    }
    
    .resource-card .resource-icon {
        font-size: 2rem;
    }
    
    .resource-card .resource-info {
        flex: 1;
    }
    
    .resource-name {
        color: var(--text-secondary);
        font-size: 0.875rem;
    }
    
    .resource-amount {
        color: var(--gold-primary);
        font-size: 1.5rem;
        font-weight: bold;
    }
    
    .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
    }
`;
document.head.appendChild(style);

export default CultivationInterface;
