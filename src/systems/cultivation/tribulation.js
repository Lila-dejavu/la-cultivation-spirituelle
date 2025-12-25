/**
 * Tribulation System - 天劫系統
 * Manages heavenly tribulations during cultivation
 * 管理修煉過程中的天劫
 */

/**
 * Tribulation types
 * 天劫類型
 */
export const TRIBULATION_TYPES = {
  THUNDER: 'thunder',           // 雷劫
  HEART_DEMON: 'heart_demon',   // 心魔劫
  ELEMENTAL: 'elemental',       // 元素劫
  HEAVENLY_FIRE: 'heavenly_fire', // 天火劫
  WIND_BLADE: 'wind_blade',     // 風刃劫
  NINE_HEAVEN: 'nine_heaven'    // 九天神雷
};

/**
 * Tribulation stages
 * 天劫階段
 */
export const TRIBULATION_STAGES = {
  WARNING: 'warning',       // 警告期
  GATHERING: 'gathering',   // 聚集期
  STRIKING: 'striking',     // 劫雷期
  FINAL: 'final'           // 最終劫
};

/**
 * TribulationSystem class
 * Manages heavenly tribulation events
 */
export class TribulationSystem {
  constructor() {
    this.activeTribulations = new Map();
  }

  /**
   * Check if tribulation is needed for realm breakthrough
   * 檢查境界突破是否需要渡劫
   * @param {string} targetRealm - Realm being broken through to
   * @returns {boolean} Whether tribulation is needed
   */
  requiresTribulation(targetRealm) {
    const tribulationRealms = [
      'nascent_soul',      // 元嬰期
      'soul_transform',    // 化神期
      'body_integration',  // 合體期
      'tribulation',       // 渡劫期
      'mahayana'          // 大乘期
    ];

    return tribulationRealms.includes(targetRealm);
  }

  /**
   * Get tribulation difficulty based on realm
   * 根據境界獲取天劫難度
   */
  getTribulationDifficulty(realm) {
    const difficulties = {
      'nascent_soul': 3,      // 3 waves
      'soul_transform': 6,    // 6 waves
      'body_integration': 9,  // 9 waves
      'tribulation': 12,      // 12 waves
      'mahayana': 18         // 18 waves (九九天劫)
    };

    return difficulties[realm] || 3;
  }

  /**
   * Initiate tribulation
   * 開始天劫
   * @param {Object} character - Character facing tribulation
   * @param {string} realm - Target realm
   * @returns {Object} Tribulation instance
   */
  initiateTribulation(character, realm) {
    const tribulation = {
      id: `trib_${Date.now()}`,
      character: character,
      realm: realm,
      type: this.selectTribulationType(realm),
      stage: TRIBULATION_STAGES.WARNING,
      waves: this.getTribulationDifficulty(realm),
      currentWave: 0,
      damage: 0,
      startTime: Date.now(),
      status: 'active'
    };

    this.activeTribulations.set(tribulation.id, tribulation);

    return {
      tribulation: tribulation,
      message: `天劫降臨！準備迎接${tribulation.waves}道劫雷！(Tribulation descends! Prepare for ${tribulation.waves} waves!)`
    };
  }

  /**
   * Select tribulation type based on realm
   * 根據境界選擇天劫類型
   */
  selectTribulationType(realm) {
    const typesByRealm = {
      'nascent_soul': TRIBULATION_TYPES.THUNDER,
      'soul_transform': TRIBULATION_TYPES.HEART_DEMON,
      'body_integration': TRIBULATION_TYPES.ELEMENTAL,
      'tribulation': TRIBULATION_TYPES.HEAVENLY_FIRE,
      'mahayana': TRIBULATION_TYPES.NINE_HEAVEN
    };

    return typesByRealm[realm] || TRIBULATION_TYPES.THUNDER;
  }

  /**
   * Progress tribulation to next wave
   * 推進天劫到下一波
   * @param {string} tribulationId - Tribulation ID
   * @param {Object} defenseAction - Player's defense action
   * @returns {Object} Wave result
   */
  progressTribulation(tribulationId, defenseAction = {}) {
    const tribulation = this.activeTribulations.get(tribulationId);
    
    if (!tribulation || tribulation.status !== 'active') {
      return { error: 'Invalid tribulation' };
    }

    tribulation.currentWave++;
    
    // Calculate wave power
    const wavePower = this.calculateWavePower(tribulation);
    
    // Calculate defense
    const defense = this.calculateDefense(tribulation.character, defenseAction);
    
    // Calculate damage
    const damage = Math.max(0, wavePower - defense);
    tribulation.damage += damage;
    
    // Apply damage to character
    tribulation.character.health -= damage;

    // Check if character survived
    if (tribulation.character.health <= 0) {
      tribulation.status = 'failed';
      return this.failTribulation(tribulation);
    }

    // Check if tribulation is complete
    if (tribulation.currentWave >= tribulation.waves) {
      tribulation.status = 'completed';
      return this.completeTribulation(tribulation);
    }

    // Continue to next wave
    return {
      tribulation: tribulation,
      wave: tribulation.currentWave,
      damage: damage,
      remaining: tribulation.waves - tribulation.currentWave,
      message: `承受第${tribulation.currentWave}道劫雷！(Withstood wave ${tribulation.currentWave}!)`,
      status: 'continuing'
    };
  }

  /**
   * Calculate wave power
   * 計算劫雷威力
   */
  calculateWavePower(tribulation) {
    const basePower = 1000;
    const waveMultiplier = 1 + (tribulation.currentWave * 0.2);
    const realmMultiplier = this.getRealmMultiplier(tribulation.realm);
    
    return Math.floor(basePower * waveMultiplier * realmMultiplier);
  }

  /**
   * Get realm power multiplier
   * 獲取境界威力倍數
   */
  getRealmMultiplier(realm) {
    const multipliers = {
      'nascent_soul': 1.0,
      'soul_transform': 2.0,
      'body_integration': 3.5,
      'tribulation': 5.0,
      'mahayana': 8.0
    };

    return multipliers[realm] || 1.0;
  }

  /**
   * Calculate character's defense against tribulation
   * 計算角色對天劫的防禦
   */
  calculateDefense(character, defenseAction) {
    let defense = 0;

    // Base defense from cultivation
    defense += character.cultivation?.spiritualPower || 0;
    
    // Defense from equipment
    if (defenseAction.artifact) {
      defense += defenseAction.artifact.tribulationResist || 0;
    }

    // Defense from formation
    if (defenseAction.formation) {
      defense += defenseAction.formation.protection || 0;
    }

    // Defense from elixirs
    if (defenseAction.elixir) {
      defense += defenseAction.elixir.tribulationBonus || 0;
    }

    // Dao comprehension bonus
    if (character.daoComprehension) {
      const thunderDao = character.daoComprehension.paths?.thunder;
      if (thunderDao) {
        defense += thunderDao.level * 100;
      }
    }

    return defense;
  }

  /**
   * Complete tribulation successfully
   * 成功渡劫
   */
  completeTribulation(tribulation) {
    // Grant rewards
    const rewards = this.calculateTribulationRewards(tribulation);
    
    // Apply realm breakthrough
    tribulation.character.cultivation.realm = tribulation.realm;
    tribulation.character.cultivation.stage = 'early';

    // Grant tribulation tempering bonuses
    const tempering = this.calculateTemperingBonuses(tribulation);
    this.applyTemperingBonuses(tribulation.character, tempering);

    this.activeTribulations.delete(tribulation.id);

    return {
      success: true,
      tribulation: tribulation,
      rewards: rewards,
      tempering: tempering,
      message: `成功渡劫！突破至${tribulation.realm}！(Successfully transcended tribulation! Broke through to ${tribulation.realm}!)`
    };
  }

  /**
   * Fail tribulation
   * 渡劫失敗
   */
  failTribulation(tribulation) {
    // Apply failure penalties
    tribulation.character.cultivation.spiritualPower *= 0.3;
    tribulation.character.cultivation.stage = 'early'; // Regress stage
    
    this.activeTribulations.delete(tribulation.id);

    return {
      success: false,
      tribulation: tribulation,
      message: '渡劫失敗，身受重傷！(Tribulation failed, severely injured!)',
      penalty: 'Lost 70% spiritual power and regressed cultivation stage'
    };
  }

  /**
   * Calculate tribulation rewards
   * 計算渡劫獎勵
   */
  calculateTribulationRewards(tribulation) {
    return {
      experience: tribulation.waves * 10000,
      spiritualPower: tribulation.waves * 1000,
      comprehension: tribulation.waves * 500,
      title: this.getTribulationTitle(tribulation.realm)
    };
  }

  /**
   * Get title for successful tribulation
   * 獲取渡劫成功的稱號
   */
  getTribulationTitle(realm) {
    const titles = {
      'nascent_soul': '渡劫者',
      'soul_transform': '天選者',
      'body_integration': '超凡入聖',
      'tribulation': '劫後重生',
      'mahayana': '天劫主宰'
    };

    return titles[realm] || '渡劫者';
  }

  /**
   * Calculate tempering bonuses from tribulation
   * 計算天劫淬煉加成
   */
  calculateTemperingBonuses(tribulation) {
    const damagePercent = tribulation.damage / tribulation.character.maxHealth;
    const survivalBonus = Math.min(damagePercent * 100, 50); // Max 50% bonus

    return {
      bodyTempering: Math.floor(survivalBonus * 10),
      willpower: Math.floor(survivalBonus * 5),
      tribulationResist: Math.floor(survivalBonus * 2),
      description: '劫雷淬體，體質大幅提升 (Tribulation tempering, body greatly strengthened)'
    };
  }

  /**
   * Apply tempering bonuses to character
   * 將淬煉加成應用到角色
   */
  applyTemperingBonuses(character, tempering) {
    if (!character.tempering) {
      character.tempering = {};
    }

    character.tempering.bodyTempering = (character.tempering.bodyTempering || 0) + tempering.bodyTempering;
    character.tempering.willpower = (character.tempering.willpower || 0) + tempering.willpower;
    character.tempering.tribulationResist = (character.tempering.tribulationResist || 0) + tempering.tribulationResist;
  }

  /**
   * Get preparation recommendations for tribulation
   * 獲取渡劫準備建議
   */
  getTribulationPreparation(realm) {
    return {
      recommendedItems: [
        'thunder_resist_armor',
        'tribulation_crossing_pill',
        'heavenly_protection_talisman'
      ],
      recommendedFormation: 'five_elements_defense',
      optimalLocation: 'spiritual_vein_peak',
      preparationTime: 30, // days
      warningMessage: '天劫凶險萬分，務必做好充足準備！(Tribulation is extremely dangerous, prepare thoroughly!)'
    };
  }
}

export default TribulationSystem;
