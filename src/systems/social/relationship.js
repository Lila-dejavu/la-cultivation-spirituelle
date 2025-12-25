/**
 * Relationship System - 關係系統
 * Manages character relationships
 * 管理角色關係
 */

export const RELATIONSHIP_TYPES = {
  FRIEND: 'friend',
  RIVAL: 'rival',
  MASTER: 'master',
  DISCIPLE: 'disciple',
  ALLY: 'ally',
  ENEMY: 'enemy',
  LOVER: 'lover',
  FAMILY: 'family'
};

export class RelationshipSystem {
  constructor() {
    this.relationships = new Map();
  }

  createRelationship(character1Id, character2Id, type) {
    const relationshipId = this.generateId();
    
    const relationship = {
      id: relationshipId,
      character1: character1Id,
      character2: character2Id,
      type: type,
      affinity: 50,
      interactions: [],
      establishedDate: Date.now()
    };

    this.relationships.set(relationshipId, relationship);
    return relationship;
  }

  generateId() {
    return `rel_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  updateAffinity(relationshipId, change) {
    const relationship = this.relationships.get(relationshipId);
    if (!relationship) return { success: false };

    relationship.affinity += change;
    relationship.affinity = Math.max(0, Math.min(100, relationship.affinity));

    return {
      success: true,
      affinity: relationship.affinity
    };
  }

  getRelationship(character1Id, character2Id) {
    return Array.from(this.relationships.values()).find(r =>
      (r.character1 === character1Id && r.character2 === character2Id) ||
      (r.character1 === character2Id && r.character2 === character1Id)
    );
  }
}

export default RelationshipSystem;
