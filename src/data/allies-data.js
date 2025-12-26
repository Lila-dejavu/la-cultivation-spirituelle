/**
 * Allies Data - 隊友數據
 * 定義遊戲中可招募的隊友角色
 */

/**
 * 隊友數據庫
 */
export const ALLIES_DATA = {
    lin_xue: {
        id: 'lin_xue',
        name: '林雪',
        title: '劍修',
        icon: '👩',
        joinChapter: 2,
        stats: {
            hp: 90,
            maxHp: 90,
            attack: 28,
            defense: 22,
            movement: 5,
            skill: 12,
            evasion: 8
        },
        type: 'infantry',
        attackRange: { min: 1, max: 1 },
        abilities: ['heal', 'protect'],
        description: '來自劍宗的弟子，擅長輔助和防禦',
        joinCondition: 'complete_chapter_2',
        backstory: '劍宗外門弟子，因緣際會與你相識，決定同行修煉。擅長劍術和輔助法術。',
        personality: 'calm', // 冷靜、理智
        growthRates: {
            hp: 5,
            attack: 2,
            defense: 3,
            skill: 1
        }
    },

    lei_ting: {
        id: 'lei_ting',
        name: '雷霆',
        title: '雷修',
        icon: '👨',
        joinChapter: 4,
        stats: {
            hp: 85,
            maxHp: 85,
            attack: 42,
            defense: 18,
            movement: 5,
            skill: 15,
            evasion: 12
        },
        type: 'mage',
        attackRange: { min: 1, max: 2 },
        abilities: ['lightning_strike', 'thunder_bolt'],
        description: '雷系修士，高傷害輸出',
        joinCondition: 'complete_chapter_4',
        backstory: '散修出身，精通雷法。性格直爽，重情重義。在古墓探險中與你並肩作戰後決定加入。',
        personality: 'aggressive', // 進取、好戰
        growthRates: {
            hp: 3,
            attack: 4,
            defense: 1,
            skill: 2
        }
    },

    xuan_wu: {
        id: 'xuan_wu',
        name: '玄武',
        title: '體修',
        icon: '🧔',
        joinChapter: 6,
        stats: {
            hp: 140,
            maxHp: 140,
            attack: 25,
            defense: 40,
            movement: 4,
            skill: 8,
            evasion: 5
        },
        type: 'infantry',
        attackRange: { min: 1, max: 1 },
        abilities: ['taunt', 'iron_defense', 'counter_strike'],
        description: '體修高手，坦克型，高防禦+嘲諷',
        joinCondition: 'complete_chapter_6',
        backstory: '曾是某個宗門的護法，因理念不合離開。修煉肉身達到極致，防御力驚人。',
        personality: 'defensive', // 穩健、防禦
        growthRates: {
            hp: 8,
            attack: 1,
            defense: 5,
            skill: 0
        }
    }
};

/**
 * 根據隊友ID獲取隊友數據
 * @param {string} allyId - 隊友ID
 * @returns {Object|null} 隊友數據
 */
export function getAllyData(allyId) {
    if (ALLIES_DATA[allyId]) {
        // 返回深拷貝避免修改原始數據
        return JSON.parse(JSON.stringify(ALLIES_DATA[allyId]));
    }
    return null;
}

/**
 * 獲取所有隊友列表
 * @returns {Array} 隊友數組
 */
export function getAllAllies() {
    return Object.values(ALLIES_DATA);
}

/**
 * 根據章節獲取可加入的隊友
 * @param {number} chapterNum - 章節號
 * @returns {Array} 該章節可加入的隊友
 */
export function getAlliesByChapter(chapterNum) {
    return getAllAllies().filter(ally => ally.joinChapter === chapterNum);
}

/**
 * 創建隊友實例
 * @param {string} allyId - 隊友ID
 * @param {number} row - 行位置
 * @param {number} col - 列位置
 * @returns {Object|null} 隊友實例
 */
export function createAllyInstance(allyId, row, col) {
    const data = getAllyData(allyId);
    if (!data) return null;

    return {
        ...data,
        row,
        col,
        isPlayer: true,
        hasActed: false,
        facing: 'south',
        level: 1,
        exp: 0,
        instanceId: `${allyId}_${Date.now()}_${Math.random()}`
    };
}

/**
 * 隊友升級
 * @param {Object} ally - 隊友實例
 */
export function levelUpAlly(ally) {
    if (!ally || !ALLIES_DATA[ally.id]) return;

    const baseData = ALLIES_DATA[ally.id];
    ally.level += 1;
    
    // 應用成長率
    ally.maxHp += baseData.growthRates.hp;
    ally.hp = ally.maxHp;
    ally.attack += baseData.growthRates.attack;
    ally.defense += baseData.growthRates.defense;
    ally.skill += baseData.growthRates.skill;
}

export default {
    ALLIES_DATA,
    getAllyData,
    getAllAllies,
    getAlliesByChapter,
    createAllyInstance,
    levelUpAlly
};
