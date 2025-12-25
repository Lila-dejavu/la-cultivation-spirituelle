/**
 * Master-Disciple System - 師徒系統
 * Manages master-disciple relationships
 * 管理師徒關係
 */

export class MasterDiscipleSystem {
  constructor() {
    this.relationships = new Map();
  }

  establishRelationship(masterId, discipleId) {
    const relationshipId = this.generateId();
    
    const relationship = {
      id: relationshipId,
      masterId: masterId,
      discipleId: discipleId,
      establishedDate: Date.now(),
      affinity: 50,
      teachings: [],
      rewards: []
    };

    this.relationships.set(relationshipId, relationship);

    return {
      success: true,
      relationship: relationship,
      message: '建立師徒關係！(Master-disciple relationship established!)'
    };
  }

  generateId() {
    return `relationship_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  teachDisciple(relationshipId, teaching) {
    const relationship = this.relationships.get(relationshipId);
    
    if (!relationship) {
      return {
        success: false,
        message: '師徒關係不存在 (Relationship does not exist)'
      };
    }

    relationship.teachings.push({
      content: teaching,
      timestamp: Date.now()
    });

    relationship.affinity += 5;

    return {
      success: true,
      affinity: relationship.affinity,
      message: '傳授弟子！親密度+5 (Taught disciple! Affinity +5)'
    };
  }

  rewardDisciple(relationshipId, reward) {
    const relationship = this.relationships.get(relationshipId);
    
    if (!relationship) {
      return {
        success: false,
        message: '師徒關係不存在 (Relationship does not exist)'
      };
    }

    relationship.rewards.push({
      reward: reward,
      timestamp: Date.now()
    });

    relationship.affinity += 10;

    return {
      success: true,
      affinity: relationship.affinity,
      message: '賞賜弟子！親密度+10 (Rewarded disciple! Affinity +10)'
    };
  }

  getRelationship(masterId, discipleId) {
    return Array.from(this.relationships.values()).find(
      r => r.masterId === masterId && r.discipleId === discipleId
    );
  }
}

export default MasterDiscipleSystem;
