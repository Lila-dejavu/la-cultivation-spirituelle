/**
 * Breakthrough System - 突破系統
 * Handles realm breakthrough mechanics and progression
 * 處理境界突破機制和進階
 */

import { REALMS, REALM_STAGES } from './realm-system.js';

/**
 * Breakthrough difficulty levels
 * 突破難度等級
 */
export const BREAKTHROUGH_DIFFICULTY = {
  EASY: 0.8,      // 容易
  NORMAL: 1.0,    // 普通
  HARD: 1.3,      // 困難
  EXTREME: 1.8    // 極難
};

/**
 * Breakthrough results
 * 突破結果
 */
export const BREAKTHROUGH_RESULT = {
  SUCCESS: 'success',           // 成功
  PARTIAL: 'partial',           // 部分成功
  FAILURE: 'failure',           // 失敗
  CRITICAL_FAILURE: 'critical'  // 嚴重失敗（受傷）
};

/**
 * BreakthroughSystem class
 * Manages cultivation breakthrough attempts
 */
export class BreakthroughSystem {
  constructor(realmSystem) {
    this.realmSystem = realmSystem;
  }

  /**
   * Attempt breakthrough to next realm
   * 嘗試突破到下一個境界
   * @param {Object} character - Character attempting breakthrough
   * @param {Object} options - Breakthrough options (items, location, etc.)
   * @returns {Object} Breakthrough result
   */
  attemptBreakthrough(character, options = {}) {
    const currentRealm = character.cultivation.realm;
    const nextRealm = this.realmSystem.getNextRealm(currentRealm);

    if (!nextRealm) {
      return {
        success: false,
        message: '已達最高境界 (Already at maximum realm)'
      };
    }

    // Check basic requirements
    if (!this.realmSystem.canBreakthrough(character)) {
      return {
        success: false,
        message: '不滿足突破條件 (Requirements not met)'
      };
    }

    // Calculate success rate
    const successRate = this.calculateSuccessRate(character, options);
    
    // Roll for success
    const roll = Math.random();
    const result = this.determineResult(roll, successRate);

    // Apply result
    return this.applyBreakthroughResult(character, result, nextRealm, options);
  }

  /**
   * Calculate breakthrough success rate
   * 計算突破成功率
   */
  calculateSuccessRate(character, options) {
    let baseRate = 0.5; // 50% base rate

    // Spiritual root quality bonus
    // 靈根品質加成
    if (character.spiritualRoot) {
      baseRate += character.spiritualRoot.quality * 0.1;
    }

    // Comprehension bonus
    // 悟性加成
    const comprehension = character.cultivation.comprehension || 0;
    baseRate += comprehension / 1000 * 0.2;

    // Elixir bonus
    // 丹藥加成
    if (options.elixir) {
      baseRate += options.elixir.breakthroughBonus || 0;
    }

    // Location bonus (spiritual vein)
    // 地點加成（靈脈）
    if (options.location && options.location.spiritualDensity) {
      baseRate += options.location.spiritualDensity * 0.05;
    }

    // Guidance bonus (master assistance)
    // 師父指導加成
    if (options.masterGuidance) {
      baseRate += 0.15;
    }

    return Math.min(baseRate, 0.95); // Cap at 95%
  }

  /**
   * Determine breakthrough result based on roll
   * 根據隨機數決定突破結果
   */
  determineResult(roll, successRate) {
    if (roll <= successRate) {
      return BREAKTHROUGH_RESULT.SUCCESS;
    } else if (roll <= successRate + 0.2) {
      return BREAKTHROUGH_RESULT.PARTIAL;
    } else if (roll <= 0.95) {
      return BREAKTHROUGH_RESULT.FAILURE;
    } else {
      return BREAKTHROUGH_RESULT.CRITICAL_FAILURE;
    }
  }

  /**
   * Apply breakthrough result to character
   * 將突破結果應用到角色
   */
  applyBreakthroughResult(character, result, nextRealm, options) {
    const response = {
      result: result,
      realm: character.cultivation.realm,
      stage: character.cultivation.stage
    };

    switch (result) {
      case BREAKTHROUGH_RESULT.SUCCESS:
        // Successful breakthrough
        character.cultivation.realm = nextRealm;
        character.cultivation.stage = REALM_STAGES.EARLY;
        character.cultivation.spiritualPower = 0; // Reset for new realm
        
        // TODO: Trigger tribulation for certain realms
        if (this.requiresTribulation(nextRealm)) {
          response.tribulation = true;
        }
        
        response.message = `成功突破至${nextRealm}！(Successfully broke through to ${nextRealm}!)`;
        break;

      case BREAKTHROUGH_RESULT.PARTIAL:
        // Partial success - advance stage but not realm
        const stages = Object.values(REALM_STAGES);
        const currentStageIndex = stages.indexOf(character.cultivation.stage);
        if (currentStageIndex < stages.length - 1) {
          character.cultivation.stage = stages[currentStageIndex + 1];
        }
        
        response.message = '突破未完全成功，但境界有所提升 (Partial breakthrough, stage advanced)';
        break;

      case BREAKTHROUGH_RESULT.FAILURE:
        // Failed breakthrough - lose some spiritual power
        character.cultivation.spiritualPower *= 0.7;
        response.message = '突破失敗，損失部分修為 (Breakthrough failed, lost some cultivation)';
        break;

      case BREAKTHROUGH_RESULT.CRITICAL_FAILURE:
        // Critical failure - injury and setback
        character.cultivation.spiritualPower *= 0.5;
        character.health *= 0.6;
        response.message = '突破失敗，走火入魔！(Critical failure, Qi deviation!)';
        response.injury = true;
        break;
    }

    return response;
  }

  /**
   * Check if realm requires tribulation
   * 檢查境界是否需要渡劫
   */
  requiresTribulation(realm) {
    const majorRealms = [
      REALMS.NASCENT_SOUL,
      REALMS.SOUL_TRANSFORMATION,
      REALMS.BODY_INTEGRATION,
      REALMS.TRIBULATION_CROSSING,
      REALMS.MAHAYANA
    ];
    
    return majorRealms.includes(realm);
  }

  /**
   * Get breakthrough preparation recommendations
   * 獲取突破準備建議
   */
  getBreakthroughRecommendations(character) {
    return {
      recommendedElixirs: this.getRecommendedElixirs(character),
      optimalLocation: 'spiritual_vein_area',
      preparationTime: this.getPreparationTime(character),
      riskLevel: this.assessRiskLevel(character)
    };
  }

  /**
   * Get recommended elixirs for breakthrough
   * 獲取推薦的突破丹藥
   */
  getRecommendedElixirs(character) {
    // TODO: Implement elixir recommendation system
    return [];
  }

  /**
   * Calculate preparation time needed
   * 計算所需準備時間
   */
  getPreparationTime(character) {
    // TODO: Calculate based on character stats
    return 7; // days
  }

  /**
   * Assess breakthrough risk level
   * 評估突破風險等級
   */
  assessRiskLevel(character) {
    const successRate = this.calculateSuccessRate(character, {});
    
    if (successRate >= 0.8) return 'low';
    if (successRate >= 0.6) return 'medium';
    if (successRate >= 0.4) return 'high';
    return 'extreme';
  }
}

export default BreakthroughSystem;
