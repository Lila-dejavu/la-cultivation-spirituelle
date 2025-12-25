/**
 * Inventory Interface - 背包介面
 * Manages inventory and items
 * 管理背包和物品
 */

export class InventoryInterface {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.character = null;
    }

    /**
     * Initialize interface / 初始化介面
     * @param {Object} character - Character data
     */
    initialize(character) {
        this.character = character;
        this.render();
        this.setupEventListeners();
    }

    /**
     * Render inventory panel / 渲染背包面板
     */
    render() {
        const panel = document.getElementById('inventory-panel');
        if (!panel || !this.character) return;

        panel.innerHTML = `
            <div class="panel-section">
                <h2 class="panel-title">背包</h2>
                <div class="inventory-tabs">
                    <button class="tab-btn active" data-tab="all">全部</button>
                    <button class="tab-btn" data-tab="consumables">消耗品</button>
                    <button class="tab-btn" data-tab="equipment">裝備</button>
                    <button class="tab-btn" data-tab="materials">材料</button>
                </div>
            </div>

            <div class="panel-section">
                <div class="inventory-grid" id="inventory-items">
                    ${this.renderItems()}
                </div>
            </div>

            <div class="panel-section">
                <h2 class="panel-title">資源</h2>
                <div class="resource-list">
                    <div class="resource-item-large">
                        <div class="resource-icon">💎</div>
                        <div class="resource-details">
                            <h4>下品靈石</h4>
                            <p class="resource-count">${this.character.resources.spiritStones}</p>
                            <p class="resource-desc">修煉基礎貨幣</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupTabListeners();
    }

    /**
     * Setup event listeners / 設置事件監聽
     */
    setupEventListeners() {
        // Will be set up after render
    }

    /**
     * Setup tab listeners / 設置標籤監聽
     */
    setupTabListeners() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active to clicked tab
                tab.classList.add('active');
                // Filter items
                this.filterItems(tab.dataset.tab);
            });
        });
    }

    /**
     * Render items / 渲染物品
     * @param {string} filter - Item filter
     * @returns {string} HTML string
     */
    renderItems(filter = 'all') {
        const items = this.character.resources?.items || [];
        
        if (items.length === 0) {
            return `
                <div class="empty-inventory">
                    <p>背包是空的</p>
                </div>
            `;
        }

        return items.map((item, index) => {
            return this.renderItemSlot(item, index);
        }).join('');
    }

    /**
     * Render item slot / 渲染物品槽位
     * @param {Object} item - Item data
     * @param {number} index - Item index
     * @returns {string} HTML string
     */
    renderItemSlot(item, index) {
        const icon = this.getItemIcon(item.id);
        const rarity = this.getItemRarity(item.id);
        
        return `
            <div class="inventory-slot ${rarity}" data-item-index="${index}">
                <div class="item-icon">${icon}</div>
                <div class="item-name">${item.name}</div>
                ${item.quantity > 1 ? `<div class="item-quantity">${item.quantity}</div>` : ''}
                <div class="item-actions">
                    <button class="btn-use" data-item-index="${index}">使用</button>
                </div>
            </div>
        `;
    }

    /**
     * Get item icon / 獲取物品圖示
     * @param {string} itemId - Item ID
     * @returns {string} Icon emoji
     */
    getItemIcon(itemId) {
        const icons = {
            healing_pill_low: '🔴',
            mana_pill_low: '🔵',
            iron_sword: '⚔️',
            spirit_stone_low: '💎'
        };
        return icons[itemId] || '📦';
    }

    /**
     * Get item rarity class / 獲取物品稀有度類別
     * @param {string} itemId - Item ID
     * @returns {string} Rarity class
     */
    getItemRarity(itemId) {
        if (itemId.includes('_low')) return 'common';
        if (itemId.includes('_mid')) return 'uncommon';
        if (itemId.includes('_high')) return 'rare';
        return 'common';
    }

    /**
     * Filter items / 篩選物品
     * @param {string} filter - Filter type
     */
    filterItems(filter) {
        const itemsContainer = document.getElementById('inventory-items');
        if (!itemsContainer) return;

        // For now, show all items (filtering logic can be added later)
        itemsContainer.innerHTML = this.renderItems(filter);
        this.attachItemListeners();
    }

    /**
     * Attach item action listeners / 附加物品操作監聽
     */
    attachItemListeners() {
        const useButtons = document.querySelectorAll('.btn-use');
        useButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.itemIndex);
                this.useItem(index);
            });
        });

        // Add hover effect to show item details
        const slots = document.querySelectorAll('.inventory-slot');
        slots.forEach(slot => {
            slot.addEventListener('click', () => {
                const index = parseInt(slot.dataset.itemIndex);
                this.showItemDetails(index);
            });
        });
    }

    /**
     * Use item / 使用物品
     * @param {number} index - Item index
     */
    useItem(index) {
        const item = this.character.resources.items[index];
        if (!item) return;

        this.uiManager.showDialog({
            title: '使用物品',
            content: `
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">${this.getItemIcon(item.id)}</div>
                    <h3>${item.name}</h3>
                    <p style="color: var(--text-secondary); margin: 1rem 0;">
                        ${this.getItemDescription(item.id)}
                    </p>
                    <p>數量: ${item.quantity}</p>
                </div>
            `,
            confirmText: '使用',
            cancelText: '取消',
            onConfirm: () => {
                this.applyItemEffect(item);
                
                // Decrease quantity
                item.quantity--;
                if (item.quantity <= 0) {
                    this.character.resources.items.splice(index, 1);
                }
                
                // Update display
                this.render();
                this.attachItemListeners();
                
                // Save
                const event = new CustomEvent('saveGame');
                document.dispatchEvent(event);
            }
        });
    }

    /**
     * Apply item effect / 應用物品效果
     * @param {Object} item - Item data
     */
    applyItemEffect(item) {
        switch (item.id) {
            case 'healing_pill_low':
                const healAmount = 300;
                this.character.stats.health = Math.min(
                    this.character.stats.health + healAmount,
                    this.character.stats.maxHealth
                );
                this.uiManager.showNotification(`恢復了 ${healAmount} 生命值`, 'success');
                break;
                
            case 'mana_pill_low':
                const manaAmount = 200;
                this.character.stats.mana = Math.min(
                    this.character.stats.mana + manaAmount,
                    this.character.stats.maxMana
                );
                this.uiManager.showNotification(`恢復了 ${manaAmount} 靈力`, 'success');
                break;
                
            default:
                this.uiManager.showNotification('使用了物品', 'info');
        }

        // Update HUD
        this.uiManager.updateHUD(this.character);
    }

    /**
     * Get item description / 獲取物品描述
     * @param {string} itemId - Item ID
     * @returns {string} Description
     */
    getItemDescription(itemId) {
        const descriptions = {
            healing_pill_low: '恢復 300 點生命值',
            mana_pill_low: '恢復 200 點靈力',
            iron_sword: '普通的鐵劍，攻擊力 +10',
            spirit_stone_low: '修煉基礎貨幣'
        };
        return descriptions[itemId] || '神秘的物品';
    }

    /**
     * Show item details / 顯示物品詳情
     * @param {number} index - Item index
     */
    showItemDetails(index) {
        const item = this.character.resources.items[index];
        if (!item) return;

        // Simple details - could be expanded with a tooltip system
        console.log('Item details:', item);
    }

    /**
     * Update panel / 更新面板
     */
    update() {
        if (this.character) {
            this.render();
            this.attachItemListeners();
        }
    }
}

// Add CSS
const style = document.createElement('style');
style.textContent = `
    .inventory-tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .tab-btn {
        flex: 1;
        padding: 0.75rem;
        background: var(--bg-elevated);
        border: 1px solid var(--text-dim);
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .tab-btn:hover {
        border-color: var(--spirit-primary);
        color: var(--text-primary);
    }
    
    .tab-btn.active {
        background: var(--spirit-primary);
        border-color: var(--spirit-primary);
        color: var(--bg-primary);
        font-weight: bold;
    }
    
    .inventory-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
        min-height: 300px;
    }
    
    .inventory-slot {
        position: relative;
        padding: 1rem;
        background: var(--bg-elevated);
        border: 2px solid var(--text-dim);
        border-radius: var(--radius-md);
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .inventory-slot:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
    }
    
    .inventory-slot.common {
        border-color: var(--text-dim);
    }
    
    .inventory-slot.uncommon {
        border-color: var(--success);
    }
    
    .inventory-slot.rare {
        border-color: var(--info);
    }
    
    .inventory-slot.epic {
        border-color: var(--gold-primary);
    }
    
    .item-icon {
        font-size: 3rem;
        margin-bottom: 0.5rem;
    }
    
    .item-name {
        font-size: 0.875rem;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }
    
    .item-quantity {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: var(--bg-primary);
        color: var(--text-primary);
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        font-weight: bold;
    }
    
    .item-actions {
        margin-top: 0.5rem;
    }
    
    .btn-use {
        width: 100%;
        padding: 0.5rem;
        background: var(--spirit-primary);
        border: none;
        border-radius: var(--radius-sm);
        color: var(--bg-primary);
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-use:hover {
        background: var(--spirit-secondary);
        transform: scale(1.05);
    }
    
    .empty-inventory {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 300px;
        color: var(--text-dim);
        font-size: 1.25rem;
    }
    
    .resource-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .resource-item-large {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 1.5rem;
        background: var(--bg-elevated);
        border-radius: var(--radius-lg);
        border: 2px solid var(--gold-primary);
    }
    
    .resource-item-large .resource-icon {
        font-size: 3rem;
    }
    
    .resource-details h4 {
        color: var(--gold-primary);
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
    }
    
    .resource-count {
        color: var(--text-primary);
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 0.25rem;
    }
    
    .resource-desc {
        color: var(--text-secondary);
        font-size: 0.875rem;
    }
`;
document.head.appendChild(style);

export default InventoryInterface;
