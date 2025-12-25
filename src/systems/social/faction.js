/**
 * Faction System - 勢力系統
 * Manages factions and organizations
 * 管理勢力和組織
 */

export const FACTION_TYPES = {
  RIGHTEOUS: 'righteous',
  DEMONIC: 'demonic',
  NEUTRAL: 'neutral',
  HIDDEN: 'hidden'
};

export class FactionSystem {
  constructor() {
    this.factions = new Map();
  }

  createFaction(config) {
    const faction = {
      id: config.id || this.generateId(),
      name: config.name,
      type: config.type || FACTION_TYPES.NEUTRAL,
      description: config.description || '',
      leader: config.leader || null,
      members: new Map(),
      allies: [],
      enemies: [],
      influence: 0
    };

    this.factions.set(faction.id, faction);
    return faction;
  }

  generateId() {
    return `faction_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  joinFaction(factionId, characterId) {
    const faction = this.factions.get(factionId);
    if (!faction) return { success: false };

    faction.members.set(characterId, {
      joinDate: Date.now(),
      rank: 'member'
    });

    return {
      success: true,
      message: `加入${faction.name}！(Joined ${faction.name}!)`
    };
  }
}

export default FactionSystem;
