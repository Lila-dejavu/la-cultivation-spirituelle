/**
 * Sect Manager System - 宗門管理
 * Manages sect operations and administration
 * 管理宗門運營和管理
 */

/**
 * Sect ranks
 * 宗門等級
 */
export const SECT_RANKS = {
  MINOR: { rank: 1, name: '小門派', maxMembers: 50 },
  MEDIUM: { rank: 2, name: '中型宗門', maxMembers: 200 },
  MAJOR: { rank: 3, name: '大宗門', maxMembers: 1000 },
  SUPER: { rank: 4, name: '超級宗門', maxMembers: 5000 },
  SACRED: { rank: 5, name: '聖地', maxMembers: 20000 }
};

/**
 * Sect positions
 * 宗門職位
 */
export const SECT_POSITIONS = {
  SECT_MASTER: 'sect_master',       // 掌門
  ELDER: 'elder',                   // 長老
  PEAK_MASTER: 'peak_master',       // 峰主
  CORE_DISCIPLE: 'core_disciple',   // 核心弟子
  INNER_DISCIPLE: 'inner_disciple', // 內門弟子
  OUTER_DISCIPLE: 'outer_disciple'  // 外門弟子
};

/**
 * SectManagerSystem class
 * Manages sect creation and administration
 */
export class SectManagerSystem {
  constructor() {
    this.sects = new Map();
  }

  /**
   * Create sect
   * 創建宗門
   */
  createSect(config) {
    const sect = {
      id: config.id || this.generateId(),
      name: config.name,
      rank: config.rank || SECT_RANKS.MINOR,
      founder: config.founder,
      foundedDate: Date.now(),
      members: new Map(),
      resources: {
        spiritStones: config.resources?.spiritStones || 0,
        materials: config.resources?.materials || {},
        territory: config.resources?.territory || []
      },
      facilities: {
        library: { level: 1 },
        treasury: { level: 1 },
        training_grounds: { level: 1 },
        alchemy_hall: { level: 1 },
        refining_hall: { level: 1 }
      },
      techniques: [],
      reputation: 0,
      alliances: [],
      enemies: []
    };

    // Add founder as sect master
    this.addMember(sect, config.founder, SECT_POSITIONS.SECT_MASTER);

    this.sects.set(sect.id, sect);
    return sect;
  }

  /**
   * Generate unique sect ID
   * 生成唯一宗門ID
   */
  generateId() {
    return `sect_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * Add member to sect
   * 添加成員到宗門
   */
  addMember(sect, character, position = SECT_POSITIONS.OUTER_DISCIPLE) {
    if (sect.members.size >= sect.rank.maxMembers) {
      return {
        success: false,
        message: '宗門人數已滿 (Sect is at maximum capacity)'
      };
    }

    sect.members.set(character.id, {
      character: character,
      position: position,
      joinDate: Date.now(),
      contribution: 0,
      missions: []
    });

    return {
      success: true,
      message: `${character.name}加入${sect.name}！(${character.name} joined ${sect.name}!)`
    };
  }

  /**
   * Remove member from sect
   * 從宗門移除成員
   */
  removeMember(sect, characterId) {
    if (!sect.members.has(characterId)) {
      return {
        success: false,
        message: '此成員不在宗門中 (Member not in sect)'
      };
    }

    const member = sect.members.get(characterId);
    
    // Cannot remove sect master directly
    if (member.position === SECT_POSITIONS.SECT_MASTER) {
      return {
        success: false,
        message: '無法移除掌門 (Cannot remove sect master)'
      };
    }

    sect.members.delete(characterId);

    return {
      success: true,
      message: `${member.character.name}離開${sect.name} (${member.character.name} left ${sect.name})`
    };
  }

  /**
   * Promote member
   * 晉升成員
   */
  promoteMember(sect, characterId) {
    if (!sect.members.has(characterId)) {
      return {
        success: false,
        message: '此成員不在宗門中 (Member not in sect)'
      };
    }

    const member = sect.members.get(characterId);
    const newPosition = this.getNextPosition(member.position);

    if (!newPosition) {
      return {
        success: false,
        message: '已是最高職位 (Already at highest position)'
      };
    }

    member.position = newPosition;

    return {
      success: true,
      position: newPosition,
      message: `${member.character.name}晉升為${newPosition}！(${member.character.name} promoted to ${newPosition}!)`
    };
  }

  /**
   * Get next position in hierarchy
   * 獲取階層中的下一個職位
   */
  getNextPosition(currentPosition) {
    const hierarchy = [
      SECT_POSITIONS.OUTER_DISCIPLE,
      SECT_POSITIONS.INNER_DISCIPLE,
      SECT_POSITIONS.CORE_DISCIPLE,
      SECT_POSITIONS.PEAK_MASTER,
      SECT_POSITIONS.ELDER,
      SECT_POSITIONS.SECT_MASTER
    ];

    const currentIndex = hierarchy.indexOf(currentPosition);
    if (currentIndex === -1 || currentIndex >= hierarchy.length - 1) {
      return null;
    }

    return hierarchy[currentIndex + 1];
  }

  /**
   * Upgrade sect facility
   * 升級宗門設施
   */
  upgradeFacility(sect, facilityName, cost = {}) {
    if (!sect.facilities[facilityName]) {
      return {
        success: false,
        message: '設施不存在 (Facility does not exist)'
      };
    }

    const facility = sect.facilities[facilityName];
    const maxLevel = 10;

    if (facility.level >= maxLevel) {
      return {
        success: false,
        message: '已達最高等級 (Already at maximum level)'
      };
    }

    // Check resources
    // TODO: Implement resource checking

    facility.level++;

    return {
      success: true,
      level: facility.level,
      message: `${facilityName}升級至${facility.level}級！(${facilityName} upgraded to level ${facility.level}!)`
    };
  }

  /**
   * Upgrade sect rank
   * 提升宗門等級
   */
  upgradeSectRank(sect, requirements = {}) {
    const ranks = [
      SECT_RANKS.MINOR,
      SECT_RANKS.MEDIUM,
      SECT_RANKS.MAJOR,
      SECT_RANKS.SUPER,
      SECT_RANKS.SACRED
    ];

    const currentIndex = ranks.findIndex(r => r.rank === sect.rank.rank);
    
    if (currentIndex === -1 || currentIndex >= ranks.length - 1) {
      return {
        success: false,
        message: '已是最高等級 (Already at maximum rank)'
      };
    }

    // Check requirements
    // TODO: Implement requirement checking

    sect.rank = ranks[currentIndex + 1];

    return {
      success: true,
      rank: sect.rank,
      message: `${sect.name}晉升為${sect.rank.name}！(${sect.name} promoted to ${sect.rank.name}!)`
    };
  }

  /**
   * Get sect information
   * 獲取宗門資訊
   */
  getSectInfo(sectId) {
    const sect = this.sects.get(sectId);
    
    if (!sect) {
      return null;
    }

    return {
      name: sect.name,
      rank: sect.rank.name,
      memberCount: sect.members.size,
      maxMembers: sect.rank.maxMembers,
      reputation: sect.reputation,
      facilities: sect.facilities,
      allianceCount: sect.alliances.length,
      enemyCount: sect.enemies.length
    };
  }

  /**
   * Get member list
   * 獲取成員列表
   */
  getMemberList(sectId, position = null) {
    const sect = this.sects.get(sectId);
    
    if (!sect) {
      return [];
    }

    const members = Array.from(sect.members.values());

    if (position) {
      return members.filter(m => m.position === position);
    }

    return members;
  }
}

export default SectManagerSystem;
