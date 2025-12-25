/**
 * Side Quest System - 支線任務
 * Manages side quests and optional content
 * 管理支線任務和可選內容
 */

export const SIDE_QUEST_TYPES = {
  COLLECTION: 'collection',
  EXPLORATION: 'exploration',
  COMBAT: 'combat',
  SOCIAL: 'social',
  CRAFTING: 'crafting'
};

export class SideQuestSystem {
  constructor() {
    this.quests = new Map();
  }

  createSideQuest(config) {
    const quest = {
      id: config.id || this.generateId(),
      name: config.name,
      type: config.type || SIDE_QUEST_TYPES.COLLECTION,
      description: config.description || '',
      objectives: config.objectives || [],
      rewards: config.rewards || {},
      timeLimit: config.timeLimit || null,
      repeatable: config.repeatable || false,
      state: 'available'
    };

    this.quests.set(quest.id, quest);
    return quest;
  }

  generateId() {
    return `side_quest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  acceptQuest(character, questId) {
    const quest = this.quests.get(questId);
    if (!quest) return { success: false };

    if (!character.sideQuests) {
      character.sideQuests = [];
    }

    character.sideQuests.push({
      questId: questId,
      acceptedAt: Date.now(),
      progress: {}
    });

    return {
      success: true,
      quest: quest,
      message: `接受支線任務：${quest.name}！(Accepted side quest: ${quest.name}!)`
    };
  }

  getAvailableQuests(character) {
    return Array.from(this.quests.values()).filter(q => 
      q.state === 'available' || q.repeatable
    );
  }
}

export default SideQuestSystem;
