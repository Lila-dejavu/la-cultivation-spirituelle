/**
 * Reputation System - 聲望系統
 * Manages character reputation across different groups
 * 管理角色在不同群體中的聲望
 */

export class ReputationSystem {
  constructor() {
    this.reputations = new Map();
  }

  addReputation(characterId, groupId, amount) {
    const key = `${characterId}_${groupId}`;
    
    if (!this.reputations.has(key)) {
      this.reputations.set(key, {
        characterId: characterId,
        groupId: groupId,
        value: 0,
        rank: 'neutral'
      });
    }

    const reputation = this.reputations.get(key);
    reputation.value += amount;
    reputation.rank = this.calculateRank(reputation.value);

    return {
      success: true,
      reputation: reputation.value,
      rank: reputation.rank,
      message: `聲望${amount > 0 ? '提升' : '降低'}！(Reputation ${amount > 0 ? 'increased' : 'decreased'}!)`
    };
  }

  calculateRank(value) {
    if (value >= 1000) return 'revered';
    if (value >= 500) return 'honored';
    if (value >= 100) return 'friendly';
    if (value >= -100) return 'neutral';
    if (value >= -500) return 'unfriendly';
    return 'hostile';
  }

  getReputation(characterId, groupId) {
    const key = `${characterId}_${groupId}`;
    return this.reputations.get(key) || { value: 0, rank: 'neutral' };
  }
}

export default ReputationSystem;
