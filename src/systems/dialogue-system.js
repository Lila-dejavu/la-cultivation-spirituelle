/**
 * Dialogue System - 對話系統
 * 處理遊戲中的劇情對話展示和互動
 */

import { getDialogueData } from '../data/dialogues-data.js';

export class DialogueSystem {
    constructor() {
        this.currentDialogue = null;
        this.currentIndex = 0;
        this.isPlaying = false;
        this.dialogueContainer = null;
        this.onCompleteCallback = null;
    }

    /**
     * 播放對話
     * @param {string} dialogueId - 對話ID
     * @param {Function} onComplete - 完成回調
     */
    playDialogue(dialogueId, onComplete = null) {
        const dialogueData = getDialogueData(dialogueId);
        if (!dialogueData) {
            console.warn(`Dialogue not found: ${dialogueId}`);
            if (onComplete) onComplete();
            return;
        }

        this.currentDialogue = dialogueData;
        this.currentIndex = 0;
        this.isPlaying = true;
        this.onCompleteCallback = onComplete;

        this.createDialogueUI();
        this.showCurrentDialogue();
    }

    /**
     * 創建對話UI
     */
    createDialogueUI() {
        // 移除舊的對話框（如果存在）
        this.removeDialogueUI();

        // 創建對話容器
        this.dialogueContainer = document.createElement('div');
        this.dialogueContainer.className = 'dialogue-overlay';
        this.dialogueContainer.innerHTML = `
            <div class="dialogue-box">
                <div class="dialogue-portrait" id="dialogue-portrait">
                    <span class="portrait-icon" id="portrait-icon">👤</span>
                </div>
                <div class="dialogue-content">
                    <div class="dialogue-speaker" id="dialogue-speaker">旁白</div>
                    <div class="dialogue-text" id="dialogue-text">對話文字</div>
                    <div class="dialogue-controls">
                        <button class="btn secondary btn-dialogue-skip" id="btn-dialogue-skip">跳過</button>
                        <button class="btn primary btn-dialogue-next" id="btn-dialogue-next">下一步</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.dialogueContainer);

        // 添加動畫效果
        setTimeout(() => {
            this.dialogueContainer.classList.add('active');
        }, 10);

        // 綁定事件
        this.setupDialogueEvents();
    }

    /**
     * 設置對話事件
     */
    setupDialogueEvents() {
        const nextBtn = document.getElementById('btn-dialogue-next');
        const skipBtn = document.getElementById('btn-dialogue-skip');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextDialogue());
        }

        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skipDialogue());
        }

        // 空格鍵或點擊繼續
        const keyHandler = (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.nextDialogue();
            } else if (e.key === 'Escape') {
                this.skipDialogue();
            }
        };

        document.addEventListener('keydown', keyHandler);
        this.keyHandler = keyHandler; // 保存引用以便後續移除
    }

    /**
     * 顯示當前對話
     */
    showCurrentDialogue() {
        if (!this.currentDialogue || this.currentIndex >= this.currentDialogue.dialogues.length) {
            this.completeDialogue();
            return;
        }

        const dialogue = this.currentDialogue.dialogues[this.currentIndex];
        const speakerElement = document.getElementById('dialogue-speaker');
        const textElement = document.getElementById('dialogue-text');
        const portraitIcon = document.getElementById('portrait-icon');
        const portraitElement = document.getElementById('dialogue-portrait');

        // 設置說話者
        let speakerName = '旁白';
        let speakerIcon = '📖';

        switch (dialogue.speaker) {
            case 'narrator':
                speakerName = '旁白';
                speakerIcon = '📖';
                break;
            case 'player':
                speakerName = '你';
                speakerIcon = '🧑';
                break;
            case 'lin_xue':
                speakerName = dialogue.name || '林雪';
                speakerIcon = '👩';
                break;
            case 'lei_ting':
                speakerName = dialogue.name || '雷霆';
                speakerIcon = '👨';
                break;
            case 'xuan_wu':
                speakerName = dialogue.name || '玄武';
                speakerIcon = '🧔';
                break;
            case 'enemy':
                speakerName = dialogue.name || '敵人';
                speakerIcon = '👹';
                break;
            case 'voice':
                speakerName = dialogue.name || '？？？';
                speakerIcon = '❓';
                break;
            default:
                speakerName = dialogue.name || '未知';
                speakerIcon = '👤';
        }

        if (speakerElement) {
            speakerElement.textContent = speakerName;
        }

        if (portraitIcon) {
            portraitIcon.textContent = speakerIcon;
        }

        // 根據情緒設置樣式
        if (portraitElement) {
            portraitElement.className = 'dialogue-portrait';
            if (dialogue.emotion) {
                portraitElement.classList.add(`emotion-${dialogue.emotion}`);
            }
        }

        // 打字機效果顯示文字
        if (textElement) {
            this.typewriterEffect(textElement, dialogue.text);
        }
    }

    /**
     * 打字機效果
     * @param {HTMLElement} element - 目標元素
     * @param {string} text - 文字內容
     * @param {number} speed - 打字速度（毫秒）
     */
    typewriterEffect(element, text, speed = 30) {
        element.textContent = '';
        let index = 0;

        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };

        type();
    }

    /**
     * 下一段對話
     */
    nextDialogue() {
        if (!this.isPlaying) return;

        this.currentIndex++;
        this.showCurrentDialogue();
    }

    /**
     * 跳過對話
     */
    skipDialogue() {
        if (!this.isPlaying) return;
        this.completeDialogue();
    }

    /**
     * 完成對話
     */
    completeDialogue() {
        this.isPlaying = false;
        
        // 移除UI
        if (this.dialogueContainer) {
            this.dialogueContainer.classList.remove('active');
            setTimeout(() => {
                this.removeDialogueUI();
            }, 300);
        }

        // 調用完成回調
        if (this.onCompleteCallback) {
            this.onCompleteCallback();
            this.onCompleteCallback = null;
        }

        // 清理數據
        this.currentDialogue = null;
        this.currentIndex = 0;
    }

    /**
     * 移除對話UI
     */
    removeDialogueUI() {
        if (this.dialogueContainer && this.dialogueContainer.parentNode) {
            this.dialogueContainer.parentNode.removeChild(this.dialogueContainer);
        }
        this.dialogueContainer = null;

        // 移除鍵盤事件監聽
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
            this.keyHandler = null;
        }
    }

    /**
     * 檢查是否正在播放對話
     * @returns {boolean}
     */
    isDialoguePlaying() {
        return this.isPlaying;
    }
}

export default DialogueSystem;
