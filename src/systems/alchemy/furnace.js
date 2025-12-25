/**
 * Furnace System - 丹爐管理
 * Manages alchemy furnaces
 * 管理煉丹爐
 */

/**
 * Furnace grades
 * 丹爐品階
 */
export const FURNACE_GRADES = {
  MORTAL: { grade: 1, name: '凡品丹爐', bonus: 0 },
  SPIRITUAL: { grade: 2, name: '靈品丹爐', bonus: 0.1 },
  TREASURE: { grade: 3, name: '法寶丹爐', bonus: 0.25 },
  HEAVEN: { grade: 4, name: '天階丹爐', bonus: 0.5 },
  DIVINE: { grade: 5, name: '神品丹爐', bonus: 1.0 },
  IMMORTAL: { grade: 6, name: '仙品丹爐', bonus: 2.0 }
};

/**
 * Furnace types
 * 丹爐類型
 */
export const FURNACE_TYPES = {
  STANDARD: 'standard',       // 標準型
  FIRE: 'fire',               // 火屬性專精
  WOOD: 'wood',               // 木屬性專精
  RAPID: 'rapid',             // 快速煉製
  STABLE: 'stable',           // 穩定型
  MULTI: 'multi'              // 多爐同煉
};

/**
 * FurnaceSystem class
 * Manages alchemy furnaces
 */
export class FurnaceSystem {
  constructor() {
    this.furnaceDatabase = new Map();
  }

  /**
   * Create furnace
   * 創建丹爐
   */
  createFurnace(config) {
    const furnace = {
      id: config.id || this.generateId(),
      name: config.name,
      type: config.type || FURNACE_TYPES.STANDARD,
      grade: config.grade || FURNACE_GRADES.MORTAL,
      level: config.level || 1,
      maxLevel: config.maxLevel || 10,
      attributes: {
        stabilityBonus: config.attributes?.stabilityBonus || 0,
        qualityBonus: config.attributes?.qualityBonus || 0,
        speedBonus: config.attributes?.speedBonus || 0,
        yieldBonus: config.attributes?.yieldBonus || 0
      },
      specialEffects: config.specialEffects || [],
      durability: config.durability || 1000,
      maxDurability: config.maxDurability || 1000,
      fireControl: config.fireControl || 50,
      capacity: config.capacity || 1
    };

    this.furnaceDatabase.set(furnace.id, furnace);
    return furnace;
  }

  /**
   * Generate unique furnace ID
   * 生成唯一丹爐ID
   */
  generateId() {
    return `furnace_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * Upgrade furnace level
   * 升級丹爐等級
   */
  upgradeFurnace(furnace, materials = {}) {
    if (furnace.level >= furnace.maxLevel) {
      return {
        success: false,
        message: '已達最高等級 (Already at maximum level)'
      };
    }

    // Check materials (TODO: implement material checking)
    
    // Upgrade
    furnace.level++;
    
    // Increase attributes
    furnace.attributes.stabilityBonus += 2;
    furnace.attributes.qualityBonus += 1;
    furnace.attributes.speedBonus += 1;

    return {
      success: true,
      level: furnace.level,
      message: `丹爐升級至${furnace.level}級！(Furnace upgraded to level ${furnace.level}!)`
    };
  }

  /**
   * Repair furnace
   * 修復丹爐
   */
  repairFurnace(furnace, amount) {
    const oldDurability = furnace.durability;
    furnace.durability = Math.min(
      furnace.durability + amount,
      furnace.maxDurability
    );

    return {
      success: true,
      repaired: furnace.durability - oldDurability,
      durability: furnace.durability,
      message: `修復${furnace.durability - oldDurability}耐久度 (Repaired ${furnace.durability - oldDurability} durability)`
    };
  }

  /**
   * Get furnace bonuses
   * 獲取丹爐加成
   */
  getFurnaceBonuses(furnace) {
    const baseBonuses = { ...furnace.attributes };
    const gradeBonuses = furnace.grade.bonus;
    const levelMultiplier = 1 + (furnace.level * 0.1);

    return {
      stability: Math.floor((baseBonuses.stabilityBonus + gradeBonuses * 10) * levelMultiplier),
      quality: Math.floor((baseBonuses.qualityBonus + gradeBonuses * 5) * levelMultiplier),
      speed: Math.floor((baseBonuses.speedBonus + gradeBonuses * 5) * levelMultiplier),
      yield: Math.floor((baseBonuses.yieldBonus + gradeBonuses * 3) * levelMultiplier)
    };
  }

  /**
   * Check if furnace is suitable for formula
   * 檢查丹爐是否適合配方
   */
  isSuitableForFormula(furnace, formula) {
    return furnace.grade.grade >= formula.requirements.furnaceGrade;
  }
}

export default FurnaceSystem;
