myDemo.state1 = function(){
    var player, centerX, centerY, currentX, currentY, weapon, dir, bullets, nextFire, fireRate, gameObjects, top=0, enemyGroup, nextEnemy, enemyRate, sightsGroup;
};

myDemo.state1.prototype = {
    
    preload: function(){
        // player;
        centerX = 100;
        centerY = 100;
        
        game.load.spritesheet('player', 'assets/spritesheets/player/standing.png', 100, 78);
        game.load.spritesheet('playerMove', 'assets/spritesheets/player/playerMove.png', 100, 78);
        game.load.spritesheet('playerAttack', 'assets/spritesheets/player/playerAttack.png', 100, 78);
        game.load.spritesheet('playerFull', 'assets/spritesheets/player/playerFull.png.png', 100, 78);
        game.load.spritesheet('playerKnife', 'assets/spritesheets/player/playerknife.png.png', 100, 78);
        game.load.spritesheet('playerHandGun', 'assets/spritesheets/player/playerhandgun.png.png', 100, 84);
        game.load.spritesheet('bullet', 'assets/spritesheets/bullet.png', 50, 50);
        game.load.spritesheet('zombieMove', 'assets/spritesheets/enemy/zombieMove.png', 100, 108);
        game.load.spritesheet('zombieAttack', 'assets/spritesheets/enemy/zombieAttack.png', 100, 92);
        game.load.image('enemysights', 'assets/spritesheets/enemy/enemysights.png', 400, 200);

        
    },
    create: function(){
        game.stage.backgroundColor = "#545659";
        addChangeStateEventListeners();
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        /*player = game.add.sprite(0,0,'player');
        currentX = player.x;
        currentY = player.y;*/
        
        gameObjects = [];
        
        
        player = game.add.sprite(100, 100, 'playerKnife');
        game.physics.arcade.enableBody(player);
        player.body.collideWorldBounds = true;
        player.anchor.setTo(0.5, 0.5);
        player.scale.setTo(0.8, 0.8);
                
        player.weapon = "knife";
        setAnimations();
        dir = 0;
        
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(50, 'bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
        
        enemyGroup = game.add.group();
        enemyGroup.enableBody = true;
        enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;
        
        sightsGroup = game.add.group();
        sightsGroup.enableBody = true;
        sightsGroup.physicsBodyType = Phaser.Physics.ARCADE;

        //enemyGroup.create(500, 500, 'zombieMove');
        
        
        nextFire = 0;
        fireRate = 200;
        
        nextEnemy = 0;
        enemyRate = 30000;
        
        createEnemy();
        //gameObjects = [];

          
    },
    update: function(){
        keyEventListen();
        for(var i = 0; i < bullets.children.length; i++){
            if(bullets.children[i].alive){
                bullets.children[i].x += bullets.children[i].body.velocity.x;
                bullets.children[i].y += bullets.children[i].body.velocity.y;
            }
        }
        
        for(var i = 0; i < enemyGroup.children.length; i++){
            if(enemyGroup.children[i].alive){
                enemyGroup.children[i].update();
                //if(enemyGroup.children[i].children[0])
                game.physics.arcade.overlap(player, enemyGroup.children[i].children[0], enemySeePlayer, null, this);
                game.physics.arcade.collide(player, enemyGroup.children[i].children[0], enemySeePlayer, null, this);
                //enemy.u.children[i]pdate();
                //updateEnemy(enemyGroup.children[i]);
            }
        }
        
        createEnemy();
        
        
        game.physics.arcade.overlap(bullets, enemyGroup, enemyHit, null, this);
        
        /*game.physics.arcade.overlap(enemyGroup, enemyGroup, enemyBump, null, this);*/
        
        
        
    }
    
};

function keyEventListen(){
    //MOVEMENT BUTTON FUNCTIONALITY:
    if(!game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                //player.scale.setTo(0.7, 0.7);
                if(game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
                    if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
                        //player.y -= 1;
                    }
                }
                else{

                    if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
                        //alert("hello");
                        player.angle = -45;
                        //player.y -= 1;
                        //player. x += 1;
                        dir = -45;
                    }
                    if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
                        //alert("hello");
                        player.angle = 45;
                        player.y += 1;
                        player.x += 1;
                        dir = 45;
                    }
                    else{
                        player.angle = 0;
                        player.x += 1;
                        player.animations.stop('standing');
                        player.animations.play('playerMove', 12, true);
                        dir = 0;
                        if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
                            //alert("hello");
                            player.angle = -45;
                            player.y -= .5;
                            player. x += .5;
                            dir = -45;
                        }
                    }
                }

            }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
                //player.scale.setTo(-0.7, 0.7);

                if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
                    //alert("wtf");
                    player.angle = -135;
                    //player.y -= 1;
                    //player.x -= 1;
                    player.angle = -135;
                    dir = -135;
                }
                if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
                    //alert("hello");
                    player.angle = 135;
                    player.x -= 1;
                    player.y += 1;
                    dir = 135;
                }
                else{
                    player.angle = -180;
                    //player.angle = -(180 + 90) / 2;
                    player.x -= 1.5;
                    player.animations.stop('standing');
                    player.animations.play('playerMove', 12, true);
                    dir = -180;
                    if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
                        //alert("wtf");
                        player.angle = -135;
                        player.y -= .5;
                        player.x -= .5;
                        player.angle = -135;
                        dir = -135;
                    }
                }
            }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
                //player.scale.setTo(0.7, -1);
                //player.pivot.y = 2;

                if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
                    //alert("wtf");
                    player.angle = -135;
                    //player.x -= 1;
                    //player.y -= 1;
                    dir = -135;
                }
                if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                    //alert("hello");
                    player.angle = -45;
                    player.x += 1;
                    player.y -= 1;
                    dir = -45;
                }
                else{
                    player.angle = -90;
                    player.y -= 1.5;
                    player.animations.stop('standing');
                    player.animations.play('playerMove', 12, true);
                    dir = -90
                }
            }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
                //player.scale.setTo(0.7, -0.7);
                if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
                    //alert("hello");
                    //player.angle = -45;
                    player.angle = 135;
                    player.x -= 1;
                    player.y += 1;
                    dir = 135;
                }
                if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                    //alert("hello");
                    player.angle = 45;
                    player.x += 1;
                    player.y += 1;
                    dir = 45

                }
                else{
                    player.angle = 90;
                    player.y += 1.5;
                    player.animations.stop('standing');
                    player.animations.play('playerMove', 12, true); 
                    dir = 90;
                }

            //player.angle = -45;        
            }

    }
    else/*(game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))*/{
        //alert("hello");
        
        if(player.angle == 0){
            if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
                player.y -= 1.5;
                //alert("hello");
            } 
            else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
                player.y += 1.5;
                //alert("hello");
            } 
            else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
                player.x -= 1.5;
                //alert("hello");
            }
            else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                player.x += 1.5;
                //alert("hello");
            } 
        }
        else if(player.angle == 45){
            if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
                player.y -= 1;
                player.x -= 1;
                //alert("hello");
            } 
            else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
                player.y += 1;
                player.x += 1;
                //alert("hello");
            } 
            else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
                player.x -= 1;
                player.y += 1
                //alert("hello");
            }
            else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                player.x += 1;
                player.y -= 1;
                //alert("hello");
            }
            
        }
        else if(player.angle == 90){
            if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
                player.y -= 1.5;
                //alert("hello");
            } 
            else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
                player.y += 1.5;
                //alert("hello");
            } 
            else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
                player.x -= 1.5;
                //alert("hello");
            }
            else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                player.x += 1.5;
                //alert("hello");
            }
        }
        else if(player.angle == 135){
            if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
                player.y -= 1;
                player.x += 1;
                //alert("hello");
            } 
            else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
                player.y += 1;
                player.x -= 1;
                //alert("hello");
            } 
            else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
                player.x -= 1;
                player.y -= 1;
                //alert("hello");
            }
            else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                player.x += 1;
                player.y += 1;
                //alert("hello");
            }
        }
        else if(player.angle == -180){
            if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
                player.y -= 1.5;
                //alert("hello");
            } 
            else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
                player.y += 1.5;
                //alert("hello");
            } 
            else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
                player.x -= 1.5;
                //alert("hello");
            }
            else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                player.x += 1.5;
                //alert("hello");
            }
        }
        else if(player.angle == -135){
            if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
                player.y -= 1;
                player.x -= 1;
                //alert("hello");
            } 
            else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
                player.y += 1;
                player.x += 1;
                //alert("hello");
            } 
            else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
                player.x -= 1;
                player.y += 1;
                //alert("hello");
            }
            else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                player.x += 1;
                player.y -= 1;
                //alert("hello");
            }
        }
        else if(player.angle == -90){
            if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
                player.y -= 1.5;
                //alert("hello");
            } 
            else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
                player.y += 1.5;
                //alert("hello");
            } 
            else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
                player.x -= 1.5;
                //alert("hello");
            }
            else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                player.x += 1.5;
                //alert("hello");
            }
        }
        else if(player.angle == -45){
            if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
                player.y -= 1;
                player.x += 1;
                //alert("hello");
            } 
            else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
                player.y += 1;
                player.x -= 1;
                //alert("hello");
            } 
            else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
                player.x -= 1;
                player.y -= 1;
                //alert("hello");
            }
            else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                player.x += 1;
                player.y += 1;
                //alert("hello");
            }
        }
    }
    
    //NON-MOVEMENT BUTTON FUNCTIONALITY:
    if(game.input.keyboard.isDown(Phaser.Keyboard.X)){
            player.animations.stop('playerMove');
             player.animations.play('playerSwing', 24, false);
            //player.frame = 0;
            //alert('hello');
        }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.Q)){
            player.weapon = "handgun";
            setAnimations();
        }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
            player.weapon = "knife";
            setAnimations();
        }
    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            if(player.weapon != "knife"){
                player.animations.stop('playerMove');
                player.animations.play('playerShoot', 12, false);
                fireWeapon();
            }
        }
    if(game.input.activePointer.isDown){
        //alert("hello");
        fireWeapon();
    }
    if(player.frame == 10 && player.weapon == "knife"){
            player.animations.play('playerMove', 12, true);
        }
    
}

/* This would be the perfect function if my very large spritesheets worked. We will get it working */
function setAnimations(){
    if(player.weapon == "knife"){
        //player = game.add.sprite(100, 100, 'playerKnife');
        if(player){
            //player.destroy();
        }
        
        player.loadTexture('playerKnife', 11);
        player.animations.add('standing', [11,12,13,14,15,16,17]);
        player.animations.add('playerMove', [11,12,13,14,15,16,17]);
        player.animations.add('playerSwing', [0,1,2,3,4,5,6,7,8,9,10]);
    }
    if(player.weapon == "handgun"){
        if(player){
            //player.destroy();
        }
        
        player.loadTexture('playerHandGun', 11);
        
        /*player = game.add.sprite(currentX, currentY, 'playerHandGun');
        game.physics.arcade.enableBody(player);
        player.body.collideWorldBounds = true;
        player.anchor.setTo(0.5, 0.5);
        player.scale.setTo(0.8, 0.8);
        */
        
        player.animations.add('standing', [0,1,2,3,4,5,6,7,8,9]);
        player.animations.add('playerMove', [0,1,2,3,4,5,6,7,8,9]);
        player.animations.add('playerSwing', [10,11,12,13,14,15,16,17,18]);
        player.animations.add('playerShoot', [20, 21, 22]);
        
    }
}

function fireWeapon(){
    if(game.time.now > nextFire){
        nextFire = game.time.now + fireRate;
        var bullet = bullets.getFirstDead();
        bullet.enableBody = true;
        bullet.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.arcade.enableBody(bullet);
        bullet.reset(player.x, player.y);
        if(player.angle == 0){
            bullet.body.velocity.x = 10;
            bullet.body.velocity.y = 0;
            bullet.direction = "right";
        }
        else if(player.angle == 45){
            bullet.body.velocity.x = 10;
            bullet.body.velocity.y = 10;
            bullet.direction = "downRight";
        }
        else if(player.angle == 90){
            bullet.body.velocity.x = 0;
            bullet.body.velocity.y = 10;
            bullet.direction = "down";
        }
        else if(player.angle == 135){
            bullet.body.velocity.x = -10;
            bullet.body.velocity.y = 10;
            bullet.direction = "downLeft";
        }
        else if(player.angle == -180){
            bullet.body.velocity.x = -10;
            bullet.body.velocity.y = 0;
            bullet.direction = "left";
        }
        else if(player.angle == -135){
            bullet.body.velocity.x = -10;
            bullet.body.velocity.y = -10;
            bullet.direction = "upLeft";
        }
        else if(player.angle == -90){
            bullet.body.velocity.x = 0;
            bullet.body.velocity.y = -10;
            bullet.direction = "up";
        }
        else if(player.angle == -45){
            bullet.body.velocity.x = 10;
            bullet.body.velocity.y = -10;
            bullet.direction = "upRight";
        }
        //game.physics.arcade.moveToPointer(bullet, bullet.body.velocity.x);

        //May have the bullet angle orientation be equal to the player.angle or maybe the opposite of the player's anlge.
        bullet.rotation = game.physics.arcade.angleToPointer(bullet);
        //addObject(bullet);
        
    }
    
}


function createEnemy(){
    if(game.time.now > nextEnemy){
        var randX = this.game.rnd.integerInRange(0, 600);
        var randY = this.game.rnd.integerInRange(0, 600);
        nextEnemy = game.time.now + enemyRate;
        //var zombie = new Zombie(this.game, 400, 400);
        
        var zombie = enemyGroup.getFirstExists(false);
        var sights;
        if(!zombie){
            zombie = new Zombie(this.game, randX, randY);
            /*zombie.width += 100;
            zombie.height += 100;*/
            
            
            /*zombie.addChild(game.make.sprite(0, -50, 'enemysights'));
            zombie.children[0].scale.setTo(200, 200);
            //zombie.children[0].width += 150;
            //zombie.children[0].height += 100;
            game.physics.arcade.enableBody(zombie.children[0]);
        zombie.children[0].enableBody = true;
        zombie.children[0].physicsBodyType = Phaser.Physics.ARCADE;
            zombie.children[0].anchor = 0.5;*/
            
            
            //zombie.revive();
            enemyGroup.add(zombie);
            //sightsGroup.add(zombie.children[0]);
           
            /*zombie = new Zombie(this.game, randX, randY);
            sights = zombie.addChild(game.make.sprite(0, -50, 'enemysights'));
            sights.width += 150;
            sights.height += 100;
            game.physics.arcade.enableBody(sights);
            sights.enableBody = true;
            sights.physicsBodyType = Phaser.Physics.ARCADE;
            sights.anchor = 0.5;
            //zombie.revive();
            enemyGroup.add(zombie);
            sightsGroup.add(sights);*/
        }
        if(zombie){
            zombie.revive();
            
            
            zombie.addChild(game.make.sprite(0, -50, 'enemysights'));
            zombie.children[0].scale.setTo(200, 200);
            //zombie.children[0].width += 150;
            //zombie.children[0].height += 100;
            game.physics.arcade.enableBody(zombie.children[0]);
            zombie.children[0].enableBody = true;
        zombie.children[0].physicsBodyType = Phaser.Physics.ARCADE;
          zombie.children[0].anchor = 0.5;
            enemyGroup.add(zombie);
            
            
            //sightsGroup.add(zombie.children[0]);*/
            /*zombie = new Zombie(this.game, randX, randY);
            sights = zombie.addChild(game.make.sprite(0, -50, 'enemysights'));
            sights.width += 150;
            sights.height += 100;
            game.physics.arcade.enableBody(sights);
            sights.enableBody = true;
            sights.physicsBodyType = Phaser.Physics.ARCADE;
            sights.anchor = 0.5;
            //zombie.revive();
            enemyGroup.add(zombie);
            sightsGroup.add(sights);*/
        }
        //zombie =  enemyGroup.add(zombie);
        
    }
    
    
    
}

function enemyHit(bullet, enemy){
    //alert('hello');
    bullet.kill();
    //enemy.kill();
    if(bullet.direction == "right"){
        enemy.x += 2;
        enemy.turnAround("left");
    }
    if(bullet.direction == "downRight"){
        enemy.x += 2;
        enemy.y += 2;
    }
    if(bullet.direction == "down"){
        enemy.y += 2;
        enemy.turnAround("up");
    }
    if(bullet.direction == "downLeft"){
        enemy.x -= 2;
        enemy.y += 2;
    }
    if(bullet.direction == "left"){
        enemy.x -= 2;
        enemy.turnAround("right");
    }
    if(bullet.direction == "upLeft"){
        enemy.x -= 2;
        enemy.y -= 2;
    }
    if(bullet.direction == "up"){
        enemy.y -= 2;
        enemy.turnAround("down");
        
    }
    if(bullet.direction == "upRight"){
        enemy.x += 2;
        enemy.y -= 2;
    }
    
}

function enemyBump(enemyA, enemyB){
    //alert('hello');
    
    
    if(enemyA.direction == "up"){
        enemyA.y += 20;
        enemyA.direction = "right";
        enemyA.angle = 0;
    }
    else if(enemyA.direction == "right"){
        enemyA.x -= 20;
        enemyA.direction = "down";
        enemyA.angle = 90;
    }
    else if(enemyA.direction == "down"){
        enemyA.y -= 20;
        enemyA.direction = "left";
        enemyA.angle = -180;
    }
    else if(enemyA.direction == "left"){
        enemyA.x += 20;
        enemyA.direction = "up";
        enemyA.angle = -90;
    }
    
    if(enemyB.direction == "up"){
        enemyB.y += 20;
        enemyB.direction = "right";
        enemyB.angle = 0;
    }
    else if(enemyB.direction == "right"){
        enemyB.x -= 20;
        enemyB.direction = "down";
        enemyB.angle = 90;
    }
    else if(enemyB.direction == "down"){
        enemyB.y -= 20;
        enemyB.direction = "left";
        enemyB.angle = -180;
    }
    else if(enemyB.direction == "left"){
        enemyB.x += 20;
        enemyB.direction = "up";
        enemyB.angle = -90;
    }
    
    //enemyA.changeDirection();
    //enemyB.changeDirection();
}

function enemySeePlayer(plyr, enmy){
    //alert("hello external");
    console.log("hello" + game.time.now);
}