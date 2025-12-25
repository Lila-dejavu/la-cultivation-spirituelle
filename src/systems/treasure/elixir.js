/**
 * Elixir System - 丹藥系統
 * Manages pills and elixirs for cultivation
 * 管理修煉用的丹藥
 */

/**
 * Elixir types
 * 丹藥類型
 */
export const ELIXIR_TYPES = {
  HEALING: 'healing',                 // 治療丹
  SPIRITUAL_POWER: 'spiritual_power', // 靈力丹
  BREAKTHROUGH: 'breakthrough',       // 突破丹
  POISON: 'poison',                   // 毒丹
  ANTIDOTE: 'antidote',              // 解毒丹
  ATTRIBUTE: 'attribute',            // 屬性丹
  COMPREHENSION: 'comprehension',    // 悟道丹
  LONGEVITY: 'longevity'             // 延壽丹
};

/**
 * Elixir grades
 * 丹藥品階
 */
export const ELIXIR_GRADES = {
  LOW: { grade: 1, name: '下品', efficacy: 1.0 },
  MIDDLE: { grade: 2, name: '中品', efficacy: 2.0 },
  HIGH: { grade: 3, name: '上品', efficacy: 3.5 },
  SUPREME: { grade: 4, name: '極品', efficacy: 6.0 },
  DIVINE: { grade: 5, name: '神品', efficacy: 10.0 },
  IMMORTAL: { grade: 6, name: '仙品', efficacy: 20.0 }
};

/**
 * ElixirSystem class
 * Manages elixir usage and effects
 */
export class ElixirSystem {
  constructor() {
    this.elixirDatabase = new Map();
    this.activeEffects = new Map(); // Track active elixir effects
  }

  /**
   * Create elixir
   * 創建丹藥
   */
  createElixir(config) {
    const elixir = {
      id: config.id || this.generateId(),
      name: config.name,
      type: config.type,
      grade: config.grade || ELIXIR_GRADES.LOW,
      effects: config.effects || {},
      duration: config.duration || 0, // 0 for instant effects
      cooldown: config.cooldown || 0,
      toxicity: config.toxicity || 0,
      description: config.description || '',
      requirements: config.requirements || {}
    };

    this.elixirDatabase.set(elixir.id, elixir);
    return elixir;
  }

  /**
   * Generate unique elixir ID
   * 生成唯一丹藥ID
   */
  generateId() {
    return `elixir_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * Use elixir
   * 使用丹藥
   */
  useElixir(character, elixir) {
    // Check requirements
    if (!this.canUseElixir(character, elixir)) {
      return {
        success: false,
        message: '無法使用此丹藥 (Cannot use this elixir)'
      };
    }

    // Check toxicity
    const toxicityCheck = this.checkToxicity(character, elixir);
    if (!toxicityCheck.success) {
      return toxicityCheck;
    }

    // Apply effects
    const result = this.applyElixirEffects(character, elixir);

    // Add toxicity
    this.addToxicity(character, elixir.toxicity);

    // Set cooldown
    if (elixir.cooldown > 0) {
      this.setCooldown(character, elixir);
    }

    return {
      success: true,
      message: `使用${elixir.name}成功！(Successfully used ${elixir.name}!)`,
      effects: result
    };
  }

  /**
   * Check if character can use elixir
   * 檢查角色是否能使用丹藥
   */
  canUseElixir(character, elixir) {
    // Check level requirement
    if (elixir.requirements.level && character.level < elixir.requirements.level) {
      return false;
    }

    // Check realm requirement
    if (elixir.requirements.realm) {
      // TODO: Check realm requirement
    }

    // Check cooldown
    if (this.isOnCooldown(character, elixir)) {
      return false;
    }

    return true;
  }

  /**
   * Check toxicity before using elixir
   * 檢查使用丹藥前的丹毒
   */
  checkToxicity(character, elixir) {
    if (!character.toxicity) {
      character.toxicity = 0;
    }

    const maxToxicity = this.getMaxToxicity(character);
    const newToxicity = character.toxicity + elixir.toxicity;

    if (newToxicity > maxToxicity) {
      return {
        success: false,
        message: '丹毒過重，無法繼續服用丹藥！(Toxicity too high, cannot use more elixirs!)'
      };
    }

    // Warning at 80% toxicity
    if (newToxicity > maxToxicity * 0.8) {
      return {
        success: true,
        warning: '丹毒接近極限，請小心！(Toxicity approaching limit, be careful!)'
      };
    }

    return { success: true };
  }

  /**
   * Get maximum toxicity character can handle
   * 獲取角色能承受的最大丹毒
   */
  getMaxToxicity(character) {
    const baseMax = 100;
    const realmBonus = character.level * 5; // Higher realm = more resistance
    const bodyTemperingBonus = (character.tempering?.bodyTempering || 0) * 2;
    
    return baseMax + realmBonus + bodyTemperingBonus;
  }

  /**
   * Add toxicity to character
   * 為角色添加丹毒
   */
  addToxicity(character, amount) {
    if (!character.toxicity) {
      character.toxicity = 0;
    }

    character.toxicity += amount;

    // Toxicity naturally dissipates over time
    // This should be called by a time management system
  }

  /**
   * Reduce toxicity (through meditation, detox pills, etc.)
   * 減少丹毒（通過冥想、解毒丹等）
   */
  reduceToxicity(character, amount) {
    if (!character.toxicity) return 0;

    const reduced = Math.min(character.toxicity, amount);
    character.toxicity -= reduced;

    return reduced;
  }

  /**
   * Apply elixir effects to character
   * 將丹藥效果應用到角色
   */
  applyElixirEffects(character, elixir) {
    const effects = {};
    const efficacy = elixir.grade.efficacy;

    switch (elixir.type) {
      case ELIXIR_TYPES.HEALING:
        const healing = (elixir.effects.healing || 0) * efficacy;
        character.health = Math.min(character.health + healing, character.maxHealth);
        effects.healing = healing;
        break;

      case ELIXIR_TYPES.SPIRITUAL_POWER:
        const spiritualPower = (elixir.effects.spiritualPower || 0) * efficacy;
        character.cultivation.spiritualPower += spiritualPower;
        effects.spiritualPower = spiritualPower;
        break;

      case ELIXIR_TYPES.BREAKTHROUGH:
        effects.breakthroughBonus = (elixir.effects.breakthroughBonus || 0) * efficacy;
        break;

      case ELIXIR_TYPES.COMPREHENSION:
        const comprehension = (elixir.effects.comprehension || 0) * efficacy;
        character.cultivation.comprehension += comprehension;
        effects.comprehension = comprehension;
        break;

      case ELIXIR_TYPES.ATTRIBUTE:
        // Temporary or permanent attribute boost
        for (const [attr, value] of Object.entries(elixir.effects.attributes || {})) {
          const boost = value * efficacy;
          
          if (elixir.duration > 0) {
            // Temporary effect
            this.addTemporaryEffect(character, elixir, attr, boost);
          } else {
            // Permanent effect
            character[attr] = (character[attr] || 0) + boost;
          }
          
          effects[attr] = boost;
        }
        break;

      case ELIXIR_TYPES.LONGEVITY:
        const lifespan = (elixir.effects.lifespan || 0) * efficacy;
        character.lifespan = (character.lifespan || 100) + lifespan;
        effects.lifespan = lifespan;
        break;

      default:
        // Generic effects
        for (const [key, value] of Object.entries(elixir.effects)) {
          effects[key] = value * efficacy;
        }
    }

    return effects;
  }

  /**
   * Add temporary effect from elixir
   * 添加丹藥的臨時效果
   */
  addTemporaryEffect(character, elixir, attribute, value) {
    const effectId = `${elixir.id}_${Date.now()}`;
    const effect = {
      id: effectId,
      elixir: elixir.id,
      attribute: attribute,
      value: value,
      startTime: Date.now(),
      duration: elixir.duration,
      endTime: Date.now() + elixir.duration
    };

    if (!character.temporaryEffects) {
      character.temporaryEffects = [];
    }

    character.temporaryEffects.push(effect);
    this.activeEffects.set(effectId, effect);

    // Apply effect
    character[attribute] = (character[attribute] || 0) + value;

    return effect;
  }

  /**
   * Remove expired temporary effects
   * 移除過期的臨時效果
   */
  updateTemporaryEffects(character) {
    if (!character.temporaryEffects) return;

    const now = Date.now();
    const expiredEffects = character.temporaryEffects.filter(
      effect => effect.endTime <= now
    );

    expiredEffects.forEach(effect => {
      // Remove effect from character
      character[effect.attribute] = (character[effect.attribute] || 0) - effect.value;
      this.activeEffects.delete(effect.id);
    });

    // Keep only active effects
    character.temporaryEffects = character.temporaryEffects.filter(
      effect => effect.endTime > now
    );
  }

  /**
   * Check if elixir is on cooldown
   * 檢查丹藥是否在冷卻中
   */
  isOnCooldown(character, elixir) {
    if (!character.elixirCooldowns) {
      character.elixirCooldowns = {};
    }

    const cooldown = character.elixirCooldowns[elixir.id];
    if (!cooldown) return false;

    return Date.now() < cooldown;
  }

  /**
   * Set elixir cooldown
   * 設置丹藥冷卻
   */
  setCooldown(character, elixir) {
    if (!character.elixirCooldowns) {
      character.elixirCooldowns = {};
    }

    character.elixirCooldowns[elixir.id] = Date.now() + elixir.cooldown;
  }

  /**
   * Get elixir description
   * 獲取丹藥描述
   */
  getElixirDescription(elixir) {
    return {
      name: elixir.name,
      type: elixir.type,
      grade: elixir.grade.name,
      effects: elixir.effects,
      duration: elixir.duration > 0 ? `${elixir.duration / 1000}秒` : '即時',
      toxicity: elixir.toxicity,
      description: elixir.description
    };
  }
}

export default ElixirSystem;
