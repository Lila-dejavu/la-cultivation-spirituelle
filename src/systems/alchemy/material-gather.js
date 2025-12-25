/**
 * Material Gathering System - 材料收集
 * Manages gathering of alchemy materials
 * 管理煉丹材料的收集
 */

/**
 * Gathering methods
 * 收集方式
 */
export const GATHERING_METHODS = {
  HARVEST: 'harvest',         // 採集
  MINING: 'mining',           // 挖掘
  HUNTING: 'hunting',         // 狩獵
  PURCHASE: 'purchase',       // 購買
  QUEST: 'quest',             // 任務獲得
  TRADE: 'trade'              // 交易
};

/**
 * MaterialGatherSystem class
 * Manages material gathering operations
 */
export class MaterialGatherSystem {
  constructor() {
    this.gatheringLocations = new Map();
    this.activeGathering = new Map();
  }

  /**
   * Register gathering location
   * 註冊採集地點
   */
  registerLocation(config) {
    const location = {
      id: config.id || this.generateLocationId(),
      name: config.name,
      type: config.type,
      materials: config.materials || [],
      requiredLevel: config.requiredLevel || 1,
      requiredTools: config.requiredTools || [],
      respawnTime: config.respawnTime || 3600, // seconds
      lastGathered: {}
    };

    this.gatheringLocations.set(location.id, location);
    return location;
  }

  /**
   * Generate location ID
   * 生成地點ID
   */
  generateLocationId() {
    return `location_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * Start gathering at location
   * 在地點開始採集
   */
  startGathering(character, locationId) {
    const location = this.gatheringLocations.get(locationId);
    
    if (!location) {
      return {
        success: false,
        message: '地點不存在 (Location does not exist)'
      };
    }

    // Check requirements
    if (!this.canGather(character, location)) {
      return {
        success: false,
        message: '不滿足採集條件 (Requirements not met)'
      };
    }

    // Start gathering
    const gatheringId = this.generateGatheringId();
    const gathering = {
      id: gatheringId,
      character: character,
      location: location,
      startTime: Date.now(),
      progress: 0,
      discoveries: []
    };

    this.activeGathering.set(gatheringId, gathering);

    return {
      success: true,
      gatheringId: gatheringId,
      message: `開始在${location.name}採集 (Started gathering at ${location.name})`
    };
  }

  /**
   * Generate gathering ID
   * 生成採集ID
   */
  generateGatheringId() {
    return `gather_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * Check if character can gather at location
   * 檢查角色是否能在地點採集
   */
  canGather(character, location) {
    // Check level
    if (character.level < location.requiredLevel) {
      return false;
    }

    // Check tools
    if (location.requiredTools.length > 0) {
      const hasTools = location.requiredTools.every(tool => 
        character.inventory?.tools?.includes(tool)
      );
      
      if (!hasTools) {
        return false;
      }
    }

    // Check if materials are available (respawn time)
    const now = Date.now();
    const canGather = location.materials.some(material => {
      const lastGathered = location.lastGathered[material.id] || 0;
      return now - lastGathered >= location.respawnTime * 1000;
    });

    return canGather;
  }

  /**
   * Progress gathering
   * 推進採集
   */
  progressGathering(gatheringId) {
    const gathering = this.activeGathering.get(gatheringId);
    
    if (!gathering) {
      return {
        success: false,
        message: '採集會話不存在 (Gathering session does not exist)'
      };
    }

    gathering.progress += 10;

    // Check for discoveries
    if (gathering.progress >= 100) {
      return this.completeGathering(gathering);
    }

    // Random discovery during gathering
    if (Math.random() < 0.1) {
      const discovery = this.findMaterial(gathering.location, gathering.character);
      if (discovery) {
        gathering.discoveries.push(discovery);
        
        return {
          success: true,
          gathering: gathering,
          discovery: discovery,
          message: `發現${discovery.name}！(Discovered ${discovery.name}!)`
        };
      }
    }

    return {
      success: true,
      gathering: gathering
    };
  }

  /**
   * Complete gathering
   * 完成採集
   */
  completeGathering(gathering) {
    // Gather remaining materials
    const finalDiscoveries = [];
    
    for (let i = 0; i < 3; i++) {
      const discovery = this.findMaterial(gathering.location, gathering.character);
      if (discovery) {
        finalDiscoveries.push(discovery);
      }
    }

    gathering.discoveries.push(...finalDiscoveries);

    // Update last gathered time
    const now = Date.now();
    gathering.discoveries.forEach(discovery => {
      gathering.location.lastGathered[discovery.id] = now;
    });

    // Clean up
    this.activeGathering.delete(gathering.id);

    return {
      success: true,
      completed: true,
      discoveries: gathering.discoveries,
      totalGathered: gathering.discoveries.length,
      message: `採集完成！獲得${gathering.discoveries.length}種材料 (Gathering complete! Obtained ${gathering.discoveries.length} materials)`
    };
  }

  /**
   * Find material at location
   * 在地點尋找材料
   */
  findMaterial(location, character) {
    const availableMaterials = location.materials.filter(material => {
      const now = Date.now();
      const lastGathered = location.lastGathered[material.id] || 0;
      return now - lastGathered >= location.respawnTime * 1000;
    });

    if (availableMaterials.length === 0) {
      return null;
    }

    // Select material based on rarity
    const roll = Math.random();
    let cumulative = 0;

    for (const material of availableMaterials) {
      cumulative += material.dropRate || 0.1;
      
      if (roll <= cumulative) {
        // Calculate quantity based on character's gathering skill
        const quantity = this.calculateQuantity(character, material);
        
        return {
          ...material,
          quantity: quantity
        };
      }
    }

    // Fallback to first material
    return availableMaterials[0] ? {
      ...availableMaterials[0],
      quantity: 1
    } : null;
  }

  /**
   * Calculate material quantity
   * 計算材料數量
   */
  calculateQuantity(character, material) {
    let base = 1;

    // Gathering skill bonus
    if (character.skills?.gathering) {
      base += Math.floor(character.skills.gathering / 20);
    }

    // Realm bonus
    base += Math.floor(character.level / 40);

    // Random variation
    return Math.floor(base * (0.8 + Math.random() * 0.4));
  }

  /**
   * Purchase material from shop
   * 從商店購買材料
   */
  purchaseMaterial(character, materialId, quantity, price) {
    // Check if character has enough currency
    // TODO: Implement currency checking

    // Add material to inventory
    // TODO: Implement inventory system integration

    return {
      success: true,
      material: materialId,
      quantity: quantity,
      cost: price,
      message: `購買${quantity}個材料，花費${price}靈石 (Purchased ${quantity} materials for ${price} spirit stones)`
    };
  }

  /**
   * Trade materials with NPC
   * 與NPC交易材料
   */
  tradeMaterial(character, offeredMaterials, requestedMaterials) {
    // Check if character has offered materials
    // TODO: Implement material checking

    // Check if trade is fair
    const tradeValue = this.evaluateTrade(offeredMaterials, requestedMaterials);
    
    if (!tradeValue.fair) {
      return {
        success: false,
        message: '交易不公平 (Trade is not fair)',
        ratio: tradeValue.ratio
      };
    }

    // Execute trade
    // TODO: Implement material exchange

    return {
      success: true,
      message: '交易成功 (Trade successful)'
    };
  }

  /**
   * Evaluate trade fairness
   * 評估交易公平性
   */
  evaluateTrade(offered, requested) {
    // TODO: Implement trade evaluation logic
    return {
      fair: true,
      ratio: 1.0
    };
  }

  /**
   * Get available gathering locations
   * 獲取可用的採集地點
   */
  getAvailableLocations(character) {
    const available = [];

    this.gatheringLocations.forEach(location => {
      if (this.canGather(character, location)) {
        available.push({
          id: location.id,
          name: location.name,
          type: location.type,
          materialCount: location.materials.length,
          requiredLevel: location.requiredLevel
        });
      }
    });

    return available;
  }
}

export default MaterialGatherSystem;
