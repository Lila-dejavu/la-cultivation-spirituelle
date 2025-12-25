/**
 * Spiritual Root System - 靈根系統
 * Manages innate cultivation talent and affinity
 * 管理天生的修煉天賦和親和力
 */

/**
 * Spiritual root elements
 * 靈根元素
 */
export const ELEMENTS = {
  METAL: 'metal',     // 金
  WOOD: 'wood',       // 木
  WATER: 'water',     // 水
  FIRE: 'fire',       // 火
  EARTH: 'earth',     // 地
  THUNDER: 'thunder', // 雷
  WIND: 'wind',       // 風
  ICE: 'ice',         // 冰
  DARKNESS: 'dark',   // 暗
  LIGHT: 'light'      // 光
};

/**
 * Spiritual root quality/grade
 * 靈根品質等級
 */
export const ROOT_QUALITY = {
  MORTAL: 1,          // 凡品
  COMMON: 2,          // 普通
  SUPERIOR: 3,        // 上品
  HEAVEN_GRADE: 4,    // 天品
  DIVINE: 5           // 神品
};

/**
 * Special spiritual root types
 * 特殊靈根類型
 */
export const SPECIAL_ROOTS = {
  SINGLE: 'single',           // 單靈根（最佳）
  DUAL: 'dual',               // 雙靈根
  TRI: 'tri',                 // 三靈根
  QUAD: 'quad',               // 四靈根
  PENTA: 'penta',             // 五靈根（最差）
  MUTANT: 'mutant',           // 變異靈根
  CHAOTIC: 'chaotic',         // 混沌靈根
  HEAVENLY: 'heavenly'        // 天靈根
};

/**
 * SpiritualRootSystem class
 * Manages character spiritual roots
 */
export class SpiritualRootSystem {
  constructor() {
    this.elementInteractions = this.initializeElementInteractions();
  }

  /**
   * Initialize element interaction matrix
   * 初始化元素相互作用矩陣
   */
  initializeElementInteractions() {
    // Five elements cycle: Wood > Earth > Water > Fire > Metal > Wood
    // 五行相剋：木剋土，土剋水，水剋火，火剋金，金剋木
    return {
      [ELEMENTS.WOOD]: { strong: ELEMENTS.EARTH, weak: ELEMENTS.METAL },
      [ELEMENTS.EARTH]: { strong: ELEMENTS.WATER, weak: ELEMENTS.WOOD },
      [ELEMENTS.WATER]: { strong: ELEMENTS.FIRE, weak: ELEMENTS.EARTH },
      [ELEMENTS.FIRE]: { strong: ELEMENTS.METAL, weak: ELEMENTS.WATER },
      [ELEMENTS.METAL]: { strong: ELEMENTS.WOOD, weak: ELEMENTS.FIRE },
      [ELEMENTS.THUNDER]: { strong: ELEMENTS.WATER, weak: ELEMENTS.EARTH },
      [ELEMENTS.WIND]: { strong: ELEMENTS.FIRE, weak: ELEMENTS.ICE },
      [ELEMENTS.ICE]: { strong: ELEMENTS.WIND, weak: ELEMENTS.FIRE },
      [ELEMENTS.DARKNESS]: { strong: ELEMENTS.LIGHT, weak: ELEMENTS.LIGHT },
      [ELEMENTS.LIGHT]: { strong: ELEMENTS.DARKNESS, weak: ELEMENTS.DARKNESS }
    };
  }

  /**
   * Generate random spiritual root
   * 生成隨機靈根
   * @param {Object} options - Generation options
   * @returns {Object} Spiritual root data
   */
  generateSpiritualRoot(options = {}) {
    const rootType = options.type || this.rollRootType();
    const elements = this.selectElements(rootType);
    const quality = options.quality || this.rollQuality();

    return {
      type: rootType,
      elements: elements,
      quality: quality,
      affinities: this.calculateAffinities(elements, quality),
      cultivationSpeed: this.calculateCultivationSpeed(rootType, quality)
    };
  }

  /**
   * Roll for spiritual root type
   * 隨機決定靈根類型
   */
  rollRootType() {
    const roll = Math.random();
    
    if (roll < 0.001) return SPECIAL_ROOTS.HEAVENLY;
    if (roll < 0.01) return SPECIAL_ROOTS.SINGLE;
    if (roll < 0.05) return SPECIAL_ROOTS.MUTANT;
    if (roll < 0.15) return SPECIAL_ROOTS.DUAL;
    if (roll < 0.35) return SPECIAL_ROOTS.TRI;
    if (roll < 0.60) return SPECIAL_ROOTS.QUAD;
    return SPECIAL_ROOTS.PENTA;
  }

  /**
   * Roll for spiritual root quality
   * 隨機決定靈根品質
   */
  rollQuality() {
    const roll = Math.random();
    
    if (roll < 0.005) return ROOT_QUALITY.DIVINE;
    if (roll < 0.05) return ROOT_QUALITY.HEAVEN_GRADE;
    if (roll < 0.20) return ROOT_QUALITY.SUPERIOR;
    if (roll < 0.50) return ROOT_QUALITY.COMMON;
    return ROOT_QUALITY.MORTAL;
  }

  /**
   * Select elements based on root type
   * 根據靈根類型選擇元素
   */
  selectElements(rootType) {
    const baseElements = Object.values(ELEMENTS).filter(e => 
      [ELEMENTS.METAL, ELEMENTS.WOOD, ELEMENTS.WATER, ELEMENTS.FIRE, ELEMENTS.EARTH].includes(e)
    );

    switch (rootType) {
      case SPECIAL_ROOTS.HEAVENLY:
        return [this.selectRandomElement()];
      
      case SPECIAL_ROOTS.SINGLE:
        return [this.selectRandomElement()];
      
      case SPECIAL_ROOTS.MUTANT:
        // Special elements
        const specialElements = [ELEMENTS.THUNDER, ELEMENTS.WIND, ELEMENTS.ICE, ELEMENTS.DARKNESS, ELEMENTS.LIGHT];
        return [specialElements[Math.floor(Math.random() * specialElements.length)]];
      
      case SPECIAL_ROOTS.DUAL:
        return this.selectRandomElements(2, baseElements);
      
      case SPECIAL_ROOTS.TRI:
        return this.selectRandomElements(3, baseElements);
      
      case SPECIAL_ROOTS.QUAD:
        return this.selectRandomElements(4, baseElements);
      
      case SPECIAL_ROOTS.PENTA:
        return [...baseElements];
      
      default:
        return [this.selectRandomElement()];
    }
  }

  /**
   * Select random element
   * 選擇隨機元素
   */
  selectRandomElement() {
    const elements = Object.values(ELEMENTS);
    return elements[Math.floor(Math.random() * elements.length)];
  }

  /**
   * Select multiple random elements
   * 選擇多個隨機元素
   */
  selectRandomElements(count, pool) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Calculate element affinities
   * 計算元素親和力
   */
  calculateAffinities(elements, quality) {
    const affinities = {};
    const baseAffinity = quality * 20;
    
    elements.forEach(element => {
      affinities[element] = baseAffinity / elements.length;
    });

    return affinities;
  }

  /**
   * Calculate cultivation speed multiplier
   * 計算修煉速度倍數
   */
  calculateCultivationSpeed(rootType, quality) {
    let baseSpeed = 1.0;

    // Type modifier
    switch (rootType) {
      case SPECIAL_ROOTS.HEAVENLY:
        baseSpeed = 5.0;
        break;
      case SPECIAL_ROOTS.SINGLE:
        baseSpeed = 3.0;
        break;
      case SPECIAL_ROOTS.MUTANT:
        baseSpeed = 2.5;
        break;
      case SPECIAL_ROOTS.DUAL:
        baseSpeed = 2.0;
        break;
      case SPECIAL_ROOTS.TRI:
        baseSpeed = 1.5;
        break;
      case SPECIAL_ROOTS.QUAD:
        baseSpeed = 1.2;
        break;
      case SPECIAL_ROOTS.PENTA:
        baseSpeed = 1.0;
        break;
    }

    // Quality modifier
    baseSpeed *= (quality * 0.3);

    return baseSpeed;
  }

  /**
   * Check element compatibility
   * 檢查元素相容性
   */
  getElementRelation(element1, element2) {
    const interaction = this.elementInteractions[element1];
    
    if (!interaction) return 'neutral';
    
    if (interaction.strong === element2) return 'strong';
    if (interaction.weak === element2) return 'weak';
    
    return 'neutral';
  }

  /**
   * Get spiritual root description
   * 獲取靈根描述
   */
  getSpiritualRootDescription(spiritualRoot) {
    const typeNames = {
      [SPECIAL_ROOTS.HEAVENLY]: '天靈根',
      [SPECIAL_ROOTS.SINGLE]: '單靈根',
      [SPECIAL_ROOTS.MUTANT]: '變異靈根',
      [SPECIAL_ROOTS.DUAL]: '雙靈根',
      [SPECIAL_ROOTS.TRI]: '三靈根',
      [SPECIAL_ROOTS.QUAD]: '四靈根',
      [SPECIAL_ROOTS.PENTA]: '五靈根'
    };

    const qualityNames = {
      [ROOT_QUALITY.DIVINE]: '神品',
      [ROOT_QUALITY.HEAVEN_GRADE]: '天品',
      [ROOT_QUALITY.SUPERIOR]: '上品',
      [ROOT_QUALITY.COMMON]: '普通',
      [ROOT_QUALITY.MORTAL]: '凡品'
    };

    return {
      type: typeNames[spiritualRoot.type] || spiritualRoot.type,
      quality: qualityNames[spiritualRoot.quality] || spiritualRoot.quality,
      elements: spiritualRoot.elements,
      cultivationSpeed: `${spiritualRoot.cultivationSpeed}x`
    };
  }
}

export default SpiritualRootSystem;
