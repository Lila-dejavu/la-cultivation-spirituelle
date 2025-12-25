/**
 * Character Creation Scene - 角色創建場景
 * Handles character creation interface
 * 處理角色創建介面
 */

import { SPECIAL_ROOTS, ROOT_QUALITY } from './src/systems/cultivation/spiritual-root.js';
import { DESTINY_TYPES } from './src/systems/character/destiny.js';

export class CharacterCreationScene {
    constructor(uiManager, dataManager) {
        this.uiManager = uiManager;
        this.dataManager = dataManager;
        
        this.characterData = {
            name: '林逸',
            spiritualRoot: null,
            destiny: null
        };

        this.setupEventListeners();
    }

    /**
     * Setup event listeners / 設置事件監聽
     */
    setupEventListeners() {
        // Character name input
        const nameInput = document.getElementById('character-name');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                this.characterData.name = e.target.value || '林逸';
            });
        }

        // Spiritual root selection
        const rootOptions = document.querySelectorAll('.root-option');
        rootOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectSpiritualRoot(option);
            });
        });

        // Destiny selection
        const destinyOptions = document.querySelectorAll('.destiny-option');
        destinyOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectDestiny(option);
            });
        });

        // Back button
        const backBtn = document.getElementById('btn-back-to-menu');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.uiManager.showScene('mainMenu');
            });
        }

        // Confirm button
        const confirmBtn = document.getElementById('btn-confirm-character');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.confirmCharacter();
            });
        }

        // Set default selections
        this.setDefaultSelections();
    }

    /**
     * Set default selections / 設置預設選擇
     */
    setDefaultSelections() {
        // Default spiritual root - Sword
        const defaultRoot = document.querySelector('[data-root="single-sword"]');
        if (defaultRoot) {
            this.selectSpiritualRoot(defaultRoot);
        }

        // Default destiny - Protagonist
        const defaultDestiny = document.querySelector('[data-destiny="protagonist"]');
        if (defaultDestiny) {
            this.selectDestiny(defaultDestiny);
        }
    }

    /**
     * Select spiritual root / 選擇靈根
     * @param {HTMLElement} option - Selected option element
     */
    selectSpiritualRoot(option) {
        // Remove previous selection
        document.querySelectorAll('.root-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selection
        option.classList.add('selected');

        // Store data
        const rootType = option.dataset.root;
        this.characterData.spiritualRoot = this.getRootData(rootType);
    }

    /**
     * Select destiny / 選擇命格
     * @param {HTMLElement} option - Selected option element
     */
    selectDestiny(option) {
        // Remove previous selection
        document.querySelectorAll('.destiny-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selection
        option.classList.add('selected');

        // Store data
        const destinyType = option.dataset.destiny;
        this.characterData.destiny = this.getDestinyData(destinyType);
    }

    /**
     * Get spiritual root data / 獲取靈根資料
     * @param {string} rootType - Root type identifier
     * @returns {Object}
     */
    getRootData(rootType) {
        const rootConfigs = {
            'single-sword': {
                type: 'single',
                elements: ['metal'],
                quality: ROOT_QUALITY.SUPERIOR,
                cultivationSpeed: 3.0,
                affinities: { metal: 60 }
            },
            'single-fire': {
                type: 'single',
                elements: ['fire'],
                quality: ROOT_QUALITY.SUPERIOR,
                cultivationSpeed: 3.0,
                affinities: { fire: 60 }
            },
            'mutant-thunder': {
                type: 'mutant',
                elements: ['thunder'],
                quality: ROOT_QUALITY.HEAVEN_GRADE,
                cultivationSpeed: 3.0,
                affinities: { thunder: 80 }
            }
        };

        return rootConfigs[rootType] || rootConfigs['single-sword'];
    }

    /**
     * Get destiny data / 獲取命格資料
     * @param {string} destinyType - Destiny type
     * @returns {Object}
     */
    getDestinyData(destinyType) {
        const destinyValues = {
            protagonist: { type: DESTINY_TYPES.PROTAGONIST, value: 80 },
            genius: { type: DESTINY_TYPES.GENIUS, value: 60 },
            ordinary: { type: DESTINY_TYPES.ORDINARY, value: 40 }
        };

        const data = destinyValues[destinyType] || destinyValues.protagonist;
        
        return {
            type: data.type,
            value: data.value,
            karma: 0,
            fatePoints: 0,
            majorEvents: []
        };
    }

    /**
     * Confirm character creation / 確認角色創建
     */
    confirmCharacter() {
        // Validate character data
        if (!this.characterData.name || this.characterData.name.trim() === '') {
            this.uiManager.showNotification('請輸入角色名稱', 'warning');
            return;
        }

        if (!this.characterData.spiritualRoot) {
            this.uiManager.showNotification('請選擇靈根', 'warning');
            return;
        }

        if (!this.characterData.destiny) {
            this.uiManager.showNotification('請選擇命格', 'warning');
            return;
        }

        // Show confirmation dialog
        this.uiManager.showDialog({
            title: '確認創建角色',
            content: this.getCharacterSummary(),
            confirmText: '開始修煉之路',
            cancelText: '返回修改',
            onConfirm: () => {
                this.createCharacter();
            }
        });
    }

    /**
     * Get character summary HTML / 獲取角色摘要HTML
     * @returns {string}
     */
    getCharacterSummary() {
        const root = this.characterData.spiritualRoot;
        const destiny = this.characterData.destiny;

        const rootTypeNames = {
            single: '單靈根',
            mutant: '變異靈根'
        };

        const qualityNames = {
            3: '上品',
            4: '天品'
        };

        const destinyNames = {
            protagonist: '主角命格',
            genius: '天才命格',
            ordinary: '普通命格'
        };

        const elementNames = {
            metal: '金',
            fire: '火',
            thunder: '雷'
        };

        return `
            <div style="line-height: 2;">
                <p><strong>道號：</strong>${this.characterData.name}</p>
                <p><strong>靈根：</strong>${rootTypeNames[root.type]} - ${qualityNames[root.quality]}</p>
                <p><strong>元素：</strong>${root.elements.map(e => elementNames[e]).join('、')}</p>
                <p><strong>修煉速度：</strong>${root.cultivationSpeed}x</p>
                <p><strong>命格：</strong>${destinyNames[destiny.type] || destiny.type}</p>
                <p><strong>命運值：</strong>${destiny.value}</p>
                <hr style="margin: 1rem 0; border-color: var(--spirit-primary);">
                <p style="color: var(--text-secondary);">確認後將開始您的修仙之旅</p>
            </div>
        `;
    }

    /**
     * Create character and start game / 創建角色並開始遊戲
     */
    createCharacter() {
        // Create character with selected options
        const character = this.dataManager.createCharacter(this.characterData);

        // Dispatch event to game controller
        const event = new CustomEvent('characterCreated', {
            detail: { character }
        });
        document.dispatchEvent(event);

        // Show notification
        this.uiManager.showNotification('角色創建成功！', 'success');
    }

    /**
     * Reset character creation / 重置角色創建
     */
    reset() {
        // Reset data
        this.characterData = {
            name: '林逸',
            spiritualRoot: null,
            destiny: null
        };

        // Reset input
        const nameInput = document.getElementById('character-name');
        if (nameInput) {
            nameInput.value = '林逸';
        }

        // Reset selections
        this.setDefaultSelections();
    }

    /**
     * Show scene / 顯示場景
     */
    show() {
        this.reset();
        this.uiManager.showScene('characterCreation');
    }
}

export default CharacterCreationScene;
