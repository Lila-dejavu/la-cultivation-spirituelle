/**
 * Sect Mission System - 宗門任務
 * Manages sect-related missions
 * 管理宗門相關任務
 */

export const MISSION_RANKS = {
  D: { rank: 'D', contribution: 10 },
  C: { rank: 'C', contribution: 25 },
  B: { rank: 'B', contribution: 50 },
  A: { rank: 'A', contribution: 100 },
  S: { rank: 'S', contribution: 250 }
};

export class SectMissionSystem {
  constructor() {
    this.missions = new Map();
  }

  createMission(config) {
    const mission = {
      id: config.id || this.generateId(),
      name: config.name,
      rank: config.rank || MISSION_RANKS.D,
      sectId: config.sectId,
      description: config.description || '',
      objectives: config.objectives || [],
      contributionReward: config.contributionReward || 0,
      timeLimit: config.timeLimit || 86400
    };

    this.missions.set(mission.id, mission);
    return mission;
  }

  generateId() {
    return `sect_mission_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  acceptMission(character, missionId) {
    const mission = this.missions.get(missionId);
    if (!mission) return { success: false };

    if (!character.sectMissions) {
      character.sectMissions = [];
    }

    character.sectMissions.push({
      missionId: missionId,
      acceptedAt: Date.now(),
      deadline: Date.now() + (mission.timeLimit * 1000)
    });

    return {
      success: true,
      mission: mission,
      message: `接受宗門任務：${mission.name}！(Accepted sect mission: ${mission.name}!)`
    };
  }

  completeMission(character, missionId) {
    const mission = this.missions.get(missionId);
    if (!mission) return { success: false };

    return {
      success: true,
      mission: mission,
      contribution: mission.contributionReward,
      message: `完成宗門任務！獲得${mission.contributionReward}貢獻度 (Completed sect mission! Gained ${mission.contributionReward} contribution)`
    };
  }
}

export default SectMissionSystem;
