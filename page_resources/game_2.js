/** @typeof {HTMLCanvasElement} */

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;
let frameCount = 0;
let slowdownRate = 5;
let numberOfEnemies = 100;
let enemiesArray = [];

const EnumEnemyType = {
    Type1: {
        width: 1758,
        height: 155,
        columns: 5,
    },
    Type2: {
        width: 1596,
        height: 188,
        columns: 5,
    },
    Type3: {
        width: 1308,
        height: 177,
        columns: 5,
    },
    Type4: {
        width: 1917,
        height: 212,
        columns: 8
    },
}
class Enemy {
    constructor(enemyType) {
        this.x = canvasWidth/2 + Math.random()*(-100) + 50;
        this.y = Math.random() * canvasHeight;
        this.newX = Math.random() * canvasWidth;
        this.newY = Math.random() * canvasHeight;
        this.columns = EnumEnemyType[`Type${enemyType}`].columns;
        this.width = EnumEnemyType[`Type${enemyType}`].width/(this.columns+1);
        this.height = EnumEnemyType[`Type${enemyType}`].height;
        this.image = new Image;
        this.image.src = `page_resources/images/enemy${enemyType}.png`;
        this.actionFrame = 0;
        this.speed = (Math.random() * (-10) + 5);
        this.YSpeed = (Math.random() * (-0.3) + 0.1);
        this.angle = 0;
    }
    updateMovement = () => {
        this.x += this.speed;
        this.y += Math.sin(this.angle) * 5;
        this.angle+= this.YSpeed;
        this.actionFrame++;
        if (this.actionFrame > this.columns) this.actionFrame = 0;
    };
    updateMovementType2 = () => {
        this.x += Math.sin(this.angle) * 5;
        this.y += Math.cos(this.angle) * 5;
        this.angle+= this.YSpeed;
        this.actionFrame++;
        if (this.actionFrame > this.columns) this.actionFrame = 0;
    };
    updateMovementType3 = () => {
        dx = this.newX - this.x;
        dy = this.newY - this.y;
    };
    draw = () => {
        context.drawImage(this.image, this.actionFrame * this.width, 0 * this.height, this.width, this.height, this.x, this.y, this.width/3, this.height/3);
    }
}
for (i=0 ; i < numberOfEnemies; i++) {
    // enemiesArray.push(new Enemy(Math.floor(Math.random() * (-3) + 4.5), 5));
    enemiesArray.push(new Enemy(1, 5));
}
let animate = () => {
    frameCount++;
    if (frameCount % slowdownRate == 0) {
        frameCount = 0;
        context.clearRect(0,0, canvasWidth, canvasHeight);
        enemiesArray.forEach((enemy) => {
            enemy.draw();
            // enemy.updateMovement();
            enemy.updateMovementType2();
        });
    }
    requestAnimationFrame(animate);
}
animate();