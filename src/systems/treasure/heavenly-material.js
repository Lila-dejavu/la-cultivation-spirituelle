/**
 * Heavenly Material System - 天材地寶系統
 * Manages rare materials for crafting and cultivation
 * 管理用於煉器和修煉的稀有材料
 */

/**
 * Material types
 * 材料類型
 */
export const MATERIAL_TYPES = {
  HERB: 'herb',               // 靈草
  ORE: 'ore',                 // 礦石
  ESSENCE: 'essence',         // 精華
  BEAST_CORE: 'beast_core',   // 妖獸內丹
  BONE: 'bone',               // 骨骼
  SCALE: 'scale',             // 鱗片
  WOOD: 'wood',               // 靈木
  CRYSTAL: 'crystal',         // 晶石
  LIQUID: 'liquid'            // 靈液
};

/**
 * Material grades
 * 材料品階
 */
export const MATERIAL_GRADES = {
  COMMON: { grade: 1, name: '普通', rarity: 0.5 },
  UNCOMMON: { grade: 2, name: '罕見', rarity: 0.3 },
  RARE: { grade: 3, name: '稀有', rarity: 0.15 },
  EPIC: { grade: 4, name: '史詩', rarity: 0.04 },
  LEGENDARY: { grade: 5, name: '傳說', rarity: 0.009 },
  MYTHICAL: { grade: 6, name: '神話', rarity: 0.001 }
};

/**
 * HeavenlyMaterialSystem class
 * Manages rare materials and their usage
 */
export class HeavenlyMaterialSystem {
  constructor() {
    this.materialDatabase = new Map();
  }

  /**
   * Create material
   * 創建材料
   */
  createMaterial(config) {
    const material = {
      id: config.id || this.generateId(),
      name: config.name,
      type: config.type,
      grade: config.grade || MATERIAL_GRADES.COMMON,
      element: config.element || null,
      properties: config.properties || [],
      quantity: config.quantity || 1,
      maxStack: config.maxStack || 999,
      description: config.description || '',
      uses: config.uses || []
    };

    this.materialDatabase.set(material.id, material);
    return material;
  }

  /**
   * Generate unique material ID
   * 生成唯一材料ID
   */
  generateId() {
    return `material_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * Add material to character inventory
   * 將材料添加到角色背包
   */
  addMaterial(character, materialId, quantity = 1) {
    if (!character.materials) {
      character.materials = new Map();
    }

    const existingMaterial = character.materials.get(materialId);
    
    if (existingMaterial) {
      const material = this.materialDatabase.get(materialId);
      const newQuantity = existingMaterial.quantity + quantity;
      
      if (newQuantity <= material.maxStack) {
        existingMaterial.quantity = newQuantity;
      } else {
        return {
          success: false,
          message: '材料堆疊已滿 (Material stack is full)'
        };
      }
    } else {
      const material = this.materialDatabase.get(materialId);
      if (!material) {
        return {
          success: false,
          message: '材料不存在 (Material does not exist)'
        };
      }

      character.materials.set(materialId, {
        ...material,
        quantity: quantity
      });
    }

    return {
      success: true,
      message: `獲得${quantity}個${this.getMaterialName(materialId)}！(Obtained ${quantity} ${this.getMaterialName(materialId)}!)`
    };
  }

  /**
   * Remove material from character inventory
   * 從角色背包移除材料
   */
  removeMaterial(character, materialId, quantity = 1) {
    if (!character.materials || !character.materials.has(materialId)) {
      return {
        success: false,
        message: '沒有此材料 (Do not have this material)'
      };
    }

    const material = character.materials.get(materialId);
    
    if (material.quantity < quantity) {
      return {
        success: false,
        message: '材料數量不足 (Insufficient material quantity)'
      };
    }

    material.quantity -= quantity;
    
    if (material.quantity === 0) {
      character.materials.delete(materialId);
    }

    return {
      success: true,
      message: `使用${quantity}個${material.name} (Used ${quantity} ${material.name})`
    };
  }

  /**
   * Check if character has materials
   * 檢查角色是否擁有材料
   */
  hasMaterials(character, requirements) {
    if (!character.materials) return false;

    for (const [materialId, requiredQuantity] of Object.entries(requirements)) {
      const material = character.materials.get(materialId);
      
      if (!material || material.quantity < requiredQuantity) {
        return false;
      }
    }

    return true;
  }

  /**
   * Consume materials for crafting or other uses
   * 為煉製或其他用途消耗材料
   */
  consumeMaterials(character, requirements) {
    // First check if character has all materials
    if (!this.hasMaterials(character, requirements)) {
      return {
        success: false,
        message: '材料不足 (Insufficient materials)'
      };
    }

    // Consume materials
    for (const [materialId, quantity] of Object.entries(requirements)) {
      const result = this.removeMaterial(character, materialId, quantity);
      if (!result.success) {
        // This shouldn't happen after the check, but handle it anyway
        return result;
      }
    }

    return {
      success: true,
      message: '材料消耗成功 (Materials consumed successfully)'
    };
  }

  /**
   * Gather material from location
   * 從地點採集材料
   */
  gatherMaterial(character, location) {
    // Check if location has materials
    if (!location.materials || location.materials.length === 0) {
      return {
        success: false,
        message: '此處沒有可採集的材料 (No materials available at this location)'
      };
    }

    // Select random material based on rarity
    const material = this.selectRandomMaterial(location.materials);
    
    if (!material) {
      return {
        success: false,
        message: '採集失敗 (Gathering failed)'
      };
    }

    // Calculate quantity based on character's gathering skill
    const quantity = this.calculateGatherQuantity(character, material);

    // Add to inventory
    const result = this.addMaterial(character, material.id, quantity);

    return {
      ...result,
      material: material,
      quantity: quantity
    };
  }

  /**
   * Select random material based on rarity
   * 根據稀有度選擇隨機材料
   */
  selectRandomMaterial(materials) {
    const totalWeight = materials.reduce((sum, m) => {
      const material = this.materialDatabase.get(m.id);
      return sum + (1 - material.grade.rarity);
    }, 0);

    let random = Math.random() * totalWeight;

    for (const m of materials) {
      const material = this.materialDatabase.get(m.id);
      const weight = 1 - material.grade.rarity;
      
      if (random < weight) {
        return material;
      }
      
      random -= weight;
    }

    return materials[0] ? this.materialDatabase.get(materials[0].id) : null;
  }

  /**
   * Calculate gather quantity
   * 計算採集數量
   */
  calculateGatherQuantity(character, material) {
    let baseQuantity = 1;

    // TODO: Add gathering skill bonus
    // if (character.skills.gathering) {
    //   baseQuantity += Math.floor(character.skills.gathering / 10);
    // }

    // Realm bonus
    const realmBonus = Math.floor(character.level / 20);
    
    return baseQuantity + realmBonus;
  }

  /**
   * Refine material to higher grade
   * 提煉材料到更高品階
   */
  refineMaterial(character, materialId, quantity) {
    if (!character.materials || !character.materials.has(materialId)) {
      return {
        success: false,
        message: '沒有此材料 (Do not have this material)'
      };
    }

    const material = character.materials.get(materialId);
    const requiredQuantity = 10; // Need 10 materials to refine to next grade

    if (quantity < requiredQuantity) {
      return {
        success: false,
        message: `需要至少${requiredQuantity}個材料才能提煉 (Need at least ${requiredQuantity} materials to refine)`
      };
    }

    const refinableCount = Math.floor(quantity / requiredQuantity);
    
    // Remove materials
    const removeResult = this.removeMaterial(
      character,
      materialId,
      refinableCount * requiredQuantity
    );
    
    if (!removeResult.success) {
      return removeResult;
    }

    // Create refined material (higher grade)
    const originalMaterial = this.materialDatabase.get(materialId);
    const nextGrade = this.getNextGrade(originalMaterial.grade);

    if (!nextGrade) {
      return {
        success: false,
        message: '已是最高品階 (Already at highest grade)'
      };
    }

    const refinedMaterial = this.createMaterial({
      ...originalMaterial,
      id: `${materialId}_refined`,
      grade: nextGrade,
      name: `${originalMaterial.name}（提煉）`
    });

    this.addMaterial(character, refinedMaterial.id, refinableCount);

    return {
      success: true,
      refined: refinableCount,
      material: refinedMaterial,
      message: `成功提煉${refinableCount}個${refinedMaterial.name}！(Successfully refined ${refinableCount} ${refinedMaterial.name}!)`
    };
  }

  /**
   * Get next higher grade
   * 獲取下一個更高品階
   */
  getNextGrade(currentGrade) {
    const grades = [
      MATERIAL_GRADES.COMMON,
      MATERIAL_GRADES.UNCOMMON,
      MATERIAL_GRADES.RARE,
      MATERIAL_GRADES.EPIC,
      MATERIAL_GRADES.LEGENDARY,
      MATERIAL_GRADES.MYTHICAL
    ];

    const currentIndex = grades.findIndex(g => g.grade === currentGrade.grade);
    
    if (currentIndex === -1 || currentIndex >= grades.length - 1) {
      return null;
    }

    return grades[currentIndex + 1];
  }

  /**
   * Get material name
   * 獲取材料名稱
   */
  getMaterialName(materialId) {
    const material = this.materialDatabase.get(materialId);
    return material ? material.name : 'Unknown Material';
  }

  /**
   * Get material description
   * 獲取材料描述
   */
  getMaterialDescription(materialId) {
    const material = this.materialDatabase.get(materialId);
    
    if (!material) {
      return null;
    }

    return {
      name: material.name,
      type: material.type,
      grade: material.grade.name,
      element: material.element,
      properties: material.properties,
      uses: material.uses,
      description: material.description
    };
  }

  /**
   * Get character's material inventory summary
   * 獲取角色的材料背包摘要
   */
  getMaterialInventory(character) {
    if (!character.materials) {
      return [];
    }

    const inventory = [];
    
    character.materials.forEach((material, id) => {
      inventory.push({
        id: id,
        name: material.name,
        type: material.type,
        grade: material.grade.name,
        quantity: material.quantity,
        maxStack: material.maxStack
      });
    });

    return inventory;
  }

  /**
   * Sort materials by grade and type
   * 按品階和類型排序材料
   */
  sortMaterials(materials, sortBy = 'grade') {
    return materials.sort((a, b) => {
      if (sortBy === 'grade') {
        return b.grade.grade - a.grade.grade;
      } else if (sortBy === 'type') {
        return a.type.localeCompare(b.type);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }
}

export default HeavenlyMaterialSystem;
