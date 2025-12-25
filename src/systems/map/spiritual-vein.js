/**
 * Spiritual Vein System - 靈脈系統
 * Manages spiritual energy veins and nodes
 * 管理靈脈和靈氣節點
 */

export const VEIN_GRADES = {
  LOW: { grade: 1, name: '下品靈脈', density: 1.0 },
  MIDDLE: { grade: 2, name: '中品靈脈', density: 2.0 },
  HIGH: { grade: 3, name: '上品靈脈', density: 4.0 },
  SUPREME: { grade: 4, name: '極品靈脈', density: 8.0 },
  DIVINE: { grade: 5, name: '神品靈脈', density: 16.0 }
};

export class SpiritualVeinSystem {
  constructor() {
    this.veins = new Map();
  }

  createSpiritualVein(config) {
    const vein = {
      id: config.id || this.generateId(),
      name: config.name,
      grade: config.grade || VEIN_GRADES.LOW,
      location: config.location || {x: 0, y: 0},
      spiritualDensity: config.spiritualDensity || 1.0,
      element: config.element || null,
      controlled: null
    };

    this.veins.set(vein.id, vein);
    return vein;
  }

  generateId() {
    return `vein_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  cultivateAtVein(character, veinId, duration) {
    const vein = this.veins.get(veinId);
    if (!vein) return { success: false };

    const spiritualGain = Math.floor(
      vein.spiritualDensity * duration * 10
    );

    character.cultivation.spiritualPower += spiritualGain;

    return {
      success: true,
      gained: spiritualGain,
      message: `在${vein.name}修煉，獲得${spiritualGain}靈力！(Cultivated at ${vein.name}, gained ${spiritualGain} spiritual power!)`
    };
  }

  controlVein(sectId, veinId) {
    const vein = this.veins.get(veinId);
    if (!vein) return { success: false };

    if (vein.controlled) {
      return {
        success: false,
        message: '此靈脈已被控制 (Vein already controlled)'
      };
    }

    vein.controlled = sectId;

    return {
      success: true,
      message: `控制${vein.name}！(Controlled ${vein.name}!)`
    };
  }
}

export default SpiritualVeinSystem;
