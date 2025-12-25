/**
 * UI Manager - UI管理器
 * Manages all UI interactions and scene transitions
 * 管理所有UI互動和場景切換
 */

export class UIManager {
    constructor() {
        this.currentScene = null;
        this.panels = new Map();
        this.notifications = [];
        this.dialogCallback = null;
        
        this.initializeElements();
        this.setupEventListeners();
    }

    /**
     * Initialize DOM elements / 初始化DOM元素
     */
    initializeElements() {
        // Scenes
        this.scenes = {
            loading: document.getElementById('loading-screen'),
            mainMenu: document.getElementById('main-menu'),
            characterCreation: document.getElementById('character-creation'),
            gameInterface: document.getElementById('game-interface')
        };

        // Dialog
        this.dialogOverlay = document.getElementById('dialog-overlay');
        this.dialogTitle = document.getElementById('dialog-title');
        this.dialogContent = document.getElementById('dialog-content');
        this.dialogButtons = document.getElementById('dialog-buttons');

        // Notification container
        this.notificationContainer = document.getElementById('notification-container');
    }

    /**
     * Setup event listeners / 設置事件監聽
     */
    setupEventListeners() {
        // Dialog close
        const closeBtn = document.getElementById('dialog-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideDialog());
        }

        // Click outside dialog to close
        this.dialogOverlay?.addEventListener('click', (e) => {
            if (e.target === this.dialogOverlay) {
                this.hideDialog();
            }
        });
    }

    /**
     * Switch to a scene / 切換場景
     * @param {string} sceneName - Scene name
     */
    showScene(sceneName) {
        // Hide all scenes
        Object.values(this.scenes).forEach(scene => {
            if (scene) scene.classList.add('hidden');
        });

        // Show target scene
        const targetScene = this.scenes[sceneName];
        if (targetScene) {
            targetScene.classList.remove('hidden');
            this.currentScene = sceneName;
        }
    }

    /**
     * Switch panel in game interface / 切換遊戲介面面板
     * @param {string} panelName - Panel name
     */
    switchPanel(panelName) {
        // Remove active class from all panels and buttons
        const panels = document.querySelectorAll('.panel');
        const buttons = document.querySelectorAll('.sidebar-btn');
        
        panels.forEach(panel => panel.classList.remove('active'));
        buttons.forEach(btn => btn.classList.remove('active'));

        // Activate target panel and button
        const targetPanel = document.getElementById(`${panelName}-panel`);
        const targetButton = document.querySelector(`[data-panel="${panelName}"]`);
        
        if (targetPanel) targetPanel.classList.add('active');
        if (targetButton) targetButton.classList.add('active');
    }

    /**
     * Show notification / 顯示通知
     * @param {string} message - Message content
     * @param {string} type - Notification type (success, warning, error, info)
     * @param {number} duration - Display duration in ms
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        this.notificationContainer.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);

        this.notifications.push(notification);
    }

    /**
     * Show dialog / 顯示對話框
     * @param {Object} options - Dialog options
     */
    showDialog(options) {
        const {
            title = '提示',
            content = '',
            confirmText = '確認',
            cancelText = '取消',
            showCancel = true,
            onConfirm = null,
            onCancel = null
        } = options;

        this.dialogTitle.textContent = title;
        this.dialogContent.innerHTML = content;

        // Clear existing buttons
        this.dialogButtons.innerHTML = '';

        // Add cancel button
        if (showCancel) {
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn secondary';
            cancelBtn.textContent = cancelText;
            cancelBtn.onclick = () => {
                if (onCancel) onCancel();
                this.hideDialog();
            };
            this.dialogButtons.appendChild(cancelBtn);
        }

        // Add confirm button
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'btn primary';
        confirmBtn.textContent = confirmText;
        confirmBtn.onclick = () => {
            if (onConfirm) onConfirm();
            this.hideDialog();
        };
        this.dialogButtons.appendChild(confirmBtn);

        // Show dialog
        this.dialogOverlay.classList.remove('hidden');
    }

    /**
     * Hide dialog / 隱藏對話框
     */
    hideDialog() {
        this.dialogOverlay.classList.add('hidden');
        this.dialogCallback = null;
    }

    /**
     * Update loading progress / 更新載入進度
     * @param {number} progress - Progress percentage (0-100)
     */
    updateLoadingProgress(progress) {
        const progressBar = document.getElementById('loading-progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    /**
     * Update HUD / 更新HUD
     * @param {Object} character - Character data
     */
    updateHUD(character) {
        // Character name
        const nameEl = document.getElementById('hud-character-name');
        if (nameEl) nameEl.textContent = character.name;

        // Realm
        const realmEl = document.getElementById('hud-realm');
        if (realmEl) realmEl.textContent = this.getRealmDisplayName(character.cultivation);

        // Health bar
        this.updateStatBar('health', character.stats.health, character.stats.maxHealth);

        // Mana bar
        this.updateStatBar('mana', character.stats.mana, character.stats.maxMana);

        // Experience bar
        this.updateStatBar('exp', character.experience, character.nextLevelExp);

        // Spirit stones
        const stonesEl = document.getElementById('spirit-stones');
        if (stonesEl) stonesEl.textContent = character.resources.spiritStones || 0;
    }

    /**
     * Update stat bar / 更新狀態條
     * @param {string} barName - Bar name
     * @param {number} current - Current value
     * @param {number} max - Maximum value
     */
    updateStatBar(barName, current, max) {
        const bar = document.getElementById(`${barName}-bar`);
        const text = document.getElementById(`${barName}-text`);

        if (bar) {
            const percentage = (current / max) * 100;
            bar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
        }

        if (text) {
            text.textContent = `${Math.floor(current)}/${Math.floor(max)}`;
        }
    }

    /**
     * Get realm display name / 獲取境界顯示名稱
     * @param {Object} cultivation - Cultivation data
     * @returns {string} Display name
     */
    getRealmDisplayName(cultivation) {
        const realmNames = {
            qi_condensation: '凝氣期',
            foundation: '築基期',
            golden_core: '金丹期',
            nascent_soul: '元嬰期',
            soul_transform: '化神期',
            body_integration: '合體期',
            tribulation: '渡劫期',
            mahayana: '大乘期'
        };

        const stageNames = {
            early: '初期',
            middle: '中期',
            late: '後期',
            peak: '圓滿'
        };

        const realmName = realmNames[cultivation.realm] || cultivation.realm;
        const stageName = stageNames[cultivation.stage] || cultivation.stage;

        return `${realmName} ${stageName}`;
    }

    /**
     * Create element with classes / 創建帶類名的元素
     * @param {string} tag - HTML tag
     * @param {string|Array} classes - Class names
     * @param {string} content - Text content
     * @returns {HTMLElement}
     */
    createElement(tag, classes = [], content = '') {
        const element = document.createElement(tag);
        
        if (typeof classes === 'string') {
            element.className = classes;
        } else if (Array.isArray(classes)) {
            element.classList.add(...classes);
        }
        
        if (content) {
            element.textContent = content;
        }
        
        return element;
    }

    /**
     * Clear container / 清空容器
     * @param {HTMLElement|string} container - Container element or ID
     */
    clearContainer(container) {
        const el = typeof container === 'string' 
            ? document.getElementById(container) 
            : container;
        
        if (el) {
            el.innerHTML = '';
        }
    }

    /**
     * Show/hide element / 顯示/隱藏元素
     * @param {HTMLElement|string} element - Element or ID
     * @param {boolean} show - Show or hide
     */
    toggleElement(element, show) {
        const el = typeof element === 'string' 
            ? document.getElementById(element) 
            : element;
        
        if (el) {
            if (show) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    }
}

export default UIManager;
