/**
 * Formation System - 陣法系統
 * Manages tactical formations and array techniques
 * 管理戰術陣型和陣法技巧
 */

export const FORMATION_TYPES = {
  OFFENSIVE: 'offensive',
  DEFENSIVE: 'defensive',
  SUPPORT: 'support',
  SEALING: 'sealing',
  ILLUSION: 'illusion'
};

export class FormationSystem {
  constructor() {
    this.formations = new Map();
  }

  createFormation(config) {
    const formation = {
      id: config.id || this.generateId(),
      name: config.name,
      type: config.type || FORMATION_TYPES.DEFENSIVE,
      rank: config.rank || 1,
      positions: config.positions || [],
      effects: config.effects || {},
      requirements: config.requirements || {}
    };

    this.formations.set(formation.id, formation);
    return formation;
  }

  generateId() {
    return `formation_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  activateFormation(characters, formationId) {
    const formation = this.formations.get(formationId);
    if (!formation) return { success: false };

    if (characters.length < formation.positions.length) {
      return {
        success: false,
        message: '人數不足 (Insufficient members)'
      };
    }

    // Apply formation effects to all members
    const bonuses = this.calculateFormationBonuses(formation);

    return {
      success: true,
      formation: formation,
      bonuses: bonuses,
      message: `布下${formation.name}！(Activated ${formation.name}!)`
    };
  }

  calculateFormationBonuses(formation) {
    const baseBonuses = { ...formation.effects };
    const rankMultiplier = 1 + (formation.rank * 0.2);

    const bonuses = {};
    for (const [key, value] of Object.entries(baseBonuses)) {
      bonuses[key] = Math.floor(value * rankMultiplier);
    }

    return bonuses;
  }
}

export default FormationSystem;
