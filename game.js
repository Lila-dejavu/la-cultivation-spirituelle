/**
 * Game - 遊戲主程式
 * Main game controller and initialization
 * 遊戲主控制器和初始化
 */

import UIManager from './ui-manager.js';
import AnimationSystem from './animation-system.js';
import GameDataManager from './game-data-manager.js';
import MainMenuScene from './main-menu-scene.js';
import CharacterCreationScene from './character-creation.js';
import CultivationInterface from './cultivation-interface.js';
import CharacterPanel from './character-panel.js';
import InventoryInterface from './inventory-interface.js';
import SkillInterface from './skill-interface.js';
import BattleInterface from './battle-interface.js';

/**
 * Game class - Main game controller
 */
class Game {
    constructor() {
        this.gameData = null;
        this.isInitialized = false;
        
        // Initialize managers
        this.uiManager = new UIManager();
        this.animationSystem = new AnimationSystem();
        this.dataManager = new GameDataManager();
        
        // Initialize scenes
        this.mainMenuScene = new MainMenuScene(this.uiManager, this.dataManager);
        this.characterCreationScene = new CharacterCreationScene(this.uiManager, this.dataManager);
        
        // Initialize interfaces
        this.cultivationInterface = new CultivationInterface(this.uiManager, this.animationSystem);
        this.characterPanel = new CharacterPanel(this.uiManager);
        this.inventoryInterface = new InventoryInterface(this.uiManager);
        this.skillInterface = new SkillInterface(this.uiManager);
        this.battleInterface = new BattleInterface(this.uiManager, this.animationSystem);
        
        this.setupEventListeners();
    }

    /**
     * Initialize game / 初始化遊戲
     */
    async initialize() {
        console.log('Initializing game...');
        
        try {
            // Show loading screen
            this.uiManager.showScene('loading');
            
            // Simulate loading (with progress updates)
            await this.loadResources();
            
            // Start animation system
            this.animationSystem.startAnimationLoop();
            
            // Show main menu
            this.mainMenuScene.show();
            
            this.isInitialized = true;
            console.log('Game initialized successfully');
            
        } catch (error) {
            console.error('Error initializing game:', error);
            this.uiManager.showNotification('遊戲初始化失敗', 'error');
        }
    }

    /**
     * Load game resources / 載入遊戲資源
     */
    async loadResources() {
        const steps = 5;
        let currentStep = 0;
        
        const updateProgress = () => {
            currentStep++;
            const progress = (currentStep / steps) * 100;
            this.uiManager.updateLoadingProgress(progress);
        };

        // Step 1: Load basic data
        await this.delay(300);
        updateProgress();
        
        // Step 2: Load skill data
        try {
            await this.dataManager.loadSkills();
        } catch (error) {
            console.warn('Could not load skills data:', error);
        }
        await this.delay(300);
        updateProgress();
        
        // Step 3: Load enemy data
        try {
            await this.dataManager.loadEnemies();
        } catch (error) {
            console.warn('Could not load enemies data:', error);
        }
        await this.delay(300);
        updateProgress();
        
        // Step 4: Check for saved game
        const hasSave = this.dataManager.hasSave();
        console.log('Has save:', hasSave);
        await this.delay(300);
        updateProgress();
        
        // Step 5: Initialize UI
        await this.delay(300);
        updateProgress();
    }

    /**
     * Setup event listeners / 設置事件監聽
     */
    setupEventListeners() {
        // Character creation complete
        document.addEventListener('characterCreated', (event) => {
            this.startNewGame(event.detail.character);
        });

        // Show character creation
        document.addEventListener('showCharacterCreation', () => {
            this.characterCreationScene.show();
        });

        // Load game
        document.addEventListener('loadGame', (event) => {
            this.loadGame(event.detail.saveData);
        });

        // Save game
        document.addEventListener('saveGame', () => {
            this.saveGame();
        });

        // Panel switching
        const sidebarBtns = document.querySelectorAll('.sidebar-btn');
        sidebarBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const panel = btn.dataset.panel;
                this.switchPanel(panel);
            });
        });
    }

    /**
     * Start new game / 開始新遊戲
     * @param {Object} character - Character data
     */
    startNewGame(character) {
        console.log('Starting new game with character:', character);
        
        // Initialize game data
        this.gameData = this.dataManager.getInitialGameData();
        this.gameData.character = character;
        
        // Initialize all interfaces
        this.initializeGameInterfaces();
        
        // Show game interface
        this.uiManager.showScene('gameInterface');
        
        // Update HUD
        this.uiManager.updateHUD(this.gameData.character);
        
        // Auto-save
        this.saveGame();
        
        // Welcome message
        this.uiManager.showNotification('歡迎來到修仙世界！', 'success');
    }

    /**
     * Load game / 載入遊戲
     * @param {Object} saveData - Save data
     */
    loadGame(saveData) {
        console.log('Loading game:', saveData);
        
        // Load game data
        this.gameData = saveData;
        
        // Initialize all interfaces
        this.initializeGameInterfaces();
        
        // Show game interface
        this.uiManager.showScene('gameInterface');
        
        // Update HUD
        this.uiManager.updateHUD(this.gameData.character);
    }

    /**
     * Save game / 儲存遊戲
     */
    saveGame() {
        if (!this.gameData) return;
        
        const success = this.dataManager.saveGame(this.gameData);
        
        if (success) {
            console.log('Game saved successfully');
        } else {
            console.error('Failed to save game');
            this.uiManager.showNotification('儲存失敗', 'error');
        }
    }

    /**
     * Initialize game interfaces / 初始化遊戲介面
     */
    initializeGameInterfaces() {
        const character = this.gameData.character;
        
        this.cultivationInterface.initialize(character);
        this.characterPanel.initialize(character);
        this.inventoryInterface.initialize(character);
        this.skillInterface.initialize(character);
        this.battleInterface.initialize(character);
    }

    /**
     * Switch panel / 切換面板
     * @param {string} panelName - Panel name
     */
    switchPanel(panelName) {
        this.uiManager.switchPanel(panelName);
        
        // Update the specific panel if needed
        switch (panelName) {
            case 'cultivation':
                this.cultivationInterface.updateDisplay?.();
                break;
            case 'character':
                this.characterPanel.update?.();
                break;
            case 'inventory':
                this.inventoryInterface.update?.();
                break;
            case 'skills':
                this.skillInterface.update?.();
                break;
            case 'battle':
                this.battleInterface.update?.();
                break;
        }
    }

    /**
     * Update game / 更新遊戲
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        // Update active systems
        if (this.gameData) {
            // Update play time
            this.gameData.gameState.playTime += deltaTime;
        }
    }

    /**
     * Delay helper / 延遲輔助函數
     * @param {number} ms - Milliseconds
     * @returns {Promise}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize and start game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting game...');
    
    const game = new Game();
    game.initialize();
    
    // Make game globally accessible for debugging
    window.game = game;
    
    // Start game loop
    let lastTime = Date.now();
    function gameLoop() {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        game.update(deltaTime);
        
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
});

export default Game;
