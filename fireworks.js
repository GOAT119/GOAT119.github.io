// 检查是否已经定义了相关变量
if (typeof window.Firework === 'undefined') {
    // 所有现有的代码放在这个条件语句中
    class Firework {
        constructor(x, y, targetX, targetY) {
            this.x = x;
            this.y = y;
            this.startX = x;
            this.startY = y;
            this.targetX = targetX;
            this.targetY = targetY;
            
            this.distanceToTarget = Math.sqrt(
                Math.pow(targetX - x, 2) + Math.pow(targetY - y, 2)
            );
            this.distanceTraveled = 0;
            
            this.coordinates = [];
            this.coordinateCount = 3;
            while(this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }
            this.angle = Math.atan2(targetY - y, targetX - x);
            this.speed = 1.5;
            this.acceleration = 1.03;
            this.brightness = random(50, 70);
            this.alpha = 1;
            this.decay = random(0.015, 0.03);
            this.particles = [];
        }

        update(index) {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);
            
            this.speed *= this.acceleration;
            
            let vx = Math.cos(this.angle) * this.speed;
            let vy = Math.sin(this.angle) * this.speed;
            
            this.distanceTraveled = Math.sqrt(
                Math.pow(this.x - this.startX, 2) + 
                Math.pow(this.y - this.startY, 2)
            );
            
            if(this.distanceTraveled >= this.distanceToTarget) {
                createParticles(this.targetX, this.targetY);
                fireworks.splice(index, 1);
            } else {
                this.x += vx;
                this.y += vy;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(
                this.coordinates[this.coordinates.length - 1][0],
                this.coordinates[this.coordinates.length - 1][1]
            );
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = `hsla(${random(0, 360)}, 100%, 50%, ${this.alpha})`;
            ctx.stroke();
        }
    }

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.coordinates = [];
            this.coordinateCount = 5;
            
            while(this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }
            this.angle = random(0, Math.PI * 2);
            this.speed = random(1, 15);
            this.friction = 0.97;
            this.gravity = 0.8;
            this.hue = random(0, 360);
            this.brightness = random(50, 80);
            this.alpha = 1;
            this.decay = random(0.01, 0.02);
        }

        update(index) {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);
            this.speed *= this.friction;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
            this.alpha -= this.decay;
            
            if(this.alpha <= this.decay) {
                particles.splice(index, 1);
            }
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(
                this.coordinates[this.coordinates.length - 1][0],
                this.coordinates[this.coordinates.length - 1][1]
            );
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
            ctx.stroke();
        }
    }

    // 工具函数
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // 创建烟花画布
    const fireworksCanvas = document.createElement('canvas');
    fireworksCanvas.id = 'fireworks';
    fireworksCanvas.style.position = 'fixed';
    fireworksCanvas.style.top = '0';
    fireworksCanvas.style.left = '0';
    fireworksCanvas.style.width = '100%';
    fireworksCanvas.style.height = '100%';
    fireworksCanvas.style.pointerEvents = 'none';
    fireworksCanvas.style.zIndex = '1';
    document.body.insertBefore(fireworksCanvas, document.body.firstChild);

    const ctx = fireworksCanvas.getContext('2d');
    let fireworks = [];
    let particles = [];

    // 调整画布大小
    function resizeFireworksCanvas() {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    }

    // 创建粒子效果
    function createParticles(x, y) {
        let particleCount = 80;
        while(particleCount--) {
            particles.push(new Particle(x, y));
        }
    }

    // 自动发射烟花
    function autoLaunchFirework() {
        const startX = random(fireworksCanvas.width * 0.1, fireworksCanvas.width * 0.9);
        const startY = fireworksCanvas.height;
        const endX = random(fireworksCanvas.width * 0.1, fireworksCanvas.width * 0.9);
        const endY = random(fireworksCanvas.height * 0.1, fireworksCanvas.height * 0.6);
        
        fireworks.push(new Firework(startX, startY, endX, endY));
    }

    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        
        // 清除画布，使用完全透明的背景
        ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
        
        // 使用 globalCompositeOperation 来实现烟花轨迹的渐隐效果
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
        ctx.globalCompositeOperation = 'lighter';
        
        for(let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].draw();
            fireworks[i].update(i);
        }
        
        for(let i = particles.length - 1; i >= 0; i--) {
            particles[i].draw();
            particles[i].update(i);
        }
    }

    // 初始化烟花效果
    window.addEventListener('load', () => {
        resizeFireworksCanvas();
        animate();
        
        // 增加发射频率和概率
        setInterval(() => {
            // 增加发射概率到 60%
            if(Math.random() < 0.6) {
                autoLaunchFirework();
                // 有 30% 的概率同时发射第二个烟花
                if(Math.random() < 0.3) {
                    setTimeout(() => {
                        autoLaunchFirework();
                    }, 100); // 延迟 100ms 发射第二个
                }
            }
        }, 500); // 每 500ms 检查一次（原来是 1000ms）
    });

    // 点击时发射烟花
    fireworksCanvas.addEventListener('click', (e) => {
        const rect = fireworksCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        fireworks.push(new Firework(
            random(fireworksCanvas.width * 0.2, fireworksCanvas.width * 0.8),
            fireworksCanvas.height,
            x,
            y
        ));
    });

    window.addEventListener('resize', resizeFireworksCanvas);

    // 将类暴露到全局作用域（如果需要的话）
    window.Firework = Firework;
    window.Particle = Particle;
} 