/**
 * Contribution System - 貢獻度系統
 * Manages sect contribution points and rewards
 * 管理宗門貢獻度和獎勵
 */

export const CONTRIBUTION_SOURCES = {
  MISSION: 'mission',
  DONATION: 'donation',
  TEACHING: 'teaching',
  BATTLE: 'battle',
  DISCOVERY: 'discovery'
};

export class ContributionSystem {
  constructor() {
    this.contributionRecords = new Map();
  }

  addContribution(sectId, characterId, amount, source) {
    const key = `${sectId}_${characterId}`;
    
    if (!this.contributionRecords.has(key)) {
      this.contributionRecords.set(key, {
        sectId: sectId,
        characterId: characterId,
        total: 0,
        history: []
      });
    }

    const record = this.contributionRecords.get(key);
    record.total += amount;
    record.history.push({
      amount: amount,
      source: source,
      timestamp: Date.now()
    });

    return {
      success: true,
      total: record.total,
      gained: amount,
      message: `獲得${amount}貢獻度！(Gained ${amount} contribution!)`
    };
  }

  getContribution(sectId, characterId) {
    const key = `${sectId}_${characterId}`;
    const record = this.contributionRecords.get(key);
    
    return record ? record.total : 0;
  }

  redeemReward(sectId, characterId, rewardId, cost) {
    const contribution = this.getContribution(sectId, characterId);
    
    if (contribution < cost) {
      return {
        success: false,
        message: '貢獻度不足 (Insufficient contribution)'
      };
    }

    // Deduct contribution
    const key = `${sectId}_${characterId}`;
    const record = this.contributionRecords.get(key);
    record.total -= cost;

    return {
      success: true,
      remaining: record.total,
      message: `兌換成功！剩餘貢獻度：${record.total} (Exchange successful! Remaining: ${record.total})`
    };
  }
}

export default ContributionSystem;
