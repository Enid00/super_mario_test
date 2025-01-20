class Enemy {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speedX = 2;
        this.color = '#0000FF'; // 蓝色方块代表敌人
    }

    update() {
        this.x += this.speedX;
        
        // 简单的边界检测
        if (this.x <= 0 || this.x >= this.game.canvas.width - this.width) {
            this.speedX *= -1;
        }
    }

    draw() {
        // 使用矩形代替图片
        this.game.ctx.fillStyle = this.color;
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
} 