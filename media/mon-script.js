"use strict";
addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const canvasW = (canvas.width = 512);
  const canvasH = (canvas.height = 544);
  let gameSpeed = 1;
  //nombre d'ennemis
  const numberEnemy = 20;
  const enemyArray = [];

  const explosions = [];
  //les ennemis
  const enemyImage = new Image();
  enemyImage.src = "/media/img/enemy-big.png";

  //le background
  const backGround = new Image();
  backGround.src = "./media/img/desert-background.png";
  let yBg1 = 0;
  let yBg2 = -canvasH;
  //la fonction qui gere le background
  const drawBg = function () {
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(backGround, 0, yBg1, canvasW, canvasH);
    ctx.drawImage(backGround, 0, yBg2, canvasW, canvasH);
    if (yBg1 > canvasH) yBg1 = -canvasH + yBg2 + gameSpeed;
    else yBg1 += gameSpeed;
    if (yBg2 > canvasH) yBg2 = -canvasH + yBg1 + gameSpeed;
    else yBg2 += gameSpeed;
  };

  //la classe ennemi

  class Enemy {
    constructor() {
      this.x = Math.random() * canvasW;
      this.y = Math.random() * -canvasH;

      this.speed = Math.random() * 1 +1;
      this.spriteWidth = 32;
      this.spriteHeight = 32;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.frame = 0;
      this.frameSpeed = 0.05;
      this.hitBox = {
        position :{
          x : 0,
          y : 0,
        },
        ctx : ctx,
      };
    }
    

    update() {
      //   this.x += Math.random() * 3;
      this.y += this.speed;
       if(this.y + this.height>canvasH){
         this.y = -canvasH
       };
      if (this.frame > 1) {
        this.frame = 0;
      } else {
        this.frame += this.frameSpeed;
      };
      if( this.y + this.height >= ship.hitBox.position.y &&
        this.y <= ship.hitBox.position.y + ship.hitBox.height &&
        this.x + this.width >= ship.hitBox.position.x &&
        this.x <= ship.hitBox.position.x + ship.hitBox.width){
          console.log('collision');
        }
    };
    draw() {
     
      ctx.drawImage(
        enemyImage,
        Math.round(this.frame) * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
      
    }
    
  }

   for (let i = 0; i < numberEnemy; i++) {
     enemyArray.push(new Enemy());
   }

/////explosion
  class Explosion{
    constructor(x, y){
      this.x = x;
      this.y = y;
      this.spriteWidth = 96;
      this.spriteHeight = 96;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.image = new Image;
      this.image.src = './media/img/Explosion.png'
      this.frame = 0;
    }
    update(){
      this.frame++;
    }
    draw(){
      ctx.drawImage(this.image, this.spriteWidth * this.frame , 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }

  }

  const animateEnemy = function () {
    // ctx.clearRect(0,0,canvasW,canvasH);

    enemyArray.forEach((enemy) => {
      enemy.update();
      enemy.draw();
    });
  };
  console.log(enemyArray);

  const playerImage = function (imageSrc) {
    const createdImage = new Image();
    createdImage.src = imageSrc;
    return createdImage;
  };
  //la class du joueur
  class Player {
    constructor() {
      this.position = {
        x: canvasH / 2 - 50,
        y: 350,
      };
       this.hitBox = {
         position :{
           x : 0,
           y : 0,
         },
         ctx : ctx,


       };
      this.speed = {
        x: 0,
      };
      this.width = 346;
      this.height = 459;
      this.sprite = {
        move: playerImage("./media/img/spaceship.png"),
      };
    }
  
    update(speed) {
      this.position.x += speed;
      //   this.draw();
    }
  }
  const draw = (image, sx, sy, sWitch, sHeight, dx, dy, dWidth, dHeight) => {
////////////test avec triangle mais echec    //////////
    // ship.hitBox.ctx.beginPath();
    // ship.hitBox.ctx.moveTo(200, 200);
    // ship.hitBox.ctx.lineTo(150, 200);
    // ship.hitBox.ctx.lineTo(175, 160);
    // ship.hitBox.ctx.closePath();
    // ship.hitBox.ctx.lineWidth = 10;
    // // ship.hitBox.ctx.strokeStyle = '#666666';
    // // ship.hitBox.ctx.stroke();
    // ship.hitBox.ctx.fillStyle = "#FFCC00";
    // ship.hitBox.ctx.fill();

    ship.hitBox.ctx.fillRect(ship.position.x + 10,ship.position.y,(ship.width / 6) - 20,ship.height / 6);
    ctx.drawImage(image, sx, sy, sWitch, sHeight, dx, dy, dWidth, dHeight);
  };

  const ship = new Player();

  //l'animation de tout le bordel

  const animate = function () {
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle = 'rgb(255, 255, 255,1) ';
    drawBg();

    animateEnemy();
    draw(
      ship.sprite.move,
      0,
      0,
      ship.width,
      ship.height,
      ship.position.x,
      ship.position.y,
      ship.width / 6,
      ship.height / 6
    );
    //  ship.update();

    requestAnimationFrame(animate);
  };
  animate();

  //evenement d'ecoute sur les touches
  window.addEventListener("keydown", function (eventKeyDown) {
    switch (eventKeyDown.key) {
      case "q":
        if (ship.position.x >= 0) {
          ship.update(-8);
        } else {
          ship.update(0);
        }

        break;
      case "d":
        if (ship.position.x <= canvasW - ship.width / 6) {
          ship.update(8);
        } else {
          ship.update(0);
        }
        break;
    }
  });

  window.addEventListener("keyup", function (eventKeyUp) {
    switch (eventKeyUp.key) {
      case "q":
        ship.speed.x = 0;
        break;
      case "d":
        ship.speed.x = 0;
        break;
    }
  });
});

// let player = {
//     x: canvasW /2 - 20,

//     y: 400,
//     width:40,
//     height:40,
//     speed : 4

// };

// const drawPlayer = function(){

// ctx.clearRect(0,0,canvasW,canvasH);
// ctx.fillRect(player.x, player.y, player.width, player.height);

// }
// drawPlayer();

// let qActive = false;
// let dActive  = false;

// let itvIdGauche;
// let itvIdDroite;

// const deplacementGauche =function(){
//     player.x -=player.speed;
// };

// const deplacementDroite = function(){
//     player.x += player.speed;
// }

//   window.addEventListener("keydown",function(eventKeyDown) {
//       switch (eventKeyDown.key) {
//           case 'q':
//               if( qActive = true && player.x - 4 >= 0){
//                  deplacementGauche();
//              //     itvIdDroite =setInterval(deplacementGauche,100);
//                }
//               break;
//           case 'd':
//              if( dActive = true && player.x + player.width +4 <= canvasW){
//                  deplacementDroite();
//                  //  itvIdGauche = setInterval(deplacementDroite,100)
//               }

//               break;
//       };
//       drawPlayer();
//   } );

//  window.addEventListener("keyup",function(eventKeyUp){
//     switch(eventKeyUp.key){
//         case 'q':
//             qActive =false;
//             clearInterval(itvIdDroite);
//             break;
//         case 'd':
//             dActive = false;
//             clearInterval(itvIdGauche);
//     };

//     drawPlayer();

//  });
