/**
 * Random Event System - 隨機事件
 * Manages random encounters and events
 * 管理隨機遭遇和事件
 */

export const EVENT_TYPES = {
  ENCOUNTER: 'encounter',
  DISCOVERY: 'discovery',
  CHALLENGE: 'challenge',
  OPPORTUNITY: 'opportunity',
  CRISIS: 'crisis'
};

export class RandomEventSystem {
  constructor() {
    this.events = new Map();
    this.activeEvents = new Map();
  }

  createEvent(config) {
    const event = {
      id: config.id || this.generateId(),
      name: config.name,
      type: config.type || EVENT_TYPES.ENCOUNTER,
      description: config.description || '',
      choices: config.choices || [],
      probability: config.probability || 0.1,
      conditions: config.conditions || {}
    };

    this.events.set(event.id, event);
    return event;
  }

  generateId() {
    return `event_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  triggerRandomEvent(character, location) {
    // Filter applicable events
    const applicableEvents = Array.from(this.events.values()).filter(event => {
      return Math.random() < event.probability;
    });

    if (applicableEvents.length === 0) return null;

    const event = applicableEvents[Math.floor(Math.random() * applicableEvents.length)];
    
    const eventInstance = {
      ...event,
      instanceId: this.generateId(),
      triggeredAt: Date.now()
    };

    this.activeEvents.set(eventInstance.instanceId, eventInstance);

    return {
      event: eventInstance,
      message: `觸發隨機事件：${event.name}！(Triggered random event: ${event.name}!)`
    };
  }

  makeChoice(instanceId, choiceId) {
    const event = this.activeEvents.get(instanceId);
    if (!event) return { success: false };

    const choice = event.choices.find(c => c.id === choiceId);
    if (!choice) return { success: false };

    this.activeEvents.delete(instanceId);

    return {
      success: true,
      outcome: choice.outcome,
      message: choice.resultMessage || '做出選擇！(Choice made!)'
    };
  }
}

export default RandomEventSystem;
