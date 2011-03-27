function Planet(x, y, mass, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.currentRadius = radius;
    this.mass = mass
    this.r = 100;
    this.g = 20;
    this.b = 0;
    this.angle =  Math.random() * Math.PI;
    this.rotationRate = 0.01;
    this.isStar = true;
    this.isDead = false;
    this.isHappy = false;
}

Planet.prototype.applyGravity = function(p) {
    if(this.isDead) return;
    var r2 = distanceSquared(p.x, p.y, this.x, this.y)
    var r = distance(p.x, p.y, this.x, this.y)
    
    
    var gx = (this.x - p.x) / r;
    var gy = (this.y - p.y) / r;
    
    var grav = ((G*this.mass)/r2);
    
    if(r < this.currentRadius) {
        //collision 
        p.x = this.x - gx*this.currentRadius
        p.y = this.y - gy*this.currentRadius
        
        reflected = reflect(p.vx, p.vy, gx, gy)
        p.vx = reflected[0]*0.8
        p.vy = reflected[1]*0.8
        this.rotationRate += .001;
        if(this.rotationRate > dt*8) this.rotationRate = dt*8;
        this.currentRadius -= 0.02
        
    } else {
        p.vx += gx * grav;
        p.vy += gy * grav;
    }
    
}

Planet.prototype.update = function() {
    this.currentRadius += .005
    if(this.currentRadius > this.radius) {
        this.currentRadius = this.radius
    }
    
    if(this.currentRadius < this.radius * 0.6) {
        this.isDead = true;
    }
    
    this.angle += this.rotationRate;
    this.rotationRate -= .001;
    if(this.rotationRate < 0.01) this.rotationRate = 0.01;
}

Planet.prototype.draw = function(ctx) {
    if(this.isDead) return;
    
    if(this.isStar) {
        this.drawStar(ctx)
    } else {
        var r = this.currentRadius;
        ctx.lineWidth = 7
        ctx.fillStyle = 'rgb(' + [this.r, this.g, this.b].join(',') + ')'
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2, false); // Outer circle
        ctx.fill();
        
        //eyes
        ctx.fillStyle = 'rgb(' + [0, 0, 0].join(',') + ')'
        ctx.beginPath();
        ctx.arc(this.x - r/3, this.y - r/3, r/10, 0, Math.PI * 2, false); // Outer circle
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + r/3, this.y - r/3, r/10, 0, Math.PI * 2, false); // Outer circle
        ctx.fill();
        
        //mouth
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(' + [0, 0, 0].join(',') + ')'
        if(this.isHappy){
            ctx.arc(this.x, this.y, r*.5, Math.PI, Math.PI * 2, true); // Outer circle
        } else {
            ctx.arc(this.x, this.y+r/2, r*.5, Math.PI, Math.PI * 2, false); // Outer circle
        }
        
        ctx.stroke();
        
    }
    
}

Planet.prototype.drawStar = function(ctx) {
    
    angle1 = this.angle + (Math.random()-0.5)
    angle2 = Math.random() * 2 * Math.PI
    angle3 = this.angle
    var r = this.currentRadius
    var sx = this.x
    var sy = this.y
    
    var szratio = this.currentRadius / this.radius;
    if(szratio < 0.5) {
        r = r - (szratio * Math.random() * 10)
    }
    
    ctx.globalCompositeOperation = 'lighter'
    ctx.lineWidth = 7
    ctx.strokeStyle = 'rgb(' + [4, 1, 0].join(',') + ')'
    ctx.beginPath();
    ctx.arc(this.x,this.y,r,0, Math.PI * 2,false); // Outer circle
    ctx.stroke();
    
    for(var i=0; i < 8; i++) {
        var angle = angle3 + (i/8) * Math.PI*2;
        var offset = angle3 + Math.random() - 0.5
        
        var midx = this.x + Math.cos(angle)*this.radius*1.25*Math.random()
        var midy = this.y + Math.sin(angle)*this.radius*1.25*Math.random()
        
        
        /*ctx.fillStyle = 'rgb(' + [0, 128, 200].join(',') + ')'
        ctx.beginPath();
        ctx.arc(this.x,this.y,r, 0, Math.PI*2,false); // Outer circle
        ctx.fill();*/
        
        
        
        ctx.strokeStyle = 'rgb(' + [this.r, this.g, this.b].join(',') + ')'
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(sx, sy)
        ctx.lineTo(midx, midy)
        ctx.lineTo(this.x + Math.cos(angle)*r*0.75, this.y + Math.sin(angle)*r*0.75)
        ctx.stroke()
    }
    
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = 'rgb(' + [255, 255, 255].join(',') + ')'
    ctx.beginPath();
    ctx.arc(this.x - r/3, this.y - r/3, r/10, 0, Math.PI * 2, false); // Outer circle
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + r/3, this.y - r/3, r/10, 0, Math.PI * 2, false); // Outer circle
    ctx.fill();
    
    //mouth
    if(this.currentRadius >= this.radius * .8) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, r*.5, Math.PI, Math.PI * 2, true); // Outer circle
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y + r * .15, r*.25, 0, Math.PI * 2, true); // Outer circle
        ctx.fill();
    }
    
}
