/**
 * Version Information - 版本資訊
 * Game version management
 * 遊戲版本管理
 */

export const VERSION = {
    major: 0,
    minor: 3,
    patch: 0,
    tag: 'alpha',
    
    // 完整版本字串
    get full() {
        return `v${this.major}.${this.minor}.${this.patch}-${this.tag}`;
    },
    
    // 簡短版本
    get short() {
        return `v${this.major}.${this.minor}.${this.patch}`;
    },
    
    // 構建日期
    buildDate: '2025-12-26',
    
    // 更新日誌
    changelog: [
        {
            version: 'v0.3.0-alpha',
            date: '2025-12-26',
            changes: [
                '修復戰鬥格子不顯示問題（CSS class 名稱不匹配）',
                '修復境界突破後頂部顯示不更新問題',
                '修復 Chrome 瀏覽器按鈕被遮擋問題',
                '優化移動端適配（iPhone 15 Safari/Chrome）',
                '添加版本號顯示功能'
            ]
        },
        {
            version: 'v0.2.0-alpha',
            date: '2025-12-25',
            changes: [
                '實裝 SRPG 戰棋系統（15×15 地圖）',
                '添加地形系統（5種地形類型）',
                '實現移動範圍計算（BFS算法）',
                '實現攻擊範圍系統',
                '添加回合制戰鬥流程',
                '實現簡單 AI 對手'
            ]
        },
        {
            version: 'v0.1.0-alpha',
            date: '2025-12-25',
            changes: [
                '實現角色創建系統',
                '實現修煉系統',
                '實現基礎戰鬥系統',
                '實現背包和技能系統',
                '添加存檔功能'
            ]
        }
    ]
};

export default VERSION;
