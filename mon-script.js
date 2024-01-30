"use strict";
addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const canvasW = (canvas.width = 512);
  const canvasH = (canvas.height = 544);
  const startGame = document.getElementById("start");
  const gameIsOver = document.getElementById("gameover");
  const lock1 = document.getElementById('gauche1');
  const lock2 = document.getElementById('droite1');
  const affiche1 = document.getElementById('gauche')
  const affiche2 = document.getElementById('droite')
  const timer = document.getElementById('compteARebours')
  const win = document.getElementById("win");
  const music = document.getElementById("theme-song");
  const playMusic = function () {
    music.play();
    // music.loop = true;
    //music.volume =0.5;
  };

  const stopMusic = function () {
    music.pause();
  };
  const contDown = function () {
    // Fonction pour formater le temps restant
    function formatTemps(temps) {
      let minutes = Math.floor(temps / 60);
      let secondes = temps % 60;

      // Ajoute un zéro devant les chiffres < 10 pour l'esthétique
      minutes = minutes < 10 ? "0" + minutes : minutes;
      secondes = secondes < 10 ? "0" + secondes : secondes;

      return minutes + ":" + secondes;
    }

    // Fonction principale du compte à rebours
    function compteARebours(tempsTotal) {
      let tempsRestant = tempsTotal;

      // Met à jour l'affichage du compte à rebours chaque seconde
      function actualiserAffichage() {
        document.getElementById("compteARebours").innerHTML =
          formatTemps(tempsRestant);

        if (tempsRestant === 0) {
          clearInterval(compteAReboursInterval);
          gG();
          lock1.style.display ='none';
          lock2.style.display ='none';
          affiche1.style.display ='block';
          affiche2.style.display = 'block';
          gameIsOver.style.display ='none;'
          timer.style.display ='none;'

         
        } else {
          tempsRestant--;
        }
      }

      
      let compteAReboursInterval = setInterval(actualiserAffichage, 1000);
    }

   
    compteARebours(120);
  };

  const creatImage = function (imageSrc) {
    const createdImage = new Image();
    createdImage.src = imageSrc;
    return createdImage;
  };

  let gameSpeed = 1;

  let keys = {
    rightPressed: false,
    leftPressed: false,
  };
  //les vies
  // const lifeImage = new Image();
  // lifeImage.src = "/media/img/ship.png"
  // ctx.drawImage(  )

  class Life {
    constructor() {
      this.x = 10;
      this.y = 10;
      this.width = 31;
      this.height = 42;
      this.nbLife = 5;
      this.image = creatImage("./media/img/spaceship.png");
    }
    // drawLife(){

    // }

    update() {
      for (let i = 0; i < this.nbLife; i++) {
        ctx.drawImage(this.image, 30 * i, 20, this.width, this.height);
      }
    }
  }
  const life = new Life();

  //les ennemis
  const enemyImage = new Image();
  enemyImage.src = "./media/img/enemy-big.png";

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
    if (yBg1 > canvasH) {
      yBg1 = -canvasH + yBg2 + gameSpeed;
    } else {
      yBg1 += gameSpeed;
    }

    if (yBg2 > canvasH) {
      yBg2 = -canvasH + yBg1 + gameSpeed;
    } else {
      yBg2 += gameSpeed;
    }
    // gameSpeed += 0.01;
  };

  //la classe ennemi

  class Enemy {
    constructor() {
      this.id = Math.round(Math.random() * 1000);
      this.x = Math.random() * canvasW;
      this.y = Math.random() * -canvasH;
      (this.enemyArray = []),
        (this.enemyMax = 20),
        (this.speed = Math.random() * 1 + 2);
      this.spriteWidth = 32;
      this.spriteHeight = 32;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.frame = 0;
      this.frameSpeed = 0.05;
      this.hitBox = {
        position: {
          x: 0,
          y: 0,
        },
        ctx: ctx,
        width: 25,
        height: 25,
      };
    }

    enemyCreatePool() {
      for (let i = this.enemyArray.length; i < this.enemyMax; i++) {
        this.enemyArray.push(new Enemy());
      }
    }

    update() {
      //   this.x += Math.random() * 3;
      this.draw();
      this.y += this.speed;
      if (this.y + this.height > canvasH) {
        this.y = -canvasH;
      }
      if (this.frame > 1) {
        this.frame = 0;
      } else {
        this.frame += this.frameSpeed;
      }
      if (
        this.hitBox.position.y + this.hitBox.height >= ship.hitBox.position.y &&
        this.hitBox.position.y <= ship.hitBox.position.y + ship.hitBox.height &&
        this.hitBox.position.x + this.hitBox.width >= ship.hitBox.position.x &&
        this.hitBox.position.x <= ship.hitBox.position.x + ship.hitBox.width
      ) {
        explosion.x = this.x;
        explosion.y = this.y;
        explosion.explosionTrigger = true;
        life.nbLife--;
        if (life.nbLife === 0) {
          gameOver();

          console.log(life.nbLife);
        }
        enemy.enemyArray = enemy.enemyArray.filter(
          (enemyId) => enemyId.id !== this.id
        );
        console.log("touché !");
      }

      if (this.y + this.height > canvasH - 5) {
        enemy.enemyArray = enemy.enemyArray.filter(
          (enemyId) => enemyId.id !== this.id
        );
      }

      if (enemy.enemyArray.length <= 19) {
        enemy.enemyCreatePool();
      }
    }
    draw() {
      this.hitBox.position.x = this.x + 4;
      this.hitBox.position.y = this.y + 8;
      this.hitBox.ctx.fillRect(
        this.hitBox.position.x,
        this.hitBox.position.y,
        this.hitBox.width,
        this.hitBox.height
      );
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

  const enemy = new Enemy();
  enemy.enemyCreatePool();

  /////explosion
  class Explosion {
    constructor() {
      this.x = 40;
      this.y = 20;
      this.spriteWidth = 96;
      this.spriteHeight = 96;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.image = creatImage("./media/img/Explosion.png");
      this.frame = 0;
      this.explosionTrigger = false;
    }

    update() {
      //
      this.drawEx();
      if (this.frame < 11) {
        this.frame += 0.05;
      } else {
        this.frame = 0;
        this.explosionTrigger = false;
      }
    }
    drawEx() {
      ctx.drawImage(
        this.image,
        this.spriteWidth * Math.round(this.frame),
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
  const explosion = new Explosion();

  //la class du joueur
  class Player {
    constructor() {
      this.position = {
        x: canvasH / 2 - 50,
        y: 350,
      };
      this.hitBox = {
        position: {
          x: 0,
          y: 0,
        },
        ctx: ctx,
        width: 30,
        height: 80,
      };
      this.speed = 0;
      this.width = 346;
      this.height = 459;
      this.sprite = {
        move: creatImage("./media/img/spaceship.png"),
      };
    }

    draw() {
      this.hitBox.position.x = this.position.x + 14;
      this.hitBox.position.y = this.position.y;
      this.hitBox.ctx.fillRect(
        this.hitBox.position.x,
        this.hitBox.position.y,
        this.hitBox.width,
        this.hitBox.height
      );
      ctx.drawImage(
        this.sprite.move,
        0,
        0,
        this.width,
        this.height,
        this.position.x,
        this.position.y,
        this.width / 6,
        this.height / 6
      );
    }

    update() {
      if (keys.rightPressed) {
        this.speed = +3;
        this.position.x += this.speed;
      } else if (keys.leftPressed) {
        this.speed = +3;
        this.position.x -= this.speed;
      } else {
        this.speed = 0;
      }
      this.draw();
    }
  }

  const ship = new Player();

  ////////////le game over
  const gameOver = function () {
    canvas.style.display = "none";
    startGame.style.display = "none";
    gameIsOver.style.display = "block";
    stopMusic();
  };
  const gG = function () {
    canvas.style.display = "none";
    startGame.style.display = "none";
    gameIsOver.style.display = "none";
    win.style.display ='block'
    stopMusic();
  };


  //l'animation de tout le bordel
  startGame.addEventListener("click", function () {
    contDown();
    startGame.style.display = "none";
    canvas.style.display = "block";
    const animate = function () {
      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.fillStyle = "rgb(255, 255, 255,0) ";

      drawBg();

      if (explosion.explosionTrigger) {
        explosion.update();
      }
      ship.update();
      enemy.enemyArray.forEach((ennemy) => {
        ennemy.update();
      });
      const idAnimation = requestAnimationFrame(animate);
      life.update();
      if (life.nbLife === 0) {
        cancelAnimationFrame(idAnimation);
      }
    };
    if (life.nbLife != 0) {
      playMusic();
      animate();
    }
    console.log(life.nbLife);

    gameIsOver.addEventListener("click", function () {
      life.nbLife = 5;
      animate();
      playMusic();
      gameIsOver.style.display = "none";
      canvas.style.display = "block";
    });
  });

  //evenement d'ecoute sur les touches
  window.addEventListener("keydown", function (eventKeyDown) {
    switch (eventKeyDown.key) {
      case "q":
        keys.leftPressed = true;
        break;
      case "d":
        keys.rightPressed = true;
        break;
    }
  });

  window.addEventListener("keyup", function (eventKeyUp) {
    switch (eventKeyUp.key) {
      case "q":
        keys.leftPressed = false;
        break;
      case "d":
        keys.rightPressed = false;
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
