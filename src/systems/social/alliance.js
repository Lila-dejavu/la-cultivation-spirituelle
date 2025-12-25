/**
 * Alliance System - 結盟系統
 * Manages alliances between groups
 * 管理群體間的結盟
 */

export const ALLIANCE_TYPES = {
  TRADE: 'trade',
  MILITARY: 'military',
  DIPLOMATIC: 'diplomatic',
  MARRIAGE: 'marriage'
};

export class AllianceSystem {
  constructor() {
    this.alliances = new Map();
  }

  createAlliance(group1Id, group2Id, type) {
    const allianceId = this.generateId();
    
    const alliance = {
      id: allianceId,
      group1: group1Id,
      group2: group2Id,
      type: type,
      strength: 50,
      establishedDate: Date.now(),
      terms: []
    };

    this.alliances.set(allianceId, alliance);

    return {
      success: true,
      alliance: alliance,
      message: '結盟成功！(Alliance established!)'
    };
  }

  generateId() {
    return `alliance_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  strengthenAlliance(allianceId, amount) {
    const alliance = this.alliances.get(allianceId);
    if (!alliance) return { success: false };

    alliance.strength += amount;
    alliance.strength = Math.max(0, Math.min(100, alliance.strength));

    return {
      success: true,
      strength: alliance.strength
    };
  }

  breakAlliance(allianceId) {
    const alliance = this.alliances.get(allianceId);
    if (!alliance) return { success: false };

    this.alliances.delete(allianceId);

    return {
      success: true,
      message: '解除同盟！(Alliance broken!)'
    };
  }
}

export default AllianceSystem;
