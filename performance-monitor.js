/**
 * Performance Monitor - 性能監控器
 * Tracks FPS, memory usage, and rendering performance
 * 追蹤幀率、內存使用和渲染性能
 */

export class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fpsUpdateTime = 0;
        this.isMonitoring = false;
        this.metrics = {
            avgFps: 60,
            minFps: 60,
            maxFps: 60,
            frameTime: 0,
            renderTime: 0
        };
        this.displayElement = null;
    }

    /**
     * Start monitoring / 開始監控
     * @param {boolean} showDisplay - Show FPS display
     */
    start(showDisplay = false) {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        this.lastTime = performance.now();
        this.fpsUpdateTime = this.lastTime;

        if (showDisplay) {
            this.createDisplay();
        }

        this.monitor();
    }

    /**
     * Stop monitoring / 停止監控
     */
    stop() {
        this.isMonitoring = false;
        if (this.displayElement) {
            this.displayElement.remove();
            this.displayElement = null;
        }
    }

    /**
     * Monitor loop / 監控循環
     */
    monitor() {
        if (!this.isMonitoring) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.frameCount++;
        this.metrics.frameTime = deltaTime;

        // Update FPS every second
        if (currentTime - this.fpsUpdateTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.fpsUpdateTime));
            
            // Update metrics
            this.metrics.avgFps = this.fps;
            this.metrics.minFps = Math.min(this.metrics.minFps, this.fps);
            this.metrics.maxFps = Math.max(this.metrics.maxFps, this.fps);

            this.frameCount = 0;
            this.fpsUpdateTime = currentTime;

            if (this.displayElement) {
                this.updateDisplay();
            }
        }

        requestAnimationFrame(() => this.monitor());
    }

    /**
     * Create FPS display element / 創建幀率顯示元素
     */
    createDisplay() {
        if (this.displayElement) return;

        this.displayElement = document.createElement('div');
        this.displayElement.id = 'performance-monitor';
        this.displayElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #0f0;
            padding: 10px;
            font-family: monospace;
            font-size: 12px;
            border-radius: 5px;
            z-index: 10000;
            min-width: 150px;
            pointer-events: none;
        `;
        
        document.body.appendChild(this.displayElement);
        this.updateDisplay();
    }

    /**
     * Update display / 更新顯示
     */
    updateDisplay() {
        if (!this.displayElement) return;

        const fpsColor = this.fps >= 55 ? '#0f0' : this.fps >= 30 ? '#ff0' : '#f00';
        
        let html = `<div style="color: ${fpsColor}; font-size: 14px; font-weight: bold;">FPS: ${this.fps}</div>`;
        html += `<div style="margin-top: 5px; font-size: 11px;">`;
        html += `Avg: ${this.metrics.avgFps} | Min: ${this.metrics.minFps} | Max: ${this.metrics.maxFps}<br>`;
        html += `Frame: ${this.metrics.frameTime.toFixed(2)}ms`;
        
        // Add memory info if available
        if (performance.memory) {
            const usedMB = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
            const totalMB = (performance.memory.totalJSHeapSize / 1048576).toFixed(2);
            html += `<br>Memory: ${usedMB} / ${totalMB} MB`;
        }
        
        html += `</div>`;
        
        this.displayElement.innerHTML = html;
    }

    /**
     * Get current FPS / 獲取當前幀率
     * @returns {number} Current FPS
     */
    getFPS() {
        return this.fps;
    }

    /**
     * Get metrics / 獲取指標
     * @returns {Object} Performance metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }

    /**
     * Measure render time / 測量渲染時間
     * @param {Function} renderFunc - Render function to measure
     * @returns {number} Render time in ms
     */
    measureRenderTime(renderFunc) {
        const startTime = performance.now();
        renderFunc();
        const endTime = performance.now();
        
        this.metrics.renderTime = endTime - startTime;
        return this.metrics.renderTime;
    }

    /**
     * Log performance warning / 記錄性能警告
     * @param {string} message - Warning message
     * @param {Object} data - Additional data
     */
    logWarning(message, data = {}) {
        if (this.fps < 30) {
            console.warn(`[Performance Warning] ${message}`, {
                fps: this.fps,
                frameTime: this.metrics.frameTime,
                ...data
            });
        }
    }

    /**
     * Get performance marks / 獲取性能標記
     * @param {string} markName - Mark name
     */
    mark(markName) {
        performance.mark(markName);
    }

    /**
     * Measure between marks / 測量標記間隔
     * @param {string} measureName - Measure name
     * @param {string} startMark - Start mark name
     * @param {string} endMark - End mark name
     * @returns {number} Duration in ms
     */
    measure(measureName, startMark, endMark) {
        performance.measure(measureName, startMark, endMark);
        const measures = performance.getEntriesByName(measureName);
        return measures.length > 0 ? measures[measures.length - 1].duration : 0;
    }

    /**
     * Clear performance marks and measures / 清除性能標記和測量
     */
    clearMarks() {
        performance.clearMarks();
        performance.clearMeasures();
    }

    /**
     * Reset metrics / 重置指標
     */
    resetMetrics() {
        this.metrics = {
            avgFps: 60,
            minFps: 60,
            maxFps: 60,
            frameTime: 0,
            renderTime: 0
        };
        this.frameCount = 0;
    }
}

export default PerformanceMonitor;
