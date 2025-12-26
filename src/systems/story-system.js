/**
 * Story System - 章節劇情系統
 * 管理遊戲的章節進度、解鎖和獎勵
 */

import { 
    getAllChapters, 
    getChapterData, 
    getChapterByNumber,
    getUnlockedChapters,
    isChapterCompleted 
} from '../data/chapters-data.js';

export class StorySystem {
    constructor(gameDataManager) {
        this.gameDataManager = gameDataManager;
        this.currentChapter = null;
        this.currentBattle = null;
    }

    /**
     * 初始化章節系統
     * @param {Object} gameData - 遊戲數據
     */
    initialize(gameData) {
        if (!gameData.story) {
            gameData.story = {
                chapters: {},
                currentChapterId: null,
                completedBattles: []
            };
        }

        // 初始化所有章節狀態
        const allChapters = getAllChapters();
        allChapters.forEach(chapter => {
            if (!gameData.story.chapters[chapter.id]) {
                gameData.story.chapters[chapter.id] = {
                    id: chapter.id,
                    unlocked: chapter.unlocked || false,
                    completed: false,
                    battles: chapter.battles.map(battle => ({
                        id: battle.id,
                        completed: false
                    }))
                };
            }
        });

        return gameData;
    }

    /**
     * 獲取所有章節（帶進度）
     * @param {Object} gameData - 遊戲數據
     * @returns {Array} 章節列表
     */
    getAllChaptersWithProgress(gameData) {
        const allChapters = getAllChapters();
        
        return allChapters.map(chapter => {
            const progress = gameData.story?.chapters?.[chapter.id];
            return {
                ...chapter,
                unlocked: progress?.unlocked || chapter.unlocked,
                completed: progress?.completed || false,
                battles: chapter.battles.map((battle, index) => {
                    const battleProgress = progress?.battles?.[index];
                    return {
                        ...battle,
                        completed: battleProgress?.completed || false
                    };
                })
            };
        });
    }

    /**
     * 獲取已解鎖的章節
     * @param {Object} gameData - 遊戲數據
     * @returns {Array} 已解鎖的章節
     */
    getUnlockedChapters(gameData) {
        return this.getAllChaptersWithProgress(gameData).filter(c => c.unlocked);
    }

    /**
     * 解鎖章節
     * @param {number} chapterNum - 章節號
     * @param {Object} gameData - 遊戲數據
     */
    unlockChapter(chapterNum, gameData) {
        const chapterId = `chapter_${chapterNum}`;
        if (!gameData.story.chapters[chapterId]) {
            const chapterData = getChapterByNumber(chapterNum);
            if (chapterData) {
                gameData.story.chapters[chapterId] = {
                    id: chapterId,
                    unlocked: true,
                    completed: false,
                    battles: chapterData.battles.map(b => ({
                        id: b.id,
                        completed: false
                    }))
                };
            }
        } else {
            gameData.story.chapters[chapterId].unlocked = true;
        }

        // 保存遊戲數據
        if (this.gameDataManager) {
            this.gameDataManager.saveGame(gameData);
        }

        return gameData;
    }

    /**
     * 開始章節
     * @param {string} chapterId - 章節ID
     * @param {Object} gameData - 遊戲數據
     * @returns {Object} 章節數據
     */
    startChapter(chapterId, gameData) {
        const chapterData = getChapterData(chapterId);
        if (!chapterData) {
            console.error(`Chapter not found: ${chapterId}`);
            return null;
        }

        // 檢查是否解鎖
        const progress = gameData.story?.chapters?.[chapterId];
        if (!progress || !progress.unlocked) {
            console.error(`Chapter not unlocked: ${chapterId}`);
            return null;
        }

        this.currentChapter = chapterData;
        gameData.story.currentChapterId = chapterId;

        if (this.gameDataManager) {
            this.gameDataManager.saveGame(gameData);
        }

        return chapterData;
    }

    /**
     * 完成戰鬥
     * @param {string} chapterId - 章節ID
     * @param {string} battleId - 戰鬥ID
     * @param {Object} gameData - 遊戲數據
     * @returns {Object} 獎勵數據
     */
    completeBattle(chapterId, battleId, gameData) {
        const chapterData = getChapterData(chapterId);
        if (!chapterData) return null;

        const battle = chapterData.battles.find(b => b.id === battleId);
        if (!battle) return null;

        // 標記戰鬥完成
        const chapterProgress = gameData.story.chapters[chapterId];
        if (chapterProgress) {
            const battleIndex = chapterData.battles.findIndex(b => b.id === battleId);
            if (battleIndex >= 0 && chapterProgress.battles[battleIndex]) {
                chapterProgress.battles[battleIndex].completed = true;
            }
        }

        // 記錄已完成的戰鬥
        if (!gameData.story.completedBattles.includes(battleId)) {
            gameData.story.completedBattles.push(battleId);
        }

        // 應用戰鬥獎勵
        if (battle.rewards) {
            this.applyRewards(battle.rewards, gameData);
        }

        // 檢查是否完成整個章節
        this.checkChapterCompletion(chapterId, gameData);

        if (this.gameDataManager) {
            this.gameDataManager.saveGame(gameData);
        }

        return battle.rewards;
    }

    /**
     * 檢查章節完成狀態
     * @param {string} chapterId - 章節ID
     * @param {Object} gameData - 遊戲數據
     */
    checkChapterCompletion(chapterId, gameData) {
        const chapterData = getChapterData(chapterId);
        if (!chapterData) return;

        const chapterProgress = gameData.story.chapters[chapterId];
        if (!chapterProgress) return;

        // 檢查所有戰鬥是否完成
        const allBattlesCompleted = chapterProgress.battles.every(b => b.completed);

        if (allBattlesCompleted && !chapterProgress.completed) {
            chapterProgress.completed = true;

            // 應用章節獎勵
            if (chapterData.rewards) {
                this.applyRewards(chapterData.rewards, gameData);
            }

            // 解鎖下一章
            if (chapterData.rewards.unlockChapter) {
                this.unlockChapter(chapterData.rewards.unlockChapter, gameData);
            }

            console.log(`Chapter ${chapterId} completed!`);
        }
    }

    /**
     * 應用獎勵
     * @param {Object} rewards - 獎勵對象
     * @param {Object} gameData - 遊戲數據
     */
    applyRewards(rewards, gameData) {
        if (!gameData.character) return;

        // 經驗值
        if (rewards.exp) {
            gameData.character.experience = (gameData.character.experience || 0) + rewards.exp;
            console.log(`Gained ${rewards.exp} exp`);
        }

        // 靈石
        if (rewards.spiritStones) {
            gameData.character.spiritStones = (gameData.character.spiritStones || 0) + rewards.spiritStones;
            console.log(`Gained ${rewards.spiritStones} spirit stones`);
        }

        // 物品
        if (rewards.items && rewards.items.length > 0) {
            if (!gameData.inventory) {
                gameData.inventory = { items: [] };
            }
            rewards.items.forEach(itemId => {
                gameData.inventory.items.push({
                    id: itemId,
                    quantity: 1,
                    obtainedAt: Date.now()
                });
                console.log(`Obtained item: ${itemId}`);
            });
        }
    }

    /**
     * 獲取當前章節
     * @returns {Object|null} 當前章節數據
     */
    getCurrentChapter() {
        return this.currentChapter;
    }

    /**
     * 獲取章節進度統計
     * @param {Object} gameData - 遊戲數據
     * @returns {Object} 進度統計
     */
    getProgressStats(gameData) {
        const allChapters = this.getAllChaptersWithProgress(gameData);
        
        const totalChapters = allChapters.length;
        const unlockedChapters = allChapters.filter(c => c.unlocked).length;
        const completedChapters = allChapters.filter(c => c.completed).length;
        
        const totalBattles = allChapters.reduce((sum, c) => sum + c.battles.length, 0);
        const completedBattles = allChapters.reduce((sum, c) => {
            return sum + c.battles.filter(b => b.completed).length;
        }, 0);

        return {
            totalChapters,
            unlockedChapters,
            completedChapters,
            totalBattles,
            completedBattles,
            completionPercentage: Math.round((completedChapters / totalChapters) * 100)
        };
    }

    /**
     * 重置章節（調試用）
     * @param {Object} gameData - 遊戲數據
     */
    resetProgress(gameData) {
        gameData.story = {
            chapters: {},
            currentChapterId: null,
            completedBattles: []
        };
        this.initialize(gameData);
        
        if (this.gameDataManager) {
            this.gameDataManager.saveGame(gameData);
        }
    }
}

export default StorySystem;
