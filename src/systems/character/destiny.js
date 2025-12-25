/**
 * Destiny System - 命格系統
 * Manages character destiny and fate
 * 管理角色命運和命格
 */

export const DESTINY_TYPES = {
  PROTAGONIST: 'protagonist',
  GENIUS: 'genius',
  CURSED: 'cursed',
  BLESSED: 'blessed',
  REINCARNATOR: 'reincarnator',
  TRANSMIGRATOR: 'transmigrator',
  CHOSEN_ONE: 'chosen_one',
  ORDINARY: 'ordinary'
};

export class DestinySystem {
  constructor() {}

  assignDestiny(character, destinyType = null) {
    if (!destinyType) {
      destinyType = this.rollDestiny();
    }

    character.destiny = {
      type: destinyType,
      value: this.getInitialDestinyValue(destinyType),
      karma: 0,
      fatePoints: 0,
      majorEvents: []
    };

    return character.destiny;
  }

  rollDestiny() {
    const roll = Math.random();
    
    if (roll < 0.001) return DESTINY_TYPES.CHOSEN_ONE;
    if (roll < 0.01) return DESTINY_TYPES.PROTAGONIST;
    if (roll < 0.05) return DESTINY_TYPES.GENIUS;
    if (roll < 0.10) return DESTINY_TYPES.BLESSED;
    if (roll < 0.15) return DESTINY_TYPES.REINCARNATOR;
    if (roll < 0.20) return DESTINY_TYPES.TRANSMIGRATOR;
    if (roll < 0.25) return DESTINY_TYPES.CURSED;
    
    return DESTINY_TYPES.ORDINARY;
  }

  getInitialDestinyValue(destinyType) {
    const values = {
      [DESTINY_TYPES.CHOSEN_ONE]: 100,
      [DESTINY_TYPES.PROTAGONIST]: 80,
      [DESTINY_TYPES.GENIUS]: 60,
      [DESTINY_TYPES.BLESSED]: 50,
      [DESTINY_TYPES.REINCARNATOR]: 70,
      [DESTINY_TYPES.TRANSMIGRATOR]: 65,
      [DESTINY_TYPES.CURSED]: 30,
      [DESTINY_TYPES.ORDINARY]: 40
    };

    return values[destinyType] || 40;
  }

  addFatePoints(character, amount) {
    if (!character.destiny) {
      this.assignDestiny(character);
    }

    character.destiny.fatePoints += amount;

    return character.destiny.fatePoints;
  }

  recordMajorEvent(character, event) {
    if (!character.destiny) {
      this.assignDestiny(character);
    }

    character.destiny.majorEvents.push({
      event: event,
      timestamp: Date.now()
    });
  }

  getDestinyModifier(character) {
    if (!character.destiny) return 1.0;

    const baseModifier = character.destiny.value / 100;
    const karmaModifier = character.destiny.karma / 1000;

    return baseModifier + karmaModifier;
  }
}

export default DestinySystem;
