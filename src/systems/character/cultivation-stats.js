/**
 * Cultivation Stats - 修煉屬性
 * Manages cultivation-specific character attributes
 * 管理修煉專屬的角色屬性
 */

export class CultivationStatsSystem {
  constructor() {}

  initializeCultivationStats(character) {
    character.cultivation = {
      realm: 'qi_condensation',
      stage: 'early',
      spiritualPower: 0,
      maxSpiritualPower: 1000,
      comprehension: 0,
      daoProgress: 0,
      breakthroughProgress: 0,
      tribulationsPassed: 0,
      cultivationSpeed: 1.0
    };

    return character.cultivation;
  }

  updateSpiritualPower(character, amount) {
    if (!character.cultivation) {
      this.initializeCultivationStats(character);
    }

    character.cultivation.spiritualPower += amount;
    character.cultivation.spiritualPower = Math.max(0, 
      Math.min(character.cultivation.spiritualPower, character.cultivation.maxSpiritualPower)
    );

    return character.cultivation.spiritualPower;
  }

  getCultivationStats(character) {
    if (!character.cultivation) {
      return null;
    }

    return {
      realm: character.cultivation.realm,
      stage: character.cultivation.stage,
      spiritualPower: character.cultivation.spiritualPower,
      maxSpiritualPower: character.cultivation.maxSpiritualPower,
      comprehension: character.cultivation.comprehension,
      cultivationSpeed: character.cultivation.cultivationSpeed
    };
  }

  calculateCultivationPower(character) {
    const cultivation = character.cultivation;
    if (!cultivation) return 0;

    const realmMultiplier = this.getRealmMultiplier(cultivation.realm);
    const stageMultiplier = this.getStageMultiplier(cultivation.stage);

    return Math.floor(
      cultivation.spiritualPower * realmMultiplier * stageMultiplier
    );
  }

  getRealmMultiplier(realm) {
    const multipliers = {
      'qi_condensation': 1.0,
      'foundation': 2.0,
      'golden_core': 4.0,
      'nascent_soul': 8.0,
      'soul_transform': 16.0,
      'body_integration': 32.0,
      'tribulation': 64.0,
      'mahayana': 128.0
    };

    return multipliers[realm] || 1.0;
  }

  getStageMultiplier(stage) {
    const multipliers = {
      'early': 1.0,
      'middle': 1.25,
      'late': 1.5,
      'peak': 1.75
    };

    return multipliers[stage] || 1.0;
  }
}

export default CultivationStatsSystem;
