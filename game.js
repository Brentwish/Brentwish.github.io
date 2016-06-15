var background = document.getElementById("background");
var sprites = document.getElementById("sprites");
background_ctx = background.getContext("2d");
sprites_ctx = sprites.getContext("2d");
entities = [];
player_data = { type: 'player',
                pos: { x: 10, y: 15 },
                image: player_image_gen('square'),
                speed: 8
              };

board_data = { type: 'background',
               canvas: background,
               ctx: background_ctx,
               image: board_image_gen(background.width, background.height, background_ctx),
               width: background.width,
               height: background.height
             };

dots_image_gen();
main_player = new Player( player_data );
board = new Board( board_data );
entities.push(main_player);
setInterval(game, 16);
window.addEventListener('keydown', on_key_press, true);

function game() {
  update();
  render();
}

function update() {
  for (var i = 0; i < entities.length; i++) {
    entity = entities[i]

    if (entity.type == 'npc') {
      entity.pos.x += entity.speed * entity.direction.x;
      entity.pos.y += entity.speed * entity.direction.y;

      if (( entity.pos.x <= 1 ) || ( entity.pos.x >= sprites.width - 1 )) {
        entity.direction.x *= -1
      }
      if (( entity.pos.y <= 1 ) || ( entity.pos.y >= sprites.height - 1 )) {
        entity.direction.y *= -1
      }

    } else if (entity.type == 'player') {
      //  After I add Action Queue, handle it here
    }
  }
}

function render() {
  //Clear Board
  sprites_ctx.clearRect(0, 0, sprites.width, sprites.height);

  //Draw entities
  for (var i = 0; i < entities.length; i++) {
    draw(entities[i]);
  }
}

function draw(entity) {
  sprites_ctx.putImageData(entity.image, entity.pos.x, entity.pos.y)
}

function on_key_press(evt) {

  switch (evt.keyCode) {
    // Left arrow.
    case 37:
      main_player.move({ x: -1, y: 0 })
      break;

    // Right arrow.
    case 39:
      main_player.move({ x: 1, y: 0 })
      break;

    // Down arrow
    case 40:
      main_player.move({ x: 0, y: 1 })
      break;

    // Up arrow
    case 38:
      main_player.move({ x: 0, y: -1 })
      break;
    }
}

function Player(data) {
  this.type = data.type
  this.image = data.image
  this.pos = data.pos
  this.speed = data.speed
}

function Npc(data) {
  this.type = data.type
  this.image = data.image
  this.pos = data.pos
  this.speed = data.speed
  this.ai_type = data.ai_type
}

function Board(data) {
  this.type = data.type
  this.canvas = data.canvas
  this.ctx = data.ctx
  this.image = data.image
  this.width = data.width
  this.height = data.height
}

Board.prototype.render = function() {
  this.ctx.putImageData(this.image, 0, 0)
}

//Npc.prototype.move = function() {
//  if (this.ai_type == 'random') {
//    this.
//  }
//}


Player.prototype.move = function(dir) {
  dir.x *= this.speed;
  dir.y *= this.speed;

  if (dir.x) {
    // Motion is in the positive direction
    if (dir.x >= 1) {
      if (this.pos.x + dir.x <= sprites.width) {
        this.pos.x += dir.x
      }
    // Motion is in the negative direction
    } else if (dir.x <= -1) {
      if (this.pos.x + dir.x >= 0) {
        this.pos.x += dir.x
      }
    }
  } else if (dir.y) {
    // Motion is in the positive direction
    if (dir.y >= 1) {
      if (this.pos.y + dir.y <= sprites.height) {
        this.pos.y += dir.y
      }
    // Motion is in the negative direction
    } else if (dir.y <= -1) {
      if (this.pos.y + dir.y >= 0) {
        this.pos.y += dir.y
      }
    }
  }
}

function player_image_gen(type) {
  if (type == 'square') {
    sprites_ctx.beginPath();
    sprites_ctx.fillStyle = "Gray";
    sprites_ctx.rect(0, 0, 30, 30);
    sprites_ctx.fill();

    sprites_ctx.beginPath();
    sprites_ctx.fillStyle = "Orange"
    sprites_ctx.rect(12, 3, 3, 24);
    sprites_ctx.fill();

    sprites_ctx.beginPath();
    sprites_ctx.fillStyle = "Orange"
    sprites_ctx.rect(3, 12, 6, 3);
    sprites_ctx.fill();

    sprites_ctx.translate(15,0);
    sprites_ctx.beginPath();
    sprites_ctx.fillStyle = "Orange"
    sprites_ctx.rect(3, 12, 6, 3);
    sprites_ctx.fill();
    sprites_ctx.translate(-15,0);

    return sprites_ctx.getImageData(0, 0, 30, 30);
  }
}

function board_image_gen(width, height, ctx) {
  ctx.beginPath();
  ctx.fillStyle = "White";
  ctx.rect( 0, 0, width, height);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "Black";
  ctx.rect( 0, 0, width, 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "Black";
  ctx.rect( 0, height - 2, width, 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "Black";
  ctx.rect( 0, 0, 2, height);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "Black";
  ctx.rect( width - 2, 0, 2, height);
  ctx.fill();

  return ctx.getImageData(0, 0, width, height);
}

function dots_image_gen() {
  r = 4;//radius
  for (i = 0; i <= 10; i++) {
    var x = Math.floor(Math.random() * 299)
    var y = Math.floor(Math.random() * 299)

    sprites_ctx.fillStyle = "Red";

    sprites_ctx.beginPath();
    sprites_ctx.arc(x, y, r, 0, Math.PI * 2, true);
    sprites_ctx.closePath();
    sprites_ctx.fill();
    dot = sprites_ctx.getImageData(x - r, y - r, 2*r, 2*r);
    entities.push( { type: 'npc',
                     image: dot,
                     pos: { x : x, y : y },
                     speed: 1,
                     direction: { x: 1, y: 1 }
                   } );
  }
}
