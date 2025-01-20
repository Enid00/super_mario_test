constructor() {
    // ... 其他代码 ...
    
    // 添加背景音乐
    this.bgm = new Audio('audio/bgm.mp3');
    this.bgm.onerror = () => {
        console.error('Error loading bgm.mp3');
    };
    this.bgm.loop = true;
    
    // 加载音效
    this.jumpSound = new Audio('audio/jump.mp3');
    this.jumpSound.onerror = () => {
        console.error('Error loading jump.mp3');
    };
    
    this.coinSound = new Audio('audio/coin.mp3');
    this.coinSound.onerror = () => {
        console.error('Error loading coin.mp3');
    };
    
    // ... 其他代码 ...
}
