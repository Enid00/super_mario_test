class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.player = new Player(this);
        this.gameWon = false;
        this.startTime = Date.now();
        this.currentTime = '00:00';
        this.gameTimer = document.getElementById('gameTimer');
        
        // 加载背景图片
        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => {
            this.isBackgroundLoaded = true;
        };
        this.backgroundImage.src = 'images/mario-background.png';
        this.isBackgroundLoaded = false;
        
        // 调整地面高度（从底部算起）
        this.groundHeight = 60; // 增加这个值会让所有元素往上移
        
        // 添加平台（调整Y坐标，减小值会让平台升高）
        this.platforms = [
            new Platform(this, 100, 200, 100, 120),   // 第一个平台
            new Platform(this, 250, 250, 100, 120),   // 第二个平台
            new Platform(this, 400, 200, 100, 120),   // 第三个平台
            new Platform(this, 550, 150, 100, 120),   // 第四个平台
            new Platform(this, 700, 100, 100, 120)    // 最后一个平台
        ];
        
        // 加载门的图片
        this.doorImage = new Image();
        this.doorImage.onerror = () => {
            console.error('Error loading door.png');
        };
        this.doorImage.src = 'images/door.png';
        
        // 调整终点门位置
        this.door = {
            x: 730,
            y: 20,
            width: 40,
            height: 60,
            reached: false
        };
        
        this.keys = {};
        window.addEventListener('keydown', e => this.keys[e.code] = true);
        window.addEventListener('keyup', e => this.keys[e.code] = false);
        
        // 开始计时器
        this.timerInterval = setInterval(() => {
            if (!this.gameWon) {
                this.updateTimer();
            }
        }, 1000);
        
        // 添加背景音乐
        this.bgm = null;
        this.jumpSound = null;
        this.coinSound = null;
        
        // 尝试加载音频文件
        try {
            this.bgm = new Audio('audio/bgm.MP3');
            this.bgm.loop = true;
            
            this.jumpSound = new Audio('audio/jump.MP3');
            this.coinSound = new Audio('audio/coin.MP3');
        } catch(e) {
            console.log('Audio files not loaded');
        }
        
        // 添加音乐控制
        this.isMuted = false;
        window.addEventListener('keydown', e => {
            if (e.code === 'KeyM' && this.bgm) {
                this.toggleMusic();
            }
        });
        
        // 自动播放（需要用户先与页面交互）
        window.addEventListener('click', () => {
            if (this.bgm && !this.bgm.playing) {
                this.bgm.play().catch(e => console.log('Playback failed'));
            }
        }, { once: true });
        
        // 初始化分数
        this.score = 0;
        
        // 为每个平台创建金币
        this.coins = [];
        this.platforms.forEach(platform => {
            // 在每个平台上方添加2-3个金币
            const coinCount = 2 + Math.floor(Math.random());
            for(let i = 0; i < coinCount; i++) {
                this.coins.push(new Coin(
                    this,
                    platform.x + platform.width * (i+1)/(coinCount+1), // 平均分布
                    platform.y - 40 // 在平台上方40像素
                ));
            }
        });
        
        // 加载标题图片
        this.titleImage = new Image();
        this.titleImage.onerror = () => {
            console.error('Error loading title.png');
        };
        this.titleImage.src = 'images/title.png';
        
        // 设置标题尺寸和位置
        this.title = {
            x: 0,          // 会在drawText中计算居中位置
            y: 10,         // 距离顶部的距离
            width: 200,    // 标题图片宽度
            height: 40     // 标题图片高度
        };
        
        this.gameLoop();
    }

    updateTimer() {
        const currentTime = Date.now();
        const timeElapsed = Math.floor((currentTime - this.startTime) / 1000);
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        this.currentTime = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    checkWinCondition() {
        // 检查玩家是否碰到门
        if (!this.door.reached &&
            this.player.x < this.door.x + this.door.width &&
            this.player.x + this.player.width > this.door.x &&
            this.player.y < this.door.y + this.door.height &&
            this.player.y + this.player.height > this.door.y) {
            
            this.door.reached = true;
            this.door.color = '#000000';
            this.gameWon = true;
            
            // 计算通关时间
            const endTime = Date.now();
            const timeElapsed = Math.floor((endTime - this.startTime) / 1000);
            const minutes = Math.floor(timeElapsed / 60);
            const seconds = timeElapsed % 60;
            const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            // 显示胜利提示框
            const winPopup = document.getElementById('winPopup');
            const clearTime = document.getElementById('clearTime');
            clearTime.textContent = timeString;
            winPopup.style.display = 'block';
        }
    }

    restart() {
        // 重置游戏状态
        this.gameWon = false;
        this.door.reached = false;
        this.door.color = '#0000FF';
        this.player.x = 50;
        this.player.y = 300;
        this.player.speedX = 0;
        this.player.speedY = 0;
        this.startTime = Date.now();
        this.currentTime = '00:00';
        
        // 隐藏胜利提示框
        document.getElementById('winPopup').style.display = 'none';
        
        // 重新开始音乐
        if (!this.isMuted) {
            this.bgm.currentTime = 0;
            this.bgm.play();
        }
        
        // 重置分数和金币
        this.score = 0;
        this.coins.forEach(coin => coin.collected = false);
    }

    update() {
        if (!this.gameWon) {
            // 玩家控制
            if (this.keys['ArrowRight'] || this.keys['KeyD']) {
                this.player.speedX = 5;
            } else if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
                this.player.speedX = -5;
            } else {
                this.player.speedX = 0;
            }
            
            // 增加向上方向键跳跃
            if (this.keys['ArrowUp'] || this.keys['Space']) {
                this.player.jump();
            }
            
            this.player.update();
            this.checkWinCondition();
            
            // 检查金币碰撞
            this.coins.forEach(coin => coin.checkCollision(this.player));
        }
    }

    drawText() {
        // 设置文字样式
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '20px monospace';
        this.ctx.textBaseline = 'top';
        this.ctx.shadowColor = '#000000';
        this.ctx.shadowBlur = 4;
        
        // 绘制标题图片
        if (this.titleImage.complete) {
            // 计算居中位置
            this.title.x = (this.canvas.width - this.title.width) / 2;
            this.ctx.drawImage(
                this.titleImage,
                this.title.x,
                this.title.y,
                this.title.width,
                this.title.height
            );
        }
        
        // 绘制分数（在标题左侧）
        const scoreX = this.title.x - 80;  // 距离标题左边80像素
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`分数: ${this.score}`, scoreX, 20);
        
        // 绘制时间（在标题右侧）
        const timeX = this.title.x + this.title.width + 80;  // 距离标题右边80像素
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`时间: ${this.currentTime}`, timeX, 20);
        
        // 绘制音乐控制提示
        this.ctx.font = '16px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`[M键${this.isMuted ? '开启' : '关闭'}音乐]`, 20, 20);
        
        // 重置阴影
        this.ctx.shadowBlur = 0;
    }

    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景
        if (this.isBackgroundLoaded) {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.fillStyle = '#87CEEB';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // 绘制平台
        this.platforms.forEach(platform => platform.draw());
        
        // 绘制终点门
        if (this.doorImage.complete) {
            this.ctx.drawImage(
                this.doorImage,
                this.door.x,
                this.door.y,
                this.door.width,
                this.door.height
            );
        } else {
            // 备用方案：绘制蓝色矩形
            this.ctx.fillStyle = this.door.reached ? '#000000' : '#0000FF';
            this.ctx.fillRect(this.door.x, this.door.y, this.door.width, this.door.height);
        }
        
        // 绘制玩家
        this.player.draw();
        
        // 绘制金币
        this.coins.forEach(coin => coin.draw());
        
        // 绘制文字（放在最后绘制，这样会显示在最上层）
        this.drawText();
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    toggleMusic() {
        if (!this.bgm) return;
        
        if (this.isMuted) {
            this.bgm.play().catch(e => console.log('Playback failed'));
            this.isMuted = false;
        } else {
            this.bgm.pause();
            this.isMuted = true;
        }
    }
}

// 添加全局重启函数
window.restartGame = function() {
    window.game.restart();
};

// 修改游戏启动代码
window.onload = () => {
    window.game = new Game();
}; 
