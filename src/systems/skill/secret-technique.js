/**
 * Secret Technique System - 秘術系統
 * Manages secret techniques and forbidden arts
 * 管理秘術和禁術
 */

export class SecretTechniqueSystem {
  constructor() {
    this.techniques = new Map();
  }

  createSecretTechnique(config) {
    const technique = {
      id: config.id || this.generateId(),
      name: config.name,
      cost: config.cost || {},
      effects: config.effects || {},
      backlash: config.backlash || null,
      requirements: config.requirements || {}
    };

    this.techniques.set(technique.id, technique);
    return technique;
  }

  generateId() {
    return `secret_technique_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  useSecretTechnique(character, techniqueId) {
    const technique = this.techniques.get(techniqueId);
    if (!technique) return { success: false };

    // Apply backlash
    if (technique.backlash) {
      character.health -= technique.backlash.damage || 0;
    }

    return {
      success: true,
      technique: technique,
      message: `施展秘術：${technique.name}！(Used secret technique: ${technique.name}!)`
    };
  }
}

export default SecretTechniqueSystem;
