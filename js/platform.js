class Platform {
    constructor(game, x, y, width, height) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        // 加载平台图片
        this.image = new Image();
        this.image.onerror = () => {
            console.error('Error loading platform.png');
        };
        this.image.src = 'images/platform.png';
    }

    draw() {
        if (this.image.complete) {
            // 简单地拉伸图片以适应平台尺寸
            this.game.ctx.drawImage(
                this.image,
                this.x,
                this.y,
                this.width,
                this.height
            );
        } else {
            // 备用方案：绘制粉色矩形
            this.game.ctx.fillStyle = '#FFC0CB';
            this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
} 