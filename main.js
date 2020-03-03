// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}


function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}

function EvilCircle(x, y, velX, velY, exists) {
    Shape.call(this, x, y, 15, 15, exists);
    this.color = 'white';
    this.size = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);

Ball.prototype = Object.create(Shape.prototype);

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

EvilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}

Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

EvilCircle.prototype.checkBounds = function () {
    if ((this.x + this.size) >= width) {
        this.x = 0 + this.size + 1;
    }

    if ((this.x - this.size) <= 0) {
        this.x = width - this.size - 1;
    }

    if ((this.y + this.size) >= height) {
        this.y = 0 + this.size + 1;
    }

    if ((this.y - this.size) <= 0) {
        this.y = height - this.size - 1;
    }
}

EvilCircle.prototype.setControls = function () {
    let _this = this;
    window.onkeydown = function (e) {
        if (e.key === 'a') {_this.x -= _this.velX; }
        if (e.key === 'd') {_this.x += _this.velX; }
        if (e.key === 'w') {_this.y -= _this.velY; }
        if (e.key === 's') {_this.y += _this.velY; }
    }
}

EvilCircle.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
            }
        }
    }
}

Ball.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
                balls[j].size = Math.random() * (25 - 10) + 10;
            }
        }
    }
}

let balls = [];
let Circle = new EvilCircle(width / 2, height / 2, 15, 15, true, 'white', 10);
Circle.setControls();

while (balls.length < 30) {
    let size = random(10, 20);
    let ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        exists = true,
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size
        );
        balls.push(ball);
    }
    
    function loop() {
    let count = balls.length;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw();
        }
        if (balls[i].exists == false) {
            count -= 1;
        }
        balls[i].update();
        balls[i].collisionDetect();
        
    }
    Circle.draw();
    Circle.checkBounds();
    Circle.collisionDetect();
    
    requestAnimationFrame(loop);
    document.getElementById('count').innerHTML = 'Ball Count:' + ' ' + count;
}

loop();