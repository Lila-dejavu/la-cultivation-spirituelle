/**
 * Dialogues Data - 對話數據
 * 定義遊戲中所有劇情對話
 */

/**
 * 對話數據庫
 */
export const DIALOGUES_DATA = {
    // 第1章對話
    ch1_intro: {
        id: 'ch1_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '你踏入了森林深處，這裡靈氣繚繞，似乎隱藏著不為人知的秘密...',
                emotion: 'neutral'
            },
            {
                speaker: 'player',
                text: '這裡的靈氣好濃郁！如果能在此修煉，必定事半功倍。',
                emotion: 'excited'
            },
            {
                speaker: 'narrator',
                text: '突然，前方傳來低沉的吼聲！',
                emotion: 'surprised'
            }
        ]
    },

    ch1_battle1_intro: {
        id: 'ch1_battle1_intro',
        dialogues: [
            {
                speaker: 'player',
                text: '是靈狼！看來它們將這片森林視為領地。',
                emotion: 'alert'
            },
            {
                speaker: 'narrator',
                text: '兩隻靈狼從樹林中竄出，眼中閃爍著兇光！',
                emotion: 'tense'
            }
        ]
    },

    ch1_battle1_outro: {
        id: 'ch1_battle1_outro',
        dialogues: [
            {
                speaker: 'player',
                text: '總算擊退了它們。不過這只是普通的靈狼，更深處恐怕有更強大的存在。',
                emotion: 'thoughtful'
            }
        ]
    },

    ch1_battle2_intro: {
        id: 'ch1_battle2_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '繼續深入，你來到了森林的中心地帶。一個巨大的身影出現在前方！',
                emotion: 'tense'
            },
            {
                speaker: 'player',
                text: '是狼群的首領！看來要認真對待了。',
                emotion: 'determined'
            }
        ]
    },

    ch1_battle2_outro: {
        id: 'ch1_battle2_outro',
        dialogues: [
            {
                speaker: 'player',
                text: '終於戰勝了靈狼首領。這次的戰鬥讓我受益匪淺。',
                emotion: 'relieved'
            },
            {
                speaker: 'narrator',
                text: '你獲得了大量的修煉經驗，實力有所提升！',
                emotion: 'positive'
            }
        ]
    },

    // 第2章對話
    ch2_intro: {
        id: 'ch2_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '離開森林後，你來到了一片陰暗的樹林。空氣中彌漫著不祥的氣息。',
                emotion: 'ominous'
            },
            {
                speaker: 'player',
                text: '這裡有邪修的氣息...看來又有麻煩了。',
                emotion: 'alert'
            }
        ]
    },

    ch2_battle1_intro: {
        id: 'ch2_battle1_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '一群毒蛇突然從陰影中躍出！',
                emotion: 'surprised'
            },
            {
                speaker: 'player',
                text: '小心，這些毒蛇的攻擊有毒性！',
                emotion: 'warning'
            }
        ]
    },

    ch2_battle1_outro: {
        id: 'ch2_battle1_outro',
        dialogues: [
            {
                speaker: 'player',
                text: '這些毒蛇明顯是被人驅使的...邪修就在附近！',
                emotion: 'alert'
            }
        ]
    },

    ch2_battle2_intro: {
        id: 'ch2_battle2_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '一個身穿黑袍的邪修出現在你面前！',
                emotion: 'tense'
            },
            {
                speaker: 'enemy',
                name: '邪修',
                text: '哼，又是一個不知死活的小子。就讓你見識見識邪道的力量！',
                emotion: 'evil'
            },
            {
                speaker: 'player',
                text: '邪道終究是邪道，我會讓你知道正道的厲害！',
                emotion: 'determined'
            }
        ]
    },

    ch2_battle2_outro: {
        id: 'ch2_battle2_outro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '邪修被擊敗，身影漸漸消散...',
                emotion: 'neutral'
            },
            {
                speaker: 'player',
                text: '看來後面還有更強的敵人。我需要變得更強！',
                emotion: 'determined'
            }
        ]
    },

    ch2_battle3_intro: {
        id: 'ch2_battle3_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '深入密林，一個強大的妖修首領擋住了你的去路！',
                emotion: 'tense'
            },
            {
                speaker: 'enemy',
                name: '妖修首領',
                text: '竟然能走到這裡，看來有點本事。但也僅此而已了！',
                emotion: 'confident'
            },
            {
                speaker: 'player',
                text: '這股妖氣...是Boss級別的對手！',
                emotion: 'alert'
            }
        ]
    },

    ch2_battle3_outro: {
        id: 'ch2_battle3_outro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '妖修首領倒下了，戰鬥終於結束。',
                emotion: 'relieved'
            },
            {
                speaker: 'voice',
                name: '？？？',
                text: '好精彩的戰鬥！',
                emotion: 'cheerful'
            },
            {
                speaker: 'player',
                text: '是誰？',
                emotion: 'surprised'
            },
            {
                speaker: 'lin_xue',
                name: '林雪',
                text: '我是劍宗弟子林雪。剛才一直在觀戰，你的實力令我佩服。',
                emotion: 'friendly'
            },
            {
                speaker: 'player',
                text: '多謝誇獎。不知閣下有何事？',
                emotion: 'curious'
            },
            {
                speaker: 'lin_xue',
                name: '林雪',
                text: '我正在尋找修煉的夥伴。看你的實力和品行，不知可否同行？',
                emotion: 'hopeful'
            },
            {
                speaker: 'player',
                text: '很榮幸！多個夥伴也多份力量。',
                emotion: 'happy'
            },
            {
                speaker: 'narrator',
                text: '林雪加入了你的隊伍！',
                emotion: 'positive'
            }
        ]
    },

    // 第3章對話
    ch3_intro: {
        id: 'ch3_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '你們來到了連綿的山脈，據說這裡有強大的妖獸守護著珍貴的靈材。',
                emotion: 'neutral'
            },
            {
                speaker: 'lin_xue',
                name: '林雪',
                text: '這裡的靈氣很特殊，小心戒備。',
                emotion: 'alert'
            },
            {
                speaker: 'player',
                text: '嗯，我們一起面對！',
                emotion: 'determined'
            }
        ]
    },

    ch3_battle1_intro: {
        id: 'ch3_battle1_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '天空中出現了巨大的飛行妖獸！',
                emotion: 'surprised'
            },
            {
                speaker: 'lin_xue',
                name: '林雪',
                text: '是飛行妖獸！它們移動迅速，要小心應對！',
                emotion: 'warning'
            }
        ]
    },

    // 第4章對話 - 雷霆加入
    ch4_battle3_outro: {
        id: 'ch4_battle3_outro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '古墓守護者轟然倒下，你們終於通過了試煉。',
                emotion: 'relieved'
            },
            {
                speaker: 'voice',
                name: '？？？',
                text: '哈哈！精彩！實在是太精彩了！',
                emotion: 'excited'
            },
            {
                speaker: 'lei_ting',
                name: '雷霆',
                text: '我是散修雷霆，一直在尋找強大的夥伴。你們的實力讓我刮目相看！',
                emotion: 'enthusiastic'
            },
            {
                speaker: 'lin_xue',
                name: '林雪',
                text: '這位是...？',
                emotion: 'curious'
            },
            {
                speaker: 'player',
                text: '看你的氣息，是雷系修士？',
                emotion: 'interested'
            },
            {
                speaker: 'lei_ting',
                name: '雷霆',
                text: '沒錯！我精通雷法，攻擊力強大。如果你們願意，我想加入你們！',
                emotion: 'hopeful'
            },
            {
                speaker: 'player',
                text: '歡迎加入！多一個強大的夥伴總是好的。',
                emotion: 'happy'
            },
            {
                speaker: 'narrator',
                text: '雷霆加入了你的隊伍！',
                emotion: 'positive'
            }
        ]
    },

    // 第5章對話
    ch5_intro: {
        id: 'ch5_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '你們來到了傳說中的魔域入口。這裡充滿了危險，但也隱藏著巨大的機遇。',
                emotion: 'ominous'
            },
            {
                speaker: 'lei_ting',
                name: '雷霆',
                text: '這裡的魔氣好重！大家要小心！',
                emotion: 'alert'
            },
            {
                speaker: 'lin_xue',
                name: '林雪',
                text: '我會保護好大家的。',
                emotion: 'determined'
            },
            {
                speaker: 'player',
                text: '我們一起並肩作戰！',
                emotion: 'confident'
            }
        ]
    },

    ch5_final_battle_intro: {
        id: 'ch5_final_battle_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '魔域深處，魔王的身影出現在你們面前！',
                emotion: 'tense'
            },
            {
                speaker: 'enemy',
                name: '魔王',
                text: '竟然有人類能走到這裡...有趣！讓我看看你們有多少實力！',
                emotion: 'menacing'
            },
            {
                speaker: 'player',
                text: '夥伴們，準備好了嗎？這是最終的考驗！',
                emotion: 'determined'
            },
            {
                speaker: 'lin_xue',
                name: '林雪',
                text: '隨時準備好了！',
                emotion: 'ready'
            },
            {
                speaker: 'lei_ting',
                name: '雷霆',
                text: '來吧！讓它見識我們的力量！',
                emotion: 'excited'
            }
        ]
    },

    ch5_final_battle_outro: {
        id: 'ch5_final_battle_outro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '魔王終於被擊敗！魔域的威脅解除了。',
                emotion: 'triumphant'
            },
            {
                speaker: 'player',
                text: '我們做到了！',
                emotion: 'victorious'
            },
            {
                speaker: 'lin_xue',
                name: '林雪',
                text: '這次的歷練讓我們都成長了很多。',
                emotion: 'satisfied'
            },
            {
                speaker: 'lei_ting',
                name: '雷霆',
                text: '哈哈！這才是真正的戰鬥！',
                emotion: 'joyful'
            },
            {
                speaker: 'narrator',
                text: '你們的修煉之路還在繼續...未完待續',
                emotion: 'hopeful'
            }
        ]
    }
};

/**
 * 根據對話ID獲取對話數據
 * @param {string} dialogueId - 對話ID
 * @returns {Object|null} 對話數據
 */
export function getDialogueData(dialogueId) {
    return DIALOGUES_DATA[dialogueId] || null;
}

/**
 * 獲取所有對話ID列表
 * @returns {Array} 對話ID數組
 */
export function getAllDialogueIds() {
    return Object.keys(DIALOGUES_DATA);
}

export default {
    DIALOGUES_DATA,
    getDialogueData,
    getAllDialogueIds
};
