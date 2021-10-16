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
  }

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
    platforms.push(new rectObj(G.WIDTH, yLoc, G.WIDTH/4, 10))
  }

  platforms.forEach((plat)=> {
    color('red')
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
  let flooring
  let forward = 0
  if(player.pos.x < G.WIDTH*0.4){
    forward = 1
  }else{
    forward = 0
  }
  if(gravity){
    player.pos.add(0, G.GRAVITY*doubled)
    flooring = char("a", player.pos).isColliding.rect.red
    if(flooring){
      player.pos.add(forward, -1*doubled)
      char("a", player.pos)
    }
  }else{
    player.pos.add(0, -G.GRAVITY*doubled)
    flooring = char("b", player.pos).isColliding.rect.red
    if(flooring){
      
      player.pos.add(forward, 1*doubled)
      char("b", player.pos)
    }
  }

  if(player.pos.y < 0 || player.pos.y > G.HEIGHT || player.pos.x < 0){
    end()
    ticks = 0;
    while(platforms.length > 0){ platforms.pop().destroy() }
  }

  if(input.isJustPressed){
    //score -= 30
    player.pos.add(-10,0)
    gravity = !gravity
  }

}

class rectObj {
  static counter = 0
  constructor(x, y, width, height){
    rectObj.counter++
    this.x = x
    this.y = y
    this.width = width
    this.height = height
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