/**
 * Animation System - 動畫系統
 * Handles all animation effects
 * 處理所有動畫效果
 */

export class AnimationSystem {
    // Configuration constants
    static DEFAULT_POOL_SIZE = 200; // Balance between memory usage and object reuse

    constructor(options = {}) {
        this.particles = [];
        this.animations = new Map();
        this.canvas = null;
        this.ctx = null;
        this.particlePool = []; // Particle object pooling
        this.maxPoolSize = options.maxPoolSize || AnimationSystem.DEFAULT_POOL_SIZE;
        this.isAnimating = false;
    }

    /**
     * Initialize canvas for particle effects / 初始化粒子效果畫布
     * @param {string} containerId - Container element ID
     */
    initializeCanvas(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        this.canvas = document.createElement('canvas');
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        
        container.style.position = 'relative';
        container.appendChild(this.canvas);
        
        // Optimize canvas context
        this.ctx = this.canvas.getContext('2d', {
            alpha: true,
            desynchronized: true, // Reduce latency
            willReadFrequently: false
        });
    }

    /**
     * Get particle from pool or create new one / 從池中獲取粒子或創建新粒子
     * @param {Object} config - Particle configuration
     * @returns {Object} Particle object
     */
    getParticleFromPool(config) {
        let particle;
        if (this.particlePool.length > 0) {
            particle = this.particlePool.pop();
            Object.assign(particle, config);
        } else {
            particle = { ...config };
        }
        return particle;
    }

    /**
     * Return particle to pool / 將粒子返回池中
     * @param {Object} particle - Particle to return
     */
    returnParticleToPool(particle) {
        if (this.particlePool.length < this.maxPoolSize) {
            this.particlePool.push(particle);
        }
    }

    /**
     * Create spiritual energy particles / 創建靈氣粒子
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} options - Particle options
     */
    createSpiritualParticles(x, y, options = {}) {
        const {
            count = 20,
            color = '#4fd1c5',
            speed = 2,
            size = 3,
            lifetime = 1000
        } = options;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed - 1
            };

            this.particles.push(this.getParticleFromPool({
                x,
                y,
                vx: velocity.x,
                vy: velocity.y,
                size,
                color,
                alpha: 1,
                lifetime,
                age: 0
            }));
        }
    }

    /**
     * Create breakthrough effect / 創建突破特效
     * @param {HTMLElement} element - Target element
     */
    createBreakthroughEffect(element) {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Multiple waves of particles
        for (let wave = 0; wave < 3; wave++) {
            setTimeout(() => {
                this.createSpiritualParticles(centerX, centerY, {
                    count: 30,
                    color: '#fbbf24',
                    speed: 3 + wave,
                    size: 4,
                    lifetime: 2000
                });
            }, wave * 200);
        }

        // Flash effect on element
        element.style.animation = 'breakthrough-flash 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    /**
     * Create level up effect / 創建升級特效
     * @param {HTMLElement} element - Target element
     */
    createLevelUpEffect(element) {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        
        // Golden particles rising up
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const x = rect.left + Math.random() * rect.width;
                const y = rect.bottom;
                
                this.particles.push(this.getParticleFromPool({
                    x,
                    y,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -3 - Math.random() * 2,
                    size: 3 + Math.random() * 3,
                    color: '#fbbf24',
                    alpha: 1,
                    lifetime: 2000,
                    age: 0
                }));
            }, i * 20);
        }

        // Add glow to element
        element.style.boxShadow = '0 0 30px rgba(251, 191, 36, 0.8)';
        setTimeout(() => {
            element.style.boxShadow = '';
        }, 1000);
    }

    /**
     * Create skill cast effect / 創建技能釋放動畫
     * @param {Object} source - Source position {x, y}
     * @param {Object} target - Target position {x, y}
     * @param {string} element - Element type
     */
    createSkillCastEffect(source, target, element = 'fire') {
        const colors = {
            fire: '#ef4444',
            water: '#3b82f6',
            wood: '#22c55e',
            metal: '#c0c0c0',
            earth: '#a16207',
            thunder: '#eab308',
            ice: '#06b6d4'
        };

        const color = colors[element] || '#4fd1c5';
        
        // Create projectile
        const projectile = {
            x: source.x,
            y: source.y,
            targetX: target.x,
            targetY: target.y,
            color,
            size: 10,
            speed: 15
        };

        this.animateProjectile(projectile);
    }

    /**
     * Animate projectile / 動畫投射物
     * @param {Object} projectile - Projectile data
     */
    animateProjectile(projectile) {
        const animate = () => {
            const dx = projectile.targetX - projectile.x;
            const dy = projectile.targetY - projectile.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < projectile.speed) {
                // Hit target - create impact effect
                this.createSpiritualParticles(projectile.targetX, projectile.targetY, {
                    count: 25,
                    color: projectile.color,
                    speed: 3,
                    size: 4
                });
                return;
            }

            // Move projectile
            projectile.x += (dx / distance) * projectile.speed;
            projectile.y += (dy / distance) * projectile.speed;

            // Create trail particles
            this.particles.push(this.getParticleFromPool({
                x: projectile.x,
                y: projectile.y,
                vx: 0,
                vy: 0,
                size: projectile.size / 2,
                color: projectile.color,
                alpha: 0.8,
                lifetime: 300,
                age: 0
            }));

            requestAnimationFrame(animate);
        };

        animate();
    }

    /**
     * Update and render particles / 更新和渲染粒子
     * @param {number} deltaTime - Time since last update
     */
    updateParticles(deltaTime) {
        if (!this.ctx || this.particles.length === 0) return;

        // Clear canvas only if there are particles
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Batch rendering for better performance
        const particlesToRemove = [];
        
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            particle.age += deltaTime;

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Apply gravity
            particle.vy += 0.1;

            // Update alpha based on lifetime
            particle.alpha = 1 - (particle.age / particle.lifetime);

            // Remove dead particles
            if (particle.age >= particle.lifetime) {
                particlesToRemove.push(i);
                continue;
            }

            // Draw particle with batched operations
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Remove dead particles and return to pool (iterate backwards)
        for (let i = particlesToRemove.length - 1; i >= 0; i--) {
            const idx = particlesToRemove[i];
            const particle = this.particles[idx];
            this.returnParticleToPool(particle);
            this.particles.splice(idx, 1);
        }

        this.ctx.globalAlpha = 1;
    }

    /**
     * Start animation loop / 開始動畫循環
     */
    startAnimationLoop() {
        if (this.isAnimating) return; // Prevent multiple loops
        
        this.isAnimating = true;
        let lastTime = Date.now();

        const loop = () => {
            if (!this.isAnimating) return;
            
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            // Only update if there are particles
            if (this.particles.length > 0) {
                this.updateParticles(deltaTime);
            }

            requestAnimationFrame(loop);
        };

        loop();
    }

    /**
     * Stop animation loop / 停止動畫循環
     */
    stopAnimationLoop() {
        this.isAnimating = false;
    }

    /**
     * Create element fade in animation / 創建元素淡入動畫
     * @param {HTMLElement} element - Target element
     * @param {number} duration - Duration in ms
     */
    fadeIn(element, duration = 300) {
        if (!element) return;

        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    }

    /**
     * Create element fade out animation / 創建元素淡出動畫
     * @param {HTMLElement} element - Target element
     * @param {number} duration - Duration in ms
     */
    fadeOut(element, duration = 300) {
        if (!element) return;

        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';
    }

    /**
     * Shake element / 震動元素
     * @param {HTMLElement} element - Target element
     * @param {number} intensity - Shake intensity
     */
    shake(element, intensity = 10) {
        if (!element) return;

        const originalTransform = element.style.transform;
        let shakeCount = 0;
        const maxShakes = 10;

        const shakeInterval = setInterval(() => {
            if (shakeCount >= maxShakes) {
                clearInterval(shakeInterval);
                element.style.transform = originalTransform;
                return;
            }

            const offsetX = (Math.random() - 0.5) * intensity;
            const offsetY = (Math.random() - 0.5) * intensity;
            element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            
            shakeCount++;
        }, 50);
    }

    /**
     * Pulse element / 脈衝元素
     * @param {HTMLElement} element - Target element
     * @param {number} duration - Duration in ms
     */
    pulse(element, duration = 500) {
        if (!element) return;

        element.style.animation = `pulse ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes breakthrough-flash {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(2) drop-shadow(0 0 20px #fbbf24); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

export default AnimationSystem;
