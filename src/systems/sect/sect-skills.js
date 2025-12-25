/**
 * Sect Skills System - 宗門功法
 * Manages sect-specific techniques and skills
 * 管理宗門專屬功法和技能
 */

export const SKILL_TIERS = {
  BASIC: { tier: 1, name: '基礎功法' },
  INTERMEDIATE: { tier: 2, name: '中級功法' },
  ADVANCED: { tier: 3, name: '高級功法' },
  CORE: { tier: 4, name: '核心功法' },
  SECRET: { tier: 5, name: '不傳之秘' }
};

export class SectSkillsSystem {
  constructor() {
    this.skills = new Map();
  }

  createSectSkill(config) {
    const skill = {
      id: config.id || this.generateId(),
      name: config.name,
      tier: config.tier || SKILL_TIERS.BASIC,
      sectId: config.sectId,
      requirements: config.requirements || {},
      contributionCost: config.contributionCost || 0,
      effects: config.effects || {},
      description: config.description || ''
    };

    this.skills.set(skill.id, skill);
    return skill;
  }

  generateId() {
    return `sect_skill_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  learnSectSkill(character, skillId, contribution) {
    const skill = this.skills.get(skillId);
    
    if (!skill) {
      return {
        success: false,
        message: '功法不存在 (Skill does not exist)'
      };
    }

    if (contribution < skill.contributionCost) {
      return {
        success: false,
        message: '貢獻度不足 (Insufficient contribution)'
      };
    }

    // Check requirements
    // TODO: Check position, realm, etc.

    if (!character.sectSkills) {
      character.sectSkills = [];
    }

    character.sectSkills.push(skillId);

    return {
      success: true,
      skill: skill,
      message: `學會${skill.name}！(Learned ${skill.name}!)`
    };
  }

  getSectSkills(sectId, tier = null) {
    const skills = Array.from(this.skills.values())
      .filter(s => s.sectId === sectId);

    if (tier) {
      return skills.filter(s => s.tier.tier === tier.tier);
    }

    return skills;
  }
}

export default SectSkillsSystem;
