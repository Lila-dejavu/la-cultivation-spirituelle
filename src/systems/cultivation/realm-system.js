/**
 * Realm System - 境界系統
 * Manages cultivation realms and progression through them
 * 管理修煉境界和境界進階
 */

/**
 * Cultivation realms in ascending order
 * 修煉境界（由低到高）
 */
export const REALMS = {
  QI_CONDENSATION: 'qi_condensation',     // 凝氣期
  FOUNDATION_ESTABLISHMENT: 'foundation', // 築基期
  GOLDEN_CORE: 'golden_core',             // 金丹期
  NASCENT_SOUL: 'nascent_soul',           // 元嬰期
  SOUL_TRANSFORMATION: 'soul_transform',  // 化神期
  BODY_INTEGRATION: 'body_integration',   // 合體期
  TRIBULATION_CROSSING: 'tribulation',    // 渡劫期
  MAHAYANA: 'mahayana'                    // 大乘期
};

/**
 * Realm stages within each major realm
 * 每個大境界內的小階段
 */
export const REALM_STAGES = {
  EARLY: 'early',     // 初期
  MIDDLE: 'middle',   // 中期
  LATE: 'late',       // 後期
  PEAK: 'peak'        // 圓滿
};

/**
 * RealmSystem class
 * Manages character realm progression
 */
export class RealmSystem {
  constructor() {
    this.realmOrder = Object.values(REALMS);
    this.stageOrder = Object.values(REALM_STAGES);
  }

  /**
   * Get realm configuration
   * 獲取境界配置
   * @param {string} realm - Realm identifier
   * @returns {Object} Realm configuration
   */
  getRealmConfig(realm) {
    // TODO: Load from realm-config.json
    return {
      name: realm,
      minLevel: this.getRealmMinLevel(realm),
      maxLevel: this.getRealmMaxLevel(realm),
      breakthroughRequirements: this.getBreakthroughRequirements(realm)
    };
  }

  /**
   * Calculate minimum level for realm
   * 計算境界的最低等級
   */
  getRealmMinLevel(realm) {
    const index = this.realmOrder.indexOf(realm);
    return index * 40 + 1;
  }

  /**
   * Calculate maximum level for realm
   * 計算境界的最高等級
   */
  getRealmMaxLevel(realm) {
    const index = this.realmOrder.indexOf(realm);
    return (index + 1) * 40;
  }

  /**
   * Get breakthrough requirements
   * 獲取突破條件
   */
  getBreakthroughRequirements(realm) {
    // TODO: Load detailed requirements from config
    return {
      spiritualPower: 1000,
      comprehension: 500,
      resources: []
    };
  }

  /**
   * Check if character can breakthrough
   * 檢查角色是否可以突破
   * @param {Object} character - Character object
   * @returns {boolean} Can breakthrough
   */
  canBreakthrough(character) {
    const currentRealm = character.cultivation.realm;
    const currentStage = character.cultivation.stage;
    
    // Must be at peak stage
    if (currentStage !== REALM_STAGES.PEAK) {
      return false;
    }

    const requirements = this.getBreakthroughRequirements(currentRealm);
    
    // Check spiritual power
    if (character.cultivation.spiritualPower < requirements.spiritualPower) {
      return false;
    }

    // Check comprehension
    if (character.cultivation.comprehension < requirements.comprehension) {
      return false;
    }

    // TODO: Check resources and other requirements
    
    return true;
  }

  /**
   * Get next realm
   * 獲取下一個境界
   */
  getNextRealm(currentRealm) {
    const index = this.realmOrder.indexOf(currentRealm);
    if (index === -1 || index >= this.realmOrder.length - 1) {
      return null;
    }
    return this.realmOrder[index + 1];
  }

  /**
   * Get attribute bonuses for realm
   * 獲取境界的屬性加成
   */
  getRealmBonuses(realm, stage) {
    const realmIndex = this.realmOrder.indexOf(realm);
    const stageIndex = this.stageOrder.indexOf(stage);
    
    const baseMult = (realmIndex + 1) * 10;
    const stageMult = (stageIndex + 1) * 0.25;
    
    return {
      health: baseMult * stageMult * 100,
      spiritualPower: baseMult * stageMult * 50,
      attack: baseMult * stageMult * 10,
      defense: baseMult * stageMult * 8,
      speed: baseMult * stageMult * 5
    };
  }
}

export default RealmSystem;
