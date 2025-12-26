/**
 * Chapters Data - 章節數據
 * 定義遊戲的章節系統，包含戰鬥配置、劇情和獎勵
 */

/**
 * 章節數據庫
 */
export const CHAPTERS_DATA = {
    chapter_1: {
        id: 'chapter_1',
        number: 1,
        title: '第一章：初入修行',
        description: '踏入森林深處，與靈獸的初次對決',
        unlocked: true, // 第一章默認解鎖
        completed: false,
        difficulty: 'easy',
        recommendedLevel: 1,
        introDialogue: 'ch1_intro',
        battles: [
            {
                id: 'ch1_battle1',
                name: '靈狼來襲',
                description: '遭遇普通靈狼群',
                enemies: [
                    { id: 'spirit_wolf', position: { row: 2, col: 12 } },
                    { id: 'spirit_wolf', position: { row: 4, col: 13 } }
                ],
                playerPositions: [
                    { row: 12, col: 2 }
                ],
                terrain: 'forest',
                dialogueBefore: 'ch1_battle1_intro',
                dialogueAfter: 'ch1_battle1_outro',
                rewards: {
                    exp: 100,
                    spiritStones: 20,
                    items: []
                }
            },
            {
                id: 'ch1_battle2',
                name: '狼王之戰',
                description: '挑戰靈狼首領',
                enemies: [
                    { id: 'spirit_wolf', position: { row: 3, col: 11 } },
                    { id: 'spirit_wolf', position: { row: 3, col: 13 } },
                    { id: 'wolf_alpha', position: { row: 2, col: 12 } }
                ],
                playerPositions: [
                    { row: 12, col: 2 }
                ],
                terrain: 'forest_boss',
                dialogueBefore: 'ch1_battle2_intro',
                dialogueAfter: 'ch1_battle2_outro',
                rewards: {
                    exp: 150,
                    spiritStones: 40,
                    items: ['wolf_fang']
                }
            }
        ],
        rewards: {
            exp: 250,
            spiritStones: 60,
            items: ['health_potion'],
            unlockChapter: 2
        }
    },

    chapter_2: {
        id: 'chapter_2',
        number: 2,
        title: '第二章：森林危機',
        description: '深入密林，邪修的陰謀浮現',
        unlocked: false,
        completed: false,
        difficulty: 'normal',
        recommendedLevel: 3,
        introDialogue: 'ch2_intro',
        battles: [
            {
                id: 'ch2_battle1',
                name: '毒蛇襲擊',
                description: '遭遇毒蛇群',
                enemies: [
                    { id: 'poison_snake', position: { row: 3, col: 10 } },
                    { id: 'poison_snake', position: { row: 4, col: 12 } },
                    { id: 'spirit_wolf', position: { row: 5, col: 11 } }
                ],
                playerPositions: [
                    { row: 12, col: 2 }
                ],
                terrain: 'forest',
                dialogueBefore: 'ch2_battle1_intro',
                dialogueAfter: 'ch2_battle1_outro',
                rewards: {
                    exp: 120,
                    spiritStones: 30,
                    items: []
                }
            },
            {
                id: 'ch2_battle2',
                name: '邪修現身',
                description: '與邪修的戰鬥',
                enemies: [
                    { id: 'evil_cultivator', position: { row: 2, col: 12 } },
                    { id: 'poison_snake', position: { row: 4, col: 10 } },
                    { id: 'poison_snake', position: { row: 4, col: 14 } }
                ],
                playerPositions: [
                    { row: 12, col: 2 }
                ],
                terrain: 'forest',
                dialogueBefore: 'ch2_battle2_intro',
                dialogueAfter: 'ch2_battle2_outro',
                rewards: {
                    exp: 150,
                    spiritStones: 40,
                    items: []
                }
            },
            {
                id: 'ch2_battle3',
                name: '妖修首領',
                description: 'Boss戰：妖修首領',
                enemies: [
                    { id: 'demon_leader', position: { row: 2, col: 12 } },
                    { id: 'evil_cultivator', position: { row: 4, col: 10 } },
                    { id: 'poison_snake', position: { row: 4, col: 14 } }
                ],
                playerPositions: [
                    { row: 12, col: 2 }
                ],
                terrain: 'forest_boss',
                dialogueBefore: 'ch2_battle3_intro',
                dialogueAfter: 'ch2_battle3_outro',
                rewards: {
                    exp: 200,
                    spiritStones: 60,
                    items: ['demon_core']
                },
                allyJoin: 'lin_xue' // 林雪加入
            }
        ],
        rewards: {
            exp: 470,
            spiritStones: 130,
            items: ['health_potion', 'mana_potion'],
            unlockChapter: 3
        }
    },

    chapter_3: {
        id: 'chapter_3',
        number: 3,
        title: '第三章：山脈試煉',
        description: '挑戰山脈中的強大妖獸',
        unlocked: false,
        completed: false,
        difficulty: 'normal',
        recommendedLevel: 5,
        introDialogue: 'ch3_intro',
        battles: [
            {
                id: 'ch3_battle1',
                name: '飛行妖獸',
                description: '對抗飛行妖獸',
                enemies: [
                    { id: 'flying_beast', position: { row: 3, col: 11 } },
                    { id: 'flying_beast', position: { row: 3, col: 13 } },
                    { id: 'spirit_wolf', position: { row: 5, col: 12 } }
                ],
                playerPositions: [
                    { row: 12, col: 2 },
                    { row: 12, col: 4 } // 林雪位置
                ],
                allyUnits: ['lin_xue'],
                terrain: 'mountain',
                dialogueBefore: 'ch3_battle1_intro',
                dialogueAfter: null,
                rewards: {
                    exp: 180,
                    spiritStones: 50,
                    items: []
                }
            },
            {
                id: 'ch3_battle2',
                name: '精英守衛',
                description: '突破守衛防線',
                enemies: [
                    { id: 'elite_guard', position: { row: 3, col: 11 } },
                    { id: 'elite_guard', position: { row: 3, col: 13 } },
                    { id: 'flying_beast', position: { row: 5, col: 12 } }
                ],
                playerPositions: [
                    { row: 12, col: 2 },
                    { row: 12, col: 4 }
                ],
                allyUnits: ['lin_xue'],
                terrain: 'mountain',
                dialogueBefore: null,
                dialogueAfter: null,
                rewards: {
                    exp: 200,
                    spiritStones: 60,
                    items: []
                }
            },
            {
                id: 'ch3_battle3',
                name: '山嶽之主',
                description: 'Boss戰：山嶽之主',
                enemies: [
                    { id: 'mountain_lord', position: { row: 2, col: 12 } },
                    { id: 'elite_guard', position: { row: 4, col: 10 } },
                    { id: 'elite_guard', position: { row: 4, col: 14 } },
                    { id: 'flying_beast', position: { row: 6, col: 12 } }
                ],
                playerPositions: [
                    { row: 12, col: 2 },
                    { row: 12, col: 4 }
                ],
                allyUnits: ['lin_xue'],
                terrain: 'mountain_boss',
                dialogueBefore: null,
                dialogueAfter: null,
                rewards: {
                    exp: 250,
                    spiritStones: 80,
                    items: ['mountain_crystal']
                }
            }
        ],
        rewards: {
            exp: 630,
            spiritStones: 190,
            items: ['health_potion', 'defense_charm'],
            unlockChapter: 4
        }
    },

    chapter_4: {
        id: 'chapter_4',
        number: 4,
        title: '第四章：古墓探險',
        description: '探索古墓，面對亡靈的威脅',
        unlocked: false,
        completed: false,
        difficulty: 'hard',
        recommendedLevel: 8,
        introDialogue: null,
        battles: [
            {
                id: 'ch4_battle1',
                name: '亡靈戰士',
                description: '對抗骷髏戰士',
                enemies: [
                    { id: 'skeleton_warrior', position: { row: 3, col: 10 } },
                    { id: 'skeleton_warrior', position: { row: 3, col: 12 } },
                    { id: 'skeleton_warrior', position: { row: 3, col: 14 } }
                ],
                playerPositions: [
                    { row: 12, col: 2 },
                    { row: 12, col: 4 }
                ],
                allyUnits: ['lin_xue'],
                terrain: 'castle',
                dialogueBefore: null,
                dialogueAfter: null,
                rewards: {
                    exp: 220,
                    spiritStones: 70,
                    items: []
                }
            },
            {
                id: 'ch4_battle2',
                name: '暗黑法師',
                description: '對抗暗黑法師',
                enemies: [
                    { id: 'dark_mage', position: { row: 2, col: 12 } },
                    { id: 'skeleton_warrior', position: { row: 4, col: 10 } },
                    { id: 'skeleton_warrior', position: { row: 4, col: 14 } }
                ],
                playerPositions: [
                    { row: 12, col: 2 },
                    { row: 12, col: 4 }
                ],
                allyUnits: ['lin_xue'],
                terrain: 'castle',
                dialogueBefore: null,
                dialogueAfter: null,
                rewards: {
                    exp: 250,
                    spiritStones: 80,
                    items: []
                }
            },
            {
                id: 'ch4_battle3',
                name: '古墓守護者',
                description: 'Boss戰：古墓守護者',
                enemies: [
                    { id: 'ancient_guardian', position: { row: 2, col: 12 } },
                    { id: 'dark_mage', position: { row: 5, col: 10 } },
                    { id: 'skeleton_warrior', position: { row: 5, col: 12 } },
                    { id: 'skeleton_warrior', position: { row: 5, col: 14 } }
                ],
                playerPositions: [
                    { row: 12, col: 2 },
                    { row: 12, col: 4 }
                ],
                allyUnits: ['lin_xue'],
                terrain: 'castle_boss',
                dialogueBefore: null,
                dialogueAfter: 'ch4_battle3_outro',
                rewards: {
                    exp: 300,
                    spiritStones: 100,
                    items: ['ancient_artifact']
                },
                allyJoin: 'lei_ting' // 雷霆加入
            }
        ],
        rewards: {
            exp: 770,
            spiritStones: 250,
            items: ['health_potion', 'attack_charm'],
            unlockChapter: 5
        }
    },

    chapter_5: {
        id: 'chapter_5',
        number: 5,
        title: '第五章：魔域挑戰',
        description: '進入魔域，挑戰魔王',
        unlocked: false,
        completed: false,
        difficulty: 'very_hard',
        recommendedLevel: 12,
        introDialogue: 'ch5_intro',
        battles: [
            {
                id: 'ch5_battle1',
                name: '魔騎士軍團',
                description: '對抗魔騎士',
                enemies: [
                    { id: 'demon_knight', position: { row: 3, col: 10 } },
                    { id: 'demon_knight', position: { row: 3, col: 12 } },
                    { id: 'demon_knight', position: { row: 3, col: 14 } }
                ],
                playerPositions: [
                    { row: 12, col: 2 },
                    { row: 12, col: 4 },
                    { row: 12, col: 6 } // 雷霆位置
                ],
                allyUnits: ['lin_xue', 'lei_ting'],
                terrain: 'plain',
                dialogueBefore: null,
                dialogueAfter: null,
                rewards: {
                    exp: 280,
                    spiritStones: 90,
                    items: []
                }
            },
            {
                id: 'ch5_battle2',
                name: '烈焰魔',
                description: '對抗火焰魔物',
                enemies: [
                    { id: 'flame_demon', position: { row: 2, col: 12 } },
                    { id: 'demon_knight', position: { row: 4, col: 10 } },
                    { id: 'demon_knight', position: { row: 4, col: 14 } }
                ],
                playerPositions: [
                    { row: 12, col: 2 },
                    { row: 12, col: 4 },
                    { row: 12, col: 6 }
                ],
                allyUnits: ['lin_xue', 'lei_ting'],
                terrain: 'plain',
                dialogueBefore: null,
                dialogueAfter: null,
                rewards: {
                    exp: 320,
                    spiritStones: 110,
                    items: []
                }
            },
            {
                id: 'ch5_battle3',
                name: '魔王決戰',
                description: 'Final Boss：魔王',
                enemies: [
                    { id: 'demon_lord', position: { row: 2, col: 12 } },
                    { id: 'flame_demon', position: { row: 4, col: 10 } },
                    { id: 'flame_demon', position: { row: 4, col: 14 } },
                    { id: 'demon_knight', position: { row: 6, col: 11 } },
                    { id: 'demon_knight', position: { row: 6, col: 13 } }
                ],
                playerPositions: [
                    { row: 12, col: 2 },
                    { row: 12, col: 4 },
                    { row: 12, col: 6 }
                ],
                allyUnits: ['lin_xue', 'lei_ting'],
                terrain: 'castle_boss',
                dialogueBefore: 'ch5_final_battle_intro',
                dialogueAfter: 'ch5_final_battle_outro',
                rewards: {
                    exp: 500,
                    spiritStones: 200,
                    items: ['demon_lord_essence', 'legendary_weapon']
                }
            }
        ],
        rewards: {
            exp: 1100,
            spiritStones: 400,
            items: ['health_potion', 'mana_potion', 'ultimate_charm'],
            unlockChapter: null // 最後一章
        }
    }
};

/**
 * 根據章節ID獲取章節數據
 * @param {string} chapterId - 章節ID
 * @returns {Object|null} 章節數據
 */
export function getChapterData(chapterId) {
    return CHAPTERS_DATA[chapterId] || null;
}

/**
 * 根據章節號獲取章節數據
 * @param {number} chapterNum - 章節號
 * @returns {Object|null} 章節數據
 */
export function getChapterByNumber(chapterNum) {
    const chapterId = `chapter_${chapterNum}`;
    return getChapterData(chapterId);
}

/**
 * 獲取所有章節列表
 * @returns {Array} 章節數組
 */
export function getAllChapters() {
    return Object.values(CHAPTERS_DATA);
}

/**
 * 獲取已解鎖的章節
 * @param {Object} gameData - 遊戲數據
 * @returns {Array} 已解鎖的章節
 */
export function getUnlockedChapters(gameData) {
    return getAllChapters().filter(chapter => {
        if (!gameData.story || !gameData.story.chapters) return chapter.unlocked;
        const savedChapter = gameData.story.chapters[chapter.id];
        return savedChapter ? savedChapter.unlocked : chapter.unlocked;
    });
}

/**
 * 檢查章節是否完成
 * @param {string} chapterId - 章節ID
 * @param {Object} gameData - 遊戲數據
 * @returns {boolean} 是否完成
 */
export function isChapterCompleted(chapterId, gameData) {
    if (!gameData.story || !gameData.story.chapters) return false;
    const savedChapter = gameData.story.chapters[chapterId];
    return savedChapter ? savedChapter.completed : false;
}

export default {
    CHAPTERS_DATA,
    getChapterData,
    getChapterByNumber,
    getAllChapters,
    getUnlockedChapters,
    isChapterCompleted
};
