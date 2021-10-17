title = "Flip";

description = `
Tap to invert Gravity
`;

characters = [
`
ccccc 
crrrc
bbbbb
c   c
c   c 
`,
`
c   c
c   c
bbbbb
cgggc
ccccc
`,
];

/**
 * @typedef {{
 * pos: Vector
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies;

const G = {
  WIDTH: 200,
  HEIGHT: 100,
  SPEED: 1,
  GRAVITY: 1,
}

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  seed: 7,
  isPlayingBgm: true,
  theme: "dark"
  
}

let player = {
  pos: vec(G.WIDTH * 0.4, G.HEIGHT * 0.7)
};

let everyOtherTick = true
let platforms = [];
let gravity = true;
let topHalf = false;
let grounded;
let doubled = 1;
let enemyCooldown;

function range(min, max) {
  return Math.random() * (max - min) + min;
}

function update() {
  if (!ticks) {
    score = 0
    gravity = true
    G.SPEED = 1
    player.pos = vec(G.WIDTH * 0.4, G.HEIGHT * 0.4)
    platforms[0] = (new rectObj(G.WIDTH/2, G.HEIGHT-10, G.WIDTH/3, 10))
    enemyCooldown = 120;
    enemies = [];
  }

  enemyCooldown -= 1;
  if (enemyCooldown == 0) {
    const posX = G.WIDTH;
    const posY = rnd(0, G.HEIGHT);
    enemyCooldown = 120;
    enemies.push({ pos: vec(posX, posY)})
  }

  enemies.forEach((e) => {
    e.pos.x -= 2 * difficulty;
    color("black");
    
    const colliding = box(e.pos, 6).isColliding.rect.cyan;
    if ((abs(e.pos.x - player.pos.x) <= 3) && abs(e.pos.y - player.pos.y) <= 3) {
      color("yellow");
      particle(e.pos);
      play("explosion")
      end()
  }
    
    return (e.pos.y > G.HEIGHT);
  });
    

  if(everyOtherTick){
    everyOtherTick = !everyOtherTick
    score++
    let value = Math.round(range(0, 50))
    if(value == 2){
      if(doubled == 1){
        doubled = 1
      }else if(doubled == 2){
        doubled = 2
      }

    }
  }else{
    everyOtherTick = !everyOtherTick
  }

  //spawn platform
  let closestPlatform = platforms[platforms.length-1];
  let yLoc
  if(topHalf){
    yLoc = range(5, G.HEIGHT/2-10)
    topHalf = !topHalf
  }else{
    yLoc = range(G.HEIGHT/2 + 10, G.HEIGHT-5)
    topHalf = !topHalf
  }
  //if closest edge of platform is 3/4 of the screen then spawn more
  if(closestPlatform.x + closestPlatform.width < 3*(G.WIDTH/4)){ 
    platforms.push(new rectObj(G.WIDTH, yLoc, G.WIDTH/4, 10, rnd(-1, 2)))
  }

  platforms.forEach((plat)=> {
    if (plat.type < 0) {
      color('green')
    }
    else {
      color('red')
    }
    rect(plat.x, plat.y, plat.width, plat.height)
    //move platforms
    plat.scroll()
    //remove
    if(plat.shouldRemove()){
      plat.destroy()
      plat = null
      platforms.shift()
    }
  });
  color("black")
  let flooringRed
  let flooringGreen
  let forward = 0
  if(player.pos.x < G.WIDTH*0.4){
    forward = 1
  }else{
    forward = 0
  }
  if(gravity){
    player.pos.add(0, G.GRAVITY*doubled)
    flooringRed = char("a", player.pos).isColliding.rect.red
    flooringGreen = char("a", player.pos).isColliding.rect.green
    if(flooringRed){
      player.pos.add(forward, -1*doubled)
      char("a", player.pos)
    }
    if(flooringGreen){
      player.pos.add(-1, -1*doubled)
      char("a", player.pos)
    }
  }else{
    player.pos.add(0, -G.GRAVITY*doubled)
    flooringRed = char("b", player.pos).isColliding.rect.red
    flooringGreen = char("b", player.pos).isColliding.rect.green
    if(flooringRed){
      
      player.pos.add(forward, 1*doubled)
      char("b", player.pos)
    }
    if(flooringGreen){
      
      player.pos.add(-1, 1*doubled)
      char("b", player.pos)
    }
  }

  if(player.pos.y < 0 || player.pos.y > G.HEIGHT || player.pos.x < 0){
    end()
    ticks = 0;
    while(platforms.length > 0){ platforms.pop().destroy() }
  }

  if(input.isJustPressed){
    score -= 30
    player.pos.add(-5,0)
    gravity = !gravity
  }

}

class rectObj {
  static counter = 0
  constructor(x, y, width, height, type){
    rectObj.counter++
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.type = type
  }
  scroll() {
    this.x -= G.SPEED * doubled
  }

  shouldRemove(){
    if(this.x + this.width < 0){
      return true
    }
    return false
  }
  destroy(){
    rectObj.counter--
  }
}