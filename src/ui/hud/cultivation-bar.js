/**
 * Cultivation Bar - 修為進度條
 * HUD element showing cultivation progress
 * 顯示修為進度的HUD元素
 */

export class CultivationBar {
  constructor() {
    this.visible = true;
  }

  update(character) {
    // TODO: Update progress bar
    const progress = character.cultivation.spiritualPower / character.cultivation.maxSpiritualPower;
    console.log(`Cultivation Progress: ${Math.floor(progress * 100)}%`);
  }

  render() {
    // TODO: Render cultivation bar
  }
}

export default CultivationBar;
