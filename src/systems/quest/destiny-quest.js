/**
 * Destiny Quest System - 命運之戰
 * Manages destiny and fate-related quests
 * 管理命運相關的任務
 */

export class DestinyQuestSystem {
  constructor() {
    this.destinyQuests = new Map();
  }

  createDestinyQuest(config) {
    const quest = {
      id: config.id || this.generateId(),
      name: config.name,
      description: config.description || '',
      destinyRequirement: config.destinyRequirement || 0,
      karmaRequirement: config.karmaRequirement || 0,
      objectives: config.objectives || [],
      rewards: config.rewards || {},
      consequences: config.consequences || {}
    };

    this.destinyQuests.set(quest.id, quest);
    return quest;
  }

  generateId() {
    return `destiny_quest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  checkDestiny(character) {
    const eligibleQuests = Array.from(this.destinyQuests.values()).filter(quest => {
      const destinyMatch = (character.destiny || 0) >= quest.destinyRequirement;
      const karmaMatch = (character.karma || 0) >= quest.karmaRequirement;
      return destinyMatch && karmaMatch;
    });

    if (eligibleQuests.length > 0) {
      return {
        available: true,
        quests: eligibleQuests,
        message: '命運的召喚！(Destiny calls!)'
      };
    }

    return { available: false };
  }

  acceptDestinyQuest(character, questId) {
    const quest = this.destinyQuests.get(questId);
    if (!quest) return { success: false };

    if (!character.destinyQuests) {
      character.destinyQuests = [];
    }

    character.destinyQuests.push(questId);

    return {
      success: true,
      quest: quest,
      message: `接受命運之戰：${quest.name}！(Accepted destiny quest: ${quest.name}!)`
    };
  }

  completeDestinyQuest(character, questId) {
    const quest = this.destinyQuests.get(questId);
    if (!quest) return { success: false };

    return {
      success: true,
      quest: quest,
      rewards: quest.rewards,
      consequences: quest.consequences,
      message: `完成命運之戰！(Completed destiny quest!)`
    };
  }
}

export default DestinyQuestSystem;
