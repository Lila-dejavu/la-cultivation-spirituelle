/**
 * Enemies Data - 敵人數據
 * 定義遊戲中所有敵人的數據，包括屬性、技能、AI行為等
 */

/**
 * 敵人數據庫
 * 按章節組織，包含各種敵人類型
 */
export const ENEMIES_DATA = {
    // 第1章：初入修行 - 基礎妖獸
    chapter1: {
        spirit_wolf: {
            id: 'spirit_wolf',
            name: '靈狼',
            icon: '🐺',
            iconId: 'spirit_wolf', // For image lookup
            chapter: 1,
            type: 'infantry',
            stats: {
                hp: 80,
                maxHp: 80,
                attack: 25,
                defense: 15,
                movement: 6,
                skill: 8,
                evasion: 10
            },
            attackRange: { min: 1, max: 1 },
            abilities: [],
            description: '森林中常見的靈獸，具有一定的戰鬥能力'
        },
        wolf_alpha: {
            id: 'wolf_alpha',
            name: '靈狼首領',
            icon: '🐺',
            iconId: 'spirit_wolf', // Reuse same wolf icon
            chapter: 1,
            type: 'infantry',
            stats: {
                hp: 120,
                maxHp: 120,
                attack: 35,
                defense: 22,
                movement: 6,
                skill: 12,
                evasion: 15
            },
            attackRange: { min: 1, max: 1 },
            abilities: ['strong_attack'],
            description: '靈狼群的首領，力量強大'
        }
    },

    // 第2章：森林危機 - 妖獸與邪修
    chapter2: {
        poison_snake: {
            id: 'poison_snake',
            name: '毒蛇',
            icon: '🐍',
            chapter: 2,
            type: 'archer',
            stats: {
                hp: 70,
                maxHp: 70,
                attack: 30,
                defense: 12,
                movement: 5,
                skill: 10,
                evasion: 20
            },
            attackRange: { min: 2, max: 3 },
            abilities: ['poison'],
            description: '遠程攻擊的毒蛇，攻擊帶有毒性'
        },
        evil_cultivator: {
            id: 'evil_cultivator',
            name: '邪修',
            icon: '🧙',
            chapter: 2,
            type: 'mage',
            stats: {
                hp: 90,
                maxHp: 90,
                attack: 38,
                defense: 18,
                movement: 5,
                skill: 15,
                evasion: 12
            },
            attackRange: { min: 1, max: 2 },
            abilities: ['dark_magic'],
            description: '修煉邪道的修士，擅長魔法攻擊'
        },
        demon_leader: {
            id: 'demon_leader',
            name: '妖修首領',
            icon: '👹',
            chapter: 2,
            type: 'infantry',
            stats: {
                hp: 150,
                maxHp: 150,
                attack: 45,
                defense: 28,
                movement: 5,
                skill: 18,
                evasion: 15
            },
            attackRange: { min: 1, max: 1 },
            abilities: ['strong_attack', 'dark_magic'],
            description: '妖修首領，實力強大的Boss'
        }
    },

    // 第3章：山脈試煉 - 飛行妖獸與精英守衛
    chapter3: {
        flying_beast: {
            id: 'flying_beast',
            name: '飛行妖獸',
            icon: '🦅',
            chapter: 3,
            type: 'flying',
            stats: {
                hp: 85,
                maxHp: 85,
                attack: 40,
                defense: 20,
                movement: 8,
                skill: 15,
                evasion: 25
            },
            attackRange: { min: 1, max: 1 },
            abilities: ['fly', 'dive_attack'],
            description: '飛行妖獸，移動力強，無視地形'
        },
        elite_guard: {
            id: 'elite_guard',
            name: '精英守衛',
            icon: '⚔️',
            chapter: 3,
            type: 'infantry',
            stats: {
                hp: 130,
                maxHp: 130,
                attack: 48,
                defense: 35,
                movement: 5,
                skill: 20,
                evasion: 10
            },
            attackRange: { min: 1, max: 1 },
            abilities: ['shield_bash', 'counter'],
            description: '訓練有素的精英守衛，防禦力強'
        },
        mountain_lord: {
            id: 'mountain_lord',
            name: '山嶽之主',
            icon: '👺',
            chapter: 3,
            type: 'infantry',
            stats: {
                hp: 200,
                maxHp: 200,
                attack: 55,
                defense: 40,
                movement: 4,
                skill: 22,
                evasion: 12
            },
            attackRange: { min: 1, max: 2 },
            abilities: ['earthquake', 'rock_throw', 'strong_attack'],
            description: '山脈的統治者，力量驚人'
        }
    },

    // 第4章：古墓探險 - 亡靈與機關
    chapter4: {
        skeleton_warrior: {
            id: 'skeleton_warrior',
            name: '骷髏戰士',
            icon: '💀',
            chapter: 4,
            type: 'infantry',
            stats: {
                hp: 110,
                maxHp: 110,
                attack: 42,
                defense: 25,
                movement: 5,
                skill: 16,
                evasion: 8
            },
            attackRange: { min: 1, max: 1 },
            abilities: ['undead'],
            description: '不死的骷髏戰士，感受不到痛苦'
        },
        dark_mage: {
            id: 'dark_mage',
            name: '暗黑法師',
            icon: '🧙‍♂️',
            chapter: 4,
            type: 'mage',
            stats: {
                hp: 95,
                maxHp: 95,
                attack: 52,
                defense: 22,
                movement: 4,
                skill: 24,
                evasion: 15
            },
            attackRange: { min: 2, max: 3 },
            abilities: ['curse', 'dark_bolt', 'summon'],
            description: '精通暗黑魔法的法師，可以召喚亡靈'
        },
        ancient_guardian: {
            id: 'ancient_guardian',
            name: '古墓守護者',
            icon: '🗿',
            chapter: 4,
            type: 'infantry',
            stats: {
                hp: 250,
                maxHp: 250,
                attack: 60,
                defense: 45,
                movement: 3,
                skill: 20,
                evasion: 5
            },
            attackRange: { min: 1, max: 1 },
            abilities: ['stone_skin', 'crushing_blow', 'regenerate'],
            description: '古墓的終極守護者，防禦驚人'
        }
    },

    // 第5章：魔域挑戰 - 高級魔物
    chapter5: {
        demon_knight: {
            id: 'demon_knight',
            name: '魔騎士',
            icon: '🐴',
            chapter: 5,
            type: 'cavalry',
            stats: {
                hp: 140,
                maxHp: 140,
                attack: 58,
                defense: 35,
                movement: 7,
                skill: 22,
                evasion: 18
            },
            attackRange: { min: 1, max: 1 },
            abilities: ['charge', 'trample'],
            description: '騎乘魔獸的騎士，衝鋒威力巨大'
        },
        flame_demon: {
            id: 'flame_demon',
            name: '烈焰魔',
            icon: '🔥',
            chapter: 5,
            type: 'mage',
            stats: {
                hp: 120,
                maxHp: 120,
                attack: 65,
                defense: 28,
                movement: 5,
                skill: 26,
                evasion: 20
            },
            attackRange: { min: 1, max: 3 },
            abilities: ['fireball', 'flame_wave', 'burn'],
            description: '火焰魔物，精通火系法術'
        },
        demon_lord: {
            id: 'demon_lord',
            name: '魔王',
            icon: '😈',
            chapter: 5,
            type: 'infantry',
            stats: {
                hp: 300,
                maxHp: 300,
                attack: 70,
                defense: 50,
                movement: 5,
                skill: 28,
                evasion: 20
            },
            attackRange: { min: 1, max: 2 },
            abilities: ['demon_power', 'dark_explosion', 'life_drain', 'summon_minions'],
            description: '魔域的統治者，最終Boss'
        }
    }
};

/**
 * 根據敵人ID獲取敵人數據
 * @param {string} enemyId - 敵人ID
 * @returns {Object|null} 敵人數據
 */
export function getEnemyData(enemyId) {
    for (const chapter in ENEMIES_DATA) {
        if (ENEMIES_DATA[chapter][enemyId]) {
            // 返回深拷貝避免修改原始數據
            return JSON.parse(JSON.stringify(ENEMIES_DATA[chapter][enemyId]));
        }
    }
    return null;
}

/**
 * 根據章節獲取所有敵人
 * @param {number} chapterNum - 章節號
 * @returns {Object} 該章節的所有敵人數據
 */
export function getChapterEnemies(chapterNum) {
    const chapterKey = `chapter${chapterNum}`;
    return ENEMIES_DATA[chapterKey] || {};
}

/**
 * 創建敵人實例
 * @param {string} enemyId - 敵人ID
 * @param {number} row - 行位置
 * @param {number} col - 列位置
 * @returns {Object|null} 敵人實例
 */
export function createEnemyInstance(enemyId, row, col) {
    const data = getEnemyData(enemyId);
    if (!data) return null;

    return {
        ...data,
        row,
        col,
        isPlayer: false,
        hasActed: false,
        facing: 'south',
        instanceId: `${enemyId}_${Date.now()}_${Math.random()}`
    };
}

export default {
    ENEMIES_DATA,
    getEnemyData,
    getChapterEnemies,
    createEnemyInstance
};
