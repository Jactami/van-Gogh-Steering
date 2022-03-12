class Particle {

    constructor(x, y, dir, lifespan, lifespanVar, r, rVar, c, alpha) {
        this.maxVel = 1;
        this.maxForce = 0.1;
        this.pos = createVector(x, y);
        this.vel = dir.setMag(this.maxVel);
        this.acc = createVector(0, 0);
        this.lifespan = random(lifespan - lifespanVar * lifespan, lifespan + lifespanVar * lifespan);
        this.life = this.lifespan;
        this.r = random(r - r * rVar, r + r * rVar);
        this.c = c;
        this.alpha = alpha;
    }

    steer(field) {
        let prediction = p5.Vector.add(this.pos, this.vel);
        let x = constrain(prediction.x, 0, width - 1);
        let y = constrain(prediction.y, 0, height - 1);
        let desired = field.getVectorAtPos(x, y).copy();
        desired.setMag(this.maxVel);
        let force = desired.sub(this.vel);
        force.limit(this.maxForce);
        this.acc = force;
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxVel)
        this.pos.add(this.vel);
        this.life--;
    }

    isDead() {
        return this.life < 0;
    }

    isOutside(maxW, maxH) {
        return this.pos.x > maxW || this.pos.x < 0 || this.pos.y > maxH || this.pos.y < 0;
    }

    show() {
        noStroke();
        this.c[3] = map(this.life, 0, this.lifespan, 0, this.alpha);
        fill(this.c);
        circle(this.pos.x, this.pos.y, this.r * 2);
    }
}