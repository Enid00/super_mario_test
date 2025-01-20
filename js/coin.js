class Coin {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.collected = false;
        this.frameCount = 0;
        this.animationSpeed = 0.1;
        
        // 加载金币图片
        this.image = new Image();
        this.image.onerror = () => {
            console.error('Error loading coin.png');
        };
        this.image.src = 'images/coin.png';
    }

    draw() {
        if (!this.collected) {
            if (this.image.complete) {
                // 增加浮动高度以匹配更大的尺寸
                const floatOffset = Math.sin(this.frameCount * this.animationSpeed) * 10;
                this.frameCount++;
                
                this.game.ctx.drawImage(
                    this.image,
                    this.x,
                    this.y + floatOffset,
                    this.width,
                    this.height
                );
            } else {
                // 备用圆形也相应增大
                this.game.ctx.fillStyle = '#FFD700';
                this.game.ctx.beginPath();
                this.game.ctx.arc(
                    this.x + this.width/2,
                    this.y + this.height/2,
                    this.width/2,
                    0,
                    Math.PI * 2
                );
                this.game.ctx.fill();
            }
        }
    }

    checkCollision(player) {
        if (!this.collected &&
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y) {
            
            this.collected = true;
            this.game.score++;
            this.game.coinSound.currentTime = 0;
            this.game.coinSound.play();
        }
    }
} 