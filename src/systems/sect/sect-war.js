/**
 * Sect War System - 宗門戰爭
 * Manages conflicts between sects
 * 管理宗門間的衝突
 */

export const WAR_STATES = {
  PREPARATION: 'preparation',
  ACTIVE: 'active',
  TRUCE: 'truce',
  CONCLUDED: 'concluded'
};

export class SectWarSystem {
  constructor() {
    this.wars = new Map();
  }

  declareWar(attackerSectId, defenderSectId, reason) {
    const warId = this.generateId();
    
    const war = {
      id: warId,
      attacker: attackerSectId,
      defender: defenderSectId,
      reason: reason,
      state: WAR_STATES.PREPARATION,
      startDate: Date.now(),
      battles: [],
      casualties: {
        attacker: 0,
        defender: 0
      },
      territoryChanges: []
    };

    this.wars.set(warId, war);

    return {
      success: true,
      war: war,
      message: `宣戰！(War declared!)`
    };
  }

  generateId() {
    return `war_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  conductBattle(warId, battleData) {
    const war = this.wars.get(warId);
    
    if (!war) {
      return {
        success: false,
        message: '戰爭不存在 (War does not exist)'
      };
    }

    if (war.state !== WAR_STATES.ACTIVE) {
      return {
        success: false,
        message: '戰爭未進行中 (War not active)'
      };
    }

    war.battles.push({
      timestamp: Date.now(),
      location: battleData.location,
      result: battleData.result,
      casualties: battleData.casualties
    });

    // Update casualties
    war.casualties.attacker += battleData.casualties.attacker || 0;
    war.casualties.defender += battleData.casualties.defender || 0;

    return {
      success: true,
      battle: battleData,
      message: `戰鬥結束！(Battle concluded!)`
    };
  }

  proposeTruce(warId, terms) {
    const war = this.wars.get(warId);
    
    if (!war) {
      return {
        success: false,
        message: '戰爭不存在 (War does not exist)'
      };
    }

    war.state = WAR_STATES.TRUCE;
    war.truceTerms = terms;

    return {
      success: true,
      message: '提議停戰！(Truce proposed!)'
    };
  }

  concludeWar(warId, victor) {
    const war = this.wars.get(warId);
    
    if (!war) {
      return {
        success: false,
        message: '戰爭不存在 (War does not exist)'
      };
    }

    war.state = WAR_STATES.CONCLUDED;
    war.victor = victor;
    war.endDate = Date.now();

    return {
      success: true,
      victor: victor,
      message: `戰爭結束！勝者：${victor} (War concluded! Victor: ${victor})`
    };
  }
}

export default SectWarSystem;
