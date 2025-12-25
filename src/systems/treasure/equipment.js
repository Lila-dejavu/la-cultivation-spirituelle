/**
 * Equipment System - 法寶裝備系統
 * Manages magical treasures and equipment
 * 管理法寶和裝備
 */

/**
 * Equipment types
 * 裝備類型
 */
export const EQUIPMENT_TYPES = {
  WEAPON: 'weapon',       // 武器
  ARMOR: 'armor',         // 護甲
  ACCESSORY: 'accessory', // 飾品
  FLYING: 'flying',       // 飛行法寶
  DEFENSIVE: 'defensive'  // 防禦法寶
};

/**
 * Equipment grades
 * 裝備品階
 */
export const EQUIPMENT_GRADES = {
  MORTAL: { grade: 1, name: '凡品', color: '#999999' },
  SPIRITUAL: { grade: 2, name: '靈器', color: '#4CAF50' },
  TREASURE: { grade: 3, name: '法寶', color: '#2196F3' },
  HEAVEN: { grade: 4, name: '天器', color: '#9C27B0' },
  DIVINE: { grade: 5, name: '神器', color: '#FF9800' },
  IMMORTAL: { grade: 6, name: '仙器', color: '#F44336' },
  CHAOS: { grade: 7, name: '混沌至寶', color: '#FFD700' }
};

/**
 * Equipment slots
 * 裝備槽位
 */
export const EQUIPMENT_SLOTS = {
  MAIN_HAND: 'main_hand',     // 主手
  OFF_HAND: 'off_hand',       // 副手
  HEAD: 'head',               // 頭部
  CHEST: 'chest',             // 胸甲
  LEGS: 'legs',               // 腿部
  FEET: 'feet',               // 鞋子
  RING_1: 'ring_1',           // 戒指1
  RING_2: 'ring_2',           // 戒指2
  AMULET: 'amulet',           // 護身符
  FLYING_TREASURE: 'flying'   // 飛行法寶
};

/**
 * EquipmentSystem class
 * Manages character equipment and treasures
 */
export class EquipmentSystem {
  constructor() {
    this.equipmentDatabase = new Map();
  }

  /**
   * Create equipment item
   * 創建裝備物品
   */
  createEquipment(config) {
    const equipment = {
      id: config.id || this.generateId(),
      name: config.name,
      type: config.type,
      grade: config.grade || EQUIPMENT_GRADES.MORTAL,
      slot: config.slot,
      level: config.level || 1,
      attributes: config.attributes || {},
      specialEffects: config.specialEffects || [],
      requirements: config.requirements || {},
      refinementLevel: 0,
      maxRefinementLevel: this.getMaxRefinementLevel(config.grade),
      bound: false,
      durability: config.durability || 100,
      maxDurability: config.maxDurability || 100
    };

    this.equipmentDatabase.set(equipment.id, equipment);
    return equipment;
  }

  /**
   * Generate unique equipment ID
   * 生成唯一裝備ID
   */
  generateId() {
    return `equip_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * Get maximum refinement level based on grade
   * 根據品階獲取最大精煉等級
   */
  getMaxRefinementLevel(grade) {
    const maxLevels = {
      [EQUIPMENT_GRADES.MORTAL.grade]: 5,
      [EQUIPMENT_GRADES.SPIRITUAL.grade]: 10,
      [EQUIPMENT_GRADES.TREASURE.grade]: 15,
      [EQUIPMENT_GRADES.HEAVEN.grade]: 20,
      [EQUIPMENT_GRADES.DIVINE.grade]: 25,
      [EQUIPMENT_GRADES.IMMORTAL.grade]: 30,
      [EQUIPMENT_GRADES.CHAOS.grade]: 50
    };

    return maxLevels[grade.grade] || 5;
  }

  /**
   * Equip item to character
   * 將物品裝備到角色
   */
  equipItem(character, equipment) {
    if (!this.canEquip(character, equipment)) {
      return {
        success: false,
        message: '無法裝備此物品 (Cannot equip this item)'
      };
    }

    if (!character.equipment) {
      character.equipment = {};
    }

    const slot = equipment.slot;
    const currentEquipment = character.equipment[slot];

    // Unequip current item if exists
    if (currentEquipment) {
      this.unequipItem(character, slot);
    }

    // Equip new item
    character.equipment[slot] = equipment;
    equipment.bound = true;

    // Apply equipment attributes
    this.applyEquipmentAttributes(character, equipment, true);

    return {
      success: true,
      message: `成功裝備${equipment.name} (Successfully equipped ${equipment.name})`,
      equipment: equipment
    };
  }

  /**
   * Unequip item from character
   * 從角色卸下裝備
   */
  unequipItem(character, slot) {
    if (!character.equipment || !character.equipment[slot]) {
      return {
        success: false,
        message: '此槽位沒有裝備 (No equipment in this slot)'
      };
    }

    const equipment = character.equipment[slot];
    
    // Remove equipment attributes
    this.applyEquipmentAttributes(character, equipment, false);

    // Remove from slot
    character.equipment[slot] = null;

    return {
      success: true,
      message: `卸下${equipment.name} (Unequipped ${equipment.name})`,
      equipment: equipment
    };
  }

  /**
   * Check if character can equip item
   * 檢查角色是否能裝備物品
   */
  canEquip(character, equipment) {
    // Check level requirement
    if (equipment.requirements.level && character.level < equipment.requirements.level) {
      return false;
    }

    // Check realm requirement
    if (equipment.requirements.realm) {
      // TODO: Compare character realm with requirement
    }

    // Check attribute requirements
    if (equipment.requirements.attributes) {
      for (const [attr, value] of Object.entries(equipment.requirements.attributes)) {
        if (character[attr] < value) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Apply or remove equipment attributes
   * 應用或移除裝備屬性
   */
  applyEquipmentAttributes(character, equipment, apply = true) {
    const multiplier = apply ? 1 : -1;

    // Apply base attributes
    for (const [attr, value] of Object.entries(equipment.attributes)) {
      if (!character[attr]) {
        character[attr] = 0;
      }
      character[attr] += value * multiplier;
    }

    // Apply refinement bonuses
    const refinementBonus = this.calculateRefinementBonus(equipment);
    for (const [attr, value] of Object.entries(refinementBonus)) {
      if (!character[attr]) {
        character[attr] = 0;
      }
      character[attr] += value * multiplier;
    }

    // Apply special effects
    if (apply) {
      this.activateSpecialEffects(character, equipment);
    } else {
      this.deactivateSpecialEffects(character, equipment);
    }
  }

  /**
   * Calculate refinement bonus
   * 計算精煉加成
   */
  calculateRefinementBonus(equipment) {
    const bonus = {};
    const refinementLevel = equipment.refinementLevel || 0;

    for (const [attr, value] of Object.entries(equipment.attributes)) {
      bonus[attr] = Math.floor(value * refinementLevel * 0.05); // 5% per refinement level
    }

    return bonus;
  }

  /**
   * Activate special effects
   * 啟動特殊效果
   */
  activateSpecialEffects(character, equipment) {
    if (!character.activeEffects) {
      character.activeEffects = [];
    }

    equipment.specialEffects.forEach(effect => {
      character.activeEffects.push({
        source: equipment.id,
        effect: effect,
        active: true
      });
    });
  }

  /**
   * Deactivate special effects
   * 停用特殊效果
   */
  deactivateSpecialEffects(character, equipment) {
    if (!character.activeEffects) return;

    character.activeEffects = character.activeEffects.filter(
      e => e.source !== equipment.id
    );
  }

  /**
   * Get equipment stats including refinement
   * 獲取包含精煉的裝備屬性
   */
  getEquipmentStats(equipment) {
    const baseStats = { ...equipment.attributes };
    const refinementBonus = this.calculateRefinementBonus(equipment);

    const totalStats = {};
    for (const attr in baseStats) {
      totalStats[attr] = baseStats[attr] + (refinementBonus[attr] || 0);
    }

    return {
      base: baseStats,
      refinement: refinementBonus,
      total: totalStats
    };
  }

  /**
   * Get character's total equipment stats
   * 獲取角色的總裝備屬性
   */
  getTotalEquipmentStats(character) {
    if (!character.equipment) return {};

    const totalStats = {};

    Object.values(character.equipment).forEach(equipment => {
      if (!equipment) return;

      const stats = this.getEquipmentStats(equipment);
      for (const [attr, value] of Object.entries(stats.total)) {
        totalStats[attr] = (totalStats[attr] || 0) + value;
      }
    });

    return totalStats;
  }

  /**
   * Repair equipment
   * 修復裝備
   */
  repairEquipment(equipment, amount) {
    const repairCost = this.calculateRepairCost(equipment, amount);
    
    equipment.durability = Math.min(
      equipment.durability + amount,
      equipment.maxDurability
    );

    return {
      success: true,
      durability: equipment.durability,
      cost: repairCost
    };
  }

  /**
   * Calculate repair cost
   * 計算修復費用
   */
  calculateRepairCost(equipment, amount) {
    const baseCost = equipment.grade.grade * 100;
    const repairPercent = amount / equipment.maxDurability;
    return Math.floor(baseCost * repairPercent);
  }

  /**
   * Get equipment description
   * 獲取裝備描述
   */
  getEquipmentDescription(equipment) {
    const stats = this.getEquipmentStats(equipment);
    
    return {
      name: equipment.name,
      grade: equipment.grade.name,
      type: equipment.type,
      level: equipment.level,
      refinement: `+${equipment.refinementLevel}`,
      attributes: stats.total,
      specialEffects: equipment.specialEffects,
      durability: `${equipment.durability}/${equipment.maxDurability}`,
      requirements: equipment.requirements
    };
  }
}

export default EquipmentSystem;
