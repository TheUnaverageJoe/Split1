title = "Astriodian";

description = `
Hold to fly up
release to fall
`;

characters = [
  `
   c
  cccc
   c
  cc
  `,
  `
    c
   cccc
 ccc
  `,
  ];
  
  const G = {
    WIDTH: 200,
    HEIGHT: 150,
    SPEED: 1,
    GRAVITY: 1,
  }
  
  options = {
    viewSize: {x: G.WIDTH, y: G.HEIGHT},
    seed: 8,
    isPlayingBgm: false,
    theme: "dark"
    
  }
  
  let player = {
    pos: vec(G.WIDTH * 0.2, G.HEIGHT * 0.7)
  };

  let goingUp = false;
  let astriods = []
  let shots = []
  let spawnTimer = 60
  let shotTimer = 0
  let gunCharge = 1

  function range(min, max) {
    return Math.random() * (max - min) + min;
  }

function update() {
  if (!ticks) {
    score = 0
    G.SPEED = 1
    player.pos = vec(G.WIDTH * 0.2, G.HEIGHT * 0.4)
  }

  shotTimer++
  if(shotTimer == 60){
    if(gunCharge < 5){
      gunCharge++
    }
    shotTimer = 0
  }
  spawnTimer--
  if(astriods.length < 2*difficulty && spawnTimer <=0){
    let rad = range(1, 5)
    astriods.push(new Astroid(G.WIDTH-rad, range(5, G.HEIGHT-5), rad, 0, 2*PI, range(1, 5)))
    spawnTimer = 60
  }

  
  astriods.forEach((rock)=>{
    let shot
    color("light_black")
    shot = arc(rock.x, rock.y, rock.radius, 2, rock.angleFrom, rock.angleTo).isColliding.rect.green
    color("red")
    rect(rock.x-rock.radius, rock.y-rock.radius*2, rock.health*2, 2)
    rock.scroll()
    color("light_blue")
    particle(
      rock.x, // x coordinate
      rock.y, // y coordinate
      2, // The number of particles
      1, // The speed of the particles
      0, // The emitting angle
      PI/4  // The emitting width
    );

    if(rock.shouldRemove(shot)){
      rock.destroy()
      rock = null
      astriods.shift()
    }
  });

  color("transparent")
  let smashed = char("a", player.pos).isColliding.rect.light_black
  if(smashed || player.pos.x<0 || player.pos.x>G.WIDTH || player.pos.y<0 || player.pos.y>G.HEIGHT){
    end()
    ticks = 0;
    while(astriods.length > 0){ astriods.pop().destroy() }
  }
  
  if(goingUp){
    color("cyan")
    char("a", player.pos)
    color("yellow")
    particle(
      player.pos.x - 1, // x coordinate
      player.pos.y, // y coordinate
      4, // The number of particles
      1, // The speed of the particles
      -4*PI/3, // The emitting angle
      PI/4  // The emitting width
    );
  }else{
    color("cyan")
    char('b', player.pos)
  }
  
  if(input.isJustPressed){
    let lineSeg = vec(input.pos.x-player.pos.x, input.pos.y-player.pos.y)
    lineSeg.normalize()
    shots.push(new Shot(player.pos.x, player.pos.y, lineSeg.x, lineSeg.y, gunCharge))
    gunCharge = 1
  }
  if(input.isPressed){
    goingUp = true
    player.pos.add(0, -1)
  }
  if(input.isJustReleased || !goingUp){
    goingUp = false
    player.pos.add(0, 1)
  }
  color("green")
  shots.forEach((shot)=>{
    let hit = box(shot.x, shot.y, shot.power).isColliding.rect.light_black
    if(hit){
      console.log("OOF")
      this.power--
    }
    shot.step()
    if(shot.shouldRemove()){
      shot = null
      shots.shift()
    }
  });
}

class Shot {
  constructor(x, y, dirX, dirY, power){
    this.x = x
    this.y = y
    this.dirX = dirX
    this.dirY = dirY
    this.power = power
  }
  step(){
    this.x += this.dirX
    this.y += this.dirY
  }
  shouldRemove(){
    if(this.x < 0 || this.x > G.WIDTH || this.y < 0 || this.y > G.HEIGHT || this.power <= 0){
      return true
    }
    return false
  }
}


class Astroid {
  static counter = 0
  constructor(x, y, radius, angleFrom, angleTo, health){
    Astroid.counter++
    this.health = health
    this.x = x
    this.y = y
    this.radius = radius
    this.angleFrom = angleFrom
    this.angleTo = angleTo
  }
  scroll() {
    this.x -= G.SPEED
  }

  shouldRemove(shot){
    if(shot){
      score += this.radius
      return true
    }
    if(this.x + this.radius < 0){
      return true
    }
    return false
  }
  destroy(){
    Astroid.counter--
  }
}
