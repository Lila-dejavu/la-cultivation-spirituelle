# 遊戲圖像優化指南 / Game Graphics Optimization Guide

## 概述 / Overview

本指南介紹了遊戲中實施的圖形優化技術，旨在提高性能、流暢度和用戶體驗。

This guide introduces the graphics optimization techniques implemented in the game to improve performance, smoothness, and user experience.

## 優化技術 / Optimization Techniques

### 1. Canvas 渲染優化 / Canvas Rendering Optimization

#### 1.1 Context 優化
```javascript
const ctx = canvas.getContext('2d', {
    alpha: true,
    desynchronized: true,  // 減少延遲 / Reduce latency
    willReadFrequently: false
});
```

**優點 / Benefits:**
- `desynchronized`: 允許更低的渲染延遲
- `willReadFrequently`: 優化讀取操作性能
- 減少 CPU-GPU 同步開銷

#### 1.2 粒子對象池 / Particle Object Pooling

```javascript
class AnimationSystem {
    particlePool = [];
    maxPoolSize = 200;
    
    getParticleFromPool(config) {
        return this.particlePool.length > 0 
            ? Object.assign(this.particlePool.pop(), config)
            : { ...config };
    }
    
    returnParticleToPool(particle) {
        if (this.particlePool.length < this.maxPoolSize) {
            this.particlePool.push(particle);
        }
    }
}
```

**優點 / Benefits:**
- 減少垃圾回收（GC）壓力
- 降低對象創建開銷
- 提高整體性能 20-30%

#### 1.3 批量渲染 / Batch Rendering

```javascript
// 優化前 / Before
this.particles = this.particles.filter(particle => {
    // 更新和渲染
    return particle.age < particle.lifetime;
});

// 優化後 / After
const particlesToRemove = [];
for (let i = 0; i < this.particles.length; i++) {
    const particle = this.particles[i];
    // 更新和渲染
    if (particle.age >= particle.lifetime) {
        particlesToRemove.push(i);
    }
}
// 批量移除
for (let i = particlesToRemove.length - 1; i >= 0; i--) {
    this.particles.splice(particlesToRemove[i], 1);
}
```

**優點 / Benefits:**
- 減少數組重建次數
- 提高遍歷效率
- 更好的內存管理

### 2. CSS 性能優化 / CSS Performance Optimization

#### 2.1 硬件加速 / Hardware Acceleration

```css
.animated-element {
    will-change: transform, opacity;
    transform: translateZ(0);
    backface-visibility: hidden;
}
```

**優點 / Benefits:**
- 啟用 GPU 加速
- 減少重繪和重排
- 提高動畫流暢度

#### 2.2 CSS Containment

```css
.panel-container {
    contain: layout style paint;
}

.grid-cell {
    contain: layout;
}
```

**優點 / Benefits:**
- 限制佈局計算範圍
- 提高渲染性能
- 減少不必要的重排

#### 2.3 使用 transform 替代 position

```css
/* 優化前 / Before */
.slide-in {
    left: 0;
    transition: left 0.3s;
}

/* 優化後 / After */
.slide-in {
    transform: translateX(0) translateZ(0);
    transition: transform 0.3s;
}
```

**優點 / Benefits:**
- GPU 加速的變換
- 避免觸發重排
- 更流暢的動畫

### 3. 圖像資源管理 / Image Asset Management

#### 3.1 圖像預加載 / Image Preloading

```javascript
const assetManager = new ImageAssetManager();

// 預加載多張圖片
await assetManager.preloadImages([
    { url: 'character.png', key: 'character' },
    { url: 'background.png', key: 'bg' }
], (loaded, total) => {
    console.log(`載入進度: ${loaded}/${total}`);
});
```

**優點 / Benefits:**
- 減少運行時加載延遲
- 改善用戶體驗
- 避免圖像閃爍

#### 3.2 精靈圖系統 / Sprite Sheet System

```javascript
// 創建精靈圖
assetManager.createSpriteSheet('characters', image, {
    frameWidth: 64,
    frameHeight: 64
});

// 繪製精靈
assetManager.drawSprite(ctx, 'characters', frameIndex, x, y, width, height);
```

**優點 / Benefits:**
- 減少 HTTP 請求
- 提高渲染效率
- 降低內存使用

#### 3.3 離屏畫布 / Offscreen Canvas

```javascript
const { canvas, ctx } = assetManager.createOffscreenCanvas(width, height);
// 在離屏畫布上渲染
ctx.drawImage(...);
// 然後複製到主畫布
mainCtx.drawImage(canvas, 0, 0);
```

**優點 / Benefits:**
- 預渲染複雜圖形
- 減少主線程負擔
- 提高整體性能

### 4. 性能監控 / Performance Monitoring

#### 4.1 FPS 監控 / FPS Monitoring

```javascript
const monitor = new PerformanceMonitor();
monitor.start(true); // 顯示 FPS 顯示器

// 獲取性能指標
const metrics = monitor.getMetrics();
console.log(`FPS: ${metrics.avgFps}`);
console.log(`幀時間: ${metrics.frameTime}ms`);
```

**優點 / Benefits:**
- 實時性能追蹤
- 識別性能瓶頸
- 優化決策依據

#### 4.2 渲染時間測量 / Render Time Measurement

```javascript
monitor.measureRenderTime(() => {
    // 渲染操作
    renderScene();
});

console.log(`渲染時間: ${monitor.metrics.renderTime}ms`);
```

#### 4.3 性能標記 / Performance Marks

```javascript
monitor.mark('render-start');
// 執行渲染
renderScene();
monitor.mark('render-end');

const duration = monitor.measure('render-duration', 'render-start', 'render-end');
console.log(`渲染耗時: ${duration}ms`);
```

## 使用建議 / Best Practices

### 1. 動畫優化
- 優先使用 CSS 動畫而非 JavaScript
- 僅動畫化 `transform` 和 `opacity` 屬性
- 使用 `requestAnimationFrame` 而非 `setInterval`

### 2. 粒子系統
- 限制同時存在的粒子數量（建議 < 500）
- 使用對象池減少 GC 壓力
- 在粒子不可見時停止更新

### 3. Canvas 優化
- 使用多層畫布分離靜態和動態內容
- 實施髒區域追蹤，僅重繪變化區域
- 批量繪製相似元素

### 4. 圖像優化
- 使用精靈圖合併小圖像
- 壓縮圖像質量（JPEG 80-90%）
- 使用適當的圖像格式（PNG/JPEG/WebP）

### 5. 內存管理
- 及時清理不再使用的資源
- 使用弱引用避免內存洩漏
- 定期清理緩存

## 性能目標 / Performance Targets

- **目標 FPS**: 60 FPS
- **最低 FPS**: 30 FPS
- **平均幀時間**: < 16.67ms
- **最大粒子數**: 500 個
- **渲染時間**: < 10ms

## 檢查清單 / Checklist

- [ ] 所有動畫元素使用 `will-change` 或 `transform: translateZ(0)`
- [ ] 粒子系統實現對象池
- [ ] 圖像資源預加載
- [ ] Canvas 使用優化的 context 選項
- [ ] 實施性能監控
- [ ] 限制同時粒子數量
- [ ] 使用 CSS containment
- [ ] 優化滾動性能

## 工具和資源 / Tools and Resources

### 開發工具
- Chrome DevTools Performance Panel
- Firefox Performance Tools
- WebPageTest

### 相關文檔
- [MDN: Optimizing Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [Web.dev: Rendering Performance](https://web.dev/rendering-performance/)
- [Google: Speed Tools](https://developers.google.com/speed)

## 故障排除 / Troubleshooting

### 問題: FPS 低於 30
**解決方案:**
1. 檢查粒子數量是否過多
2. 確認是否啟用硬件加速
3. 減少複雜的 CSS 效果
4. 優化渲染循環

### 問題: 內存持續增長
**解決方案:**
1. 檢查是否正確返回粒子到對象池
2. 清理不再使用的圖像緩存
3. 移除事件監聽器
4. 檢查閉包引用

### 問題: 動畫卡頓
**解決方案:**
1. 使用 `will-change` 提示瀏覽器
2. 避免在動畫中觸發重排
3. 使用 CSS transform 而非 position
4. 減少 DOM 操作頻率

## 結論 / Conclusion

通過實施這些優化技術，遊戲的圖形性能可以顯著提升。持續監控性能指標並根據實際情況調整優化策略是維持良好性能的關鍵。

By implementing these optimization techniques, the game's graphics performance can be significantly improved. Continuous monitoring of performance metrics and adjusting optimization strategies based on actual conditions are key to maintaining good performance.
