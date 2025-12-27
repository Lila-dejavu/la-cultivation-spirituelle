/**
 * Image Asset Manager - 圖像資源管理器
 * Handles image preloading, caching, and sprite sheet management
 * 處理圖像預加載、緩存和精靈圖管理
 */

export class ImageAssetManager {
    constructor() {
        this.cache = new Map();
        this.spriteSheets = new Map();
        this.loadingQueue = [];
        this.isLoading = false;
    }

    /**
     * Preload single image / 預加載單張圖片
     * @param {string} url - Image URL
     * @param {string} key - Cache key
     * @returns {Promise<HTMLImageElement>}
     */
    preloadImage(url, key = url) {
        // Check if already cached
        if (this.cache.has(key)) {
            return Promise.resolve(this.cache.get(key));
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.cache.set(key, img);
                resolve(img);
            };

            img.onerror = (error) => {
                console.error(`Failed to load image: ${url}`, error);
                reject(error);
            };

            img.src = url;
        });
    }

    /**
     * Preload multiple images / 預加載多張圖片
     * @param {Array<{url: string, key?: string}>} images - Array of image configs
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<Array<HTMLImageElement>>}
     */
    async preloadImages(images, onProgress = null) {
        const total = images.length;
        let loaded = 0;

        const promises = images.map(async (config) => {
            const { url, key = url } = config;
            try {
                const img = await this.preloadImage(url, key);
                loaded++;
                if (onProgress) {
                    onProgress(loaded, total);
                }
                return img;
            } catch (error) {
                loaded++;
                if (onProgress) {
                    onProgress(loaded, total);
                }
                return null;
            }
        });

        return Promise.all(promises);
    }

    /**
     * Get cached image / 獲取緩存圖片
     * @param {string} key - Cache key
     * @returns {HTMLImageElement|null}
     */
    getImage(key) {
        return this.cache.get(key) || null;
    }

    /**
     * Create sprite sheet / 創建精靈圖
     * @param {string} key - Sprite sheet key
     * @param {HTMLImageElement} image - Source image
     * @param {Object} config - Sprite configuration
     */
    createSpriteSheet(key, image, config) {
        const { frameWidth, frameHeight, frames } = config;
        
        this.spriteSheets.set(key, {
            image,
            frameWidth,
            frameHeight,
            frames: frames || []
        });
    }

    /**
     * Draw sprite from sprite sheet / 從精靈圖繪製精靈
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} sheetKey - Sprite sheet key
     * @param {number} frameIndex - Frame index
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Draw width
     * @param {number} height - Draw height
     */
    drawSprite(ctx, sheetKey, frameIndex, x, y, width, height) {
        const sheet = this.spriteSheets.get(sheetKey);
        if (!sheet) {
            console.warn(`Sprite sheet not found: ${sheetKey}`);
            return;
        }

        const { image, frameWidth, frameHeight, frames } = sheet;
        
        // Calculate source position
        let sx, sy;
        if (frames.length > 0 && frames[frameIndex]) {
            sx = frames[frameIndex].x;
            sy = frames[frameIndex].y;
        } else {
            const cols = Math.floor(image.width / frameWidth);
            sx = (frameIndex % cols) * frameWidth;
            sy = Math.floor(frameIndex / cols) * frameHeight;
        }

        ctx.drawImage(
            image,
            sx, sy, frameWidth, frameHeight,
            x, y, width, height
        );
    }

    /**
     * Create optimized off-screen canvas / 創建優化的離屏畫布
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {Object} Canvas and context
     */
    createOffscreenCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d', {
            alpha: true,
            desynchronized: true,
            willReadFrequently: false
        });

        return { canvas, ctx };
    }

    /**
     * Clear cache / 清除緩存
     * @param {string} key - Optional specific key to clear
     */
    clearCache(key = null) {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }

    /**
     * Get cache size / 獲取緩存大小
     * @returns {number} Number of cached images
     */
    getCacheSize() {
        return this.cache.size;
    }

    /**
     * Compress image quality for better performance / 壓縮圖片質量以提升性能
     * @param {HTMLImageElement} image - Source image
     * @param {number} quality - Quality (0-1)
     * @returns {Promise<Blob>}
     */
    async compressImage(image, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            
            canvas.toBlob(
                (blob) => resolve(blob),
                'image/jpeg',
                quality
            );
        });
    }

    /**
     * Create data URL from image / 從圖片創建數據URL
     * @param {HTMLImageElement} image - Source image
     * @param {string} type - MIME type
     * @param {number} quality - Quality (0-1)
     * @returns {string} Data URL
     */
    imageToDataURL(image, type = 'image/png', quality = 1.0) {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        
        return canvas.toDataURL(type, quality);
    }
}

export default ImageAssetManager;
