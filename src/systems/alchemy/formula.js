/**
 * Formula System - 丹方系統
 * Manages pill and elixir formulas
 * 管理丹藥配方
 */

/**
 * Formula categories
 * 配方類別
 */
export const FORMULA_CATEGORIES = {
  HEALING: 'healing',             // 治療類
  CULTIVATION: 'cultivation',     // 修煉類
  BREAKTHROUGH: 'breakthrough',   // 突破類
  ENHANCEMENT: 'enhancement',     // 增強類
  RECOVERY: 'recovery',           // 恢復類
  SPECIAL: 'special'              // 特殊類
};

/**
 * Formula rarities
 * 配方稀有度
 */
export const FORMULA_RARITIES = {
  COMMON: { rarity: 1, name: '常見配方' },
  UNCOMMON: { rarity: 2, name: '罕見配方' },
  RARE: { rarity: 3, name: '稀有配方' },
  EPIC: { rarity: 4, name: '史詩配方' },
  LEGENDARY: { rarity: 5, name: '傳說配方' },
  IMMORTAL: { rarity: 6, name: '仙級配方' }
};

/**
 * FormulaSystem class
 * Manages formula collection and research
 */
export class FormulaSystem {
  constructor() {
    this.formulaDatabase = new Map();
  }

  /**
   * Create formula
   * 創建配方
   */
  createFormula(config) {
    const formula = {
      id: config.id || this.generateId(),
      name: config.name,
      category: config.category,
      rarity: config.rarity || FORMULA_RARITIES.COMMON,
      description: config.description || '',
      materials: config.materials || {},
      output: config.output || {},
      requirements: {
        alchemyLevel: config.requirements?.alchemyLevel || 1,
        realm: config.requirements?.realm || null,
        furnaceGrade: config.requirements?.furnaceGrade || 1,
        comprehension: config.requirements?.comprehension || 0
      },
      craftingTime: config.craftingTime || 60, // seconds
      difficulty: config.difficulty || 1,
      experience: config.experience || 100,
      discoveryMethod: config.discoveryMethod || 'purchase',
      prerequisites: config.prerequisites || []
    };

    this.formulaDatabase.set(formula.id, formula);
    return formula;
  }

  /**
   * Generate unique formula ID
   * 生成唯一配方ID
   */
  generateId() {
    return `formula_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * Learn formula
   * 學習配方
   */
  learnFormula(character, formulaId) {
    if (!character.knownFormulas) {
      character.knownFormulas = [];
    }

    // Check if already known
    if (character.knownFormulas.includes(formulaId)) {
      return {
        success: false,
        message: '已經學會此配方 (Already know this formula)'
      };
    }

    const formula = this.formulaDatabase.get(formulaId);
    if (!formula) {
      return {
        success: false,
        message: '配方不存在 (Formula does not exist)'
      };
    }

    // Check prerequisites
    if (!this.checkPrerequisites(character, formula)) {
      return {
        success: false,
        message: '不滿足學習條件 (Prerequisites not met)'
      };
    }

    // Learn formula
    character.knownFormulas.push(formulaId);

    return {
      success: true,
      formula: formula,
      message: `學會配方：${formula.name}！(Learned formula: ${formula.name}!)`
    };
  }

  /**
   * Check formula prerequisites
   * 檢查配方前置條件
   */
  checkPrerequisites(character, formula) {
    // Check alchemy level
    if (formula.requirements.alchemyLevel) {
      const alchemyLevel = character.skills?.alchemy || 0;
      if (alchemyLevel < formula.requirements.alchemyLevel) {
        return false;
      }
    }

    // Check realm
    if (formula.requirements.realm) {
      // TODO: Check character realm
    }

    // Check comprehension
    if (formula.requirements.comprehension) {
      const comprehension = character.cultivation?.comprehension || 0;
      if (comprehension < formula.requirements.comprehension) {
        return false;
      }
    }

    // Check prerequisite formulas
    if (formula.prerequisites.length > 0) {
      const knownFormulas = character.knownFormulas || [];
      const hasAllPrereqs = formula.prerequisites.every(
        prereqId => knownFormulas.includes(prereqId)
      );
      
      if (!hasAllPrereqs) {
        return false;
      }
    }

    return true;
  }

  /**
   * Research new formula
   * 研究新配方
   */
  researchFormula(character, baseFormulaId, modifications = {}) {
    const baseFormula = this.formulaDatabase.get(baseFormulaId);
    
    if (!baseFormula) {
      return {
        success: false,
        message: '基礎配方不存在 (Base formula does not exist)'
      };
    }

    // Check if character knows base formula
    if (!character.knownFormulas || !character.knownFormulas.includes(baseFormulaId)) {
      return {
        success: false,
        message: '尚未學會基礎配方 (Have not learned base formula)'
      };
    }

    // Calculate research success rate
    const successRate = this.calculateResearchSuccessRate(character, baseFormula);
    
    const roll = Math.random();
    
    if (roll > successRate) {
      return {
        success: false,
        message: '研究失敗 (Research failed)',
        progressMade: Math.floor(roll * 100)
      };
    }

    // Create new formula variant
    const newFormula = this.createFormulaVariant(baseFormula, modifications);
    
    // Learn new formula
    character.knownFormulas.push(newFormula.id);

    return {
      success: true,
      formula: newFormula,
      message: `研究成功！發現新配方：${newFormula.name}！(Research successful! Discovered new formula: ${newFormula.name}!)`
    };
  }

  /**
   * Calculate research success rate
   * 計算研究成功率
   */
  calculateResearchSuccessRate(character, formula) {
    let baseRate = 0.3;

    // Alchemy skill bonus
    const alchemyLevel = character.skills?.alchemy || 0;
    baseRate += alchemyLevel * 0.01;

    // Comprehension bonus
    const comprehension = character.cultivation?.comprehension || 0;
    baseRate += comprehension / 1000 * 0.1;

    // Dao comprehension bonus (alchemy dao)
    if (character.daoComprehension?.paths?.alchemy) {
      baseRate += character.daoComprehension.paths.alchemy.level * 0.05;
    }

    // Formula difficulty penalty
    baseRate -= formula.difficulty * 0.1;

    return Math.max(0.05, Math.min(baseRate, 0.95));
  }

  /**
   * Create formula variant
   * 創建配方變體
   */
  createFormulaVariant(baseFormula, modifications) {
    const variant = {
      ...baseFormula,
      id: this.generateId(),
      name: `${baseFormula.name}（改良）`,
      rarity: this.upgradeRarity(baseFormula.rarity),
      materials: { ...baseFormula.materials, ...modifications.materials },
      output: { ...baseFormula.output, ...modifications.output },
      requirements: { ...baseFormula.requirements },
      discoveryMethod: 'research',
      prerequisites: [baseFormula.id]
    };

    this.formulaDatabase.set(variant.id, variant);
    return variant;
  }

  /**
   * Upgrade formula rarity
   * 提升配方稀有度
   */
  upgradeRarity(currentRarity) {
    const rarities = [
      FORMULA_RARITIES.COMMON,
      FORMULA_RARITIES.UNCOMMON,
      FORMULA_RARITIES.RARE,
      FORMULA_RARITIES.EPIC,
      FORMULA_RARITIES.LEGENDARY,
      FORMULA_RARITIES.IMMORTAL
    ];

    const currentIndex = rarities.findIndex(r => r.rarity === currentRarity.rarity);
    
    if (currentIndex === -1 || currentIndex >= rarities.length - 1) {
      return currentRarity;
    }

    return rarities[currentIndex + 1];
  }

  /**
   * Get formula details
   * 獲取配方詳情
   */
  getFormulaDetails(formulaId) {
    const formula = this.formulaDatabase.get(formulaId);
    
    if (!formula) {
      return null;
    }

    return {
      name: formula.name,
      category: formula.category,
      rarity: formula.rarity.name,
      description: formula.description,
      materials: formula.materials,
      output: formula.output,
      requirements: formula.requirements,
      craftingTime: `${formula.craftingTime}秒`,
      difficulty: formula.difficulty,
      experience: formula.experience
    };
  }

  /**
   * Get character's known formulas
   * 獲取角色已知配方
   */
  getKnownFormulas(character, category = null) {
    if (!character.knownFormulas) {
      return [];
    }

    const formulas = character.knownFormulas.map(id => 
      this.formulaDatabase.get(id)
    ).filter(f => f !== undefined);

    if (category) {
      return formulas.filter(f => f.category === category);
    }

    return formulas;
  }

  /**
   * Get available formulas to learn
   * 獲取可學習的配方
   */
  getAvailableFormulas(character) {
    const available = [];

    this.formulaDatabase.forEach(formula => {
      // Skip if already known
      if (character.knownFormulas?.includes(formula.id)) {
        return;
      }

      // Skip if prerequisites not met
      if (!this.checkPrerequisites(character, formula)) {
        return;
      }

      available.push(formula);
    });

    return available;
  }

  /**
   * Combine formulas to create new one
   * 組合配方創建新配方
   */
  combineFormulas(character, formulaIds) {
    if (formulaIds.length < 2) {
      return {
        success: false,
        message: '至少需要兩個配方才能組合 (Need at least two formulas to combine)'
      };
    }

    const formulas = formulaIds.map(id => this.formulaDatabase.get(id));
    
    // Check if character knows all formulas
    const knowsAll = formulaIds.every(id => 
      character.knownFormulas?.includes(id)
    );

    if (!knowsAll) {
      return {
        success: false,
        message: '必須學會所有配方才能組合 (Must know all formulas to combine)'
      };
    }

    // Calculate combination success rate
    const successRate = 0.2; // Low success rate for combinations

    const roll = Math.random();
    
    if (roll > successRate) {
      return {
        success: false,
        message: '配方組合失敗 (Formula combination failed)'
      };
    }

    // Create combined formula
    const combinedFormula = this.createCombinedFormula(formulas);
    
    // Learn combined formula
    character.knownFormulas.push(combinedFormula.id);

    return {
      success: true,
      formula: combinedFormula,
      message: `創造新配方：${combinedFormula.name}！(Created new formula: ${combinedFormula.name}!)`
    };
  }

  /**
   * Create combined formula from multiple formulas
   * 從多個配方創建組合配方
   */
  createCombinedFormula(formulas) {
    const combinedMaterials = {};
    const combinedEffects = {};

    formulas.forEach(formula => {
      // Merge materials
      Object.entries(formula.materials).forEach(([mat, qty]) => {
        combinedMaterials[mat] = (combinedMaterials[mat] || 0) + qty;
      });

      // Merge effects
      if (formula.output.effects) {
        Object.entries(formula.output.effects).forEach(([effect, value]) => {
          combinedEffects[effect] = (combinedEffects[effect] || 0) + value;
        });
      }
    });

    const combined = this.createFormula({
      name: `組合丹藥`,
      category: FORMULA_CATEGORIES.SPECIAL,
      rarity: FORMULA_RARITIES.RARE,
      materials: combinedMaterials,
      output: {
        name: '組合丹',
        type: 'special',
        grade: formulas[0].output.grade,
        effects: combinedEffects
      },
      requirements: {
        alchemyLevel: Math.max(...formulas.map(f => f.requirements.alchemyLevel)),
        furnaceGrade: Math.max(...formulas.map(f => f.requirements.furnaceGrade))
      },
      discoveryMethod: 'combination',
      prerequisites: formulas.map(f => f.id)
    });

    return combined;
  }
}

export default FormulaSystem;
