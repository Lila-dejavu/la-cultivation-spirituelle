/**
 * Chain Reaction System - 連鎖反應
 * Manages elemental chain reactions and combos
 * 管理元素連鎖反應和連招
 */

export const ELEMENT_REACTIONS = {
  AMPLIFY: 'amplify',         // 增幅
  OVERLOAD: 'overload',       // 超載
  FREEZE: 'freeze',           // 冰凍
  VAPORIZE: 'vaporize',       // 蒸發
  MELT: 'melt',               // 融化
  CRYSTALLIZE: 'crystallize'  // 結晶
};

export class ChainReactionSystem {
  constructor() {
    this.activeElements = new Map();
  }

  applyElement(targetId, element, duration = 5000) {
    const key = `${targetId}_${element}`;
    
    this.activeElements.set(key, {
      element: element,
      appliedAt: Date.now(),
      expiresAt: Date.now() + duration
    });
  }

  checkReaction(targetId, incomingElement) {
    const activeElements = this.getActiveElements(targetId);
    
    for (const activeElement of activeElements) {
      const reaction = this.getReactionType(activeElement.element, incomingElement);
      
      if (reaction) {
        // Clear reacted element
        this.clearElement(targetId, activeElement.element);
        
        return {
          reaction: reaction,
          damage: this.calculateReactionDamage(reaction),
          message: this.getReactionMessage(reaction)
        };
      }
    }

    // No reaction, apply new element
    this.applyElement(targetId, incomingElement);
    
    return null;
  }

  getReactionType(element1, element2) {
    const reactions = {
      'fire_water': ELEMENT_REACTIONS.VAPORIZE,
      'water_fire': ELEMENT_REACTIONS.VAPORIZE,
      'fire_ice': ELEMENT_REACTIONS.MELT,
      'ice_fire': ELEMENT_REACTIONS.MELT,
      'water_ice': ELEMENT_REACTIONS.FREEZE,
      'thunder_water': ELEMENT_REACTIONS.OVERLOAD,
      'fire_thunder': ELEMENT_REACTIONS.OVERLOAD
    };

    const key = `${element1}_${element2}`;
    return reactions[key] || null;
  }

  calculateReactionDamage(reaction) {
    const baseDamage = {
      [ELEMENT_REACTIONS.AMPLIFY]: 50,
      [ELEMENT_REACTIONS.OVERLOAD]: 200,
      [ELEMENT_REACTIONS.FREEZE]: 0,
      [ELEMENT_REACTIONS.VAPORIZE]: 150,
      [ELEMENT_REACTIONS.MELT]: 150,
      [ELEMENT_REACTIONS.CRYSTALLIZE]: 100
    };

    return baseDamage[reaction] || 0;
  }

  getReactionMessage(reaction) {
    const messages = {
      [ELEMENT_REACTIONS.AMPLIFY]: '元素增幅！(Element amplified!)',
      [ELEMENT_REACTIONS.OVERLOAD]: '超載爆炸！(Overload explosion!)',
      [ELEMENT_REACTIONS.FREEZE]: '冰凍！(Frozen!)',
      [ELEMENT_REACTIONS.VAPORIZE]: '蒸發！(Vaporized!)',
      [ELEMENT_REACTIONS.MELT]: '融化！(Melted!)',
      [ELEMENT_REACTIONS.CRYSTALLIZE]: '結晶！(Crystallized!)'
    };

    return messages[reaction] || '元素反應！(Elemental reaction!)';
  }

  getActiveElements(targetId) {
    const now = Date.now();
    const elements = [];

    this.activeElements.forEach((data, key) => {
      if (key.startsWith(`${targetId}_`) && data.expiresAt > now) {
        elements.push(data);
      }
    });

    return elements;
  }

  clearElement(targetId, element) {
    const key = `${targetId}_${element}`;
    this.activeElements.delete(key);
  }

  cleanupExpiredElements() {
    const now = Date.now();
    
    this.activeElements.forEach((data, key) => {
      if (data.expiresAt <= now) {
        this.activeElements.delete(key);
      }
    });
  }
}

export default ChainReactionSystem;
