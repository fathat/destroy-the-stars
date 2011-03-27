//delta time
dt = (1/30.0);
G = 9.8 ;

/* Particle Stream */
function ParticleStream(scene, startx, starty, vx, vy, rgb, particleCount) {
    this.startx = startx;
    this.starty = starty;
    this.vx = vx;
    this.vy = vy;
    this.particles = []
    this.scene = scene
    for(var i=0; i<particleCount; i++) {
        var p = new Particle(startx, starty, rgb)
        this.resetParticle(p)
        this.particles.push(p)
    }
}

ParticleStream.prototype.resetParticle = function (p) {
    p.x = this.startx + Math.random()*30-15;
    p.y = this.starty + Math.random()*30-15;
    p.ox = p.x;
    p.oy = p.y;
    p.vx = this.vx
    p.vy = this.vy
    p.life = Math.random() * 20
    p.maxLife = p.life;
    return p
}

ParticleStream.prototype.update = function() {
    for(var i=0; i<this.particles.length; i++) {
        this.particles[i].update()
        
        for(var planetIndex in this.scene.planets) {
            var planet = this.scene.planets[planetIndex]
            planet.applyGravity(this.particles[i])
        }
        
        if(this.particles[i].life < 0 ) {
            this.resetParticle(this.particles[i])
        }
    }
}

ParticleStream.prototype.draw = function() {
    var ctx = particleBuffer.getContext('2d');
    var p = this.particles;
    for(var i=0; i<this.particles.length; i++) {
        var grad = ctx.createRadialGradient(p[i].ox, p[i].oy, 0, p[i].x, p[i].y, 10)
        if(this.particles[i].color[1] > this.particles[i].color[2]) {
            grad.addColorStop(0, "#001100")
            grad.addColorStop(1, "#000000")
        } else {
            grad.addColorStop(0, "#000011")
            grad.addColorStop(1, "#000000")
        }
        
        ctx.fillStyle = grad;
        ctx.rect(p[i].x - 10, p[i].y - 10, 20, 20);
        ctx.fill();
        
        ctx.strokeStyle = p[i].getColorStr()
        ctx.lineWidth = 1
        ctx.beginPath();
        ctx.moveTo(p[i].ox, p[i].oy);
        ctx.lineTo(p[i].x, p[i].y);
        ctx.stroke();
    }
}


function start() {
    setInterval('update()', 16)
    
    //clear screen to black
    
    var canvas = document.getElementById('game-canvas');
    var ctx = canvas.getContext('2d');
    
    //clear background
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect (0, 0, canvas.width, canvas.height);
   

    //setup render target for particles
    window.particleBuffer = document.createElement('canvas');
    window.particleBuffer.width = canvas.width;
    window.particleBuffer.height = canvas.height;
    
    window.planetBuffer = document.createElement('canvas');
    window.planetBuffer.width = canvas.width;
    window.planetBuffer.height = canvas.height;
    
    //fill planet buffer with stars
    var planetctx = window.planetBuffer.getContext('2d');
    
    for(var i=0; i<300; i++) {
        var x = Math.random() * canvas.width;
        var y = Math.random() * canvas.height;
        
        planetctx.fillStyle = 'rgb(' + [200, 200, 240].join(',') + ')'
        planetctx.beginPath();
        planetctx.arc(x, y, 1, 0, Math.PI * 2, false); // Outer circle
        planetctx.fill();
    }
    
    window.scene = new Scene();
    
    
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMoved, false);
    
}

selectedPlanet = null;

function mouseDown(e) {
    var canvas = document.getElementById('game-canvas');
    var x = e.clientX-canvas.offsetLeft;
    var y = e.clientY-canvas.offsetTop;
    for(var i=0; i<scene.planets.length; i++) {
        var p = scene.planets[i];
        
        if(!p.isStar && distance(x, y, p.x, p.y) < p.currentRadius) {
            window.selectedPlanet = p;
        }
    }
}

function mouseMoved(e) {
    var canvas = document.getElementById('game-canvas');
    var x = e.clientX-canvas.offsetLeft;
    var y = e.clientY-canvas.offsetTop;
    if(window.selectedPlanet) {
        window.selectedPlanet.x = x;
        window.selectedPlanet.y = y;
    }
}

function mouseUp(e) {
    window.selectedPlanet = null;
}

function update() {
    var canvas = document.getElementById('game-canvas');
    var mainctx = canvas.getContext('2d');
    var ctx = particleBuffer.getContext('2d');
    
    //clear background
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect (0, 0, canvas.width, canvas.height);
    
    mainctx.fillStyle = "rgba(0, 0, 0, 1)";
    mainctx.fillRect (0, 0, canvas.width, canvas.height);
    
    
    
    
    //draw particles
    ctx.globalCompositeOperation = 'lighter'
    
    for(var i=0; i<scene.particleStreams.length; i++) {
        scene.particleStreams[i].update()
        scene.particleStreams[i].draw()
    }
    
    mainctx.drawImage(particleBuffer, 0, 0)
    mainctx.drawImage(window.planetBuffer, 0, 0)
    
    var livingStars = 0;
    var livingPlanets = 0;
    for(var planetIndex in scene.planets) {
        var planet = scene.planets[planetIndex]
        planet.update()
        
        if(planet.isStar) {
            planet.draw(ctx)
            if(!planet.isDead) {
                livingStars ++;
            }
        }
        else
        {
            if(!planet.isDead) {
                livingPlanets++;
            }
            planet.draw(mainctx)
        }
    }    
    
    //check for win condition
    if(livingStars == 0) {
        for(var planetIndex in scene.planets) {
            var planet = scene.planets[planetIndex]
            planet.isHappy = true;
        }
        
        $('#win').show()
    }
    
    //check for loss condition
    else if(livingPlanets == 0) {
        $('#win').show()
        $('#win').text('Oh no! All planets are dead. Refresh the browser to try again.')
    }
    
    
    scene.tick += dt;
}