/**
 * Audio Manager - 音效管理器
 * Manages sound effects and music (Optional)
 * 管理音效和音樂（可選）
 */

export class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.music = null;
        this.sfxVolume = 0.5;
        this.musicVolume = 0.3;
        this.enabled = true;
    }

    /**
     * Load sound / 載入音效
     * @param {string} name - Sound name
     * @param {string} url - Sound URL
     */
    async loadSound(name, url) {
        try {
            const audio = new Audio(url);
            audio.volume = this.sfxVolume;
            this.sounds.set(name, audio);
        } catch (error) {
            console.warn(`Failed to load sound: ${name}`, error);
        }
    }

    /**
     * Play sound / 播放音效
     * @param {string} name - Sound name
     */
    playSound(name) {
        if (!this.enabled) return;
        
        const sound = this.sounds.get(name);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.warn(`Failed to play sound: ${name}`, error);
            });
        }
    }

    /**
     * Play music / 播放音樂
     * @param {string} url - Music URL
     * @param {boolean} loop - Loop music
     */
    async playMusic(url, loop = true) {
        if (!this.enabled) return;
        
        try {
            if (this.music) {
                this.music.pause();
            }
            
            this.music = new Audio(url);
            this.music.volume = this.musicVolume;
            this.music.loop = loop;
            
            await this.music.play();
        } catch (error) {
            console.warn('Failed to play music:', error);
        }
    }

    /**
     * Stop music / 停止音樂
     */
    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }
    }

    /**
     * Set SFX volume / 設置音效音量
     * @param {number} volume - Volume (0-1)
     */
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.sounds.forEach(sound => {
            sound.volume = this.sfxVolume;
        });
    }

    /**
     * Set music volume / 設置音樂音量
     * @param {number} volume - Volume (0-1)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.music) {
            this.music.volume = this.musicVolume;
        }
    }

    /**
     * Toggle audio / 切換音效開關
     * @param {boolean} enabled - Enabled state
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled && this.music) {
            this.stopMusic();
        }
    }

    /**
     * Preload common sounds / 預載常用音效
     */
    preloadCommonSounds() {
        // These are placeholder paths - actual audio files would need to be added
        const sounds = {
            click: '/assets/audio/click.mp3',
            notification: '/assets/audio/notification.mp3',
            success: '/assets/audio/success.mp3',
            error: '/assets/audio/error.mp3',
            attack: '/assets/audio/attack.mp3',
            skill: '/assets/audio/skill.mp3',
            levelup: '/assets/audio/levelup.mp3',
            breakthrough: '/assets/audio/breakthrough.mp3'
        };

        // Note: These won't load unless audio files exist
        Object.entries(sounds).forEach(([name, url]) => {
            this.loadSound(name, url).catch(() => {
                // Silently fail if audio files don't exist
            });
        });
    }
}

export default AudioManager;
