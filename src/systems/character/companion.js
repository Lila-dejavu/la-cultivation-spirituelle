/**
 * Companion System - 隊友系統
 * Manages party members and companions
 * 管理隊伍成員和夥伴
 */

export const COMPANION_TYPES = {
  CULTIVATOR: 'cultivator',
  SPIRIT_BEAST: 'spirit_beast',
  ARTIFACT_SPIRIT: 'artifact_spirit',
  SUMMON: 'summon'
};

export class CompanionSystem {
  constructor() {
    this.companions = new Map();
  }

  addCompanion(character, companionData) {
    const companion = {
      id: companionData.id || this.generateId(),
      name: companionData.name,
      type: companionData.type || COMPANION_TYPES.CULTIVATOR,
      level: companionData.level || 1,
      loyalty: companionData.loyalty || 50,
      abilities: companionData.abilities || [],
      equipment: companionData.equipment || {},
      bond: 0
    };

    this.companions.set(companion.id, companion);

    if (!character.companions) {
      character.companions = [];
    }

    character.companions.push(companion.id);

    return {
      success: true,
      companion: companion,
      message: `${companion.name}加入隊伍！(${companion.name} joined the party!)`
    };
  }

  generateId() {
    return `companion_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  increaseBond(companionId, amount) {
    const companion = this.companions.get(companionId);
    if (!companion) return { success: false };

    companion.bond += amount;
    companion.bond = Math.min(companion.bond, 100);

    // Check for bond level up
    if (companion.bond >= 100) {
      return {
        success: true,
        bond: companion.bond,
        levelUp: true,
        message: `羈絆達到最高！(Bond maximized!)`
      };
    }

    return {
      success: true,
      bond: companion.bond
    };
  }

  getActiveCompanions(character) {
    if (!character.companions) return [];

    return character.companions.map(id => this.companions.get(id));
  }

  removeCompanion(character, companionId) {
    if (!character.companions) return { success: false };

    const index = character.companions.indexOf(companionId);
    if (index === -1) return { success: false };

    character.companions.splice(index, 1);

    return {
      success: true,
      message: '隊友離隊 (Companion left)'
    };
  }
}

export default CompanionSystem;
