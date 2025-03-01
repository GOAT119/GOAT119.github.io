// GameDetails 函数用于接收服务器信息
function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
    document.getElementById('servername').textContent = servername;
    document.getElementById('mapname').textContent = mapname;
    document.getElementById('maxplayers').textContent = maxplayers;
    document.getElementById('gamemode').textContent = gamemode;
}

// 设置下载状态
function SetStatusChanged(status) {
    document.getElementById('status').textContent = status;
}

// 设置文件信息
function SetFilesTotal(total) {
    window.filesTotal = total;
    window.filesDownloaded = 0;
}

// 更新文件下载进度
function SetFilesNeeded(needed) {
    window.filesDownloaded = window.filesTotal - needed;
    updateProgress();
}

// 显示当前下载的文件
function DownloadingFile(filename) {
    document.getElementById('status').textContent = `正在下载: ${filename}`;
}

// 更新总体进度
function updateProgress() {
    if (window.filesTotal > 0) {
        const progress = (window.filesDownloaded / window.filesTotal) * 100;
        document.getElementById('progress').style.width = `${progress}%`;
        document.getElementById('percentage').textContent = `${Math.round(progress)}%`;
    }
}

// 初始化时间相关变量和函数
const startTime = Date.now(); // 使用时间戳来记录开始时间

function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function formatElapsedTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function updateTimes() {
    // 更新当前时间
    const now = new Date();
    document.getElementById('current-time').textContent = formatTime(now);
    
    // 更新已经过时间
    const elapsedMilliseconds = Date.now() - startTime;
    document.getElementById('elapsed-time').textContent = formatElapsedTime(elapsedMilliseconds);
}

// 每秒更新一次时间
setInterval(updateTimes, 1000);
updateTimes(); // 立即执行次

// 修改粒子效果配置
document.addEventListener('DOMContentLoaded', () => {
    // 确保 particles.js 已加载
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,          // 减少粒子数量
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": ["#ff3838", "#ffd700", "#ff6b6b", "#ffcc00"] // 新年红金配色
                },
                "shape": {
                    "type": ["circle", "star"],  // 使用圆形和星形
                    "stroke": {
                        "width": 0
                    }
                },
                "opacity": {
                    "value": 0.6,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffd700",
                    "opacity": 0.3,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": true,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.5
                        }
                    },
                    "push": {
                        "particles_nb": 3
                    }
                }
            },
            "retina_detect": true
        });
    } else {
        console.error('particles.js 未能正确加载');
    }
});

// 添加颜色渐变效果
let colorIndex = 0;
const colors = ['#ff9800', '#2196f3', '#ff5722'];

setInterval(() => {
    if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
        const particles = pJSDom[0].pJS.particles;
        particles.array.forEach(particle => {
            particle.color.value = colors[colorIndex];
        });
        colorIndex = (colorIndex + 1) % colors.length;
    }
}, 3000);

// 模拟加载进度（如果需的）
let progress = 0;
const progressBar = document.getElementById('progress');
const percentageText = document.getElementById('percentage');
const statusText = document.getElementById('status');

const loadingStates = [
    "正在连接到服务器...",
    "正在下载地图资源...",
    "正在加载模型...",
    "正在同步服务器数据...",
    "即将进入服务器..."
];

function simulateLoading() {
    if (progress < 100) {
        progress += Math.random() * 2;
        if (progress > 100) progress = 100;
        
        progressBar.style.width = progress + '%';
        percentageText.textContent = Math.floor(progress) + '%';
        
        const stateIndex = Math.floor((progress / 100) * loadingStates.length);
        statusText.textContent = loadingStates[Math.min(stateIndex, loadingStates.length - 1)];
        
        setTimeout(simulateLoading, 100);
    }
}

// 初始化
window.addEventListener('load', () => {
    // 如果本测试，启用模拟加载
    if (window.location.protocol === 'file:') {
        simulateLoading();
    }
});

// 将所有音频相关的初始化代码移到 DOMContentLoaded 事件中
document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bgMusic');
    const toggleButton = document.getElementById('toggleMusic');
    const musicPlayer = document.querySelector('.music-player');
    
    if (bgMusic) {
        // 设置初始音量
        bgMusic.volume = 0.5;
        
        // 初始化时设置状态
        if (!bgMusic.paused) {
            musicPlayer.classList.add('music-playing');
        } else {
            musicPlayer.classList.add('music-paused');
        }
        
        // 添加歌词相关功能
        function updateLyrics() {
            const lyricsWrapper = document.getElementById('lyricsWrapper');
            if (!lyricsWrapper) return;
            
            // 清空歌词容器内容
            lyricsWrapper.innerHTML = '';
        }
        
        // 在音频加载完成后调用
        bgMusic.addEventListener('loadeddata', updateLyrics);
        // 立即调用一次以显示初始状态
        updateLyrics();

        // 音频上下文和可视化相关代码
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const audioCanvas = document.getElementById('audioCanvas');
        
        if (audioCanvas) {
            const canvasCtx = audioCanvas.getContext('2d');
            
            // 设置分析器节点参数
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            // 创建音频源节点
            let source = null;
            
            // 音乐控制相关事件监听
            if (toggleButton) {
                toggleButton.addEventListener('click', async () => {
                    // 如果AudioContext处于suspended状态，需要恢复
                    if (audioCtx.state === 'suspended') {
                        await audioCtx.resume();
                    }
                    
                    if (bgMusic.paused) {
                        if (!source) {
                            source = audioCtx.createMediaElementSource(bgMusic);
                            source.connect(analyser);
                            analyser.connect(audioCtx.destination);
                        }
                        bgMusic.play();
                        toggleButton.querySelector('i').className = 'fas fa-pause';
                        musicPlayer.classList.add('music-playing');
                        musicPlayer.classList.remove('music-paused');
                    } else {
                        bgMusic.pause();
                        toggleButton.querySelector('i').className = 'fas fa-play';
                        musicPlayer.classList.remove('music-playing');
                        musicPlayer.classList.add('music-paused');
                    }
                });
            }
            
            // 监听音乐播放状态变化
            bgMusic.addEventListener('play', () => {
                musicPlayer.classList.remove('music-paused');
            });
            
            bgMusic.addEventListener('pause', () => {
                musicPlayer.classList.add('music-paused');
            });
            
            // 绘制音频可视化效果
            function drawAudio() {
                requestAnimationFrame(drawAudio);
                
                analyser.getByteFrequencyData(dataArray);
                
                canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
                canvasCtx.clearRect(0, 0, audioCanvas.width, audioCanvas.height);
                
                const barWidth = (audioCanvas.width / bufferLength) * 2.5;
                let barHeight;
                let x = 0;
                
                for(let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i] / 2;
                    
                    const gradient = canvasCtx.createLinearGradient(0, audioCanvas.height, 0, 0);
                    gradient.addColorStop(0, 'rgba(255, 56, 56, 0.7)'); // 半透明的红色
                    gradient.addColorStop(1, 'rgba(255, 215, 0, 0.7)'); // 半透明的金色
                    
                    canvasCtx.fillStyle = gradient;
                    canvasCtx.fillRect(x, audioCanvas.height - barHeight, barWidth, barHeight);
                    
                    x += barWidth + 1;
                }
            }
            
            // 开始绘制
            drawAudio();
        } else {
            console.warn('音频可视化canvas元素未找到');
        }
    } else {
        console.warn('背景音乐元素未找到');
    }
});


const motivationalQuotes = [
    "HUD是紫黑格子请订阅服务器合集",
    "请务必遵守好规则",
    "祝您游戏愉快！",
    "感谢您的支持与陪伴！",
    "新的一年，新的开始！"
];
let currentQuoteIndex = 0;


function updateQuote() {
    const loadingTips = document.getElementById('loadingTips');
    if (loadingTips) {
        currentQuoteIndex = (currentQuoteIndex + 1) % motivationalQuotes.length;
        loadingTips.textContent = motivationalQuotes[currentQuoteIndex];
    }
}

// 每4秒更新一次名言
setInterval(updateQuote, 4000);

// 添加图片预加载功能
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
    });
}

// 更新背景图片函数
async function updateBackgroundImage() {
    try {
        // 使用新的图片API
        const imageUrl = 'https://th.bing.com/th/id/R.b224bcc6208e1740552a6e55abdb489a?rik=%2boC%2bgVh11d%2fLXQ&pid=ImgRaw&r=0';

        // 创建新的背景元素
        const newBg = document.createElement('div');
        newBg.className = 'bg-zoom';
        newBg.style.backgroundImage = `url('${imageUrl}')`;
        newBg.style.opacity = '0';
        newBg.style.transition = 'opacity 1s ease-in-out';

        // 获取当前背景元素
        const currentBg = document.querySelector('.bg-zoom');

        // 添加新背景
        document.body.insertBefore(newBg, document.body.firstChild);

        // 触发渐变动画
        setTimeout(() => {
            newBg.style.opacity = '1';

            if (currentBg) {
                currentBg.style.opacity = '0';
                currentBg.style.transition = 'opacity 1s ease-in-out';
                
                setTimeout(() => {
                    document.body.removeChild(currentBg);
                }, 1000);
            }
        }, 50);

    } catch (error) {
        console.error('图片加载失败:', error);
    }
}

// 初始化背景图片
document.addEventListener('DOMContentLoaded', () => {
    // 移除可能存在的初始背景图
    document.body.style.backgroundImage = 'none';
    
    // 页面加载时立即更新一次背景图片
    updateBackgroundImage();
    
    // 每30秒更新一次背景图片
    setInterval(updateBackgroundImage, 30000); // 30000毫秒 = 30秒
});

// 为所有卡片添加淡入效果
document.querySelectorAll('.card').forEach((card, index) => {
  card.style.animationDelay = `${index * 0.2}s`;
  card.classList.add('fade-in');
});

// 添加滚动显示动画
function handleScroll() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementTop < windowHeight * 0.8) {
      element.classList.add('fade-in');
    }
  });
}

window.addEventListener('scroll', handleScroll);

// 在现有代码后添加烟花效果相关代码

// 烟花效果类
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
        this.speed = 2;
        this.acceleration = 1.05;
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

// 烟花粒子类
// 工具函数
function random(min, max) {
    return Math.random() * (max - min) + min;
}


// 在初始化音频可视化时添加错误处理
const canvas = document.getElementById('audioCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    // 继续处理音频可视化的代码...
} else {
    console.warn('音频可视化canvas元素未找到');
}

// 添加歌词相关功能
function updateLyrics() {
    const lyricsWrapper = document.getElementById('lyricsWrapper');
    if (!lyricsWrapper) return;
    
    // 清空歌词容器内容
    lyricsWrapper.innerHTML = '';
}

// 在音频加载完成后调用
document.getElementById('bgMusic').addEventListener('loadeddata', updateLyrics);
  