/** @typeof {HTMLCanvasElement} */

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const gameOverMenu = document.getElementById("gameOverMenu");
const tryAgainButton = document.getElementById("tryAgain");
const startGameButton = document.getElementById("startGame");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 150;
const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;
let frameTimer = 0;
let frameInterval = 50;
let lastTime = 0;
let load = 0;
let images = {};
let isGameOver = false;
let isGameWin = false;
let isFirstStart = false;
let isAllResourcesLoaded = false;

const imageSources = [
    "page_resources/images/forest_adventure_assets/Animal_Wildlife/Bear.png",
    "page_resources/images/forest_adventure_assets/Animal_Wildlife/Beatle.png",
    "page_resources/images/forest_adventure_assets/Animal_Wildlife/enemy1.png",
    "page_resources/images/forest_adventure_assets/Animal_Wildlife/Bear_Attack.png",
    "page_resources/images/forest_adventure_assets/Kobold_Warrior/RUN.png",
    "page_resources/images/forest_adventure_assets/Kobold_Warrior/RUN_Reverse.png",
    "page_resources/images/forest_adventure_assets/Samurai/ATTACK_1.png",
    "page_resources/images/forest_adventure_assets/Samurai/ATTACK_1_REVERSE.png",
    "page_resources/images/forest_adventure_assets/Samurai/HURT.png",
    "page_resources/images/forest_adventure_assets/Samurai/IDLE.png",
    "page_resources/images/forest_adventure_assets/Samurai/RUN.png",
    "page_resources/images/forest_adventure_assets/Samurai/RUN_REVERSE.png",
    "page_resources/Background/Map_1.png",
    "page_resources/Background/Map_2.png",
];
const scaleFactor = 2;
class Boundary {
    static width = 16* scaleFactor;
    static height = 16* scaleFactor;
    constructor (position) {
        this.position = position
        this.x = this.position.x;
        this.y = this.position.y;
        this.height = 16* scaleFactor;
        this.width = 16* scaleFactor;
    }
    getCharacterCollision = () => {
        return this;
    }
    draw = () => {
        context.fillStyle = "rgb(255,0,0, 0.5)";
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
let collision_point = [];
    let boundaries = [];
let healing_zone = [];
let healingBoundaries = [];
    for (i = 0; i< map_collision.data.length ; i+= map_collision.width) {
        collision_point.push(map_collision.data.slice(i, map_collision.width + i));
    }
    collision_point.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol === 839) {
                boundaries.push(new Boundary({
                    x:j*Boundary.width,
                    y:i*Boundary.height,
                }))
            };
        })
    })
    for (i = 0; i< HEALING_ZONE.data.length ; i+= HEALING_ZONE.width) {
        healing_zone.push(HEALING_ZONE.data.slice(i, HEALING_ZONE.width + i));
    }
    
    healing_zone.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol === 2397) {
                healingBoundaries.push(new Boundary({
                    x:j*Boundary.width,
                    y:i*Boundary.height,
                }))
            };
        })
    })
    
// const gameSaved = {
//     characterHp: 100,
//     enemyLeft: [ new BeatleEnemy ],
//     gameStage: 1,
// }
class mobileGamePad {
    constructor() {
        this.x = 100;
        this.y = canvasHeight - 100;
        this.xInnerPad = this.x;
        this.yInnerPad = this.y;
        this.width = 100;
        this.height = 200;
        this.radius = this.width/2;
        this.secondRadius = this.width/4;
        this.moveDirectionX = 0;
        this.moveDirectionY = 0;
        this.isDragged = false;
        this.keys = [];
        this.xAttack = canvasWidth - 100;
        this.yAttack = this.y;
        this.yInteract = this.y - 100
    };
    draw = () => {        
        context.save();
        context.beginPath();
        context.strokeStyle = "whitesmoke"
        context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        context.stroke();
        context.restore();
        context.save();
        context.fillStyle = "whitesmoke";
        context.beginPath();
        context.arc(this.xInnerPad, this.yInnerPad, this.secondRadius, 0, Math.PI*2);
        context.fill();
        context.stroke();
        context.restore();
        context.save();
        context.beginPath();
        context.strokeStyle = "whitesmoke"
        context.fillStyle = "whitesmoke";
        context.arc(this.xAttack, this.y, this.radius, 0, Math.PI*2);
        context.fillText("Attack",this.xAttack - this.secondRadius, this.yAttack + 5);
        // context.fillRect(this.xAttack - this.radius, this.yAttack , 100, 100);
        context.stroke();
        context.restore();
        context.save();
        context.beginPath();
        context.strokeStyle = "whitesmoke"
        context.fillStyle = "whitesmoke";
        context.arc(this.xAttack, this.yInteract, this.secondRadius, 0, Math.PI*2);
        context.fillText("i",this.xAttack - 5, this.yInteract + 5);
        context.stroke();
        context.restore();
    }
    moveGamePad = () => {
        canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const touchCoordinate = e.touches[0];
            if (touchCoordinate.clientX < this.xAttack + this.radius && touchCoordinate.clientX > this.xAttack - this.radius &&
                touchCoordinate.clientY - rect.top < this.yAttack + this.radius &&touchCoordinate.clientY - rect.top > this.yAttack - this.radius) {
                this.keys.push("k");                
            };
            if (touchCoordinate.clientX < this.xAttack + this.radius && touchCoordinate.clientX > this.xAttack - this.radius &&
                touchCoordinate.clientY - rect.top < this.yInteract + this.radius &&touchCoordinate.clientY - rect.top > this.yInteract - this.radius) {
                this.keys.push("i");                
            };
            if ((touchCoordinate.clientX) >= this.x - this.radius  && 
            touchCoordinate.clientX <= this.x  + this.radius &&
            (touchCoordinate.clientY - rect.top) >= this.y - this.radius &&
            (touchCoordinate.clientY - rect.top) <= this.y + this.radius) {
                this.isDragged = true;
                this.xInnerPad = touchCoordinate.clientX;
                this.yInnerPad = touchCoordinate.clientY - rect.top;
                }
        })
        canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            if (this.isDragged) {
                const rect = canvas.getBoundingClientRect();
                const touchCoordinate = e.touches[0];
                this.isDragged = true;
                    this.xInnerPad = Math.max(this.x - this.radius,Math.min(touchCoordinate.clientX, this.x + this.radius));
                    this.yInnerPad = Math.max(this.y - this.radius ,Math.min(touchCoordinate.clientY - rect.top, this.y + this.radius));
                    if (this.xInnerPad > this.x && this.keys.indexOf("d") === -1) {
                        this.keys.push("d");
                        if (this.keys.includes("a")) this.keys.splice(this.keys.indexOf("a"), 1);
                    } 
                    if (this.xInnerPad < this.x && this.keys.indexOf("a") === -1){
                        this.keys.push("a");
                        if (this.keys.includes("d")) this.keys.splice(this.keys.indexOf("d"), 1);
                    } 
                    if (touchCoordinate.clientY - rect.top < this.y && this.keys.indexOf("w") === -1) {
                        this.keys.push("w");
                        if (this.keys.includes("s")) this.keys.splice(this.keys.indexOf("s"), 1);
                    } 
                    if (touchCoordinate.clientY - rect.top > this.y && this.keys.indexOf("s") === -1){
                        this.keys.push("s");
                        if (this.keys.includes("w")) this.keys.splice(this.keys.indexOf("w"), 1);
                    } 
                    
                    // }
            }
        })
        canvas.addEventListener("touchend", (e) => {
            e.preventDefault();
            this.isDragged = false;
            this.xInnerPad = this.x;
            this.yInnerPad = this.y;
            this.moveDirectionX = 0;
            this.moveDirectionY = 0;
            this.keys = []
        })
    }
    getKeys = () => {
        return this.keys;
    }
}
const characterStates = {
    attack: 0,
    attackReverse: 1,
    hurt: 2,
    idle: 3,
    run: 4,
    runReverse: 5,
}
let heal = (keys, healthComponent, deltaTime) => {
    const healAmount = 10
    if (keys.includes("i") && frameTimer >= frameInterval) {
        healthComponent.healUp(healAmount, deltaTime);
    }
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
        isAllResourcesLoaded = true;
        callback();
    };
}
let logImageObject = () => {
    console.log("images loaded", images);
}
let startGame = () => {
    if (isAllResourcesLoaded) {
        startGameContainer.classList.add("isNotGameOver");
        game1.startGame();
        isGameOver = false;
        isGameWin = false;
        animate(0);
    }
}
tryAgainButton.addEventListener("click", startGame);
startGameButton.addEventListener("click", startGame);
let waveNumber = 1;
let waveEnemiesAmount = 5*waveNumber;
class Game {
    constructor() {
        this.samurai = new Character(30, 150);
        this.health = new HealthComponent;
        this.movingPad = new mobileGamePad;
        this.enemyArray = [];
        this.bossArray = [];
        this.allEnemies = [];
        this.cameraX = 0;
        this.cameraY = 0;
        this.movingPad.moveGamePad();
    }
    updateGameProgress = (deltaTime) => {
        if (this.samurai.healthComponent.health <= 0) isGameOver = true;
        this.allEnemies = [...this.enemyArray,...this.bossArray];
        characterInput.keys = this.movingPad.getKeys();
        let characterCollisionProperty = checkIsCollide(this.samurai, this.allEnemies);
        let characterAttackHitProperty = checkIsCollide(this.samurai.attackBox,this.allEnemies);
        if (characterCollisionProperty.isCollide) this.samurai.takingDamage(characterCollisionProperty.secondCollider.damage, deltaTime);
        if (characterAttackHitProperty.isCollide) characterAttackHitProperty.secondCollider.takingDamage(this.samurai.attack(characterInput.keys), deltaTime);
        if (checkIsCollide(this.samurai, healingBoundaries).isCollide) {
            heal(characterInput.keys, this.samurai.healthComponent, deltaTime);
        }
        
        this.samurai.updateMovement(characterInput.keys, this.samurai.healthComponent.health, boundaries);
        this.samurai.updateAnimation();
        this.enemyArray = this.enemyArray.filter((res) => !res.isDeletion);
        this.bossArray = this.bossArray.filter((res) => !res.isDeletion);
        this.enemyArray.forEach((res) => {
            res.updateAnimation();
            res.autoMoving(deltaTime);
        })
        this.bossArray.forEach((res) => {
            res.updateAnimation();
            res.approachingLocation({
            x: this.samurai.x,
            y: this.samurai.y,
            width: this.samurai.width,
            height: this.samurai.height,
        }, deltaTime);
        })
        this.spawnWave(this.allEnemies);
    }
    cameraPanning = (keys,speed) => {
        if (keys.includes("ArrowRight")) {
            this.cameraX -= speed;
        };
        if (keys.includes("ArrowLeft")) {
            this.cameraX += speed;
        };
        if (keys.includes("ArrowUp")) {
            this.cameraY += speed;
        };
        if (keys.includes("ArrowDown")) {
            this.cameraY -= speed;
        };
        context.translate(this.cameraX, this.cameraY)

    }
    renderGame = () => {
        let scrollX = Math.min(Math.max(0, this.samurai.collision.x + this.samurai.collision.width - canvasWidth/2),960*scaleFactor - canvasWidth);
        let scrollY = Math.min(Math.max(0, this.samurai.collision.y + this.samurai.collision.height - canvasHeight/2),480*scaleFactor - canvasHeight) ;
        context.save();
        context.translate(-scrollX, -scrollY);
        context.drawImage(images.background_map_2, 0,0, 960, 480, 0, 0, 960*scaleFactor, 480*scaleFactor);
        this.samurai.draw();
        this.enemyArray.forEach((res) => {
            res.draw();
        });
        this.bossArray.forEach((res) => {
            res.draw();
        })
        if (checkIsCollide(this.samurai, healingBoundaries).isCollide) {
            context.fillStyle = "Whitesmoke";
            this.samurai.drawText("hold i to heal", 60, 90);
        }
        context.restore();
        this.movingPad.draw();
        context.font = "20px Arial";
        context.fillStyle = "whitesmoke";
        context.fillText(`Enemies remain ${this.allEnemies.length}`, 5, 50); 
        context.fillText(`Wave ${waveNumber}`, 5, 80); 
        this.samurai.healthComponent.draw();
    };
    startGame = () => {
        this.restoreHealth();
        waveNumber = 1;
            let bossAmount = 1;
            let reamainingEnemiesAmount = waveEnemiesAmount - bossAmount;
            this.bossArray = [];
            this.enemyArray = [];
            this.bossArray.push(...Array.from({ length: bossAmount}, () => new BossEnemy(50,0,0, 50)));
            this.enemyArray.push(...Array.from({ length: Math.floor(reamainingEnemiesAmount/2) }, () => new BeatleEnemy(5, 4, 5)));
            this.enemyArray.push(...Array.from({ length: Math.floor(reamainingEnemiesAmount/2) }, () => new Enemy(20, 4, 5)));
    }
    restoreHealth = () => {
        this.samurai.healthComponent.restoreHealth();
    }
    spawnWave = (allEnemies) => {
        if (allEnemies <= 0) {
            let bossAmount = 1;
            let reamainingEnemiesAmount = waveEnemiesAmount - bossAmount;
            this.bossArray.push(...Array.from({ length: bossAmount}, () => new BossEnemy(50,0,0,50 + 20*waveNumber)));
            this.enemyArray.push(...Array.from({ length: Math.floor(reamainingEnemiesAmount/2) }, () => new BeatleEnemy(5, 4, 5)));
            this.enemyArray.push(...Array.from({ length: Math.floor(reamainingEnemiesAmount/2) }, () => new Enemy(20, 4, 5)));
            waveNumber++;
            waveEnemiesAmount = 5*waveNumber;
        };
        return;
    }
}
class InputHandler {
    constructor() {
        this.keys = [];
        window.addEventListener("keydown", (e) => {
            if ((e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d" || e.key === "k" || e.key === "i" || e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key)
            };
        })
        window.addEventListener("keyup", (e) => {
            if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d" || e.key === "k" || e.key === "i" || e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
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
    getCharacterCollision = () => {
        return this;
    }
}
checkIsCollide = (firstCollider, colliders, xOffset = 0, yOffset = 0) => {
        let collisionProperty = {
            isCollide: false,
            secondCollider: {},
        }
        colliders.forEach((res) => {
            if ((firstCollider.getCharacterCollision().x + firstCollider.getCharacterCollision().width) >= res.getCharacterCollision().x + xOffset && 
                firstCollider.getCharacterCollision().x <= res.getCharacterCollision().x + xOffset + res.getCharacterCollision().width &&
                (firstCollider.getCharacterCollision().y + firstCollider.getCharacterCollision().height) >= res.getCharacterCollision().y + yOffset && 
                firstCollider.getCharacterCollision().y <= res.getCharacterCollision().y + yOffset + res.getCharacterCollision().height) {
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
        this.x = -50;
        this.y = 100;
        this.actionFrame = 0;
        this.speed = 2;
        this.actionImage = "samurai_idle";
        this.damage = damage;
        this.width = 1536/16;
        this.height = 96;
        this.healthComponent = new HealthComponent("green", 5, 5, maxHealth);
        this.collision = new CollisionBox(this.damage, this.x + 90, this.y + 100, this.width - 70, this.height - 25);
        this.attackBox = new CollisionBox(this.damage, this.x + 120, this.y + 100, this.width - 40, this.height - 25);
        this.isHurt = false;
        this.isTakingDamageTime = 0;
        this.direction = 1;
    }
    drawText = (text, textXOffset, textYOffset) => {
        context.fillText(text, this.x + textXOffset, this.y + textYOffset);
    }
    updateMovement = (keys, health, boundaries) => {
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
            if (!checkIsCollide(this, boundaries, 0, this.speed).isCollide) this.y-= this.speed;
        } 
        if (keys.includes("s")) {
            this.actionImage = "samurai_run"
            if (!checkIsCollide(this, boundaries, 0, -this.speed).isCollide) this.y+= this.speed;
        };
        if (keys.includes("a")) {
            this.direction = -1;
            this.actionImage = "samurai_run_reverse"
            if (!checkIsCollide(this, boundaries, this.speed).isCollide) this.x-= this.speed;
            
        }
        if (keys.includes("d")) {
            this.direction = 1;
            this.actionImage = "samurai_run";
            if (!checkIsCollide(this, boundaries, -this.speed).isCollide) {
                this.x+= this.speed;
            } 
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
        if (this.isTakingDamageTime > 0 && frameTimer >= frameInterval) this.isTakingDamageTime -= interval;
    }
    getCharacterCollision = () => {
        return this.collision;
    }
    updateAnimation = () => {
        if (frameTimer >= frameInterval) this.actionFrame++
        if (this.actionFrame > 6) this.actionFrame = 0;
    }
    draw = () => {
        this.collision.updateLocation(this.x + 90, this.y + 100);
        context.drawImage(images[this.actionImage], this.actionFrame * 1536/16, 0 , 672/7, 96, this.x, this.y, 200, 200);
        if (this.direction === 1) {
            this.attackBox.updateLocation(this.x + 120, this.y + 100);
        } else {
            this.attackBox.updateLocation(this.x + 10, this.y + 100);
        }
    }
}
class Enemy {
    constructor (damage, forwardRow, backwardRow, collisionXOffset = 0, collisionYOffset = 0, collisionWidth = 50, collisionHeight = 50, maxHealth = 50, sizeFactor = 2, colsCOunt = 3) {
        this.x = 300;
        this.y = canvasHeight/2 + Math.random()*200;
        this.actionFrame = 0;
        this.speed = Math.random() * 0.5 + 0.5;
        this.actionImage = "animal_wildlife_bear";
        this.damage = damage;
        this.width = 96/4;
        this.height = 336/14;
        this.direction = -1;
        this.directionY = 0;
        this.maxHealth = maxHealth
        this.sizeFactor = sizeFactor;
        this.changeDirectionTime = 0;
        this.forwardRow = forwardRow;
        this.backwardRow = backwardRow;
        this.actionRow = this.backwardRow;
        this.isTakingDamageTime = 0;
        this.collisionXOffset = collisionXOffset;
        this.collisionYOffset = collisionYOffset;
        this.needTurnBack = false;
        this.isDeletion = false;
        this.turnBackOffset = 100;
        this.collision = new CollisionBox(this.damage, this.x + collisionXOffset, this.y + collisionYOffset, collisionWidth, collisionHeight);
        this.enemyHealth = new EnemyHealthComponent("red", this.x + this.width/2, this.y + this.height, this.maxHealth);
    }
    getCharacterCollision = () => {
        return this.collision;
    }
    updateAnimation = () => {
        if(frameTimer >= frameInterval)this.actionFrame++;
        if (this.actionFrame > 3) this.actionFrame = 0;
    } 
    takingDamage = (damageTaken, interval) => {        
        if (this.isTakingDamageTime <= 0 && damageTaken != 0) {
            this.isTakingDamageTime = 100;
            this.enemyHealth.health -= damageTaken;
            return;
        };
        if (this.isTakingDamageTime > 0 && frameTimer >= frameInterval) this.isTakingDamageTime -= interval;
    }
    autoMoving = (deltaTime) => {
        if (this.changeDirectionTime >= 300) {
            if (this.x < this.turnBackOffset || this.x > canvasWidth - this.turnBackOffset) {
                this.needTurnBack = true;
                this.direction = this.direction*-1
            };
            if (this.y < this.turnBackOffset || this.y > canvasHeight - this.turnBackOffset) {
                this.needTurnBack = true;
                this.directionY = this.directionY*-1
            }
            if (this.needTurnBack && (this.x > this.turnBackOffset + 300 && this.x < canvasWidth - (this.turnBackOffset + 300)) &&
                (this.y > this.turnBackOffset + 300 && this.y < canvasHeight - (this.turnBackOffset + 300))) {
                this.needTurnBack = !this.needTurnBack;
            }
            if (!this.needTurnBack) {
                this.directionY = Math.random() < 0.5 ? -1 : 1;
                this.direction = Math.random() < 0.5 ? -1 : 1;
            }
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
        this.collision.updateLocation(this.x + this.collisionXOffset, this.y + this.collisionYOffset, this.width, this.height);
        this.enemyHealth.updateHealthLocation(this.x + this.width/2 - 50/2, this.y);
    }
    draw = () => {
        if (this.enemyHealth.health > 0) {
            this.enemyHealth.draw();
            context.drawImage(images[this.actionImage], this.actionFrame * this.width, this.actionRow * this.height, this.width, this.height, this.x, this.y, this.width* this.sizeFactor, this.height* this.sizeFactor);
        } else {
            this.isDeletion = true;
        }
    }
}
class BeatleEnemy extends Enemy {
    constructor (damage, forwardRow, backwardRow) {
        super(damage, forwardRow, backwardRow, 0 , 0, 50, 50, 50);
        // this.y = 200;
        this.actionImage = "animal_wildlife_beatle";
        this.width = 64/4;
        this.height = 224/14;
    }
}
class BossEnemy extends Enemy {
    constructor (damage, forwardRow, backwardRow, maxHealth = 100) {
        super(damage, forwardRow, backwardRow, 0 , 0, 50, 50, maxHealth, 0.8);
        this.actionImage = "kobold_warrior_run_reverse";
        this.width = 1184/8;
        this.height = 96;
        this.speed = 1;
        this.updateLastKnownLocationTime = 0;
        this.lastKnownLocation = {
            x:0,
            y:0,
            width:0,
            height:0,
        }
    }
    approachingLocation = (currentLocation, deltaTime) => {
        let directionX = ((this.lastKnownLocation.x+this.lastKnownLocation.width/2) - this.x) > 0 ? 1 : -1;
        let directionY = ((this.lastKnownLocation.y+this.lastKnownLocation.width/2) - this.y) > 0 ? 1 : -1;
        this.x += directionX*this.speed;
        this.y += directionY* this.speed;
        this.collision.updateLocation(this.x + this.collisionXOffset, this.y + this.collisionYOffset, this.width, this.height);
        this.enemyHealth.updateHealthLocation(this.x + this.width/2 - 50/2, this.y);
        if (this.updateLastKnownLocationTime <= 0) {
            this.lastKnownLocation = currentLocation;
            this.updateLastKnownLocationTime = 500;
        }
        if (this.updateLastKnownLocationTime > 0) this.updateLastKnownLocationTime -= deltaTime;
    }
}
class HealthComponent {
    constructor(color, x = 5, y = 5, maxHealth = 50, widthFactor = 2) {
        this.x = x;
        this.y = y;
        this.fullHealth = maxHealth
        this.health = this.fullHealth;
        this.height = 10;
        this.isTakingDamageTime = 0;
        this.healthColor = color;
        this.widthFactor = widthFactor;
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
    healUp = (healAmount, interval) => {
        if (this.isTakingDamageTime <= 0) {
            this.isTakingDamageTime = 100;
            this.health += healAmount;
            return;
        };
        if (this.isTakingDamageTime > 0) this.isTakingDamageTime -= interval;
    }
    draw = () => {
        context.fillStyle = this.healthColor;
        if (this.health > 0) context.fillRect(this.x, this.y, this.health*this.widthFactor, this.height);
    }
}
class EnemyHealthComponent extends HealthComponent {
    constructor(color, x, y, maxHealth, widthFactor = 1) {
        super(color, x, y, maxHealth, widthFactor);
        this.health = maxHealth;
        this.height = 5;
    }
    updateHealthLocation = (x, y) => {
        this.x = x;
        this.y = y;
    }
}

let characterInput = new InputHandler;
let game1 = new Game;
let animate = (timeStamp) => {
    let deltaTime = timeStamp - lastTime;
    frameTimer += deltaTime;
    lastTime = timeStamp;
    context.clearRect(0,0, canvasWidth, canvasHeight);
    game1.renderGame();
    game1.updateGameProgress(deltaTime);
    if (frameTimer >= frameInterval) {
        frameTimer = 0;
    }
    if (isGameOver === true) {
        gameOverMenu.querySelector("h3").innerHTML = "Game Over"
        gameOverMenu.classList.remove("isNotGameOver");
        
    } else if (isGameWin === true) {
        gameOverMenu.querySelector("h3").innerHTML = "Win";
        gameOverMenu.classList.remove("isNotGameOver");
    } else {
        gameOverMenu.classList.add("isNotGameOver");
    };
    if (isGameOver === false && isGameWin === false) requestAnimationFrame(animate);
}
loadImages(imageSources,() => {
    logImageObject();
    // if (isFirstStart) startGame();
});