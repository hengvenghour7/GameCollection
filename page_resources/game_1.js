const canvas = document.getElementById("gameCanvas");
const actionSelector = document.getElementById("actionSelector");
const context = canvas.getContext("2d");
const playerImage = new Image;
const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

playerImage.src = 'page_resources/images/shadow_dog.png'
let x = 0;
let y = 0;
const movementSpeed = 3;
let actionFrame = 0;
let frameCount = 0;
let slowdownRate = 5;
let selectedAction = actionSelector.value;
const actionStatus = {
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
console.log ("selected action", actionStatus[selectedAction]);
let animate = () => {
    frameCount++;
    if (frameCount > slowdownRate) {
        frameCount = 0;
        context.clearRect(0,0, canvasWidth, canvasHeight);
        context.drawImage(playerImage, actionFrame * 575, actionStatus[actionSelector.value].row * 523, 575, 523, x, y, canvasWidth - 50, canvasHeight - 50);
        actionFrame++;
        if (actionFrame > actionStatus[actionSelector.value].column) actionFrame = 0;
    }
    requestAnimationFrame(animate);
}
animate();
