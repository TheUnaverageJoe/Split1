title = "Swap";

description = `
  Tap to Jump

  Tap in the
  air to flip
`;

characters = [
`
ccccc
 lll
 lll
rrrrr  
`,
`
rrrrr
 lll
 lll
ccccc
`
];

const G = {
  WIDTH: 200,
  HEIGHT: 100,
  SPEED: 1,
  GRAVITY: 1
  
}

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  seed: 11,
  isPlayingBgm: true,
  theme: "dark"
  
}

let player = {
  pos: vec(G.WIDTH * 0.4, G.HEIGHT * 0.7)
};

let platforms = [];
let colors = ["red", "cyan"]
let jumpForce = 1;
let jumpStartT = 0;
let jumpStart = false;
let redActive = true;
let grounded;
let jumping;
let gameSpeed;

function range(min, max) {
  return Math.random() * (max - min) + min;
}


function update() {
  
  if (!ticks) {
    grounded = false
    jumping = false
    G.SPEED = 1
    player.pos = vec(G.WIDTH * 0.4, G.HEIGHT * 0.4)
    platforms[0] = (new rectObj(G.WIDTH/2, G.HEIGHT-10, G.WIDTH/3, 10, colors[0]))
  }

  //spawn platform
  let closestPlatform = platforms[platforms.length-1];
  let yLoc = range(closestPlatform.y-20,closestPlatform.y+20)
  if(yLoc > G.HEIGHT){
    yLoc = G.HEIGHT-10
  }
  if(yLoc < 5){
    yLoc = 5
  }
  //if closest edge of platform is 3/4 of the screen then spawn more
  if(closestPlatform.x + closestPlatform.width < 3*(G.WIDTH/4)){ 
    platforms.push(new rectObj(G.WIDTH, yLoc, G.WIDTH/3, 10, colors[Math.round(Math.random())]))
  }
  
  platforms.forEach((plat)=> {
    color(plat.color)
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
  let flooring;
  let deadly;
  if(redActive){
    flooring = char("a", player.pos).isColliding.rect.red
    deadly = char("a", player.pos).isColliding.rect.cyan
  }else{
    flooring = char("b", player.pos).isColliding.rect.cyan
    deadly = char("b", player.pos).isColliding.rect.red
  }

  if(flooring){
    grounded = true;
    score++
    //if(score%200 == 0){
    //  G.SPEED++
    //}
    //player.pos.sub(0, 1)
  }

  if(deadly || player.pos.y > G.HEIGHT){
    end()
    ticks = 0;
    while(platforms.length > 0){ platforms.pop().destroy() }
  }

  //Game Start
  // && toggle) removed
  if(!flooring && !jumpStart){
    player.pos.add(0, G.GRAVITY)
  }

  //trying to jump
  if(input.isJustPressed && flooring){
    jumpStart = true;
    jumpStartT = ticks;
  }else if(input.isJustPressed){ // in the air, so flip
    //if(gameSpeed == null && G.SPEED>1){
    //  gameSpeed = G.SPEED
    //  G.SPEED = G.SPEED/2
    //}
    redActive = !redActive;
  }
  /* Experimental code for slowing platforms movement
  if(input.isJustReleased){
    if(gameSpeed != null){
      G.SPEED = gameSpeed
      gameSpeed = null
    }
  }
  */

  //if jumping then do this to mimic the motion
  if(jumpStart == true){
    jumping = true
    grounded = false
    player.pos.sub(0, jumpForce)
    if(ticks-jumpStartT == 30){
      jumpStart = false
      jumping = false;
      //jumpForce = -jumpForce
    }else if(ticks-jumpStartT == 60){ //|| flooring){
      //jumpStart = false
      //jumpForce = -jumpForce
    }
  }

}

class rectObj {
  static counter = 0
  constructor(x, y, width, height, color){
    rectObj.counter++
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
  }
  scroll() {
    this.x -= G.SPEED
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