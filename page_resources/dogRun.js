/** @typeof {HTMLCanvasElement} */

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;
let frameTimer = 0;
let frameInterval = 30;
let lastTime = 0;

class InputHandler {
    constructor() {
        this.keys = [];
        window.addEventListener("keydown", (e) => {
            if ((e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key)
            };
        })
        window.addEventListener("keyup", (e) => {
            if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        })
    }
}
const dogActionStatus = {
    idle: {
        column: 6,
        row: 0,
    },
    jumpingUp: {
        column: 6,
        row: 1,
    },
    jumpingDown: {
        column: 6,
        row: 2,
    },
    running: {
        column: 8,
        row: 3,
    },
    confuse: {
        column: 10,
        row: 4,
    },
    rolling: {
        column: 6,
        row: 6,
    },
    falling: {
        column: 11,
        row: 8,
    },
};
class Character {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.actionFrame = 0;
        this.actionColumn = dogActionStatus.idle.column;
        this.actionRow = dogActionStatus.idle.row;
        this.image = new Image;
        this.image.src = 'page_resources/images/shadow_dog.png';
    }
    updateAction = (status) => {
        this.actionColumn = dogActionStatus[status].column;
        this.actionRow = dogActionStatus[status].row;
    }
    updateMovement = (keys) => {
        if (keys.includes("w")) {
            this.updateAction("jumpingUp");
            this.y--;
        } 
        if (keys.includes("s")) {
            this.updateAction("falling");
            this.y++;
        };
        if (keys.includes("a")) {
            this.updateAction("rolling");
            this.x--;
        }
        if (keys.includes("d")) {
            this.updateAction("running");
            this.x++;
        } 
        if (keys.length === 0) this.updateAction("idle");
    }
    updateAnimation = () => {
        this.actionFrame++;
        if (this.actionFrame > this.actionColumn) this.actionFrame = 0;
    }
    draw = () => {
        // context.fillRect(this.x, this.y, 100, 100);
        context.drawImage(this.image,this.actionFrame * 575,this.actionRow * 523, 575, 523, this.x, this.y, 200, 200);
    }
}
let character1 = new Character;
let characterInput = new InputHandler;
let animate = (timeStamp) => {
    let deltaTime = timeStamp - lastTime;
    frameTimer += deltaTime;
    lastTime = timeStamp;
    character1.updateMovement(characterInput.keys);    
    if (frameTimer >= frameInterval) {
        context.clearRect(0,0, canvasWidth, canvasHeight);
        frameTimer = 0;
        character1.updateAnimation();
        character1.draw();
    };
    requestAnimationFrame(animate);
}
animate(0);