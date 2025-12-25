/**
 * Town Scene - 城鎮場景
 * Scene for town interactions and shops
 * 城鎮互動和商店的場景
 */

export class TownScene {
  constructor() {
    this.name = 'Town Scene';
    this.npcs = [];
    this.shops = [];
  }

  create() {
    // TODO: Initialize town
    console.log('Town Scene created');
  }

  update(delta) {
    // TODO: Update town logic
  }

  interactWithNPC(npcId) {
    // TODO: NPC interaction
    console.log(`Interacting with NPC: ${npcId}`);
  }

  enterShop(shopId) {
    // TODO: Open shop interface
    console.log(`Entering shop: ${shopId}`);
  }
}

export default TownScene;
