/**
 * Main Quest System - 主線任務
 * Manages main storyline quests
 * 管理主線劇情任務
 */

export const QUEST_STATES = {
  LOCKED: 'locked',
  AVAILABLE: 'available',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export class MainQuestSystem {
  constructor() {
    this.quests = new Map();
  }

  createQuest(config) {
    const quest = {
      id: config.id || this.generateId(),
      name: config.name,
      chapter: config.chapter || 1,
      description: config.description || '',
      objectives: config.objectives || [],
      rewards: config.rewards || {},
      prerequisites: config.prerequisites || [],
      state: QUEST_STATES.LOCKED,
      progress: {}
    };

    this.quests.set(quest.id, quest);
    return quest;
  }

  generateId() {
    return `main_quest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  unlockQuest(questId) {
    const quest = this.quests.get(questId);
    if (!quest) return { success: false };

    quest.state = QUEST_STATES.AVAILABLE;
    return {
      success: true,
      quest: quest,
      message: `解鎖主線任務：${quest.name}！(Unlocked main quest: ${quest.name}!)`
    };
  }

  acceptQuest(character, questId) {
    const quest = this.quests.get(questId);
    if (!quest || quest.state !== QUEST_STATES.AVAILABLE) {
      return { success: false };
    }

    quest.state = QUEST_STATES.ACTIVE;
    
    if (!character.activeQuests) {
      character.activeQuests = [];
    }
    character.activeQuests.push(questId);

    return {
      success: true,
      quest: quest,
      message: `接受任務：${quest.name}！(Accepted quest: ${quest.name}!)`
    };
  }

  updateProgress(questId, objectiveId, progress) {
    const quest = this.quests.get(questId);
    if (!quest || quest.state !== QUEST_STATES.ACTIVE) {
      return { success: false };
    }

    if (!quest.progress) {
      quest.progress = {};
    }

    quest.progress[objectiveId] = progress;

    // Check if all objectives completed
    const allCompleted = quest.objectives.every(obj => 
      quest.progress[obj.id] >= obj.required
    );

    if (allCompleted) {
      return this.completeQuest(questId);
    }

    return {
      success: true,
      progress: quest.progress
    };
  }

  completeQuest(questId) {
    const quest = this.quests.get(questId);
    if (!quest) return { success: false };

    quest.state = QUEST_STATES.COMPLETED;

    return {
      success: true,
      quest: quest,
      rewards: quest.rewards,
      message: `完成任務：${quest.name}！(Completed quest: ${quest.name}!)`
    };
  }

  getActiveQuests(character) {
    if (!character.activeQuests) return [];
    
    return character.activeQuests.map(id => this.quests.get(id));
  }
}

export default MainQuestSystem;
