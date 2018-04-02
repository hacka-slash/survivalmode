myDemo.state1 = function(){
    var player, centerX, centerY, currentX, currentY, weapon, dir, bullets, nextFire, fireRate, gameObjects, top=0, enemyGroup, nextEnemy, enemyRate, sightsGroup, nextSight, sightRate, rangeGroup, healthBar, barWidth, LIFE, isPlayerAttacked, nextDamage, damageRate, nextIcon, iconRate;
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
        game.load.spritesheet('zombieMove', 'assets/spritesheets/enemy/zombieMove.png', 100, 108, 12);
        game.load.spritesheet('zombieAttack', 'assets/spritesheets/enemy/zombieAttack.png', 100, 92, 9);
        game.load.spritesheet('zombieTotal', 'assets/spritesheets/enemy/zombieTotal.png', 100, 108, 32);
        game.load.image('enemysights', 'assets/spritesheets/enemy/sights.png', 400, 200);
        game.load.image('iconSpray', 'assets/spritesheets/enemy/spray.png', 400, 200); 
        game.load.spritesheet('playerSheet', 'assets/spritesheets/player/playerSpriteSheet.png', 100, 84, 168);

        
    },
    create: function(){
        game.stage.backgroundColor = "#545659";
        addChangeStateEventListeners();
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.startSystem(Phaser.Physics.P2JS);
        
        
        player = game.add.sprite(100, 100, 'playerKnife');
        game.physics.arcade.enableBody(player);
        player.body.collideWorldBounds = true;
        player.anchor.setTo(0.5, 0.5);
        player.scale.setTo(0.8, 0.8);
        player.nextFire = 0;
        player.fireRate = 200;
        player.weapon = "knife";
        
        setAnimations();
        
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
        sightsGroup.createMultiple(100, 'enemysights');
        sightsGroup.setAll('checkWorldBounds', true);
        sightsGroup.setAll('outOfBoundsKill', true);
        
        rangeGroup = game.add.group();
        rangeGroup.enableBody = true;
        rangeGroup.physicsBodyType = Phaser.Physics.ARCADE;
        rangeGroup.createMultiple(50, 'enemysights');
        rangeGroup.setAll('checkWorldBounds', true);
        rangeGroup.setAll('outOfBoundsKill', true);

        iconGroup = game.add.group();
        iconGroup.enableBody = true;
        iconGroup.physicsBodyType = Phaser.Physics.ARCADE;
        iconGroup.createMultiple(50, 'iconSpray');
        iconGroup.setAll('checkWorldBounds', true);
        iconGroup.setAll('outOfBoundsKill', true);

        var bmd = game.add.bitmapData(80,5);
        bmd.ctx.rect(0,0,180,30);
        bmd.ctx.fillStyle = "#00685e";
        bmd.ctx.fill();
        healthBar = game.add.sprite(200,300,bmd);
        healthBar.anchor.setTo(0.5);
        LIFE = 80;
        isPlayerAttacked = false;
        
        
        //healthBar = new HealthBar(200, 300, bmd);
        //healthBar.anchor.y = 0.5;
        
        
        //enemyGroup.create(500, 500, 'zombieMove');
        
        
        nextFire = 0;
        fireRate = 200;
        
        nextEnemy = 0;
        enemyRate = 30000;
        
        createEnemy();
        //gameObjects = [];
        
        nextSight = 0;
        sightRate = 3000;
        
        nextDamage = 0;
        damageRate = 1000;
        
        nextIcon = 0;
        iconRate = 3000;

          
    },
    update: function(){
        keyEventListen();
        //healthBar.update();
        healthBar.x = player.x;
        healthBar.y = player.y - player.height/2 - healthBar.height/2;
        healthBar.width = LIFE;
        
        //if(isPlayerAttacked)
        
        for(var i = 0; i < bullets.children.length; i++){
            if(bullets.children[i].alive){
                bullets.children[i].x += bullets.children[i].body.velocity.x;
                bullets.children[i].y += bullets.children[i].body.velocity.y;
            }
        }
        
            
        for(var i = 0; i < enemyGroup.children.length; i++){
            if(enemyGroup.children[i].alive){
                enemyGroup.children[i].update();
            
                shootSights(enemyGroup.children[i]);
                if(enemyGroup.children[i].isLocatedPlayer == true){
                    createRangeSight(enemyGroup.children[i]);
                    var theseSights = [];
                    for(var x = 0; x < sightsGroup.children.length; x++){
                        if(sightsGroup.children[x].sig == enemyGroup.children[i].sig){
                            theseSights.push(sightsGroup.children[x]);
                            
                        }
                        if(!game.physics.arcade.overlap(player, theseSights, enemySeePlayer)){
                            enemyGroup.children[i].timeOutCount++;
                            
                            }
                    }
                }
            }
            
            
            
            game.physics.arcade.overlap(player, sightsGroup.children, enemySeePlayer);
            game.physics.arcade.overlap(player, rangeGroup.children, enemyAttackPlayer);
        }
        
        
        for(var i = 0; i < rangeGroup.children.length; i++){
            if(rangeGroup.children[i].alive){
                for(var j = 0; j < enemyGroup.children.length; j++){
                    if(enemyGroup.children[j].alive){
                        if(rangeGroup.children[i].sig == enemyGroup.children[j].sig){
                            rangeGroup.children[i].x = enemyGroup.children[j].x;
                            
                            rangeGroup.children[i].y = enemyGroup.children[j].y;
                            
                            if(game.physics.arcade.overlap(player, rangeGroup.children[i], enemyAttackPlayer)){}else{
                                enemyGroup.children[j].isInMelee = false;
                                
                                
                            }
                        }
                    }
                }
            }
            
        }
        
        for(var i = 0; i < iconGroup.children.length; i++){
            //iconGroup.children[i].update();
            if(iconGroup.children[i].alive)
            iconGroup.children[i].x += iconGroup.children[i].body.velocity.x;
        }
        
        
        createEnemy();
        
        //createIcon();
        
        
        game.physics.arcade.overlap(bullets, enemyGroup, enemyHit, null, this);
        game.physics.arcade.overlap(sightsGroup, player, enemySeePlayer, null, this); 
        game.physics.arcade.overlap(iconGroup, player, grabIcon, null, this); 
        
        
        for(var i = 0; i < sightsGroup.children.length; i++){
            if(sightsGroup.children[i].direction == "up"){
                if(sightsGroup.children[i].y <= sightsGroup.children[i].endPos)
                    sightsGroup.children[i].kill();
            }
            else  if(sightsGroup.children[i].direction == "upRight"){
                if(sightsGroup.children[i].x >= sightsGroup.children[i].endPos)
                    sightsGroup.children[i].kill();
            }
            else  if(sightsGroup.children[i].direction == "right"){
                if(sightsGroup.children[i].x >= sightsGroup.children[i].endPos)
                    sightsGroup.children[i].kill();
            }
            else  if(sightsGroup.children[i].direction == "downRight"){
                if(sightsGroup.children[i].y >= sightsGroup.children[i].endPos)
                    sightsGroup.children[i].kill();
                if(sightsGroup.children[i].x >= sightsGroup.children[i].endPos)
                    sightsGroup.children[i].kill();
            }
            else  if(sightsGroup.children[i].direction == "down"){
                if(sightsGroup.children[i].y >= sightsGroup.children[i].endPos)
                    sightsGroup.children[i].kill();
            }
            else  if(sightsGroup.children[i].direction == "downLeft"){
                if(sightsGroup.children[i].y >= sightsGroup.children[i].endPos)
                    //sightsGroup.children[i].kill();
                if(sightsGroup.children[i].x <= sightsGroup.children[i].endPos)
                    sightsGroup.children[i].kill();
                if(sightsGroup.children[i].x <= sightsGroup.children[i].endPos)
                    sightsGroup.children[i].kill();
            }
            else  if(sightsGroup.children[i].direction == "left"){
                if(sightsGroup.children[i].x <= sightsGroup.children[i].endPos)
                    sightsGroup.children[i].kill();
            }
            else  if(sightsGroup.children[i].direction == "upLeft"){
                if(sightsGroup.children[i].x <= sightsGroup.children[i].endPos)
                    //sightsGroup.children[i].kill();
                if(sightsGroup.children[i].y <= sightsGroup.children[i].endPos)
                    sightsGroup.children[i].kill();
                if(sightsGroup.children[i].y <= sightsGroup.children[i].endPos)
                    sightsGroup.children[i].kill();
            }
        }

    

        
        
        
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
        
        //player.loadTexture('playerKnife');
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
    //if(player.weapon == "handgun")
    if(game.time.now > player.nextFire){
        player.nextFire = game.time.now + player.fireRate;
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
        var sight = sightsGroup.getFirstExists(false);
        if(!zombie){
            zombie = new Zombie(this.game, randX, randY);
        
            enemyGroup.add(zombie);
            
            /*if(!sight){
                sight = sightsGroup.getFirstDead();
                sight.width = 10;
                sight.height = 300;
                sight.enableBody = true;
                sight.physicsBodyType = Phaser.Physics.ARCADE;
                game.physics.arcade.enableBody(sight);
                sight.reset(zombie.x, zombie.y);
                sight.anchor.setTo(1,1);
                sight.allowRotation = true;
                //this.sight.sig = "old";
                sightsGroup.add(sight);
            }*/
        }
        if(zombie){
            zombie.revive();
    
            enemyGroup.add(zombie);
            /*if(sight){
                sight = sightsGroup.getFirstDead();
                sight.width = 10;
                sight.height = 300;
                sight.enableBody = true;
                sight.physicsBodyType = Phaser.Physics.ARCADE;
                game.physics.arcade.enableBody(sight);
                sight.reset(zombie.x, zombie.y);
                sight.anchor.setTo(1,1);
                sight.allowRotation = true;
                //this.sight.sig = "old";
                sightsGroup.add(sight);
            }*/
            
           
        }
        //zombie =  enemyGroup.add(zombie);
        
    }
    
    
    
}

function enemyHit(bullet, enemy){
    //alert('hello');
    bullet.kill();
    //enemy.kill();
    enemy.isLocatedPlayer = true;
    enemy.timeOutCount = 0;
    var x = this.game.rnd.integerInRange(0, 5);
    enemy.lifePoints -= x;
    var spd = 60;
    if(bullet.direction == "right"){
        enemy.x += 2;
        enemy.turnAround("left");
        shootOneSight(enemy, "left");
        //enemy.body.velocity.x = -spd;
    }
    if(bullet.direction == "downRight"){
        enemy.x += 2;
        enemy.y += 2;
        shootOneSight(enemy, "upLeft");
    }
    if(bullet.direction == "down"){
        enemy.y += 2;
        enemy.turnAround("up");
        shootOneSight(enemy, "up");
        //enemy.body.velocity.y = -spd;
    }
    if(bullet.direction == "downLeft"){
        enemy.x -= 2;
        enemy.y += 2;
        shootOneSight(enemy, "upRight");
    }
    if(bullet.direction == "left"){
        enemy.x -= 2;
        enemy.turnAround("right");
        shootOneSight(enemy, "right");
       // enemy.body.velocity.x = spd;
    }
    if(bullet.direction == "upLeft"){
        enemy.x -= 2;
        enemy.y -= 2;
        shootOneSight(enemy, "downRight");
    }
    if(bullet.direction == "up"){
        enemy.y -= 2;
        enemy.turnAround("down");
        shootOneSight(enemy, "down");
        //enemy.body.velocity.y = spd;
        
    }
    if(bullet.direction == "upRight"){
        enemy.x += 2;
        enemy.y -= 2;
        shootOneSight(enemy, "downLeft");
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

function enemySeePlayer(s, p){
    
    var spd = 60;
    for(var i = 0; i < enemyGroup.children.length; i++){
        if(enemyGroup.children[i].sig == p.sig){
            enemyGroup.children[i].isLocatedPlayer = true;
            enemyGroup.children[i].timeOutCount = 0;
            if(!enemyGroup.children[i].isInMelee){
        if(p.direction == "up"){
            enemyGroup.children[i].direction = "up";
            enemyGroup.children[i].angle = -90;
            enemyGroup.children[i].body.velocity.x = 0;
            enemyGroup.children[i].body.velocity.y = -spd;
        }
        else if(p.direction == "upRight"){
            enemyGroup.children[i].direction = "right";
            enemyGroup.children[i].angle = -45;
            enemyGroup.children[i].body.velocity.x = spd;
            enemyGroup.children[i].body.velocity.y = -spd;
            
        }
        else if(p.direction == "right"){
            enemyGroup.children[i].direction = "right";
            enemyGroup.children[i].angle = 0;
            enemyGroup.children[i].body.velocity.x = spd;
            enemyGroup.children[i].body.velocity.y = 0;
        }
        else if(p.direction == "downRight"){
            enemyGroup.children[i].direction = "right";
            enemyGroup.children[i].angle = 45;
            enemyGroup.children[i].body.velocity.x = spd;
            enemyGroup.children[i].body.velocity.y = spd;
        }
        else if(p.direction == "down"){
            enemyGroup.children[i].direction = "down";
            enemyGroup.children[i].angle = 90;
            enemyGroup.children[i].body.velocity.x = 0;
            enemyGroup.children[i].body.velocity.y = spd;
        }
        else if(p.direction == "downLeft"){
            enemyGroup.children[i].direction = "left";
            enemyGroup.children[i].angle = 135;
            enemyGroup.children[i].body.velocity.x = -spd;
            enemyGroup.children[i].body.velocity.y = spd;
        }
        else if(p.direction == "left"){
            enemyGroup.children[i].direction = "left";
            enemyGroup.children[i].angle = -180;
            enemyGroup.children[i].body.velocity.x = -spd;
            enemyGroup.children[i].body.velocity.y = 0;
        }
        else if(p.direction == "upLeft"){
            enemyGroup.children[i].direction = "up";
            enemyGroup.children[i].angle = -135;
            enemyGroup.children[i].body.velocity.x = -spd;
            enemyGroup.children[i].body.velocity.y = -spd;
        }
        }
        }
        
    }
    
}

function shootOneSight(enemy, dir){
    var sight = sightsGroup.getFirstDead();
    sight.enableBody = true;
    sight.physicsBodyType = Phaser.Physics.ARCADE;
    //game.physics.arcade.enableBody(sight);
    sight.reset(enemy.x, enemy.y);
    sight.height = 100;//20;
    sight.width = 100;//200;
        //sight.anchor.setTo(0.5);
            //player.anchor.setTo(0,0);
    sight.sig = enemy.sig;
    enemy.timeOutCount = -100,000
    
    if(dir == "up"){
        sight.body.velocity.y = -400;
        //sight.body.velocity.x = -200;
        sight.endPos = enemy.y - 400;
        sight.direction = "up";
    }
    else if(dir == "upRight"){
        sight.body.velocity.y = -400;
        sight.body.velocity.x = 400;
        sight.endPos = enemy.y - 400;
        sight.direction = "upRight";
        sight.body.velocity.x = 400;
        sight.endPos = enemy.x + 400;
        //sight.direction = "right";
        
    }
    else if(dir == "right"){
        //sight.body.velocity.y = -200;
        sight.body.velocity.x = 400;
        sight.endPos = enemy.x + 400;
        sight.direction = "right";
    }
    else if(dir == "downRight"){
        sight.body.velocity.y = 400;
        sight.body.velocity.x = 400;
        sight.endPos = enemy.y + 400;
        sight.direction = "downRight";
    }
    else if(dir == "down"){
        sight.body.velocity.y = 400;
        //sight.body.velocity.x = -200;
        sight.endPos = enemy.y + 400;
        sight.direction = "down";
    }
    else if(dir == "downLeft"){
        sight.body.velocity.y = 400;
        sight.body.velocity.x = -400;
        sight.endPos = enemy.y + 400;
        sight.direction = "downLeft";
        sight.body.velocity.x = -400;
        sight.endPos = enemy.x - 400;
        //sight.direction = "left";
    }
    else if(dir == "left"){
        //sight.body.velocity.y = -200;
        sight.body.velocity.x = -400;
        sight.endPos = enemy.x - 400;
        sight.direction = "left";
    }
    else if(dir == "upLeft"){
        sight.body.velocity.y = -400;
        sight.body.velocity.x = -400;
        sight.endPos = enemy.x - 400;
        sight.direction = "upLeft";
    }
    
}

function shootSights(enemy){
    if(game.time.now > enemy.nextSight){
        //if(enemy.isLocatedPlayer == false){
            for(var i = 0; i < 5; i++){
        enemy.nextSight = game.time.now + enemy.sightRate;
        var sight = sightsGroup.getFirstDead();
        sight.enableBody = true;
        sight.physicsBodyType = Phaser.Physics.ARCADE;
        //game.physics.arcade.enableBody(sight);
        sight.reset(enemy.x, enemy.y);
        sight.height = 100;//20;
        sight.width = 100;//200;
        //sight.anchor.setTo(0.5);
            //player.anchor.setTo(0,0);
        sight.sig = enemy.sig;
            //Primary/Front Sights:
            //Front Left:
            if(i == 0){
                sight.anchor.setTo(0.5);
                if(enemy.direction == "up"){
                    sight.x = enemy.x - sight.width/2;
                    sight.y = enemy.y - enemy.height/2;
                    sight.body.velocity.y = -200;
                    sight.body.velocity.x = -200;
                    sight.endPos = enemy.y - sight.height - 10;
                    sight.direction = "upLeft";
                    //sight.angle = 0;
                }
                else if(enemy.direction == "right"){
                    sight.x = enemy.x + enemy.width/2;
                    sight.y = enemy.y - enemy.height/2;
                    sight.body.velocity.x = 200;
                    sight.body.velocity.y = -200;
                    sight.direction = "upRight";
                    sight.endPos = enemy.x + enemy.width + 10;
                    //sight.angle = 90;
                }
                else if(enemy.direction == "down"){
                    sight.x = enemy.x + enemy.width/2;
                    sight.y = enemy.y + enemy.height/2;
                    sight.direction = "downRight";
                    sight.body.velocity.y = 200;
                    sight.body.velocity.x = 200
                    sight.endPos = enemy.y + enemy.height + 10;
                    //sight.angle = 180;
                }
                else if(enemy.direction == "left"){
                    sight.direction = "downLeft";
                    sight.x = enemy.x - enemy.width/2;
                    sight.y = enemy.y + enemy.height/2;
                    sight.body.velocity.x = -200;
                    sight.body.velocity.y = 200;
                    sight.endPos = enemy.x - enemy.width - 10;
                    //sight.angle = -90;
                }
            }
            //Front Center:
            else if(i == 1){
                sight.anchor.setTo(0.5);
                if(enemy.direction == "up"){
                    sight.direction = "up";
                    sight.x = enemy.x;// - sight.width;
                    sight.y = enemy.y - enemy.height/2;
                    sight.body.velocity.y = -200;
                    sight.endPos = enemy.y - sight.height - 10;
                    //sight.angle = -90;
                }
                else if(enemy.direction == "right"){
                    sight.direction = "right";
                    sight.x = enemy.x + enemy.width/2;
                    sight.y = enemy.y;
                    sight.body.velocity.x = 200;
                    sight.endPos = enemy.x + enemy.width + 10;
                    //sight.angle = 0;   
                }
                else if(enemy.direction == "down"){
                    sight.direction = "down";
                    sight.x = enemy.x;
                    sight.y = enemy.y + enemy.height/2;
                    sight.body.velocity.y = 200;
                    sight.endPos = enemy.y + enemy.height + 10;
                    //sight.angle = 90;
                }
                else if(enemy.direction == "left"){
                    sight.direction = "left";
                    sight.x = enemy.x - enemy.width/2;
                    sight.y = enemy.y;
                    sight.body.velocity.x = -200;
                    sight.endPos = enemy.x - sight.width - 10; 
                    //sight.angle = 180;
                }
            }
            //Front Right:
            else if(i == 2){
                sight.anchor.setTo(0.5);
                if(enemy.direction == "up"){
                    sight.direction = "upRight";
                    sight.x = enemy.x + enemy.width/2;
                    sight.y = enemy.y - enemy.height/2;
                    sight.body.velocity.x = 200;
                    sight.body.velocity.y = -200;
                    sight.endPos = enemy.x + enemy.width +  10;
                    //sight.angle = 90;
                }
                else if(enemy.direction == "right"){
                    sight.direction = "downRight";
                    sight.x = enemy.x + enemy.width/2;
                    sight.y = enemy.y + enemy.height/2;
                    sight.body.velocity.x = 200;
                    sight.body.velocity.y = 200;
                    sight.endPos = enemy.y + enemy.height + 10;
                    //sight.angle = 180;
                }
                else if(enemy.direction == "down"){
                    sight.direction = "downLeft";
                    sight.x = enemy.x - enemy.width/2;
                    sight.y = enemy.y + enemy.height/2;
                    sight.body.velocity.x = -200;
                    sight.body.velocity.y = 200;
                    sight.endPos = enemy.x - enemy.width - 10;
                    //sight.angle = -90;
                }
                else if(enemy.direction == "left"){
                    sight.direction = "upLeft";
                    sight.x = enemy.x - enemy.width/2;
                    sight.y = enemy.y - enemy.height/2;
                    sight.body.velocity.x = -200;
                    sight.body.velocity.y = -200;
                    sight.endPos = enemy.y - enemy.height - 10;
                    //sight.angle = 0;
                }
            }
            //Secondary Sight:
            //Left Side:
            else if(i == 3){
                sight.anchor.setTo(0.5);
                if(enemy.direction == "up"){
                    sight.x = enemy.x - sight.width/2;
                    sight.y = enemy.y;
                    //sight.body.velocity.y = -200;
                    sight.body.velocity.x = -200;
                    sight.endPos = enemy.x - sight.width - 10;
                    sight.direction = "left";
                    //sight.angle = 0;
                }
                else if(enemy.direction == "right"){
                    sight.x = enemy.x;
                    sight.y = enemy.y - enemy.height/2;
                    //sight.body.velocity.x = 200;
                    sight.body.velocity.y = -200;
                    sight.direction = "up";
                    sight.endPos = enemy.y - enemy.height - 10;
                    //sight.angle = 90;
                }
                else if(enemy.direction == "down"){
                    sight.x = enemy.x + enemy.width/2;
                    //sight.y = enemy.y + enemy.height/2;
                    sight.direction = "left";
                    //sight.body.velocity.y = 200;
                    sight.body.velocity.x = 200
                    sight.endPos = enemy.x + enemy.width + 10;
                    //sight.angle = 180;
                }
                else if(enemy.direction == "left"){
                    sight.direction = "down";
                    //sight.x = enemy.x - enemy.width/2;
                    sight.y = enemy.y + enemy.height/2;
                    //sight.body.velocity.x = -200;
                    sight.body.velocity.y = 200;
                    sight.endPos = enemy.y + enemy.height + 10;
                    //sight.angle = -90;
                }

            }
            //Secondary Sight:
            //Right Side:
            else if(i == 4){
                sight.anchor.setTo(0.5);
                if(enemy.direction == "up"){
                    sight.x = enemy.x + sight.width/2;
                    sight.y = enemy.y;
                    //sight.body.velocity.y = -200;
                    sight.body.velocity.x = 200;
                    sight.endPos = enemy.x + enemy.width + 10;
                    sight.direction = "right";
                    //sight.angle = 0;
                }
                else if(enemy.direction == "right"){
                    sight.x = enemy.x;
                    sight.y = enemy.y + enemy.height/2;
                    //sight.body.velocity.x = 200;
                    sight.body.velocity.y = 200;
                    sight.direction = "down";
                    sight.endPos = enemy.y + enemy.height + 10;
                    //sight.angle = 90;
                }
                else if(enemy.direction == "down"){
                    sight.x = enemy.x - enemy.width/2;
                    sight.y = enemy.y;
                    sight.direction = "left";
                    //sight.body.velocity.y = 200;
                    sight.body.velocity.x = -200
                    sight.endPos = enemy.x - enemy.width - 10;
                    //sight.angle = 180;
                }
                else if(enemy.direction == "left"){
                    sight.direction = "up";
                    sight.x = enemy.x;
                    sight.y = enemy.y - enemy.height/2;
                    //sight.body.velocity.x = -200;
                    sight.body.velocity.y = -200;
                    sight.endPos = enemy.y - enemy.height - 10;
                    //sight.angle = -90;
                }
 
            }
        }
        //}
    }
        //enemy.isLocatedPlayer = true;
}

function moveToPlayer(enemy){
    //enemy.isLocatedPlayer = false;
    
}
    
function createRangeSight(enemy){
    if(enemy.isRangeSight == false){
        enemy.nextSight = game.time.now + enemy.sightRate;
        var range = rangeGroup.getFirstDead();
        range.enableBody = true;
        range.physicsBodyType = Phaser.Physics.ARCADE;
        //game.physics.arcade.enableBody(sight);
        range.anchor.setTo(0.5);
        range.reset(enemy.x, enemy.y);
        range.height = 50;//20;
        range.width = 50;//200;
        //sight.anchor.setTo(0.5);
            //player.anchor.setTo(0,0);
        range.sig = enemy.sig;
        
        range.body.velocity.x = enemy.body.velocity.x;
        range.body.velocity.y = enemy.body.velocity.y;
        
        enemy.isRangeSight = true;
    }
}

function enemyAttackPlayer(player, range){
    range.body.velocity.x = 0;
    range.body.velocity.y = 0;
    
    for(var i = 0; i < enemyGroup.children.length; i++){
        if(enemyGroup.children[i].sig == range.sig){
            enemyGroup.children[i].body.velocity.x = 0;
            enemyGroup.children[i].body.velocity.y = 0;
            enemyGroup.children[i].isInMelee = true;
            //enemyGroup.children[i].animations.stop(null, true);
            //enemyGroup.children[i].key="zombieAttack";
            enemyGroup.children[i].animations.play("zombieAttack", 9, true);
        }
    }
    
    playerTakeDamage();
}

function playerTakeDamage(){
    if(game.time.now > nextDamage){
        nextDamage = game.time.now + damageRate;
        LIFE -= 5;
        if(LIFE < 0)
            LIFE = 0;
    }
    isPlayerAttacked = true;
}

function createIcon(){
    if(game.time.now > nextIcon){
        nextIcon = game.time.now + iconRate;
        var ran = this.game.rnd.integerInRange(0, 6);
        var randX = this.game.rnd.integerInRange(-10, 0);
        var randY = this.game.rnd.integerInRange(0, 400);
        //var ran = 4;
        if(ran > 3){
            var icon = game.add.sprite(randX, randY, 'iconSpray');
            game.physics.arcade.enableBody(icon);
            //icon.body.collideWorldBounds = true;
            icon.anchor.setTo(0.5, 0.5);
            icon.scale.setTo(0.8, 0.8);
            icon.body.velocity.x = 3;
            iconGroup.add(icon);
            
        }
    }
}

function grabIcon(hero, icon){
    icon.kill();
    
}

