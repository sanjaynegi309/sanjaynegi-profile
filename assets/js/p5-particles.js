let particles = [];
let mouse = { x: 0, y: 0 };
let canvas;
let p5Instance;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-1');

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 50 : 100;

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    p5Instance = this;
}

function draw() {
    clear();
    mouse.x = mouseX;
    mouse.y = mouseY;
    stroke(0, 212, 255, 30);
    strokeWeight(1);
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let distance = dist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
            if (distance < 150) {
                let alpha = map(distance, 0, 150, 50, 0);
                stroke(0, 212, 255, alpha);
                line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
            }
        }
    }
    for (let particle of particles) {
        particle.update();
        particle.draw();
        particle.connectToMouse(mouse);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-1, 1), random(-1, 1));
        this.acc = createVector(0, 0);
        this.size = random(2, 5);
        this.color = color(random([0, 255, 138]), random([212, 0, 51]), random([255, 255, 236]));
    }
    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
        if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
        this.pos.x = constrain(this.pos.x, 0, width);
        this.pos.y = constrain(this.pos.y, 0, height);
        this.vel.limit(2);
    }
    draw() {
        noStroke();
        fill(red(this.color), green(this.color), blue(this.color), 150);
        ellipse(this.pos.x, this.pos.y, this.size);
        fill(red(this.color), green(this.color), blue(this.color), 50);
        ellipse(this.pos.x, this.pos.y, this.size * 2);
    }
    connectToMouse(mouse) {
        let distance = dist(this.pos.x, this.pos.y, mouse.x, mouse.y);
        if (distance < 200) {
            let alpha = map(distance, 0, 200, 100, 0);
            stroke(255, 0, 110, alpha);
            strokeWeight(2);
            line(this.pos.x, this.pos.y, mouse.x, mouse.y);
            let force = createVector(mouse.x - this.pos.x, mouse.y - this.pos.y);
            force.normalize();
            force.mult(0.01);
            this.acc.add(force);
        }
    }
}

// Expose p5 instance to the window object for site.js to access
window.p5 = {
    instance: p5Instance,
};
