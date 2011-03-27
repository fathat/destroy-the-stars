
function Particle(x, y, color) {
    this.x = x;
    this.y = y;
    this.ox = 0;
    this.oy = 0;
    this.vx = 0;
    this.vy = 0;
    this.life = 5;
    this.maxLife = 5;
    this.color = color;
}


Particle.prototype.getColorStr = function () {
    var r = this.color[0]//Math.floor(0.0)//*(this.life / this.maxLife))
    var g = this.color[1]//Math.floor(64.0)//* (this.life / this.maxLife))
    var b = this.color[2]//Math.floor(255.0)//* (this.life / this.maxLife))
    var a = (this.life / this.maxLife)
    if(this.life < 1) {
        a = (this.life / 1.0)
    } else {
        a = 1
    }
    
    return "rgba(" + [r,g,b,a].join(',') +  ")"
}


Particle.prototype.update = function () {
    this.ox = this.x;
    this.oy = this.y;
    this.x = this.x + this.vx * dt
    this.y = this.y + this.vy * dt
    this.life -= dt;
}

