/**
 * Pill Crafting System - 煉丹機制
 * Manages the creation of elixirs and pills
 * 管理丹藥的煉製
 */

/**
 * Crafting states
 * 煉丹狀態
 */
export const CRAFTING_STATES = {
  PREPARATION: 'preparation',       // 準備階段
  MATERIAL_PROCESSING: 'processing', // 材料處理
  FUSION: 'fusion',                 // 融合階段
  CONDENSATION: 'condensation',     // 凝丹階段
  COMPLETION: 'completion'          // 完成階段
};

/**
 * Crafting results
 * 煉丹結果
 */
export const CRAFTING_RESULTS = {
  PERFECT: 'perfect',           // 完美（神品）
  EXCELLENT: 'excellent',       // 極品
  SUCCESS: 'success',           // 成功
  MEDIOCRE: 'mediocre',         // 中等
  FAILURE: 'failure',           // 失敗
  EXPLOSION: 'explosion'        // 炸爐
};

/**
 * PillCraftingSystem class
 * Manages pill and elixir crafting
 */
export class PillCraftingSystem {
  constructor() {
    this.activeCraftingSessions = new Map();
  }

  /**
   * Start pill crafting
   * 開始煉丹
   */
  startCrafting(character, formula, furnace, materials) {
    // Validate inputs
    if (!this.canCraft(character, formula, furnace, materials)) {
      return {
        success: false,
        message: '無法開始煉丹 (Cannot start crafting)'
      };
    }

    // Create crafting session
    const session = {
      id: this.generateSessionId(),
      character: character,
      formula: formula,
      furnace: furnace,
      materials: materials,
      state: CRAFTING_STATES.PREPARATION,
      progress: 0,
      stability: 100,
      quality: 50,
      startTime: Date.now()
    };

    this.activeCraftingSessions.set(session.id, session);

    return {
      success: true,
      sessionId: session.id,
      message: `開始煉製${formula.name}！(Started crafting ${formula.name}!)`
    };
  }

  /**
   * Generate session ID
   * 生成會話ID
   */
  generateSessionId() {
    return `craft_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * Check if character can craft
   * 檢查角色是否能煉丹
   */
  canCraft(character, formula, furnace, materials) {
    // Check alchemy skill level
    if (formula.requirements.alchemyLevel) {
      const alchemyLevel = character.skills?.alchemy || 0;
      if (alchemyLevel < formula.requirements.alchemyLevel) {
        return false;
      }
    }

    // Check realm requirement
    if (formula.requirements.realm) {
      // TODO: Check character realm
    }

    // Check if has required materials
    if (!this.hasRequiredMaterials(materials, formula.materials)) {
      return false;
    }

    // Check if furnace is suitable
    if (furnace.grade < formula.requirements.furnaceGrade) {
      return false;
    }

    return true;
  }

  /**
   * Check if has required materials
   * 檢查是否有所需材料
   */
  hasRequiredMaterials(available, required) {
    for (const [materialId, quantity] of Object.entries(required)) {
      if (!available[materialId] || available[materialId] < quantity) {
        return false;
      }
    }
    return true;
  }

  /**
   * Progress crafting session
   * 推進煉丹進程
   */
  progressCrafting(sessionId, action = {}) {
    const session = this.activeCraftingSessions.get(sessionId);
    
    if (!session) {
      return {
        success: false,
        message: '煉丹會話不存在 (Crafting session does not exist)'
      };
    }

    // Apply action effects
    this.applyAction(session, action);

    // Advance state
    session.progress += 10;

    if (session.progress >= 25 && session.state === CRAFTING_STATES.PREPARATION) {
      session.state = CRAFTING_STATES.MATERIAL_PROCESSING;
    } else if (session.progress >= 50 && session.state === CRAFTING_STATES.MATERIAL_PROCESSING) {
      session.state = CRAFTING_STATES.FUSION;
    } else if (session.progress >= 75 && session.state === CRAFTING_STATES.FUSION) {
      session.state = CRAFTING_STATES.CONDENSATION;
    } else if (session.progress >= 100 && session.state === CRAFTING_STATES.CONDENSATION) {
      return this.completeCrafting(session);
    }

    // Random events
    if (Math.random() < 0.2) {
      const event = this.generateRandomEvent(session);
      return {
        success: true,
        session: session,
        event: event
      };
    }

    return {
      success: true,
      session: session
    };
  }

  /**
   * Apply action to session
   * 將動作應用到會話
   */
  applyAction(session, action) {
    switch (action.type) {
      case 'increase_fire':
        session.stability -= 5;
        session.quality += 3;
        break;
      
      case 'decrease_fire':
        session.stability += 3;
        session.quality -= 2;
        break;
      
      case 'add_auxiliary':
        session.quality += 5;
        session.stability -= 3;
        break;
      
      case 'stabilize':
        session.stability += 10;
        break;
      
      case 'focus':
        session.quality += 2;
        break;
      
      default:
        // Auto progress
        session.stability -= 1;
    }

    // Clamp values
    session.stability = Math.max(0, Math.min(100, session.stability));
    session.quality = Math.max(0, Math.min(100, session.quality));

    // Check for explosion
    if (session.stability <= 0) {
      return this.handleExplosion(session);
    }
  }

  /**
   * Generate random event during crafting
   * 生成煉丹過程中的隨機事件
   */
  generateRandomEvent(session) {
    const events = [
      {
        type: 'temperature_surge',
        message: '丹爐溫度突然上升！(Furnace temperature surged!)',
        effect: { stability: -10, quality: +5 }
      },
      {
        type: 'material_resonance',
        message: '材料產生共鳴！(Materials resonating!)',
        effect: { stability: +5, quality: +10 }
      },
      {
        type: 'spiritual_fluctuation',
        message: '靈氣波動！(Spiritual energy fluctuation!)',
        effect: { stability: -5, quality: -5 }
      },
      {
        type: 'dao_insight',
        message: '頓悟丹道！(Insight into alchemy Dao!)',
        effect: { stability: +10, quality: +15 }
      }
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    
    // Apply event effects
    session.stability += event.effect.stability || 0;
    session.quality += event.effect.quality || 0;

    return event;
  }

  /**
   * Handle furnace explosion
   * 處理炸爐
   */
  handleExplosion(session) {
    this.activeCraftingSessions.delete(session.id);

    return {
      success: false,
      result: CRAFTING_RESULTS.EXPLOSION,
      message: '丹爐炸裂！煉丹失敗！(Furnace exploded! Crafting failed!)',
      damage: Math.floor(session.character.maxHealth * 0.2)
    };
  }

  /**
   * Complete crafting session
   * 完成煉丹會話
   */
  completeCrafting(session) {
    const result = this.determineCraftingResult(session);
    const pills = this.generatePills(session, result);

    // Grant experience
    const exp = this.calculateExperience(session, result);
    if (session.character.skills) {
      session.character.skills.alchemy = (session.character.skills.alchemy || 0) + exp;
    }

    // Clean up session
    this.activeCraftingSessions.delete(session.id);

    return {
      success: true,
      result: result,
      pills: pills,
      experience: exp,
      message: this.getCraftingResultMessage(result, session.formula.name)
    };
  }

  /**
   * Determine crafting result based on quality and stability
   * 根據品質和穩定性決定煉丹結果
   */
  determineCraftingResult(session) {
    const { quality, stability } = session;
    const finalScore = (quality * 0.7) + (stability * 0.3);

    if (finalScore >= 90 && quality >= 85) {
      return CRAFTING_RESULTS.PERFECT;
    } else if (finalScore >= 80) {
      return CRAFTING_RESULTS.EXCELLENT;
    } else if (finalScore >= 60) {
      return CRAFTING_RESULTS.SUCCESS;
    } else if (finalScore >= 40) {
      return CRAFTING_RESULTS.MEDIOCRE;
    } else {
      return CRAFTING_RESULTS.FAILURE;
    }
  }

  /**
   * Generate pills based on result
   * 根據結果生成丹藥
   */
  generatePills(session, result) {
    const baseQuantity = session.formula.output.quantity || 1;
    const baseGrade = session.formula.output.grade;

    let quantity = baseQuantity;
    let grade = baseGrade;

    switch (result) {
      case CRAFTING_RESULTS.PERFECT:
        quantity = Math.floor(baseQuantity * 1.5);
        grade = this.upgradeGrade(baseGrade, 2);
        break;
      
      case CRAFTING_RESULTS.EXCELLENT:
        quantity = Math.floor(baseQuantity * 1.2);
        grade = this.upgradeGrade(baseGrade, 1);
        break;
      
      case CRAFTING_RESULTS.SUCCESS:
        // Standard output
        break;
      
      case CRAFTING_RESULTS.MEDIOCRE:
        quantity = Math.floor(baseQuantity * 0.7);
        grade = this.downgradeGrade(baseGrade, 1);
        break;
      
      case CRAFTING_RESULTS.FAILURE:
        quantity = 0;
        break;
    }

    return {
      name: session.formula.output.name,
      quantity: quantity,
      grade: grade,
      type: session.formula.output.type
    };
  }

  /**
   * Upgrade grade
   * 提升品階
   */
  upgradeGrade(grade, levels) {
    // TODO: Implement grade upgrade logic
    return grade;
  }

  /**
   * Downgrade grade
   * 降低品階
   */
  downgradeGrade(grade, levels) {
    // TODO: Implement grade downgrade logic
    return grade;
  }

  /**
   * Calculate alchemy experience gained
   * 計算煉丹經驗獲得
   */
  calculateExperience(session, result) {
    let baseExp = session.formula.experience || 100;

    const multipliers = {
      [CRAFTING_RESULTS.PERFECT]: 2.0,
      [CRAFTING_RESULTS.EXCELLENT]: 1.5,
      [CRAFTING_RESULTS.SUCCESS]: 1.0,
      [CRAFTING_RESULTS.MEDIOCRE]: 0.5,
      [CRAFTING_RESULTS.FAILURE]: 0.2,
      [CRAFTING_RESULTS.EXPLOSION]: 0.1
    };

    return Math.floor(baseExp * (multipliers[result] || 1.0));
  }

  /**
   * Get crafting result message
   * 獲取煉丹結果訊息
   */
  getCraftingResultMessage(result, pillName) {
    const messages = {
      [CRAFTING_RESULTS.PERFECT]: `完美！煉成神品${pillName}！(Perfect! Crafted divine ${pillName}!)`,
      [CRAFTING_RESULTS.EXCELLENT]: `極品！煉成上等${pillName}！(Excellent! Crafted superior ${pillName}!)`,
      [CRAFTING_RESULTS.SUCCESS]: `成功煉成${pillName}！(Successfully crafted ${pillName}!)`,
      [CRAFTING_RESULTS.MEDIOCRE]: `勉強煉成${pillName}，品質欠佳 (Barely crafted ${pillName}, poor quality)`,
      [CRAFTING_RESULTS.FAILURE]: `煉丹失敗，材料損毀 (Crafting failed, materials destroyed)`
    };

    return messages[result] || '煉丹完成 (Crafting completed)';
  }

  /**
   * Get crafting session info
   * 獲取煉丹會話資訊
   */
  getSessionInfo(sessionId) {
    const session = this.activeCraftingSessions.get(sessionId);
    
    if (!session) {
      return null;
    }

    return {
      formula: session.formula.name,
      state: session.state,
      progress: session.progress,
      stability: session.stability,
      quality: session.quality,
      elapsedTime: Date.now() - session.startTime
    };
  }
}

export default PillCraftingSystem;
