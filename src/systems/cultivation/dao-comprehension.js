/**
 * Dao Comprehension System - 道悟系統
 * Manages understanding and mastery of the Dao
 * 管理對道的理解和掌握
 */

/**
 * Dao paths/types
 * 道的類型
 */
export const DAO_PATHS = {
  SWORD: 'sword',           // 劍道
  SABER: 'saber',           // 刀道
  ALCHEMY: 'alchemy',       // 丹道
  FORMATION: 'formation',   // 陣道
  TALISMAN: 'talisman',     // 符道
  SLAUGHTER: 'slaughter',   // 殺戮之道
  LIFE: 'life',             // 生命之道
  DEATH: 'death',           // 死亡之道
  TIME: 'time',             // 時間之道
  SPACE: 'space',           // 空間之道
  KARMA: 'karma',           // 因果之道
  NATURE: 'nature',         // 自然之道
  BALANCE: 'balance',       // 平衡之道
  CHAOS: 'chaos'            // 混沌之道
};

/**
 * Dao comprehension levels
 * 道悟等級
 */
export const COMPREHENSION_LEVELS = {
  INITIATE: { level: 1, name: '初窺門徑', progress: 0 },      // Just beginning
  NOVICE: { level: 2, name: '略有小成', progress: 100 },      // Small achievement
  ADEPT: { level: 3, name: '融會貫通', progress: 500 },       // Thorough understanding
  EXPERT: { level: 4, name: '大成境界', progress: 2000 },     // Great achievement
  MASTER: { level: 5, name: '登峰造極', progress: 5000 },     // Peak mastery
  GRANDMASTER: { level: 6, name: '返璞歸真', progress: 10000 }, // Return to simplicity
  SAGE: { level: 7, name: '天人合一', progress: 20000 },      // Unity with heaven
  IMMORTAL: { level: 8, name: '道法自然', progress: 50000 }   // Natural law
};

/**
 * DaoComprehensionSystem class
 * Manages character's understanding of various Dao paths
 */
export class DaoComprehensionSystem {
  constructor() {
    this.comprehensionLevels = Object.values(COMPREHENSION_LEVELS);
  }

  /**
   * Initialize Dao comprehension for character
   * 初始化角色的道悟
   * @param {Object} character - Character object
   */
  initializeComprehension(character) {
    if (!character.daoComprehension) {
      character.daoComprehension = {
        paths: {},
        insights: [],
        enlightenmentPoints: 0
      };
    }
  }

  /**
   * Add or update Dao path comprehension
   * 添加或更新道的領悟
   * @param {Object} character - Character object
   * @param {string} path - Dao path
   * @param {number} progress - Progress to add
   */
  addComprehension(character, path, progress) {
    this.initializeComprehension(character);

    if (!character.daoComprehension.paths[path]) {
      character.daoComprehension.paths[path] = {
        path: path,
        level: 1,
        progress: 0,
        insights: []
      };
    }

    const pathData = character.daoComprehension.paths[path];
    pathData.progress += progress;

    // Check for level up
    const newLevel = this.checkLevelUp(pathData);
    if (newLevel > pathData.level) {
      const result = this.levelUpPath(character, path, newLevel);
      return result;
    }

    return {
      path: path,
      level: pathData.level,
      progress: pathData.progress,
      levelUp: false
    };
  }

  /**
   * Check if path should level up
   * 檢查道是否應該升級
   */
  checkLevelUp(pathData) {
    for (let i = this.comprehensionLevels.length - 1; i >= 0; i--) {
      const level = this.comprehensionLevels[i];
      if (pathData.progress >= level.progress) {
        return level.level;
      }
    }
    return 1;
  }

  /**
   * Level up Dao path
   * 道悟升級
   */
  levelUpPath(character, path, newLevel) {
    const pathData = character.daoComprehension.paths[path];
    const oldLevel = pathData.level;
    pathData.level = newLevel;

    // Grant enlightenment points
    const pointsGained = (newLevel - oldLevel) * 10;
    character.daoComprehension.enlightenmentPoints += pointsGained;

    // Grant insights
    const insight = this.grantInsight(character, path, newLevel);

    return {
      path: path,
      oldLevel: oldLevel,
      newLevel: newLevel,
      levelUp: true,
      insight: insight,
      enlightenmentPoints: pointsGained
    };
  }

  /**
   * Grant insight at level up
   * 在升級時獲得頓悟
   */
  grantInsight(character, path, level) {
    const insight = {
      path: path,
      level: level,
      timestamp: Date.now(),
      effect: this.getInsightEffect(path, level)
    };

    character.daoComprehension.paths[path].insights.push(insight);
    character.daoComprehension.insights.push(insight);

    return insight;
  }

  /**
   * Get insight effect based on path and level
   * 根據道和等級獲取頓悟效果
   */
  getInsightEffect(path, level) {
    const effects = {
      [DAO_PATHS.SWORD]: {
        damage: level * 5,
        critChance: level * 2,
        description: '劍意增強 (Sword intent strengthened)'
      },
      [DAO_PATHS.ALCHEMY]: {
        successRate: level * 3,
        qualityBonus: level * 2,
        description: '煉丹精進 (Alchemy mastery improved)'
      },
      [DAO_PATHS.FORMATION]: {
        power: level * 4,
        range: level * 1,
        description: '陣法威力提升 (Formation power increased)'
      },
      [DAO_PATHS.TIME]: {
        cooldownReduction: level * 2,
        hasteBonus: level * 3,
        description: '時間感知增強 (Time perception enhanced)'
      },
      [DAO_PATHS.SPACE]: {
        mobility: level * 5,
        evasion: level * 3,
        description: '空間掌握提升 (Space mastery increased)'
      }
      // TODO: Add more path-specific effects
    };

    return effects[path] || {
      generic: level * 2,
      description: '道悟加深 (Dao comprehension deepened)'
    };
  }

  /**
   * Trigger enlightenment event
   * 觸發頓悟事件
   * @param {Object} character - Character object
   * @param {string} path - Dao path (optional, random if not specified)
   * @returns {Object} Enlightenment result
   */
  triggerEnlightenment(character, path = null) {
    this.initializeComprehension(character);

    // Select path
    if (!path) {
      const availablePaths = Object.keys(character.daoComprehension.paths);
      if (availablePaths.length === 0) {
        // First enlightenment - choose based on character
        path = this.selectInitialPath(character);
      } else {
        // Random existing path
        path = availablePaths[Math.floor(Math.random() * availablePaths.length)];
      }
    }

    // Grant significant progress
    const progressGained = Math.floor(Math.random() * 500) + 500;
    const result = this.addComprehension(character, path, progressGained);

    return {
      ...result,
      enlightenment: true,
      message: `頓悟！對${path}的理解大幅提升！(Enlightenment! Understanding of ${path} greatly increased!)`
    };
  }

  /**
   * Select initial Dao path for character
   * 為角色選擇初始道路
   */
  selectInitialPath(character) {
    // TODO: Base on character class, spiritual root, or preferences
    const commonPaths = [
      DAO_PATHS.SWORD,
      DAO_PATHS.ALCHEMY,
      DAO_PATHS.FORMATION,
      DAO_PATHS.NATURE
    ];

    return commonPaths[Math.floor(Math.random() * commonPaths.length)];
  }

  /**
   * Get Dao comprehension summary
   * 獲取道悟總結
   */
  getComprehensionSummary(character) {
    this.initializeComprehension(character);

    const paths = Object.values(character.daoComprehension.paths);
    const totalPaths = paths.length;
    const highestLevel = Math.max(...paths.map(p => p.level), 0);
    
    return {
      totalPaths: totalPaths,
      highestLevel: highestLevel,
      enlightenmentPoints: character.daoComprehension.enlightenmentPoints,
      paths: paths.map(p => ({
        name: p.path,
        level: p.level,
        levelName: this.getLevelName(p.level),
        progress: p.progress,
        nextLevelProgress: this.getNextLevelProgress(p.level)
      }))
    };
  }

  /**
   * Get level name by level number
   * 根據等級數字獲取等級名稱
   */
  getLevelName(level) {
    const levelData = this.comprehensionLevels.find(l => l.level === level);
    return levelData ? levelData.name : '未知';
  }

  /**
   * Get progress needed for next level
   * 獲取下一級所需進度
   */
  getNextLevelProgress(currentLevel) {
    const nextLevel = this.comprehensionLevels.find(l => l.level === currentLevel + 1);
    return nextLevel ? nextLevel.progress : null;
  }

  /**
   * Check if character can comprehend specific Dao
   * 檢查角色是否能領悟特定的道
   */
  canComprehendDao(character, path) {
    // Some Daos require certain realm or conditions
    const requirements = {
      [DAO_PATHS.TIME]: { minRealm: 'nascent_soul' },
      [DAO_PATHS.SPACE]: { minRealm: 'nascent_soul' },
      [DAO_PATHS.KARMA]: { minRealm: 'soul_transform' },
      [DAO_PATHS.CHAOS]: { minRealm: 'tribulation' }
    };

    const requirement = requirements[path];
    if (!requirement) return true;

    // TODO: Check realm requirements
    return true;
  }

  /**
   * Apply Dao comprehension bonuses to character
   * 將道悟加成應用到角色
   */
  applyDaoBonuses(character) {
    this.initializeComprehension(character);

    const bonuses = {
      damage: 0,
      defense: 0,
      speed: 0,
      critChance: 0,
      comprehensionSpeed: 0
    };

    Object.values(character.daoComprehension.paths).forEach(path => {
      const effect = this.getInsightEffect(path.path, path.level);
      
      // Accumulate bonuses
      if (effect.damage) bonuses.damage += effect.damage;
      if (effect.critChance) bonuses.critChance += effect.critChance;
      // Add more bonus accumulation as needed
    });

    return bonuses;
  }
}

export default DaoComprehensionSystem;
