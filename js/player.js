class Player {
    constructor(game) {
        this.game = game;
        this.x = 50;
        this.y = 250;
        this.width = 48;
        this.height = 64;
        this.speedX = 0;
        this.speedY = 0;
        this.gravity = 0.8;
        this.jumpForce = -15;
        this.maxFallSpeed = 12;
        this.isGrounded = false;
        this.facingRight = true;
        
        // 加载玩家图片
        this.image = new Image();
        this.image.onerror = () => {
            console.error('Error loading mario.png');
        };
        this.image.src = 'images/mario.png';
    }

    update() {
        // 更新朝向
        if (this.speedX > 0) this.facingRight = true;
        if (this.speedX < 0) this.facingRight = false;
        
        // 重力
        this.speedY += this.gravity;
        
        // 限制最大下落速度
        if (this.speedY > this.maxFallSpeed) {
            this.speedY = this.maxFallSpeed;
        }
        
        // 水平移动
        this.x += this.speedX;
        
        // 检查平台碰撞
        this.checkPlatformCollisions();
        
        // 垂直移动
        this.y += this.speedY;
        
        // 地面碰撞检测
        if (this.y > this.game.canvas.height - this.height - this.game.groundHeight) {
            this.y = this.game.canvas.height - this.height - this.game.groundHeight;
            this.speedY = 0;
            this.isGrounded = true;
        }
    }

    checkPlatformCollisions() {
        this.isGrounded = false;
        
        this.game.platforms.forEach(platform => {
            // 获取玩家和平台的边界
            const playerBottom = this.y + this.height;
            const platformTop = platform.y;
            const playerRight = this.x + this.width;
            const playerLeft = this.x;
            const platformRight = platform.x + platform.width;
            const platformLeft = platform.x;
            
            // 检查是否在平台上方
            if (playerBottom >= platformTop && 
                this.y < platformTop &&
                playerRight > platformLeft && 
                playerLeft < platformRight) {
                    
                // 如果玩家正在下落
                if (this.speedY > 0) {
                    this.y = platformTop - this.height;
                    this.speedY = 0;
                    this.isGrounded = true;
                }
            }
        });
    }

    draw() {
        if (this.image.complete) {
            // 根据移动方向翻转图片
            this.game.ctx.save();
            if (!this.facingRight) {
                this.game.ctx.scale(-1, 1);
                this.game.ctx.drawImage(this.image, -this.x - this.width, this.y, this.width, this.height);
            } else {
                this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
            this.game.ctx.restore();
        } else {
            // 图片未加载完成时显示红色方块
            this.game.ctx.fillStyle = '#FF0000';
            this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    jump() {
        if (this.isGrounded) {
            this.speedY = this.jumpForce;
            this.isGrounded = false;
            // 播放跳跃音效
            this.game.jumpSound.currentTime = 0;
            this.game.jumpSound.play();
        }
    }
} 