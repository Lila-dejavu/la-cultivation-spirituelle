/**
 * Game Data Manager - 遊戲資料管理器
 * Manages game data loading and caching
 * 管理遊戲資料載入和快取
 */

export class GameDataManager {
    constructor() {
        this.cache = new Map();
        this.loading = new Map();
    }

    /**
     * Load JSON data / 載入JSON資料
     * @param {string} path - File path
     * @returns {Promise<Object>}
     */
    async loadJSON(path) {
        // Check cache
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }

        // Check if already loading
        if (this.loading.has(path)) {
            return this.loading.get(path);
        }

        // Load data
        const loadPromise = fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${path}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                this.cache.set(path, data);
                this.loading.delete(path);
                return data;
            })
            .catch(error => {
                this.loading.delete(path);
                console.error(`Error loading ${path}:`, error);
                throw error;
            });

        this.loading.set(path, loadPromise);
        return loadPromise;
    }

    /**
     * Load multiple data files / 載入多個資料檔案
     * @param {Array<string>} paths - File paths
     * @returns {Promise<Array>}
     */
    async loadMultiple(paths) {
        return Promise.all(paths.map(path => this.loadJSON(path)));
    }

    /**
     * Get cached data / 獲取快取資料
     * @param {string} path - File path
     * @returns {Object|null}
     */
    getCached(path) {
        return this.cache.get(path) || null;
    }

    /**
     * Clear cache / 清除快取
     * @param {string} path - Optional specific path to clear
     */
    clearCache(path = null) {
        if (path) {
            this.cache.delete(path);
        } else {
            this.cache.clear();
        }
    }

    /**
     * Get save data from localStorage / 從本地儲存獲取存檔
     * @param {string} saveKey - Save key
     * @returns {Object|null}
     */
    getSaveData(saveKey = 'cultivation_game_save') {
        try {
            const data = localStorage.getItem(saveKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading save data:', error);
            return null;
        }
    }

    /**
     * Save game data to localStorage / 儲存遊戲資料到本地儲存
     * @param {Object} data - Game data to save
     * @param {string} saveKey - Save key
     * @returns {boolean} Success
     */
    saveGame(data, saveKey = 'cultivation_game_save') {
        try {
            const saveData = {
                ...data,
                timestamp: Date.now(),
                version: '1.0.0'
            };
            localStorage.setItem(saveKey, JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Error saving game:', error);
            return false;
        }
    }

    /**
     * Delete save data / 刪除存檔
     * @param {string} saveKey - Save key
     */
    deleteSave(saveKey = 'cultivation_game_save') {
        localStorage.removeItem(saveKey);
    }

    /**
     * Check if save exists / 檢查存檔是否存在
     * @param {string} saveKey - Save key
     * @returns {boolean}
     */
    hasSave(saveKey = 'cultivation_game_save') {
        return localStorage.getItem(saveKey) !== null;
    }

    /**
     * Load skills data / 載入技能資料
     * @returns {Promise<Object>}
     */
    async loadSkills() {
        return this.loadJSON('./src/data/skills/spells.json');
    }

    /**
     * Load enemies data / 載入敵人資料
     * @returns {Promise<Object>}
     */
    async loadEnemies() {
        return this.loadJSON('./src/data/enemies/beasts.json');
    }

    /**
     * Load realm config / 載入境界配置
     * @returns {Promise<Object>}
     */
    async loadRealmConfig() {
        return this.loadJSON('./src/data/realms/realm-config.json');
    }

    /**
     * Get initial game data / 獲取初始遊戲資料
     * @returns {Object}
     */
    getInitialGameData() {
        return {
            character: {
                name: '林逸',
                level: 1,
                experience: 0,
                nextLevelExp: 100,
                cultivation: {
                    realm: 'qi_condensation',
                    stage: 'early',
                    spiritualPower: 0,
                    maxSpiritualPower: 1000,
                    comprehension: 0
                },
                stats: {
                    health: 1000,
                    maxHealth: 1000,
                    mana: 500,
                    maxMana: 500,
                    attack: 50,
                    defense: 40,
                    speed: 30
                },
                spiritualRoot: {
                    type: 'single',
                    elements: ['metal'],
                    quality: 3,
                    cultivationSpeed: 3.0
                },
                destiny: {
                    type: 'protagonist',
                    value: 80,
                    karma: 0,
                    fatePoints: 0
                },
                resources: {
                    spiritStones: 100,
                    items: [
                        { id: 'healing_pill_low', name: '回春丹（下品）', quantity: 5 },
                        { id: 'mana_pill_low', name: '靈力丹（下品）', quantity: 5 }
                    ],
                    equipment: {
                        weapon: { id: 'iron_sword', name: '凡鐵劍', attack: 10 }
                    }
                },
                skills: [
                    { id: 'basic_attack', name: '基礎攻擊', type: 'basic' },
                    { id: 'fireball', name: '火球術', type: 'spell', element: 'fire', manaCost: 30 }
                ]
            },
            gameState: {
                currentLocation: 'starter_village',
                questsCompleted: [],
                enemiesDefeated: 0,
                playTime: 0
            }
        };
    }

    /**
     * Create initial character / 創建初始角色
     * @param {Object} options - Character creation options
     * @returns {Object}
     */
    createCharacter(options) {
        const { name, spiritualRoot, destiny } = options;
        const baseData = this.getInitialGameData();
        
        return {
            ...baseData.character,
            name: name || '林逸',
            spiritualRoot: spiritualRoot || baseData.character.spiritualRoot,
            destiny: destiny || baseData.character.destiny
        };
    }

    /**
     * Get enemy by ID / 根據ID獲取敵人
     * @param {string} enemyId - Enemy ID
     * @returns {Object|null}
     */
    async getEnemy(enemyId) {
        try {
            const enemyData = await this.loadEnemies();
            return enemyData.beasts.find(beast => beast.id === enemyId) || null;
        } catch (error) {
            console.error('Error getting enemy:', error);
            return null;
        }
    }

    /**
     * Get skill by ID / 根據ID獲取技能
     * @param {string} skillId - Skill ID
     * @returns {Object|null}
     */
    async getSkill(skillId) {
        try {
            const skillData = await this.loadSkills();
            return skillData.spells.find(spell => spell.id === skillId) || null;
        } catch (error) {
            console.error('Error getting skill:', error);
            return null;
        }
    }

    /**
     * Validate game data / 驗證遊戲資料
     * @param {Object} data - Data to validate
     * @returns {boolean}
     */
    validateGameData(data) {
        if (!data || typeof data !== 'object') return false;
        
        // Check required fields
        const requiredFields = ['character', 'gameState'];
        for (const field of requiredFields) {
            if (!data[field]) return false;
        }

        // Check character data
        if (!data.character.name || !data.character.cultivation) {
            return false;
        }

        return true;
    }
}

export default GameDataManager;
