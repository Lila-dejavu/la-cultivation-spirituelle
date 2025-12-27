/**
 * Graphics Optimization Integration Example - 圖形優化集成示例
 * Example code for using the graphics optimization utilities
 * 使用圖形優化工具的示例代碼
 */

import AnimationSystem from './animation-system.js';
import ImageAssetManager from './image-asset-manager.js';
import PerformanceMonitor from './performance-monitor.js';

/**
 * Initialize graphics optimization systems / 初始化圖形優化系統
 */
export function initializeGraphicsOptimization() {
    // 1. Initialize Animation System
    const animationSystem = new AnimationSystem();
    animationSystem.initializeCanvas('game-interface');
    animationSystem.startAnimationLoop();

    // 2. Initialize Image Asset Manager
    const assetManager = new ImageAssetManager();
    
    // 3. Initialize Performance Monitor (optional, for development)
    const perfMonitor = new PerformanceMonitor();
    // perfMonitor.start(true); // Show FPS display
    
    return {
        animationSystem,
        assetManager,
        perfMonitor
    };
}

/**
 * Example: Preload game images / 示例：預加載遊戲圖片
 */
export async function preloadGameAssets(assetManager) {
    const images = [
        // Add your image assets here
        // { url: 'assets/characters/player.png', key: 'player' },
        // { url: 'assets/backgrounds/main.jpg', key: 'main-bg' },
        // { url: 'assets/ui/buttons.png', key: 'buttons' }
    ];

    if (images.length === 0) {
        console.log('No images to preload');
        return;
    }

    console.log('Preloading assets...');
    
    await assetManager.preloadImages(images, (loaded, total) => {
        const progress = (loaded / total) * 100;
        console.log(`Loading progress: ${progress.toFixed(0)}%`);
        
        // Update loading progress bar
        const progressBar = document.getElementById('loading-progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    });

    console.log('All assets loaded!');
}

/**
 * Example: Create sprite sheet / 示例：創建精靈圖
 */
export function setupSpriteSheet(assetManager, imageKey) {
    const image = assetManager.getImage(imageKey);
    if (!image) {
        console.warn(`Image not found: ${imageKey}`);
        return;
    }

    assetManager.createSpriteSheet('character-sprites', image, {
        frameWidth: 64,
        frameHeight: 64,
        frames: [
            { x: 0, y: 0 },    // idle
            { x: 64, y: 0 },   // walk1
            { x: 128, y: 0 },  // walk2
            { x: 192, y: 0 }   // attack
        ]
    });
}

/**
 * Example: Optimize particle effects / 示例：優化粒子效果
 */
export function createOptimizedParticleEffect(animationSystem, x, y, type = 'levelup') {
    // Use animation system's optimized particle creation
    switch (type) {
        case 'levelup':
            animationSystem.createLevelUpEffect({ getBoundingClientRect: () => ({ left: x, bottom: y, width: 100 }) });
            break;
        case 'breakthrough':
            animationSystem.createBreakthroughEffect({ getBoundingClientRect: () => ({ left: x, top: y, width: 100, height: 100 }) });
            break;
        case 'spiritual':
            animationSystem.createSpiritualParticles(x, y, {
                count: 30,
                color: '#4fd1c5',
                speed: 2,
                size: 3,
                lifetime: 1500
            });
            break;
        default:
            console.warn(`Unknown particle type: ${type}`);
    }
}

/**
 * Example: Monitor render performance / 示例：監控渲染性能
 */
export function monitorRenderPerformance(perfMonitor, renderFunction) {
    perfMonitor.mark('render-start');
    
    const renderTime = perfMonitor.measureRenderTime(renderFunction);
    
    perfMonitor.mark('render-end');
    
    // Log warning if render time is too high
    if (renderTime > 16.67) {
        perfMonitor.logWarning('Render time exceeds frame budget', {
            renderTime: renderTime.toFixed(2) + 'ms',
            frameTime: perfMonitor.getMetrics().frameTime.toFixed(2) + 'ms'
        });
    }
    
    return renderTime;
}

/**
 * Example: Draw sprite with optimization / 示例：優化繪製精靈
 */
export function drawOptimizedSprite(assetManager, ctx, spriteKey, frameIndex, x, y, width, height) {
    // Use off-screen canvas for complex rendering
    const { canvas: offscreen, ctx: offscreenCtx } = assetManager.createOffscreenCanvas(width, height);
    
    // Draw to off-screen canvas
    assetManager.drawSprite(offscreenCtx, spriteKey, frameIndex, 0, 0, width, height);
    
    // Apply effects on off-screen canvas if needed
    // offscreenCtx.filter = 'brightness(1.2)';
    
    // Copy to main canvas
    ctx.drawImage(offscreen, x, y);
}

/**
 * Example: Setup performance optimization / 示例：設置性能優化
 */
export function setupPerformanceOptimization() {
    // Add will-change to frequently animated elements
    const animatedElements = document.querySelectorAll('.menu-btn, .stat-bar-fill, .grid-cell');
    animatedElements.forEach(el => {
        el.style.willChange = 'transform';
    });

    // Remove will-change after animations complete
    document.addEventListener('transitionend', (e) => {
        if (e.target.style.willChange) {
            setTimeout(() => {
                e.target.style.willChange = 'auto';
            }, 1000);
        }
    });

    // Optimize scroll performance
    const scrollContainers = document.querySelectorAll('.panel-container, .scrollable');
    scrollContainers.forEach(container => {
        container.style.contain = 'layout style paint';
    });
}

/**
 * Example: Cleanup and resource management / 示例：清理和資源管理
 */
export function cleanupGraphicsResources(systems) {
    const { animationSystem, assetManager, perfMonitor } = systems;
    
    // Stop animation loop
    if (animationSystem) {
        animationSystem.stopAnimationLoop();
    }
    
    // Clear image cache
    if (assetManager) {
        assetManager.clearCache();
    }
    
    // Stop performance monitoring
    if (perfMonitor) {
        perfMonitor.stop();
    }
    
    console.log('Graphics resources cleaned up');
}

/**
 * Example: Complete integration / 示例：完整集成
 */
export async function setupCompleteGraphicsOptimization() {
    console.log('Initializing graphics optimization...');
    
    // 1. Initialize all systems
    const systems = initializeGraphicsOptimization();
    
    // 2. Preload assets
    await preloadGameAssets(systems.assetManager);
    
    // 3. Setup performance optimizations
    setupPerformanceOptimization();
    
    // 4. Start performance monitoring in development mode
    if (process.env.NODE_ENV === 'development') {
        systems.perfMonitor.start(true);
    }
    
    console.log('Graphics optimization ready!');
    
    return systems;
}

// Export for use in other modules
export default {
    initializeGraphicsOptimization,
    preloadGameAssets,
    setupSpriteSheet,
    createOptimizedParticleEffect,
    monitorRenderPerformance,
    drawOptimizedSprite,
    setupPerformanceOptimization,
    cleanupGraphicsResources,
    setupCompleteGraphicsOptimization
};
