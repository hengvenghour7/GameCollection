/** @typeof {HTMLCanvasElement} */

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const gameOverMenu = document.getElementById("gameOverMenu");
const tryAgainButton = document.getElementById("tryAgain");

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;
let frameTimer = 0;
let frameInterval = 50;
let lastTime = 0;
let load = 0;
let images = {};
let isGameOver = false;

const imageSources = [
    "page_resources/images/forest_adventure_assets/Animal_Wildlife/Bear.png",
    "page_resources/images/forest_adventure_assets/Animal_Wildlife/Beatle.png",
    "page_resources/images/forest_adventure_assets/Animal_Wildlife/enemy1.png",
    "page_resources/images/forest_adventure_assets/Samurai/ATTACK_1.png",
    "page_resources/images/forest_adventure_assets/Samurai/ATTACK_1_REVERSE.png",
    "page_resources/images/forest_adventure_assets/Samurai/HURT.png",
    "page_resources/images/forest_adventure_assets/Samurai/IDLE.png",
    "page_resources/images/forest_adventure_assets/Samurai/RUN.png",
    "page_resources/images/forest_adventure_assets/Samurai/RUN_REVERSE.png",
    "page_resources/images/forest_adventure_assets/Background/game_bg.png",
];
const characterStates = {
    attack: 0,
    attackReverse: 1,
    hurt: 2,
    idle: 3,
    run: 4,
    runReverse: 5,
}
let loadImages = (sources, callback) => {
    sources.forEach ((res) => {
        const key = res.split("/").slice(-2).join("_").replace(/\.png$/,"").toLowerCase();
        const img = new Image;
        img.onload = () => checkLoaded(sources, callback);
        img.onerror = () => checkLoaded(sources, callback);
        img.src = res;
        images[key] = img;
    })
}
let checkLoaded = (sources, callback) => {
    load++;
    if (load === sources.length) {
        callback();
    };
}
let logImageObject = () => {
    console.log("images loaded", images);
}
let startGame = () => {
    game1.restoreHealth();
    isGameOver = false;
    animate(0);
}
tryAgainButton.addEventListener("click", startGame);
class Game {
    constructor() {
        this.samurai = new Character(30, 200);
        this.health = new HealthComponent;
        this.bear2 = new Enemy(20,4,5);
        this.beatle1 = new BeatleEnemy (5,4,5);
    }
    updateGameProgress = (deltaTime) => {
        if (this.samurai.healthComponent.health <= 0) isGameOver = true;
        let characterCollisionProperty = checkIsCollide(this.samurai,[this.beatle1, this.bear2]);
        let characterInRadiusProperty = checkInRadius(this.samurai,[this.beatle1, this.bear2], 20, 20);
        if (characterCollisionProperty.isCollide) this.samurai.takingDamage(characterCollisionProperty.secondCollider.damage, deltaTime);
        // this.beatle1.takingDamage(this.samurai.updateMovement(characterInput.keys, this.samurai.healthComponent.health).damage, deltaTime);
        if (characterInRadiusProperty.isInRadius) characterInRadiusProperty.secondCollider.takingDamage(this.samurai.attack(characterInput.keys), deltaTime);
        this.samurai.updateMovement(characterInput.keys, this.samurai.healthComponent.health);
        this.samurai.updateAnimation();
        this.samurai.draw();
        this.bear2.updateAnimation();
        this.bear2.draw();
        this.bear2.autoMoving(deltaTime);
        this.beatle1.updateAnimation();
        this.beatle1.draw();
        this.beatle1.autoMoving(deltaTime);
    }
    restoreHealth = () => {
        this.samurai.healthComponent.restoreHealth();
    }
}
class InputHandler {
    constructor() {
        this.keys = [];
        window.addEventListener("keydown", (e) => {
            if ((e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d" || e.key === "k") && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key)
            };
        })
        window.addEventListener("keyup", (e) => {
            if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d" || e.key === "k") {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        })
    }
}
class CollisionBox {
    constructor(damage, x, y, width, height) {
        this.damage = damage;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    updateLocation = (x, y) => {
        this.x = x;
        this.y = y;
    }
    draw = () => {
        context.fillStyle = "rgb(0,255,0)";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}
checkIsCollide = (firstCollider, colliders) => {
        let collisionProperty = {
            isCollide: false,
            secondCollider: {},
        }
        colliders.forEach((res) => {
            if ((firstCollider.getCharacterCollision().x + firstCollider.getCharacterCollision().width) >= res.getCharacterCollision().x && 
                firstCollider.getCharacterCollision().x <= res.getCharacterCollision().x + res.getCharacterCollision().width &&
                (firstCollider.getCharacterCollision().y + firstCollider.getCharacterCollision().width) >= res.getCharacterCollision().y && 
                firstCollider.getCharacterCollision().y <= res.getCharacterCollision().y + res.getCharacterCollision().width) {
                collisionProperty.isCollide = true;
                collisionProperty.secondCollider = res;
                
                return;
            };
        })
        return collisionProperty;
}
checkInRadius = (firstCollider, colliders, xOffset, yOffset) => {
    let collisionProperty = {
            isInRadius: false,
            secondCollider: {},
        }
        colliders.forEach((res) => {
            if ((firstCollider.getCharacterCollision().x + firstCollider.getCharacterCollision().width) <= res.getCharacterCollision().x && 
                firstCollider.getCharacterCollision().x - 100 <= res.getCharacterCollision().x + res.getCharacterCollision().width &&
                (firstCollider.getCharacterCollision().y + firstCollider.getCharacterCollision().width) >= res.getCharacterCollision().y && 
                firstCollider.getCharacterCollision().y <= res.getCharacterCollision().y + res.getCharacterCollision().width) {
                collisionProperty.isInRadius = true;
                collisionProperty.secondCollider = res;
                return;
            };
        })
        return collisionProperty;
}
class Character {
    constructor (damage, maxHealth) {
        this.x = 0;
        this.y = 0;
        this.actionFrame = 0;
        this.speed = 6;
        this.actionImage = "samurai_idle";
        this.damage = damage;
        this.width = 1536/16;
        this.height = 96;
        this.healthComponent = new HealthComponent("green", 5, 5, maxHealth);
        this.collision = new CollisionBox(this.damage, this.x + 90, this.y + 100, this.width - 70, this.height - 25);
        this.isHurt = false;
        this.isTakingDamageTime = 0;
        this.direction = 1;
    }
    updateMovement = (keys, health) => {
        if (this.isHurt) return {
                health: health,
                damage: 0,
            };
        if (keys.includes("k")) {
            if (this.direction === 1) {
                this.actionImage = "samurai_attack_1";
            } else {
                this.actionImage = "samurai_attack_1_reverse";
            }
            health-=this.damage;
            // this.y-= this.speed;
            return {
                health: health,
                damage: this.damage,
            };
        } 
        if (keys.includes("w")) {
            this.actionImage = "samurai_run"
            this.y-= this.speed;
        } 
        if (keys.includes("s")) {
            this.actionImage = "samurai_run"
            this.y+= this.speed;
        };
        if (keys.includes("a")) {
            this.direction = -1;
            this.actionImage = "samurai_run_reverse"
            this.x-= this.speed;
        }
        if (keys.includes("d")) {
            this.direction = 1;
            this.actionImage = "samurai_run"
            this.x+= this.speed;
        } 
        if (keys.length === 0) this.actionImage = "samurai_idle";
        return {
                health: health,
                damage: 0,
            };
    }
    attack = (keys) => {
        let damage = 0
        if (keys.includes("k")) {
            damage = this.damage;
        }
        return damage;
    }
    takingDamage = (damageTaken, interval) => {
        if (this.isTakingDamageTime <= 0 && damageTaken != 0) {
            this.isHurt = true;
            this.actionImage = "samurai_hurt";
            this.healthComponent.health -= damageTaken;
            this.isTakingDamageTime = 100;
            window.setTimeout(() => {
                this.isHurt = false;
            }, 500);
        }
        if (this.isTakingDamageTime > 0) this.isTakingDamageTime -= interval;
    }
    getCharacterCollision = () => {
        return this.collision;
    }
    updateAnimation = () => {
        this.actionFrame++
        if (this.actionFrame > 6) this.actionFrame = 0;
    }
    draw = () => {
        this.healthComponent.draw();
        this.collision.updateLocation(this.x + 90, this.y + 100);
        context.drawImage(images[this.actionImage], this.actionFrame * 1536/16, 0 , 672/7, 96, this.x, this.y, 200, 200);
        // context.fillRect(this.x, this.y, 100,100)
    }
}
class Enemy {
    constructor (damage, forwardRow, backwardRow, collisionXOffset = 0, collisionYOffset = 0, collisionWidth = 50, collisionHeight = 50) {
        this.x = 300;
        this.y = canvasWidth/2 + Math.random()*200;
        this.actionFrame = 0;
        this.speed = Math.random() * 2 + 2;
        this.actionImage = "animal_wildlife_bear";
        this.damage = damage;
        this.width = 96/4;
        this.height = 336/14;
        this.direction = -1;
        this.directionY = 0;
        this.changeDirectionTime = 0;
        this.forwardRow = forwardRow;
        this.backwardRow = backwardRow;
        this.actionRow = this.backwardRow;
        this.isTakingDamageTime = 0;
        this.collisionXOffset = collisionXOffset;
        this.collisionYOffset = collisionYOffset;
        this.collision = new CollisionBox(this.damage, this.x + collisionXOffset, this.y + collisionYOffset, collisionWidth, collisionHeight);
        this.enemyHealth = new EnemyHealthComponent("red", this.x + this.width/2 - 50/2, this.y + this.height);
    }
    getCharacterCollision = () => {
        return this.collision;
    }
    updateAnimation = () => {
        this.actionFrame++
        if (this.actionFrame > 3) this.actionFrame = 0;
    } 
    takingDamage = (damageTaken, interval) => {        
        if (this.isTakingDamageTime <= 0 && damageTaken != 0) {
            this.isTakingDamageTime = 100;
            this.enemyHealth.health -= damageTaken;
            return;
        };
        if (this.isTakingDamageTime > 0) this.isTakingDamageTime -= interval;
    }
    autoMoving = (deltaTime) => {
        if (this.changeDirectionTime >= 300) {
            this.directionY = Math.random() < 0.5 ? -1 : 1;
            this.direction = Math.random() < 0.5 ? -1 : 1;
            if (this.forwardRow !== undefined && this.backwardRow !== undefined) {
                if (this.direction === 1) {
                    this.actionRow = this.forwardRow;
                    // return;
                } 
                if (this.direction === -1) {
                    this.actionRow = this.backwardRow;
                    // return;
                };
            }
            this.changeDirectionTime = 0;
        };
        this.changeDirectionTime += deltaTime;
        this.x += this.speed*this.direction;
        this.y += this.speed*this.directionY;
        this.enemyHealth.updateHealthLocation(this.x + this.width/2 - 50/2, this.y);
    }
    draw = () => {
        if (this.enemyHealth.health > 0) {
            this.collision.updateLocation(this.x + this.collisionXOffset, this.y + this.collisionYOffset, this.width, this.height);
            this.enemyHealth.draw();
            context.drawImage(images[this.actionImage], this.actionFrame * this.width, this.actionRow * this.height, this.width, this.height, this.x, this.y, 50, 50);
        }
    }
}
class BeatleEnemy extends Enemy {
    constructor (damage, forwardRow, backwardRow) {
        super(damage, forwardRow, backwardRow, 0 , 0, 50, 50);
        // this.y = 200;
        this.actionImage = "animal_wildlife_beatle";
        this.width = 64/4;
        this.height = 224/14;
    }
}
class HealthComponent {
    constructor(color, x = 5, y = 5, maxHealth) {
        this.x = x;
        this.y = y;
        this.fullHealth = maxHealth
        this.health = this.fullHealth;
        this.height = 10;
        this.isTakingDamageTime = 0;
        this.healthColor = color;
    }
    restoreHealth = () => {
        this.health = this.fullHealth;
    }
    updateHealth = (currentHealth, interval) => {
        if (this.isTakingDamageTime <= 0 && this.health != currentHealth) {
            this.isTakingDamageTime = 100;
            this.health = currentHealth;
            return;
        };
        if (this.isTakingDamageTime > 0) this.isTakingDamageTime -= interval;
    }
    draw = () => {
        // context.strokeStyle = "red";
        // context.lineWidth = 6;
        context.fillStyle = this.healthColor;
        if (this.health > 0) context.fillRect(this.x, this.y, this.health*2, this.height);
    }
}
class EnemyHealthComponent extends HealthComponent {
    constructor(color, x, y) {
        super(color, x, y);
        this.health = 50;
        this.height = 5;
    }
    updateHealthLocation = (x, y) => {
        this.x = x;
        this.y = y;
    }
}
// let x = 100;
let characterInput = new InputHandler;
let game1 = new Game;
let animate = (timeStamp) => {
    let deltaTime = timeStamp - lastTime;
    frameTimer += deltaTime;
    lastTime = timeStamp;
    if (frameTimer >= frameInterval) {
        context.clearRect(0,0, canvasWidth, canvasHeight);
        game1.updateGameProgress(deltaTime);
        frameTimer = 0;
    }
    if (isGameOver === true) {
        gameOverMenu.classList.remove("isNotGameOver");
    } else {
        gameOverMenu.classList.add("isNotGameOver");
    };
    if (isGameOver === false) requestAnimationFrame(animate);
}
loadImages(imageSources,() => {
    logImageObject();
    startGame();
});