/**
 * Skill Mastery System - 技能精通度
 * Manages skill proficiency and mastery
 * 管理技能熟練度和精通度
 */

export const MASTERY_LEVELS = {
  NOVICE: { level: 1, name: '初學', exp: 0 },
  APPRENTICE: { level: 2, name: '學徒', exp: 100 },
  COMPETENT: { level: 3, name: '熟練', exp: 500 },
  EXPERT: { level: 4, name: '專家', exp: 2000 },
  MASTER: { level: 5, name: '大師', exp: 5000 },
  GRANDMASTER: { level: 6, name: '宗師', exp: 10000 }
};

export class SkillMasterySystem {
  constructor() {
    this.masteries = new Map();
  }

  initializeSkillMastery(characterId, skillId) {
    const key = `${characterId}_${skillId}`;
    
    this.masteries.set(key, {
      skillId: skillId,
      level: MASTERY_LEVELS.NOVICE.level,
      exp: 0,
      proficiency: 0
    });

    return this.masteries.get(key);
  }

  addMasteryExp(characterId, skillId, exp) {
    const key = `${characterId}_${skillId}`;
    let mastery = this.masteries.get(key);

    if (!mastery) {
      mastery = this.initializeSkillMastery(characterId, skillId);
    }

    mastery.exp += exp;

    // Check for level up
    const newLevel = this.calculateMasteryLevel(mastery.exp);
    if (newLevel > mastery.level) {
      mastery.level = newLevel;
      return {
        levelUp: true,
        level: mastery.level,
        message: '技能精通度提升！(Skill mastery increased!)'
      };
    }

    return {
      levelUp: false,
      exp: mastery.exp
    };
  }

  calculateMasteryLevel(exp) {
    const levels = Object.values(MASTERY_LEVELS);
    
    for (let i = levels.length - 1; i >= 0; i--) {
      if (exp >= levels[i].exp) {
        return levels[i].level;
      }
    }

    return 1;
  }

  getMastery(characterId, skillId) {
    const key = `${characterId}_${skillId}`;
    return this.masteries.get(key) || null;
  }
}

export default SkillMasterySystem;
