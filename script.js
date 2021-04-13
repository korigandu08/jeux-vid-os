const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const scoreEL = document.querySelector('#scoreEL')
const startGameBtn = document.querySelector('#startGameBtn')
const modalEl = document.querySelector('#modalEl')
const bigScoreEl = document.querySelector('#bigScoreEl')

c.font = '50px Georgia';

let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
  });
  canvas.addEventListener('mouseup', function(){
    mouse.click = false;
  })  
  const playerLeft = new Image();
  playerLeft.src ='fish_blue_swimleft.png';  
  class Player {
      constructor(){
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 30;
        this.angle = 20;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 500;
        this.spriteHeight = 300;
      }
      update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta =Math.atan2(dy, dx);
        this.angle = theta;
        if (mouse.x != this.x) {
          this.x -= dx/20;
        }
        if (mouse.y != this.y) {
          this.y -= dy/20;
        }
      }
      draw(){
        if (mouse.click) {
          c.lineWidth = 0.2;
          c.beginPath();
          c.moveTo(this.x, this.y);
          c. lineTo(mouse.x, mouse.y);
          c.stroke();
        }
        c.fillStyle = 'transparent';
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fill();
        c.closePath();
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        c.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight,
           0 - 60,  0 - 45, this.spriteWidth/6, this.spriteHeight/6);
        c.restore();
      }
          }
  
    const project = new Image();
    project.src ='bubble.png';  
    class Projectile {
        
        constructor(x, y, radius, color, velocity){
            this.x = x
            this.y = y
            this.radius = 20
            this.color = color
            this.velocity = velocity
            this.spriteWidth = 500;
            this.spriteHeight = 500;
            this.frameX = 0;
            this.frameY = 0;
            this.frame = 0;
            }
            update() {
            this.draw()
            this.x = this.x + this.velocity.x
            this.y = this.y + this.velocity.y
        
            }
            
            draw(){
            c.fillStyle = 'transparent';
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            c.fill();
            c.closePath();
            c.save();
            c.translate(this.x, this.y);
            c.rotate(this.angle);
            c.drawImage(project, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight,
             0 - 40,  0 - 45, this.spriteWidth/6, this.spriteHeight/6);
            c.restore();
            }
        
}
const enemy = new Image();
enemy.src ='alien.png';  

class Enemy {
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = 60
        this.color = color
        this.velocity = velocity
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 1000;
        this.spriteHeight = 1000;
    }
    
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y

    }
    
    draw(){
        c.fillStyle = 'transparent';
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fill();
        c.closePath();
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        c.drawImage(enemy, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight,
           0 - 40,  0 - 45, this.spriteWidth/8, this.spriteHeight/8);
        c.restore();
    }

    
}

const friction = 0.98
class Particle {
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    
    draw(){
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01

    }
}


const x = canvas.width / 2
const y = canvas.height / 2

let player = new Player(x, y, 15, 'white')
let projectiles = []
let enemies = []
let particles = []

function init() {
    player = new Player(x, y, 15, 'white')
    projectiles = []
    enemies = []
    particles = []
    score = 0
    scoreEL.innerHTML = score
    bigScoreEl.innerHTML = score
}

function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (25) + 5

        let x
        let y

        if (Math.random() < 0.5) {        
             x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
             y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius

        }

        const color = `hsl(${Math.random() * 360}, 50%, 50%)`
        const angle = Math.atan2(player.y - y, 
            player.x - x)
        const velocity = {
            x: Math.cos(angle) * 3,
            y: Math.sin(angle) * 3
        }
    enemies.push(new Enemy(x, y , radius, color, velocity))
    }, 250)
}
let animationId
let score = 0
let gameFrame = 0;
let gameOver = false;
function animate() { 
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0, 0, 0, 10)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    player.update()
    particles.forEach((particle, index) => {
        if(particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {particle.update()}
    });
    projectiles.forEach((projectile, index) => {
        projectile.update()

        if(projectile.x - projectile.radius < 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
                }, 0)

        }
    })
   
    enemies.forEach((enemy, index) => {
        enemy.update()

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (dist - enemy.radius - player.radius < 1) {
        cancelAnimationFrame(animationId)
        modalEl.style.display = 'flex'
        bigScoreEl.innerHTML = score
        }
        projectiles.forEach ((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
                //collision projectile et ennemis
            if (dist - enemy.radius - projectile.radius < 1) {

                //explosions 
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {x: (Math.random() - 0.5) * (Math.random() * 6), y: (Math.random() - 0.5) * (Math.random() * 6)}))
                }
            //    if (enemy.radius - 10 > 10){
                //incrémentation score
             //   score += 100
             //   scoreEL.innerHTML = score

                //    enemy.radius -= 30
              //      setTimeout(() => {
              //          projectiles.splice(projectileIndex, 1)
              //          }, 0)
             //   } else {

                 //incrémentation score
                score += 500
                scoreEL.innerHTML = score

                setTimeout(() => {
                enemies.splice(index, 1)
                projectiles.splice(projectileIndex, 1)
                }, 0)
             //   }
            }
        })
    })
}
//setInterval (animate, 1000/60);

let xPosition;
let yPosition;

document.onmousemove = setCursorXY;

function setCursorXY(event) {
    const xTextNode = document.querySelector('.x-text');
    const yTextNode = document.querySelector('.y-text');

    xPosition = event.clientX;
    yPosition = event.clientY;

    xTextNode.innerHTML = `X position: ${xPosition}`;
    yTextNode.innerHTML = `Y position: ${yPosition}`;
}
document.onkeydown = function(event) {
    const angle = Math.atan2(yPosition - player.y, xPosition - player.x)
        const velocity = {
        x: Math.cos(angle) * 12 ,
        y: Math.sin(angle) * 12
    }
    if (event.key === 'z') {
        projectiles.push(new Projectile(player.x, player.y, 5, 'white', velocity))
        };
    }


startGameBtn.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    modalEl.style.display = 'none'
})



/////////////////////// SCRIPT BDD ///////////////////////

function getScore() {
    const scoreboardContainerNode = document.querySelector(
        '.scoreboard-container'
    );

    scoreboardContainerNode.innerHTML = '';

    fetch('http://localhost:8080/scoreboard')
        .then((r) => r.json())
        .then((d) => {
            for (score of d) {
                const playerParagraphNode = document.createElement(
                    'p'
                );
                playerParagraphNode.innerText = score.player;

                const scoreParagraphNode = document.createElement(
                    'span'
                );
                scoreParagraphNode.innerText = score.score;

                const separatorNode = document.createElement('hr');

                scoreboardContainerNode.appendChild(
                    playerParagraphNode
                );
                scoreboardContainerNode.appendChild(
                    scoreParagraphNode
                );
                scoreboardContainerNode.appendChild(separatorNode);
            }
        });
}

getScore();

const playerInputNode = document.querySelector('.player-input');
const submitBtnNode = document.querySelector('.submit-btn');
submitBtnNode.addEventListener('click', (e) => {
    e.preventDefault();

    if (!playerInputNode.value) {
        return;
    }

    fetch('http://localhost:8080/score', {
        method: 'POST',
        body: JSON.stringify({
            player: playerInputNode.value,
            score: score,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(() => getScore());
});