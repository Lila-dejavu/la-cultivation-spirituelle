/**
 * Secret Realm System - 秘境系統
 * Manages secret realms and hidden dungeons
 * 管理秘境和隱藏地城
 */

export const REALM_TYPES = {
  INHERITANCE: 'inheritance',
  TREASURE: 'treasure',
  TRIAL: 'trial',
  ANCIENT_RUINS: 'ancient_ruins',
  MYSTIC_LAND: 'mystic_land'
};

export class SecretRealmSystem {
  constructor() {
    this.realms = new Map();
  }

  createSecretRealm(config) {
    const realm = {
      id: config.id || this.generateId(),
      name: config.name,
      type: config.type || REALM_TYPES.TREASURE,
      requiredLevel: config.requiredLevel || 1,
      dangers: config.dangers || [],
      treasures: config.treasures || [],
      timeLimitDays: config.timeLimitDays || 7,
      discovered: false,
      entries: 0
    };

    this.realms.set(realm.id, realm);
    return realm;
  }

  generateId() {
    return `secret_realm_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  discoverSecretRealm(realmId) {
    const realm = this.realms.get(realmId);
    if (!realm) return { success: false };

    realm.discovered = true;

    return {
      success: true,
      realm: realm,
      message: `發現秘境：${realm.name}！(Discovered secret realm: ${realm.name}!)`
    };
  }

  enterSecretRealm(character, realmId) {
    const realm = this.realms.get(realmId);
    if (!realm) return { success: false };

    if (!realm.discovered) {
      return {
        success: false,
        message: '秘境尚未發現 (Secret realm not yet discovered)'
      };
    }

    if (character.level < realm.requiredLevel) {
      return {
        success: false,
        message: '修為不足 (Cultivation level insufficient)'
      };
    }

    realm.entries++;

    return {
      success: true,
      realm: realm,
      message: `進入${realm.name}！(Entered ${realm.name}!)`
    };
  }
}

export default SecretRealmSystem;
