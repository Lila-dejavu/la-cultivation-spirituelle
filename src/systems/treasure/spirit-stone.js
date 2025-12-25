/**
 * Spirit Stone System - 靈石系統
 * Manages spiritual stones as currency and cultivation resources
 * 管理靈石作為貨幣和修煉資源
 */

/**
 * Spirit stone grades
 * 靈石品階
 */
export const SPIRIT_STONE_GRADES = {
  LOW: { grade: 1, name: '下品靈石', value: 1, spiritualEnergy: 10 },
  MIDDLE: { grade: 2, name: '中品靈石', value: 100, spiritualEnergy: 1000 },
  HIGH: { grade: 3, name: '上品靈石', value: 10000, spiritualEnergy: 100000 },
  SUPREME: { grade: 4, name: '極品靈石', value: 1000000, spiritualEnergy: 10000000 },
  DIVINE: { grade: 5, name: '神品靈石', value: 100000000, spiritualEnergy: 1000000000 }
};

/**
 * Spirit stone attributes (special types)
 * 靈石屬性（特殊類型）
 */
export const SPIRIT_STONE_ATTRIBUTES = {
  PURE: 'pure',         // 純淨靈石
  FIRE: 'fire',         // 火屬性靈石
  WATER: 'water',       // 水屬性靈石
  WOOD: 'wood',         // 木屬性靈石
  METAL: 'metal',       // 金屬性靈石
  EARTH: 'earth',       // 土屬性靈石
  THUNDER: 'thunder',   // 雷屬性靈石
  WIND: 'wind',         // 風屬性靈石
  ICE: 'ice',           // 冰屬性靈石
  DARK: 'dark',         // 暗屬性靈石
  LIGHT: 'light'        // 光屬性靈石
};

/**
 * SpiritStoneSystem class
 * Manages spirit stones as both currency and cultivation resources
 */
export class SpiritStoneSystem {
  constructor() {
    this.conversionRates = this.initializeConversionRates();
  }

  /**
   * Initialize conversion rates between grades
   * 初始化品階間的轉換比率
   */
  initializeConversionRates() {
    return {
      lowToMiddle: 100,
      middleToHigh: 100,
      highToSupreme: 100,
      supremeToDivine: 100
    };
  }

  /**
   * Initialize character's spirit stone wallet
   * 初始化角色的靈石錢包
   */
  initializeWallet(character) {
    if (!character.spiritStones) {
      character.spiritStones = {
        low: 0,
        middle: 0,
        high: 0,
        supreme: 0,
        divine: 0,
        attributed: {} // Special attribute stones
      };
    }
  }

  /**
   * Add spirit stones to character
   * 為角色添加靈石
   */
  addSpiritStones(character, grade, amount, attribute = null) {
    this.initializeWallet(character);

    if (attribute) {
      if (!character.spiritStones.attributed[attribute]) {
        character.spiritStones.attributed[attribute] = {};
      }
      if (!character.spiritStones.attributed[attribute][grade]) {
        character.spiritStones.attributed[attribute][grade] = 0;
      }
      character.spiritStones.attributed[attribute][grade] += amount;
    } else {
      character.spiritStones[grade] += amount;
    }

    return {
      success: true,
      message: `獲得${amount}個${this.getGradeName(grade)}！(Obtained ${amount} ${this.getGradeName(grade)}!)`
    };
  }

  /**
   * Remove spirit stones from character
   * 從角色移除靈石
   */
  removeSpiritStones(character, grade, amount, attribute = null) {
    this.initializeWallet(character);

    let available;
    if (attribute) {
      available = character.spiritStones.attributed[attribute]?.[grade] || 0;
    } else {
      available = character.spiritStones[grade] || 0;
    }

    if (available < amount) {
      return {
        success: false,
        message: '靈石不足 (Insufficient spirit stones)'
      };
    }

    if (attribute) {
      character.spiritStones.attributed[attribute][grade] -= amount;
    } else {
      character.spiritStones[grade] -= amount;
    }

    return {
      success: true,
      message: `消耗${amount}個${this.getGradeName(grade)} (Consumed ${amount} ${this.getGradeName(grade)})`
    };
  }

  /**
   * Convert spirit stones to higher grade
   * 將靈石轉換為更高品階
   */
  convertUp(character, fromGrade, amount) {
    this.initializeWallet(character);

    const conversionKey = this.getConversionKey(fromGrade, 'up');
    if (!conversionKey) {
      return {
        success: false,
        message: '已是最高品階 (Already at highest grade)'
      };
    }

    const rate = this.conversionRates[conversionKey];
    if (amount < rate) {
      return {
        success: false,
        message: `需要至少${rate}個靈石才能轉換 (Need at least ${rate} spirit stones to convert)`
      };
    }

    const convertibleAmount = Math.floor(amount / rate);
    const requiredAmount = convertibleAmount * rate;

    // Remove lower grade stones
    const removeResult = this.removeSpiritStones(character, fromGrade, requiredAmount);
    if (!removeResult.success) {
      return removeResult;
    }

    // Add higher grade stones
    const toGrade = this.getNextGrade(fromGrade);
    this.addSpiritStones(character, toGrade, convertibleAmount);

    return {
      success: true,
      converted: convertibleAmount,
      used: requiredAmount,
      message: `成功轉換${convertibleAmount}個${this.getGradeName(toGrade)}！(Successfully converted ${convertibleAmount} ${this.getGradeName(toGrade)}!)`
    };
  }

  /**
   * Convert spirit stones to lower grade
   * 將靈石轉換為更低品階
   */
  convertDown(character, fromGrade, amount) {
    this.initializeWallet(character);

    const conversionKey = this.getConversionKey(fromGrade, 'down');
    if (!conversionKey) {
      return {
        success: false,
        message: '已是最低品階 (Already at lowest grade)'
      };
    }

    // Remove higher grade stones
    const removeResult = this.removeSpiritStones(character, fromGrade, amount);
    if (!removeResult.success) {
      return removeResult;
    }

    // Add lower grade stones
    const rate = this.conversionRates[conversionKey];
    const toGrade = this.getPreviousGrade(fromGrade);
    const convertedAmount = amount * rate;
    
    this.addSpiritStones(character, toGrade, convertedAmount);

    return {
      success: true,
      converted: convertedAmount,
      message: `成功轉換${convertedAmount}個${this.getGradeName(toGrade)}！(Successfully converted ${convertedAmount} ${this.getGradeName(toGrade)}!)`
    };
  }

  /**
   * Use spirit stones for cultivation
   * 使用靈石修煉
   */
  cultivateWithSpiritStones(character, grade, amount, attribute = null) {
    this.initializeWallet(character);

    // Check if stones are available
    const removeResult = this.removeSpiritStones(character, grade, amount, attribute);
    if (!removeResult.success) {
      return removeResult;
    }

    // Calculate spiritual energy gained
    const gradeData = this.getGradeData(grade);
    let spiritualEnergy = gradeData.spiritualEnergy * amount;

    // Attribute matching bonus
    if (attribute && character.spiritualRoot?.elements.includes(attribute)) {
      spiritualEnergy *= 1.5; // 50% bonus for matching attribute
    }

    // Apply to cultivation
    character.cultivation.spiritualPower += spiritualEnergy;

    return {
      success: true,
      spiritualEnergy: spiritualEnergy,
      message: `吸收靈石，獲得${spiritualEnergy}靈力！(Absorbed spirit stones, gained ${spiritualEnergy} spiritual power!)`
    };
  }

  /**
   * Calculate total wealth in low-grade spirit stone equivalent
   * 計算總財富（以下品靈石為單位）
   */
  calculateTotalWealth(character) {
    this.initializeWallet(character);

    let total = 0;
    
    // Standard stones
    total += character.spiritStones.low || 0;
    total += (character.spiritStones.middle || 0) * 100;
    total += (character.spiritStones.high || 0) * 10000;
    total += (character.spiritStones.supreme || 0) * 1000000;
    total += (character.spiritStones.divine || 0) * 100000000;

    // Attributed stones (worth more)
    Object.values(character.spiritStones.attributed).forEach(attrStones => {
      Object.entries(attrStones).forEach(([grade, amount]) => {
        const gradeValue = this.getGradeValue(grade);
        total += amount * gradeValue * 1.2; // 20% premium for attributed stones
      });
    });

    return Math.floor(total);
  }

  /**
   * Pay with spirit stones (automatically converts if needed)
   * 用靈石支付（必要時自動轉換）
   */
  pay(character, totalCost) {
    this.initializeWallet(character);

    const totalWealth = this.calculateTotalWealth(character);
    if (totalWealth < totalCost) {
      return {
        success: false,
        message: '靈石不足 (Insufficient spirit stones)',
        required: totalCost,
        available: totalWealth
      };
    }

    let remaining = totalCost;
    const grades = ['low', 'middle', 'high', 'supreme', 'divine'];

    // Try to pay with exact or closest denomination
    for (const grade of grades) {
      if (remaining <= 0) break;

      const gradeValue = this.getGradeValue(grade);
      const available = character.spiritStones[grade] || 0;
      const needed = Math.ceil(remaining / gradeValue);
      const toUse = Math.min(available, needed);

      if (toUse > 0) {
        this.removeSpiritStones(character, grade, toUse);
        remaining -= toUse * gradeValue;
      }
    }

    // Give change if overpaid
    if (remaining < 0) {
      this.addSpiritStones(character, 'low', Math.abs(remaining));
    }

    return {
      success: true,
      paid: totalCost,
      change: Math.abs(remaining),
      message: `支付${totalCost}下品靈石 (Paid ${totalCost} low-grade spirit stones)`
    };
  }

  /**
   * Get grade name
   * 獲取品階名稱
   */
  getGradeName(grade) {
    const gradeMap = {
      'low': SPIRIT_STONE_GRADES.LOW.name,
      'middle': SPIRIT_STONE_GRADES.MIDDLE.name,
      'high': SPIRIT_STONE_GRADES.HIGH.name,
      'supreme': SPIRIT_STONE_GRADES.SUPREME.name,
      'divine': SPIRIT_STONE_GRADES.DIVINE.name
    };
    return gradeMap[grade] || grade;
  }

  /**
   * Get grade data
   * 獲取品階資料
   */
  getGradeData(grade) {
    const gradeMap = {
      'low': SPIRIT_STONE_GRADES.LOW,
      'middle': SPIRIT_STONE_GRADES.MIDDLE,
      'high': SPIRIT_STONE_GRADES.HIGH,
      'supreme': SPIRIT_STONE_GRADES.SUPREME,
      'divine': SPIRIT_STONE_GRADES.DIVINE
    };
    return gradeMap[grade];
  }

  /**
   * Get grade value in low-grade equivalent
   * 獲取品階價值（以下品靈石為單位）
   */
  getGradeValue(grade) {
    return this.getGradeData(grade).value;
  }

  /**
   * Get conversion key for up/down conversion
   * 獲取向上/向下轉換的轉換鍵
   */
  getConversionKey(grade, direction) {
    if (direction === 'up') {
      const keys = {
        'low': 'lowToMiddle',
        'middle': 'middleToHigh',
        'high': 'highToSupreme',
        'supreme': 'supremeToDivine'
      };
      return keys[grade];
    } else {
      const keys = {
        'middle': 'lowToMiddle',
        'high': 'middleToHigh',
        'supreme': 'highToSupreme',
        'divine': 'supremeToDivine'
      };
      return keys[grade];
    }
  }

  /**
   * Get next higher grade
   * 獲取下一個更高品階
   */
  getNextGrade(grade) {
    const gradeOrder = ['low', 'middle', 'high', 'supreme', 'divine'];
    const index = gradeOrder.indexOf(grade);
    return index < gradeOrder.length - 1 ? gradeOrder[index + 1] : null;
  }

  /**
   * Get previous lower grade
   * 獲取上一個更低品階
   */
  getPreviousGrade(grade) {
    const gradeOrder = ['low', 'middle', 'high', 'supreme', 'divine'];
    const index = gradeOrder.indexOf(grade);
    return index > 0 ? gradeOrder[index - 1] : null;
  }
}

export default SpiritStoneSystem;
