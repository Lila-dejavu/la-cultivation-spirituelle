/**
 * Ally System - 隊友系統
 * 管理遊戲中的隊友招募、升級和配置
 */

import { 
    getAllyData, 
    getAllAllies, 
    getAlliesByChapter,
    createAllyInstance,
    levelUpAlly 
} from '../data/allies-data.js';

export class AllySystem {
    constructor(gameDataManager) {
        this.gameDataManager = gameDataManager;
    }

    /**
     * 初始化隊友系統
     * @param {Object} gameData - 遊戲數據
     */
    initialize(gameData) {
        if (!gameData.allies) {
            gameData.allies = {
                recruited: [], // 已招募的隊友ID列表
                party: [], // 當前隊伍（用於戰鬥的隊友）
                alliesData: {} // 隊友詳細數據
            };
        }

        return gameData;
    }

    /**
     * 招募隊友
     * @param {string} allyId - 隊友ID
     * @param {Object} gameData - 遊戲數據
     * @returns {Object|null} 隊友數據
     */
    recruitAlly(allyId, gameData) {
        // 檢查是否已經招募
        if (gameData.allies.recruited.includes(allyId)) {
            console.warn(`Ally ${allyId} already recruited`);
            return null;
        }

        // 獲取隊友基礎數據
        const allyData = getAllyData(allyId);
        if (!allyData) {
            console.error(`Ally ${allyId} not found`);
            return null;
        }

        // 添加到已招募列表
        gameData.allies.recruited.push(allyId);

        // 初始化隊友詳細數據
        gameData.allies.alliesData[allyId] = {
            ...allyData,
            level: 1,
            exp: 0,
            currentHp: allyData.stats.maxHp,
            joinedAt: Date.now()
        };

        // 自動加入隊伍（如果隊伍未滿）
        if (gameData.allies.party.length < 3) {
            gameData.allies.party.push(allyId);
        }

        console.log(`Recruited ally: ${allyData.name}`);

        // 保存遊戲數據
        if (this.gameDataManager) {
            this.gameDataManager.saveGame(gameData);
        }

        return gameData.allies.alliesData[allyId];
    }

    /**
     * 獲取所有已招募的隊友
     * @param {Object} gameData - 遊戲數據
     * @returns {Array} 隊友列表
     */
    getRecruitedAllies(gameData) {
        return gameData.allies.recruited.map(allyId => {
            return gameData.allies.alliesData[allyId];
        }).filter(ally => ally !== undefined);
    }

    /**
     * 獲取當前隊伍
     * @param {Object} gameData - 遊戲數據
     * @returns {Array} 隊伍中的隊友
     */
    getParty(gameData) {
        return gameData.allies.party.map(allyId => {
            return gameData.allies.alliesData[allyId];
        }).filter(ally => ally !== undefined);
    }

    /**
     * 添加隊友到隊伍
     * @param {string} allyId - 隊友ID
     * @param {Object} gameData - 遊戲數據
     * @returns {boolean} 是否成功
     */
    addToParty(allyId, gameData) {
        // 檢查是否已招募
        if (!gameData.allies.recruited.includes(allyId)) {
            console.error(`Ally ${allyId} not recruited`);
            return false;
        }

        // 檢查隊伍是否已滿
        if (gameData.allies.party.length >= 3) {
            console.warn('Party is full');
            return false;
        }

        // 檢查是否已在隊伍中
        if (gameData.allies.party.includes(allyId)) {
            console.warn(`Ally ${allyId} already in party`);
            return false;
        }

        gameData.allies.party.push(allyId);

        if (this.gameDataManager) {
            this.gameDataManager.saveGame(gameData);
        }

        return true;
    }

    /**
     * 從隊伍中移除隊友
     * @param {string} allyId - 隊友ID
     * @param {Object} gameData - 遊戲數據
     * @returns {boolean} 是否成功
     */
    removeFromParty(allyId, gameData) {
        const index = gameData.allies.party.indexOf(allyId);
        if (index === -1) {
            console.warn(`Ally ${allyId} not in party`);
            return false;
        }

        gameData.allies.party.splice(index, 1);

        if (this.gameDataManager) {
            this.gameDataManager.saveGame(gameData);
        }

        return true;
    }

    /**
     * 獲取隊友數據
     * @param {string} allyId - 隊友ID
     * @param {Object} gameData - 遊戲數據
     * @returns {Object|null} 隊友數據
     */
    getAllyById(allyId, gameData) {
        return gameData.allies.alliesData[allyId] || null;
    }

    /**
     * 隊友升級
     * @param {string} allyId - 隊友ID
     * @param {Object} gameData - 遊戲數據
     */
    levelUp(allyId, gameData) {
        const ally = gameData.allies.alliesData[allyId];
        if (!ally) {
            console.error(`Ally ${allyId} not found`);
            return;
        }

        levelUpAlly(ally);
        console.log(`${ally.name} leveled up to ${ally.level}!`);

        if (this.gameDataManager) {
            this.gameDataManager.saveGame(gameData);
        }
    }

    /**
     * 增加隊友經驗值
     * @param {string} allyId - 隊友ID
     * @param {number} exp - 經驗值
     * @param {Object} gameData - 遊戲數據
     */
    addExp(allyId, exp, gameData) {
        const ally = gameData.allies.alliesData[allyId];
        if (!ally) return;

        ally.exp += exp;

        // 檢查是否升級（簡單公式：100 * level）
        const expNeeded = 100 * ally.level;
        if (ally.exp >= expNeeded) {
            ally.exp -= expNeeded;
            this.levelUp(allyId, gameData);
        }
    }

    /**
     * 治療隊友
     * @param {string} allyId - 隊友ID
     * @param {number} amount - 治療量
     * @param {Object} gameData - 遊戲數據
     */
    healAlly(allyId, amount, gameData) {
        const ally = gameData.allies.alliesData[allyId];
        if (!ally) return;

        ally.currentHp = Math.min(ally.currentHp + amount, ally.stats.maxHp);

        if (this.gameDataManager) {
            this.gameDataManager.saveGame(gameData);
        }
    }

    /**
     * 治療所有隊友
     * @param {Object} gameData - 遊戲數據
     */
    healAllAllies(gameData) {
        gameData.allies.recruited.forEach(allyId => {
            const ally = gameData.allies.alliesData[allyId];
            if (ally) {
                ally.currentHp = ally.stats.maxHp;
            }
        });

        if (this.gameDataManager) {
            this.gameDataManager.saveGame(gameData);
        }
    }

    /**
     * 檢查隊友是否可以加入（根據章節）
     * @param {string} allyId - 隊友ID
     * @param {number} currentChapter - 當前章節號
     * @returns {boolean} 是否可以加入
     */
    canRecruit(allyId, currentChapter) {
        const allyData = getAllyData(allyId);
        if (!allyData) return false;

        return currentChapter >= allyData.joinChapter;
    }

    /**
     * 獲取可招募的隊友列表
     * @param {number} chapterNum - 章節號
     * @returns {Array} 可招募的隊友
     */
    getAvailableAllies(chapterNum) {
        return getAllAllies().filter(ally => ally.joinChapter <= chapterNum);
    }

    /**
     * 創建用於戰鬥的隊友實例
     * @param {string} allyId - 隊友ID
     * @param {number} row - 行位置
     * @param {number} col - 列位置
     * @param {Object} gameData - 遊戲數據
     * @returns {Object|null} 隊友戰鬥實例
     */
    createBattleInstance(allyId, row, col, gameData) {
        const allyData = gameData.allies.alliesData[allyId];
        if (!allyData) return null;

        // 創建戰鬥實例（基於保存的隊友數據）
        return createAllyInstance(allyId, row, col);
    }

    /**
     * 獲取隊友統計信息
     * @param {Object} gameData - 遊戲數據
     * @returns {Object} 統計信息
     */
    getStats(gameData) {
        const totalAllies = getAllAllies().length;
        const recruitedCount = gameData.allies.recruited.length;
        const partyCount = gameData.allies.party.length;

        return {
            totalAllies,
            recruitedCount,
            partyCount,
            recruitmentRate: Math.round((recruitedCount / totalAllies) * 100)
        };
    }
}

export default AllySystem;
