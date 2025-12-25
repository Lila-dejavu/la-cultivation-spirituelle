/**
 * Main Menu Scene - 主選單場景
 * Handles main menu interface
 * 處理主選單介面
 */

export class MainMenuScene {
    constructor(uiManager, dataManager) {
        this.uiManager = uiManager;
        this.dataManager = dataManager;
        
        this.setupEventListeners();
    }

    /**
     * Setup event listeners / 設置事件監聽
     */
    setupEventListeners() {
        // New game button
        const newGameBtn = document.getElementById('btn-new-game');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                this.startNewGame();
            });
        }

        // Continue game button
        const continueBtn = document.getElementById('btn-continue');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.continueGame();
            });
            
            // Check if save exists
            this.updateContinueButton();
        }

        // Settings button
        const settingsBtn = document.getElementById('btn-settings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSettings();
            });
        }

        // About button
        const aboutBtn = document.getElementById('btn-about');
        if (aboutBtn) {
            aboutBtn.addEventListener('click', () => {
                this.showAbout();
            });
        }
    }

    /**
     * Update continue button state / 更新繼續遊戲按鈕狀態
     */
    updateContinueButton() {
        const continueBtn = document.getElementById('btn-continue');
        if (!continueBtn) return;

        const hasSave = this.dataManager.hasSave();
        continueBtn.disabled = !hasSave;
        
        if (!hasSave) {
            continueBtn.style.opacity = '0.5';
            continueBtn.style.cursor = 'not-allowed';
        }
    }

    /**
     * Start new game / 開始新遊戲
     */
    startNewGame() {
        // Check if save exists
        if (this.dataManager.hasSave()) {
            this.uiManager.showDialog({
                title: '警告',
                content: '開始新遊戲將覆蓋現有存檔，是否繼續？',
                confirmText: '確認',
                cancelText: '取消',
                onConfirm: () => {
                    this.dataManager.deleteSave();
                    this.showCharacterCreation();
                }
            });
        } else {
            this.showCharacterCreation();
        }
    }

    /**
     * Show character creation / 顯示角色創建
     */
    showCharacterCreation() {
        const event = new CustomEvent('showCharacterCreation');
        document.dispatchEvent(event);
    }

    /**
     * Continue game / 繼續遊戲
     */
    continueGame() {
        const saveData = this.dataManager.getSaveData();
        
        if (!saveData) {
            this.uiManager.showNotification('未找到存檔', 'error');
            return;
        }

        // Validate save data
        if (!this.dataManager.validateGameData(saveData)) {
            this.uiManager.showDialog({
                title: '錯誤',
                content: '存檔已損壞，無法載入。是否刪除損壞的存檔？',
                confirmText: '刪除',
                cancelText: '取消',
                onConfirm: () => {
                    this.dataManager.deleteSave();
                    this.updateContinueButton();
                    this.uiManager.showNotification('已刪除損壞的存檔', 'info');
                }
            });
            return;
        }

        // Load game
        const event = new CustomEvent('loadGame', {
            detail: { saveData }
        });
        document.dispatchEvent(event);
        
        this.uiManager.showNotification('載入成功', 'success');
    }

    /**
     * Show settings / 顯示設定
     */
    showSettings() {
        this.uiManager.showDialog({
            title: '設定',
            content: this.getSettingsHTML(),
            showCancel: false,
            confirmText: '關閉'
        });
    }

    /**
     * Get settings HTML / 獲取設定HTML
     * @returns {string}
     */
    getSettingsHTML() {
        return `
            <div style="padding: 1rem;">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">音效音量</label>
                    <input type="range" min="0" max="100" value="50" 
                           style="width: 100%;" id="settings-sfx-volume">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">音樂音量</label>
                    <input type="range" min="0" max="100" value="30" 
                           style="width: 100%;" id="settings-music-volume">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" checked id="settings-animations">
                        <span>啟用動畫效果</span>
                    </label>
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" checked id="settings-notifications">
                        <span>顯示通知</span>
                    </label>
                </div>
                <hr style="margin: 1rem 0; border-color: var(--spirit-primary);">
                <button class="btn secondary" onclick="localStorage.clear(); location.reload();" 
                        style="width: 100%;">
                    清除所有資料
                </button>
            </div>
        `;
    }

    /**
     * Show about / 顯示關於
     */
    showAbout() {
        this.uiManager.showDialog({
            title: '關於遊戲',
            content: this.getAboutHTML(),
            showCancel: false,
            confirmText: '關閉'
        });
    }

    /**
     * Get about HTML / 獲取關於HTML
     * @returns {string}
     */
    getAboutHTML() {
        return `
            <div style="text-align: center; padding: 1rem;">
                <h2 style="color: var(--gold-primary); margin-bottom: 1rem;">
                    靈修之路
                </h2>
                <p style="color: var(--spirit-primary); margin-bottom: 1rem;">
                    La Cultivation Spirituelle
                </p>
                <p style="margin-bottom: 0.5rem;">版本: 1.0.0</p>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem;">
                    一款修仙主題的回合制戰棋遊戲<br>
                    從凝氣期開始，踏上修仙之路<br>
                    突破境界，領悟大道，最終飛升仙界
                </p>
                <hr style="margin: 1rem 0; border-color: var(--spirit-primary);">
                <div style="margin-top: 1rem;">
                    <p style="font-size: 0.875rem; color: var(--text-dim);">
                        © 2024 La Cultivation Spirituelle
                    </p>
                    <p style="font-size: 0.875rem; color: var(--text-dim);">
                        MIT License
                    </p>
                </div>
            </div>
        `;
    }

    /**
     * Show scene / 顯示場景
     */
    show() {
        this.updateContinueButton();
        this.uiManager.showScene('mainMenu');
    }
}

export default MainMenuScene;
