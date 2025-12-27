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
                text: '你踏入了青玄林深處，此地天地靈氣氤氳繚繞，古木參天，隱隱間似有靈光流轉...',
                emotion: 'neutral'
            },
            {
                speaker: 'player',
                text: '這青玄林果然名不虛傳！靈氣之濃郁，遠超凡俗之地。若能尋得傳說中的聚靈草，我的修為必能更進一步。',
                emotion: 'excited'
            },
            {
                speaker: 'narrator',
                text: '你運轉體內真元，感知周圍的靈氣波動。突然，神識中捕捉到一絲殺意！',
                emotion: 'tense'
            },
            {
                speaker: 'player',
                text: '不好！有妖獸接近！',
                emotion: 'alert'
            }
        ]
    },

    ch1_battle1_intro: {
        id: 'ch1_battle1_intro',
        dialogues: [
            {
                speaker: 'player',
                text: '是靈狼！這些妖獸已初通靈智，體內蘊含妖力。看來它們將青玄林視為領地，不容外人侵犯。',
                emotion: 'alert'
            },
            {
                speaker: 'narrator',
                text: '兩隻靈狼從密林中竄出，眼中閃爍著幽綠兇光，低吼聲中透著殺意。妖氣與靈氣在空中交織激盪！',
                emotion: 'tense'
            },
            {
                speaker: 'player',
                text: '來吧！讓你們見識一下修真者的手段！',
                emotion: 'determined'
            }
        ]
    },

    ch1_battle1_outro: {
        id: 'ch1_battle1_outro',
        dialogues: [
            {
                speaker: 'player',
                text: '總算擊退了這些畜生。這只是外圍的普通靈狼，體內妖力並不深厚。更深處恐怕有修為更高的妖獸盤踞...',
                emotion: 'thoughtful'
            },
            {
                speaker: 'narrator',
                text: '你盤膝調息片刻，將剛才戰鬥中消耗的真元恢復。周圍的天地靈氣緩緩匯入丹田。',
                emotion: 'neutral'
            }
        ]
    },

    ch1_battle2_intro: {
        id: 'ch1_battle2_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '繼續深入，你來到了青玄林的核心地帶。靈氣愈發濃郁，空氣中彷彿凝結成霧。一個巨大的身影在靈霧中若隱若現！',
                emotion: 'tense'
            },
            {
                speaker: 'player',
                text: '是狼群的首領！此獸體型龐大，妖氣凝實，恐怕已達妖獸中期境界。看來要動用全力了。',
                emotion: 'determined'
            },
            {
                speaker: 'narrator',
                text: '狼王仰天長嘯，周圍的靈狼聞聲而至。一場惡戰在所難免！',
                emotion: 'ominous'
            }
        ]
    },

    ch1_battle2_outro: {
        id: 'ch1_battle2_outro',
        dialogues: [
            {
                speaker: 'player',
                text: '終於戰勝了靈狼首領。這次的戰鬥讓我對真元的運用有了新的領悟。',
                emotion: 'relieved'
            },
            {
                speaker: 'narrator',
                text: '你從狼王屍身中提取出一塊妖丹，其中蘊含精純的妖力。這次歷練不僅獲得了大量修煉經驗，實力更是有所突破！',
                emotion: 'positive'
            },
            {
                speaker: 'player',
                text: '有了這枚妖丹，我的修為定能再進一步。不過聚靈草還未尋得，看來要繼續探索...',
                emotion: 'thoughtful'
            }
        ]
    },

    // 第2章對話
    ch2_intro: {
        id: 'ch2_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '離開青玄林後，你踏入了一片更加幽深的密林。陰森的氣息瀰漫四周，天地靈氣中夾雜著詭異的邪惡波動。',
                emotion: 'ominous'
            },
            {
                speaker: 'player',
                text: '這裡的氣息不對勁...空氣中竟有邪修的痕跡！難道有人在此修煉邪功？',
                emotion: 'alert'
            },
            {
                speaker: 'narrator',
                text: '你放出神識探查四周，卻發現有一股強大的力量在干擾你的感知。此地危機四伏！',
                emotion: 'tense'
            }
        ]
    },

    ch2_battle1_intro: {
        id: 'ch2_battle1_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '陰影中突然竄出一群毒蛇！蛇身泛著詭異的紫黑光芒，顯然是被邪法污染的妖獸。',
                emotion: 'surprised'
            },
            {
                speaker: 'player',
                text: '這些毒蛇體內的妖力已被邪氣侵蝕！攻擊必然帶有劇毒，萬不可大意！',
                emotion: 'warning'
            },
            {
                speaker: 'narrator',
                text: '毒蛇吐出紫黑色的瘴氣，邪毒之氣直逼而來！',
                emotion: 'tense'
            }
        ]
    },

    ch2_battle1_outro: {
        id: 'ch2_battle1_outro',
        dialogues: [
            {
                speaker: 'player',
                text: '這些毒蛇體內留有邪修的神識印記，明顯是被人豢養驅使。看來那個邪修就在附近！',
                emotion: 'alert'
            },
            {
                speaker: 'narrator',
                text: '你運轉真元，將侵入體內的些許毒氣逼出。遠處隱約傳來詭異的笑聲...',
                emotion: 'ominous'
            }
        ]
    },

    ch2_battle2_intro: {
        id: 'ch2_battle2_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '黑霧翻湧，一個身穿破舊黑袍的邪修從陰影中現身，周身邪氣環繞，眼中閃爍著詭異的紅光！',
                emotion: 'tense'
            },
            {
                speaker: 'enemy',
                name: '邪修',
                text: '桀桀桀...又是一個不知死活的正道修士。你的真元和神魂，正好可以作為我血煉大法的養料！',
                emotion: 'evil'
            },
            {
                speaker: 'player',
                text: '邪魔外道，人人得而誅之！今日便是你的末日！',
                emotion: 'determined'
            },
            {
                speaker: 'narrator',
                text: '邪修催動體內邪力，周圍的空氣瞬間變得粘稠腥臭。一場正邪對決即將展開！',
                emotion: 'ominous'
            }
        ]
    },

    ch2_battle2_outro: {
        id: 'ch2_battle2_outro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '邪修被你的法術擊中，身體化作一縷黑煙消散。但在消散前，他發出陰森的冷笑...',
                emotion: 'ominous'
            },
            {
                speaker: 'enemy',
                name: '邪修',
                text: '桀桀...你以為這就結束了嗎？我的主人很快就會來找你算賬的...',
                emotion: 'sinister'
            },
            {
                speaker: 'player',
                text: '看來這只是個小嘍囉，後面還有更強的邪修首領。我必須變得更強，才能應對即將到來的危機！',
                emotion: 'determined'
            }
        ]
    },

    ch2_battle3_intro: {
        id: 'ch2_battle3_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '深入密林核心，陰風怒號，邪氣濃郁得幾乎凝成實質。一個強大的妖修首領擋住了你的去路！其周身妖氣翻滾，實力遠超之前的邪修！',
                emotion: 'tense'
            },
            {
                speaker: 'enemy',
                name: '妖修首領',
                text: '哈哈哈！竟然能殺到這裡，看來還真有點本事。可惜，你註定要成為我修煉血神經的祭品！',
                emotion: 'confident'
            },
            {
                speaker: 'player',
                text: '這股妖氣...此人至少有築基期的修為！這將是一場惡戰！',
                emotion: 'alert'
            },
            {
                speaker: 'narrator',
                text: '妖修首領雙手結印，邪法催動，整片密林都被妖氣籠罩。生死存亡，在此一戰！',
                emotion: 'ominous'
            }
        ]
    },

    ch2_battle3_outro: {
        id: 'ch2_battle3_outro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '妖修首領在你的最後一擊下轟然倒地，體內邪力四散，化作縷縷黑煙消散於天地間。戰鬥終於結束。',
                emotion: 'relieved'
            },
            {
                speaker: 'player',
                text: '總算...解決了這個禍害。不過他臨死前提到的「血神經」究竟是什麼邪功...？',
                emotion: 'thoughtful'
            },
            {
                speaker: 'voice',
                name: '？？？',
                text: '好精彩的戰鬥！尤其是最後那一招，真元運轉行雲流水，實在令人佩服！',
                emotion: 'cheerful'
            },
            {
                speaker: 'player',
                text: '何人在此？！',
                emotion: 'surprised'
            },
            {
                speaker: 'lin_xue',
                name: '林雪',
                text: '不必緊張。在下林雪，劍宗外門弟子。剛才一直在暗處觀戰，見你與邪修惡鬥，本想出手相助，卻見你實力不凡，獨自便能應對。',
                emotion: 'friendly'
            },
            {
                speaker: 'player',
                text: '原來是劍宗的道友。多謝閣下關照，不知有何指教？',
                emotion: 'curious'
            },
            {
                speaker: 'lin_xue',
                name: '林雪',
                text: '我正欲尋找志同道合的道友，共同歷練。見你品性端正，實力不俗，不知可否結伴而行？',
                emotion: 'hopeful'
            },
            {
                speaker: 'player',
                text: '能與劍宗高徒同行，實乃榮幸！修行路上多個夥伴，也多份力量。',
                emotion: 'happy'
            },
            {
                speaker: 'narrator',
                text: '林雪加入了你的隊伍！你們的修仙之路將並肩前行！',
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
                text: '你們踏入了巍峨連綿的千丈山脈。雲霧繚繞山巔，天地靈氣在此凝聚如瀑。據傳，這裡有強大的妖獸守護著珍貴的天材地寶。',
                emotion: 'neutral'
            },
            {
                speaker: 'lin_xue',
                name: '林雪',
                text: '此地靈氣流轉極為特殊，隱約間似有陣法痕跡。我們要小心戒備。',
                emotion: 'alert'
            },
            {
                speaker: 'player',
                text: '嗯！無論前方有何兇險，我們並肩面對！',
                emotion: 'determined'
            }
        ]
    },

    ch3_battle1_intro: {
        id: 'ch3_battle1_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '天空中突然傳來淒厲的長鳴！數隻巨大的飛行妖獸振翅而來，遮天蔽日，狂風驟起！',
                emotion: 'surprised'
            },
            {
                speaker: 'lin_xue',
                name: '林雪',
                text: '是高階飛行妖獸！它們速度極快，善於空中突襲，務必小心應對！',
                emotion: 'warning'
            },
            {
                speaker: 'player',
                text: '來得好！正好試試我新領悟的身法！',
                emotion: 'determined'
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
                text: '你們來到了傳說中的魔域入口。此地天昏地暗，魔氣翻湧如海，侵蝕著周圍的一切生機。這裡充滿了致命危險，但也隱藏著足以改變命運的機緣。',
                emotion: 'ominous'
            },
            {
                speaker: 'lei_ting',
                name: '雷霆',
                text: '這魔氣濃郁得讓人窒息！大家運轉真元護體，切莫讓魔氣侵入經脈！',
                emotion: 'alert'
            },
            {
                speaker: 'lin_xue',
                name: '林雪',
                text: '我會全力守護大家。無論前路多險，劍宗弟子絕不退縮！',
                emotion: 'determined'
            },
            {
                speaker: 'player',
                text: '既然已至此地，便無退路可言。我們並肩作戰，定能闖過魔域！',
                emotion: 'confident'
            }
        ]
    },

    ch5_final_battle_intro: {
        id: 'ch5_final_battle_intro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '魔域最深處，無盡的黑暗中，一道恐怖的身影矗立於虛空。魔王！傳說中的絕世魔頭，終於現身了！',
                emotion: 'tense'
            },
            {
                speaker: 'enemy',
                name: '魔王',
                text: '哈哈哈哈！數百年來，竟有人類能踏入此地。有趣...實在太有趣了！就讓本座看看，你們這些螻蟻有多少實力！',
                emotion: 'menacing'
            },
            {
                speaker: 'player',
                text: '夥伴們，這是我們的最終試煉！無論勝敗，今日便是我們名揚修真界之時！',
                emotion: 'determined'
            },
            {
                speaker: 'lin_xue',
                name: '林雪',
                text: '劍宗林雪，隨時準備好了！',
                emotion: 'ready'
            },
            {
                speaker: 'lei_ting',
                name: '雷霆',
                text: '哈！來吧魔王！讓你嚐嚐我雷霆一擊的威力！',
                emotion: 'excited'
            },
            {
                speaker: 'narrator',
                text: '三人真元全力運轉，璀璨的靈光與魔王的黑暗魔氣在空中對峙。決戰，一觸即發！',
                emotion: 'epic'
            }
        ]
    },

    ch5_final_battle_outro: {
        id: 'ch5_final_battle_outro',
        dialogues: [
            {
                speaker: 'narrator',
                text: '在你們的全力一擊下，魔王發出震天怒吼，龐大的身軀轟然倒地。魔域的威脅終於解除了！',
                emotion: 'triumphant'
            },
            {
                speaker: 'player',
                text: '我們...做到了！這場艱苦的戰鬥，終於勝利了！',
                emotion: 'victorious'
            },
            {
                speaker: 'lin_xue',
                name: '林雪',
                text: '這一路走來，經歷無數生死考驗，我們都成長了許多。這份經歷，將成為我劍道之路上最寶貴的財富。',
                emotion: 'satisfied'
            },
            {
                speaker: 'lei_ting',
                name: '雷霆',
                text: '哈哈哈！這才是真正的戰鬥！能與你們並肩作戰，實乃我此生之幸！',
                emotion: 'joyful'
            },
            {
                speaker: 'narrator',
                text: '魔域上空，烏雲散去，久違的陽光灑落大地。你們的修煉之路還在繼續，更多的冒險在前方等待...未完待續',
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
