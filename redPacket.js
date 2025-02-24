class Coin {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = -50;
        this.speed = 2 + Math.random() * 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = -2 + Math.random() * 4;
        this.element = this.createElement();
        this.isCollected = false;
        this.isCaught = false;
    }

    createElement() {
        const div = document.createElement('div');
        div.className = 'coin';
        div.innerHTML = `
            <i class="fas fa-coins" style="color: #FFD700;"></i>
        `;
        div.style.position = 'fixed';
        div.style.left = this.x + 'px';
        div.style.top = this.y + 'px';
        div.style.transform = `rotate(${this.rotation}deg)`;
        div.style.cursor = 'pointer';
        div.style.transition = 'transform 0.3s ease';
        div.style.fontSize = '25px';
        div.style.zIndex = '1000';
        div.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.7)'; // 添加金色光晕

        // 添加鼠标悬停效果
        div.addEventListener('mouseover', () => {
            div.style.transform = `rotate(${this.rotation}deg) scale(1.2)`;
        });

        div.addEventListener('mouseout', () => {
            div.style.transform = `rotate(${this.rotation}deg) scale(1)`;
        });

        // 点击收集金币
        div.addEventListener('click', () => {
            if (!this.isCollected) {
                this.collect();
            }
        });

        document.body.appendChild(div);
        return div;
    }

    update() {
        if (this.isCollected || this.isCaught) return;

        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        
        this.element.style.top = this.y + 'px';
        this.element.style.transform = `rotate(${this.rotation}deg)`;

        // 检查是否碰到进度条
        const progressBar = document.querySelector('.loading-bar');
        if (progressBar) {
            const barRect = progressBar.getBoundingClientRect();
            const coinRect = this.element.getBoundingClientRect();

            if (coinRect.bottom >= barRect.top && 
                coinRect.top <= barRect.bottom &&
                coinRect.right >= barRect.left &&
                coinRect.left <= barRect.right) {
                
                this.catchByBar();
            }
        }

        // 如果金币落到屏幕底部，则移除
        if (this.y > window.innerHeight + 50) {
            this.remove();
        }
    }

    // 新增：被进度条接住的处理
    catchByBar() {
        if (this.isCaught) return;
        this.isCaught = true;

        // 停在进度条上方
        const progressBar = document.querySelector('.loading-bar');
        const barRect = progressBar.getBoundingClientRect();
        this.element.style.top = (barRect.top - this.element.offsetHeight) + 'px';
        this.element.style.transition = 'all 0.3s ease';

        // 添加闪烁动画
        this.element.style.animation = 'coinGlow 1s infinite';

        // 2秒后消失并显示恭喜发财
        setTimeout(() => {
            this.collect(true);
        }, 2000);
    }

    collect(isCaught = false) {
        this.isCollected = true;
        this.element.style.transform = 'scale(0)';
        this.element.style.opacity = '0';
        this.element.style.transition = 'all 0.3s ease';

        // 显示收集动画
        const collectText = document.createElement('div');
        collectText.className = 'collect-text';
        collectText.textContent = isCaught ? '恭喜发财！' : '+1';
        collectText.style.position = 'fixed';
        collectText.style.left = this.x + 'px';
        collectText.style.top = this.y + 'px';
        collectText.style.color = '#FFD700';
        collectText.style.fontWeight = 'bold';
        collectText.style.animation = 'floatUp 1s ease-out';
        document.body.appendChild(collectText);

        // 播放收集音效
        const collectSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwPz8/Pz8/TU1NTU1NW1tbW1tbaGhoaGhoaHd3d3d3d4aGhoaGhpSUlJSUlKmpqampqbe3t7e3t8bGxsbGxtTU1NTU1OPj4+Pj4/H//////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UGQAAAdsVkX+6MAVDQqov9xgBEAAAaQAAAAgAAA0gAAABJCSiQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        collectSound.volume = 0.2;
        collectSound.play();

        // 移除元素
        setTimeout(() => {
            this.remove();
            collectText.remove();
        }, 1000);
    }

    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// 管理所有金币
class CoinManager {
    constructor() {
        this.coins = [];
        this.spawnInterval = 1000; // 每1秒生成一个金币
        this.maxCoins = 15; // 最大同时存在的金币数量
        this.start();
    }

    start() {
        setInterval(() => {
            if (this.coins.length < this.maxCoins) {
                const coin = new Coin();
                this.coins.push(coin);
            }
        }, this.spawnInterval);

        this.update();
    }

    update() {
        requestAnimationFrame(() => this.update());
        
        this.coins = this.coins.filter(coin => {
            if (coin.isCollected || coin.y > window.innerHeight + 50) {
                coin.remove();
                return false;
            }
            coin.update();
            return true;
        });
    }
}

// 更新CSS样式
const style = document.createElement('style');
style.textContent = `
    .coin {
        cursor: pointer;
        user-select: none;
        transition: transform 0.3s ease;
        filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
    }

    .coin:hover {
        transform: scale(1.2);
        filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8));
    }

    @keyframes coinGlow {
        0% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5)); }
        50% { filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)); }
        100% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5)); }
    }

    @keyframes floatUp {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px) scale(1.5);
            opacity: 0;
        }
    }

    .collect-text {
        pointer-events: none;
        z-index: 1001;
        font-size: 20px;
        text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
    }
`;
document.head.appendChild(style);

// 初始化金币管理器
window.addEventListener('load', () => {
    new CoinManager();
}); 