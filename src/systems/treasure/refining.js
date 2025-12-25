/**
 * Refining System - 煉器系統
 * Manages equipment and artifact refinement
 * 管理裝備和法寶的精煉
 */

/**
 * Refinement results
 * 精煉結果
 */
export const REFINEMENT_RESULTS = {
  SUCCESS: 'success',             // 成功
  GREAT_SUCCESS: 'great_success', // 大成功
  FAILURE: 'failure',             // 失敗
  BREAK: 'break'                  // 損壞
};

/**
 * Refinement types
 * 精煉類型
 */
export const REFINEMENT_TYPES = {
  LEVEL: 'level',           // 等級提升
  QUALITY: 'quality',       // 品質提升
  ATTRIBUTE: 'attribute',   // 屬性強化
  SOCKET: 'socket',         // 開孔
  ENCHANT: 'enchant'        // 附魔
};

/**
 * RefiningSystem class
 * Manages equipment and artifact refinement
 */
export class RefiningSystem {
  constructor() {
    this.refiningForges = new Map();
  }

  /**
   * Refine equipment to increase level
   * 精煉裝備以提升等級
   */
  refineEquipment(character, equipment, materials = {}, forge = null) {
    // Check if equipment can be refined
    if (!this.canRefine(equipment)) {
      return {
        success: false,
        message: '無法精煉此裝備 (Cannot refine this equipment)'
      };
    }

    // Calculate success rate
    const successRate = this.calculateSuccessRate(equipment, forge, character);
    
    // Calculate material requirements
    const requiredMaterials = this.getRequiredMaterials(equipment, REFINEMENT_TYPES.LEVEL);
    
    // Check if character has required materials
    // TODO: Implement material checking
    
    // Perform refinement
    const result = this.performRefinement(equipment, successRate, forge);

    return result;
  }

  /**
   * Check if equipment can be refined
   * 檢查裝備是否可以精煉
   */
  canRefine(equipment) {
    if (!equipment.refinementLevel && equipment.refinementLevel !== 0) {
      return false;
    }

    if (equipment.refinementLevel >= equipment.maxRefinementLevel) {
      return false;
    }

    return true;
  }

  /**
   * Calculate refinement success rate
   * 計算精煉成功率
   */
  calculateSuccessRate(equipment, forge, character) {
    let baseRate = 1.0;

    // Success rate decreases with refinement level
    const levelPenalty = equipment.refinementLevel * 0.05;
    baseRate -= levelPenalty;

    // High refinement levels have reduced success rate
    if (equipment.refinementLevel >= 10) {
      baseRate *= 0.5;
    }
    if (equipment.refinementLevel >= 15) {
      baseRate *= 0.5;
    }

    // Forge quality bonus
    if (forge) {
      baseRate += forge.qualityBonus || 0;
    }

    // Character's refining skill bonus
    if (character.skills?.refining) {
      baseRate += character.skills.refining * 0.01;
    }

    // Equipment grade affects difficulty
    const gradeMultiplier = this.getGradeRefinementMultiplier(equipment.grade);
    baseRate *= gradeMultiplier;

    return Math.max(0.01, Math.min(baseRate, 0.99)); // Clamp between 1% and 99%
  }

  /**
   * Get grade refinement multiplier
   * 獲取品階精煉倍數
   */
  getGradeRefinementMultiplier(grade) {
    const multipliers = {
      1: 1.0,    // Mortal
      2: 0.9,    // Spiritual
      3: 0.8,    // Treasure
      4: 0.6,    // Heaven
      5: 0.4,    // Divine
      6: 0.2,    // Immortal
      7: 0.1     // Chaos
    };

    return multipliers[grade.grade] || 1.0;
  }

  /**
   * Get required materials for refinement
   * 獲取精煉所需材料
   */
  getRequiredMaterials(equipment, refinementType) {
    const baseMaterialCost = equipment.grade.grade * 10;
    const levelMultiplier = 1 + (equipment.refinementLevel * 0.5);
    
    return {
      ores: Math.floor(baseMaterialCost * levelMultiplier),
      essences: Math.floor(baseMaterialCost * 0.5 * levelMultiplier),
      spiritStones: Math.floor(baseMaterialCost * 100 * levelMultiplier)
    };
  }

  /**
   * Perform refinement
   * 執行精煉
   */
  performRefinement(equipment, successRate, forge) {
    const roll = Math.random();

    // Determine result
    let result;
    if (roll <= successRate * 0.1) {
      result = REFINEMENT_RESULTS.GREAT_SUCCESS;
    } else if (roll <= successRate) {
      result = REFINEMENT_RESULTS.SUCCESS;
    } else if (roll <= successRate + 0.3) {
      result = REFINEMENT_RESULTS.FAILURE;
    } else {
      result = REFINEMENT_RESULTS.BREAK;
    }

    return this.applyRefinementResult(equipment, result);
  }

  /**
   * Apply refinement result
   * 應用精煉結果
   */
  applyRefinementResult(equipment, result) {
    switch (result) {
      case REFINEMENT_RESULTS.GREAT_SUCCESS:
        equipment.refinementLevel += 2;
        return {
          success: true,
          result: result,
          level: equipment.refinementLevel,
          message: `大成功！${equipment.name}精煉等級提升2級！(Great success! ${equipment.name} refinement level increased by 2!)`
        };

      case REFINEMENT_RESULTS.SUCCESS:
        equipment.refinementLevel += 1;
        return {
          success: true,
          result: result,
          level: equipment.refinementLevel,
          message: `成功！${equipment.name}精煉等級+1！(Success! ${equipment.name} refinement level +1!)`
        };

      case REFINEMENT_RESULTS.FAILURE:
        return {
          success: false,
          result: result,
          level: equipment.refinementLevel,
          message: `精煉失敗，但裝備完好無損 (Refinement failed, but equipment is intact)`
        };

      case REFINEMENT_RESULTS.BREAK:
        equipment.refinementLevel = Math.max(0, equipment.refinementLevel - 1);
        equipment.durability = Math.floor(equipment.durability * 0.7);
        return {
          success: false,
          result: result,
          level: equipment.refinementLevel,
          message: `精煉失敗！${equipment.name}精煉等級-1，耐久度降低！(Refinement failed! ${equipment.name} level -1, durability reduced!)`
        };

      default:
        return {
          success: false,
          message: '未知錯誤 (Unknown error)'
        };
    }
  }

  /**
   * Add socket to equipment
   * 為裝備開孔
   */
  addSocket(character, equipment, materials = {}) {
    if (!equipment.sockets) {
      equipment.sockets = {
        current: 0,
        max: this.getMaxSockets(equipment),
        slots: []
      };
    }

    if (equipment.sockets.current >= equipment.sockets.max) {
      return {
        success: false,
        message: '已達最大孔數 (Already at maximum sockets)'
      };
    }

    // Calculate success rate (gets harder with each socket)
    const baseRate = 0.8;
    const socketPenalty = equipment.sockets.current * 0.15;
    const successRate = Math.max(0.1, baseRate - socketPenalty);

    const roll = Math.random();

    if (roll <= successRate) {
      equipment.sockets.current++;
      equipment.sockets.slots.push({
        id: `socket_${equipment.sockets.current}`,
        gem: null
      });

      return {
        success: true,
        sockets: equipment.sockets.current,
        message: `成功開孔！當前孔數：${equipment.sockets.current}/${equipment.sockets.max} (Successfully added socket! Current: ${equipment.sockets.current}/${equipment.sockets.max})`
      };
    } else {
      return {
        success: false,
        message: '開孔失敗 (Socket addition failed)'
      };
    }
  }

  /**
   * Get maximum sockets based on equipment grade
   * 根據裝備品階獲取最大孔數
   */
  getMaxSockets(equipment) {
    const maxSocketsByGrade = {
      1: 2,  // Mortal
      2: 3,  // Spiritual
      3: 4,  // Treasure
      4: 5,  // Heaven
      5: 6,  // Divine
      6: 7,  // Immortal
      7: 9   // Chaos
    };

    return maxSocketsByGrade[equipment.grade.grade] || 2;
  }

  /**
   * Embed gem into socket
   * 將寶石鑲嵌到孔中
   */
  embedGem(equipment, socketId, gem) {
    if (!equipment.sockets) {
      return {
        success: false,
        message: '此裝備沒有孔位 (This equipment has no sockets)'
      };
    }

    const socket = equipment.sockets.slots.find(s => s.id === socketId);
    
    if (!socket) {
      return {
        success: false,
        message: '孔位不存在 (Socket does not exist)'
      };
    }

    if (socket.gem) {
      return {
        success: false,
        message: '此孔位已有寶石 (Socket already has a gem)'
      };
    }

    socket.gem = gem;

    return {
      success: true,
      message: `成功鑲嵌${gem.name}！(Successfully embedded ${gem.name}!)`,
      gem: gem
    };
  }

  /**
   * Remove gem from socket
   * 從孔中移除寶石
   */
  removeGem(equipment, socketId) {
    if (!equipment.sockets) {
      return {
        success: false,
        message: '此裝備沒有孔位 (This equipment has no sockets)'
      };
    }

    const socket = equipment.sockets.slots.find(s => s.id === socketId);
    
    if (!socket) {
      return {
        success: false,
        message: '孔位不存在 (Socket does not exist)'
      };
    }

    if (!socket.gem) {
      return {
        success: false,
        message: '此孔位沒有寶石 (Socket has no gem)'
      };
    }

    const removedGem = socket.gem;
    socket.gem = null;

    return {
      success: true,
      message: `移除${removedGem.name}！(Removed ${removedGem.name}!)`,
      gem: removedGem
    };
  }

  /**
   * Enhance equipment attribute
   * 強化裝備屬性
   */
  enhanceAttribute(equipment, attribute, materials) {
    if (!equipment.enhancements) {
      equipment.enhancements = {};
    }

    const currentLevel = equipment.enhancements[attribute] || 0;
    const maxLevel = 10;

    if (currentLevel >= maxLevel) {
      return {
        success: false,
        message: `${attribute}已達最高強化等級 (${attribute} already at maximum enhancement level)`
      };
    }

    // Calculate success rate
    const baseRate = 0.7;
    const levelPenalty = currentLevel * 0.05;
    const successRate = Math.max(0.1, baseRate - levelPenalty);

    const roll = Math.random();

    if (roll <= successRate) {
      equipment.enhancements[attribute] = currentLevel + 1;
      
      // Apply attribute boost
      const boost = this.calculateAttributeBoost(equipment, attribute, currentLevel + 1);
      equipment.attributes[attribute] = (equipment.attributes[attribute] || 0) + boost;

      return {
        success: true,
        level: equipment.enhancements[attribute],
        boost: boost,
        message: `成功強化${attribute}！等級+1 (Successfully enhanced ${attribute}! Level +1)`
      };
    } else {
      return {
        success: false,
        message: `強化失敗 (Enhancement failed)`
      };
    }
  }

  /**
   * Calculate attribute boost
   * 計算屬性加成
   */
  calculateAttributeBoost(equipment, attribute, level) {
    const baseValue = equipment.attributes[attribute] || 0;
    return Math.floor(baseValue * 0.05 * level);
  }

  /**
   * Create refining forge
   * 創建煉器爐
   */
  createForge(config) {
    const forge = {
      id: config.id || this.generateForgeId(),
      name: config.name,
      grade: config.grade || 1,
      qualityBonus: config.qualityBonus || 0,
      specialEffects: config.specialEffects || [],
      durability: config.durability || 1000,
      maxDurability: config.maxDurability || 1000
    };

    this.refiningForges.set(forge.id, forge);
    return forge;
  }

  /**
   * Generate forge ID
   * 生成爐子ID
   */
  generateForgeId() {
    return `forge_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * Use protection item during refinement
   * 在精煉時使用保護道具
   */
  useProtection(equipment, protectionItem) {
    // Protection items prevent level decrease on failure
    return {
      success: true,
      message: '使用保護道具，失敗時不會降級 (Using protection, will not decrease level on failure)'
    };
  }
}

export default RefiningSystem;
