/**
 * Image Manager - 圖像管理系統
 * Handles image loading, caching, and fallback management
 * 處理圖像加載、緩存和降級管理
 */

export class ImageManager {
    constructor() {
        this.images = new Map(); // Image cache
        this.loadingPromises = new Map(); // Track loading promises
        this.config = null; // Image configuration
        this.fallbackEnabled = true; // Enable CSS fallback
    }

    /**
     * Initialize image manager / 初始化圖像管理器
     * @param {Object} config - Image configuration
     */
    async initialize(config) {
        this.config = config || {};
        
        // Load configuration file if not provided
        if (Object.keys(this.config).length === 0) {
            try {
                const response = await fetch('src/data/images-config.json');
                if (response.ok) {
                    this.config = await response.json();
                }
            } catch (error) {
                console.warn('Failed to load images-config.json, using empty config:', error);
                this.config = {};
            }
        }
        
        return this;
    }

    /**
     * Get image path from config / 從配置獲取圖像路徑
     * @param {string} category - Image category (characters, enemies, items, etc.)
     * @param {string} key - Image key
     * @returns {string|null} Image path or null
     */
    getImagePath(category, key) {
        if (!this.config[category]) {
            return null;
        }
        return this.config[category][key] || null;
    }

    /**
     * Load image / 加載圖像
     * @param {string} path - Image path
     * @returns {Promise<HTMLImageElement>}
     */
    loadImage(path) {
        // Check cache
        if (this.images.has(path)) {
            return Promise.resolve(this.images.get(path));
        }

        // Check if already loading
        if (this.loadingPromises.has(path)) {
            return this.loadingPromises.get(path);
        }

        // Create loading promise
        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.images.set(path, img);
                this.loadingPromises.delete(path);
                resolve(img);
            };
            
            img.onerror = () => {
                this.loadingPromises.delete(path);
                reject(new Error(`Failed to load image: ${path}`));
            };
            
            img.src = path;
        });

        this.loadingPromises.set(path, promise);
        return promise;
    }

    /**
     * Preload multiple images / 預加載多個圖像
     * @param {Array<string>} paths - Array of image paths
     * @returns {Promise<Array>}
     */
    async preloadImages(paths) {
        const promises = paths.map(path => 
            this.loadImage(path).catch(err => {
                console.warn(`Failed to preload image: ${path}`, err);
                return null;
            })
        );
        return Promise.all(promises);
    }

    /**
     * Get image element / 獲取圖像元素
     * @param {string} category - Image category
     * @param {string} key - Image key
     * @param {Object} options - Options
     * @returns {Promise<HTMLElement>}
     */
    async getImageElement(category, key, options = {}) {
        const {
            className = 'game-image',
            fallbackEmoji = '📦',
            alt = '',
            useCssFallback = true
        } = options;

        const path = this.getImagePath(category, key);
        
        // If no path found, use CSS fallback
        if (!path) {
            return this.createFallbackElement(category, key, className, fallbackEmoji, useCssFallback);
        }

        try {
            await this.loadImage(path);
            
            const img = document.createElement('img');
            img.src = path;
            img.className = className;
            img.alt = alt || `${category}-${key}`;
            
            return img;
        } catch (error) {
            console.warn(`Failed to load image for ${category}/${key}, using fallback`, error);
            return this.createFallbackElement(category, key, className, fallbackEmoji, useCssFallback);
        }
    }

    /**
     * Create fallback element / 創建降級元素
     * @param {string} category - Image category
     * @param {string} key - Image key
     * @param {string} className - CSS class name
     * @param {string} fallbackEmoji - Fallback emoji
     * @param {boolean} useCssFallback - Use CSS fallback styling
     * @returns {HTMLElement}
     */
    createFallbackElement(category, key, className, fallbackEmoji, useCssFallback) {
        const div = document.createElement('div');
        div.className = `${className} fallback-image`;
        
        if (useCssFallback && this.fallbackEnabled) {
            // Add category-specific CSS class for styled fallback
            div.classList.add(`fallback-${category}`);
            div.classList.add(`fallback-${category}-${key}`);
        } else {
            // Just show emoji
            div.textContent = fallbackEmoji;
        }
        
        div.setAttribute('data-category', category);
        div.setAttribute('data-key', key);
        
        return div;
    }

    /**
     * Get image URL synchronously / 同步獲取圖像 URL
     * @param {string} category - Image category
     * @param {string} key - Image key
     * @param {string} fallback - Fallback emoji
     * @returns {string}
     */
    getImageUrl(category, key, fallback = '📦') {
        const path = this.getImagePath(category, key);
        return path || fallback;
    }

    /**
     * Create background image style / 創建背景圖像樣式
     * @param {string} category - Image category
     * @param {string} key - Image key
     * @returns {string}
     */
    getBackgroundImageStyle(category, key) {
        const path = this.getImagePath(category, key);
        if (path) {
            return `background-image: url('${path}')`;
        }
        return '';
    }

    /**
     * Clear cache / 清除緩存
     */
    clearCache() {
        this.images.clear();
        this.loadingPromises.clear();
    }

    /**
     * Get cache statistics / 獲取緩存統計
     * @returns {Object}
     */
    getCacheStats() {
        return {
            cachedImages: this.images.size,
            loadingImages: this.loadingPromises.size,
            categories: Object.keys(this.config)
        };
    }

    /**
     * Create image HTML with fallback / 創建帶降級的圖像 HTML
     * @param {string} imagePath - Image path
     * @param {string} altText - Alt text
     * @param {string} fallbackEmoji - Fallback emoji
     * @param {string} className - Optional CSS class
     * @returns {string} HTML string with image and fallback
     */
    createImageHTML(imagePath, altText, fallbackEmoji, className = '') {
        if (!imagePath) {
            return fallbackEmoji;
        }
        
        const classAttr = className ? ` class="${className}"` : '';
        return `<img src="${imagePath}" alt="${altText}"${classAttr} onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';" />
                <span style="display:none;">${fallbackEmoji}</span>`;
    }
}

// Export singleton instance
export const imageManager = new ImageManager();

// Auto-initialize when module is loaded
imageManager.initialize().then(() => {
    console.log('[ImageManager] Initialized', imageManager.getCacheStats());
}).catch(err => {
    console.warn('[ImageManager] Initialization failed, fallback mode enabled', err);
});

export default imageManager;
