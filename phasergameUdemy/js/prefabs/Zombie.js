 var Zombie = function(game, x, y, key, frame){
    key = "zombieMove";
    Phaser.Sprite.call(this, game, x, y, key, frame);
    this.sig = this.game.rnd.integerInRange(100, 200);
    this.isLocatedPlayer = false;
    this.newSights = false;
     this.moveToSights = new Array();
    
    this.anchor.setTo(0.5);
    
    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;
    
    this.checkWorldBounds = true;
    this.onOutOfBoundsKill = true;
    
    this.body.velocity.x = 6;
    this.body.velocity.y = 6;
    this.direction = "";
    this.endPosX = 0;
    this.endPosY = 0;
    
    this.events.onKilled.add(this.onKilled, this);
    this.events.onRevived.add(this.onRevived, this);
    
    this.animations.add("zombieMove", [0,1,2,3,4,5,6,7,8,9,10,11,12]);
    this.animations.add("zombieAttack", [0,1,2,3,4,5,6,7,8]);
    
    /*this.addChild(game.make.sprite(0, -50, 'enemysights'));
    //this.children[0].scale.setTo(200, 200);
    this.children[0].width += 150;
    this.children[0].height += 100;*/
    /*game.physics.arcade.enableBody(zombie.children[0]);
    zombie.children[0].enableBody = true;
    zombie.children[0].physicsBodyType = Phaser.Physics.ARCADE;
    zombie.children[0].anchor = 0.5;
    enemyGroup.add(zombie);*/
    this.sightRate = 1000;
    this.nextSight = 0;
    this.enemySights = game.add.group();
    this.enemySights = game.add.group();
    this.enemySights.enableBody = true;
    this.enemySights.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemySights.createMultiple(50, 'bullet');
    this.enemySights.setAll('checkWorldBounds', true);
    this.enemySights.setAll('outOfBoundsKill', true);
        //bullets.setAll('checkWorldBounds', true);
        //bullets.setAll('outOfBoundsKill', true);
    //this.enemySights = [];
};

    //this.sights = [];
    //this.sights[0] = this.add.sprite(this.x, this.y, "enemysights");
    //this.addChild(game.make.sprite(this.x, this.y, 'enemysights'));

Zombie.prototype = Object.create(Phaser.Sprite.prototype);

Zombie.prototype.constuctor = Zombie;

Zombie.prototype.onRevived = function(){
    var rand = this.game.rnd.integerInRange(0, 3);
    if(rand == 0){
        this.direction = "up";
        this.body.velocity.x = 0;
        this.body.velocity.y = -10;
        this.angle = -90;
        this.endPosY = this.y - 90;
    }
    else if(rand == 1){
        this.direction = "right";
        this.body.velocity.x = 10;
        this.body.velocity.y = 0;
        this.angle = 0;
        this.endPosX = (this.x + this.width) + 90;
    }
    else if(rand == 2){
        this.direction = "down";
        this.body.velocity.x = 0;
        this.body.velocity.y = 10;
        this.angle = 90;
        this.endPosY = (this.y + this.height) + 90;
    }
    else if(rand == 3){
        this.direction = "left";
        this.body.velocity.x = -10;
        this.body.velocity.y = 0;
        this.angle = -180
        this.endPosX = this.x - 90;
    }
    else if(rand == 4){
        
    }
    else if(rand == 5){
        
    }
    
    this.animations.play("zombieMove", 12, true);
    
    
};

Zombie.prototype.onKilled = function(){
    
};

Zombie.prototype.update = function(){
    this.game.physics.arcade.collide(this, this.bullets, this.zombieShot, null, this);
    
    /*this.game.physics.arcade.collide(this, this.enemyGroup, this.zombieBump, null, this);*/
    if(this.isLocatedPlayer == false){
        if(this.direction == "up"){
            if(this.y <= this.endPosY)
                this.changeDirection();
        }
        else if(this.direction == "right"){
            if(this.x + this.width >= this.endPosX)
                this.changeDirection();
        }
        else if(this.direction == "down"){
            if(this.y + this.height >= this.endPosY)
                this.changeDirection();
        }
        else if(this.direction == "left"){
            if(this.x <= this.endPosX)
                this.changeDirection();
        }

        //this.game.physics.arcade.overlap(this.children[0], this.player, this.enemySeePlayer, null, this);

        //this.children[0].x++;

        //this.lookOut();
        this.createSights();
        this.updateSights();
    }else{
        this.enemySights.children.forEach(function(child){
            //if(this.newSights == false)
            if(child.sig == "old")
            child.kill();
        });
        this.enemySeePlayer();
        this.isLocatedPlayer = true;
    }
    
};

Zombie.prototype.zombieShot = function(){
    alert("hello");
};

Zombie.prototype.changeDirection = function(){
    var rand = this.game.rnd.integerInRange(0, 3);
    if(rand == 0){
        this.direction = "up";
        this.body.velocity.x = 0;
        this.body.velocity.y = -10;
        this.angle = -90;
        this.endPosY = this.y - 90;
    }
    else if(rand == 1){
        this.direction = "right";
        this.body.velocity.x = 10;
        this.body.velocity.y = 0;
        this.angle = 0;
        this.endPosX = (this.x + this.width) + 90;
    }
    else if(rand == 2){
        this.direction = "down";
        this.body.velocity.x = 0;
        this.body.velocity.y = 10;
        this.angle = 90;
        this.endPosY = (this.y + this.height) + 90;
    }
    else if(rand == 3){
        this.direction = "left";
        this.body.velocity.x = -10;
        this.body.velocity.y = 0;
        this.angle = -180
        this.endPosX = this.x - 90;
    }

};

Zombie.prototype.zombieBump = function(){
    if(this.direction == "up"){
        //this.y 
    }
};

Zombie.prototype.turnAround = function(direction){
    if(direction == "up"){
        this.direction = "up";
        this.body.velocity.x = 0;
        this.body.velocity.y = -10;
        this.angle = -90;
        this.endPosY = this.y - 90;
    }
    else if(direction == "right"){
        this.direction = "right";
        this.body.velocity.x = 10;
        this.body.velocity.y = 0;
        this.angle = 0;
        this.endPosX = (this.x + this.width) + 90;
    }
    else if(direction == "down"){
        this.direction = "down";
        this.body.velocity.x = 0;
        this.body.velocity.y = 10;
        this.angle = 90;
        this.endPosY = (this.y + this.height) + 90;
    }
    else if(direction == "left"){
        this.direction = "left";
        this.body.velocity.x = -10;
        this.body.velocity.y = 0;
        this.angle = -180
        this.endPosX = this.x - 90;
    }
    
};

Zombie.prototype.createSights = function(){
    if(game.time.now > this.nextSight){
        /*for(var i = 0; i < 3; i++){
            this.nextSight = game.time.now + this.sightRate;
            this.sight = this.enemySights.getFirstDead();
            this.sight.width = 10;
            this.sight.height = 150;
            this.sight.enableBody = true;
            this.sight.physicsBodyType = Phaser.Physics.ARCADE;
            game.physics.arcade.enableBody(this.sight);
            this.sight.reset(this.x, this.y);
            this.sight.anchor.setTo(0.5);
            //this.sight.direction = this.direction;
            //console.log("sight");

            if(i == 0){
                if(this.angle == 0){
                    this.sight.direction = "right";
                    this.sight.angle = 0;
                    this.sight.body.velocity.x = 10;
                    this.sight.body.velocity.y = 0;
                    this.sight.endPosX = this.x + this.width + 150;
                }
                else if(this.angle == 90){
                    this.sight.direction = "down";
                    this.sight.angle = 90;
                    this.sight.body.velocity.x = 0;
                    this.sight.body.velocity.y = 10;
                    this.sight.endPosY = this.y + this.height + 150;
                }
                else if(this.angle == -180){
                    this.sight.direction = "left";
                    this.sight.angle = -180;
                    this.sight.body.velocity.x = -10;
                    this.sight.body.velocity.y = 0;
                    this.sight.endPosX = this.x - 150;
                }
                else if(this.angle == -90){
                    this.sight.direction = "up";
                    this.sight.angle = -90;
                    this.sight.body.velocity.x = 0;
                    this.sight.body.velocity.y = -10;
                    this.sight.endPosY = this.y - 150;
                }
            }
            else if(i == 1){
                if(this.angle == 0){
                    this.sight.direction = "upRight";
                    this.sight.angle = -45;
                    this.sight.body.velocity.x = 5;
                    this.sight.body.velocity.y = -5;
                    this.sight.endPosY = this.y - 100;
                }
                else if(this.angle == 90){
                    this.sight.direction = "downRight";
                    this.sight.angle = 45;
                    this.sight.body.velocity.x = 5;
                    this.sight.body.velocity.y = 5;
                    this.sight.endPosY = this.y + this.height + 100;
                }
                else if(this.angle == -180){
                    this.sight.direction = "upLeft";
                    this.sight.angle = -135;
                    this.sight.body.velocity.x = -5;
                    this.sight.body.velocity.y = -5;
                    this.sight.endPosY = this.y - 100;
                }
                else if(this.angle == -90){
                    this.sight.direction = "upRight";
                    this.sight.angle = -45;
                    this.sight.body.velocity.x = 5;
                    this.sight.body.velocity.y = -5;
                    this.sight.endPosY = this.y - 100;
                }
            }
            else if(i == 2){
                if(this.angle == 0){
                    this.sight.direction = "downRight";
                    this.sight.angle = 45;
                    this.sight.body.velocity.x = 5;
                    this.sight.body.velocity.y = 5;
                    this.sight.endPosY = this.y + this.height + 100;
                }
                else if(this.angle == 90){
                    this.sight.direction = "downLeft";
                    this.sight.angle = 135;
                    this.sight.body.velocity.x = -5;
                    this.sight.body.velocity.y = 5;
                    this.sight.endPosY = this.y + this.height + 100;
                }
                else if(this.angle == -180){
                    this.sight.direction = "downLeft";
                    this.sight.angle = 135;
                    this.sight.body.velocity.x = -5;
                    this.sight.body.velocity.y = 5;
                    this.sight.endPosY = this.y + this.height + 100;
                }
                else if(this.angle == -90){
                    this.sight.direction = "upLeft";
                    this.sight.angle = -135;
                    this.sight.body.velocity.x = -5;
                    this.sight.body.velocity.y = -5;
                    this.sight.endPosY = this.y - 100;
                }
            }
            */
            
            
        
        
        for(var i = 0; i < 3; i++){
            this.nextSight = game.time.now + this.sightRate;
            this.sight = this.enemySights.getFirstDead();
            this.sight.width = 10;
            this.sight.height = 300;
            this.sight.enableBody = true;
            this.sight.physicsBodyType = Phaser.Physics.ARCADE;
            game.physics.arcade.enableBody(this.sight);
            this.sight.reset(this.x, this.y);
            this.sight.anchor.setTo(0.5);
            this.sight.sig = "old";
            //this.sight.direction = this.direction;
            //console.log("sight");

            
            if(i == 0){
                if(this.angle == 0){
                    this.sight.direction = "right";
                    this.sight.angle = 0;
                    this.sight.body.velocity.x = 10;
                    this.sight.body.velocity.y = 0;
                    this.sight.endPosX = this.x + this.width + 150;
                }
                else if(this.angle == 90){
                    this.sight.direction = "down";
                    this.sight.angle = 90;
                    this.sight.body.velocity.x = 0;
                    this.sight.body.velocity.y = 10;
                    this.sight.endPosY = this.y + this.height + 150;
                }
                else if(this.angle == -180){
                    this.sight.direction = "left";
                    this.sight.angle = -180;
                    this.sight.body.velocity.x = -10;
                    this.sight.body.velocity.y = 0;
                    this.sight.endPosX = this.x - 150;
                }
                else if(this.angle == -90){
                    this.sight.direction = "up";
                    this.sight.angle = -90;
                    this.sight.body.velocity.x = 0;
                    this.sight.body.velocity.y = -10;
                    this.sight.endPosY = this.y - 150;
                }
            }
            else if(i == 1){
                if(this.angle == 0){
                    this.sight.direction = "up";
                    this.sight.angle = -90;
                    this.sight.anchor.setTo(0,0);
                    this.sight.x -= 5;
                    this.sight.body.velocity.x -= 5;
                    this.sight.body.velocity.y = -10;
                    this.sight.endPosY = this.y - this.height - 50;
                }
                else if(this.angle == 90){
                    this.sight.direction = "right";
                    this.sight.angle = 0 ;
                    this.sight.anchor.setTo(0,0);
                    this.sight.y += 5;
                    this.sight.body.velocity.x = 10;
                    this.sight.body.velocity.y = 0;
                    this.sight.endPosX = this.x + this.width + 50;
                }
                else if(this.angle == -180){
                    this.sight.direction = "down";
                    this.sight.angle = 90;
                    this.sight.anchor.setTo(1,0);
                    this.sight.x += 25;
                    this.sight.body.velocity.x = 0;
                    this.sight.body.velocity.y = 10;
                    this.sight.endPosY = this.y + this.height + 50;
                }
                else if(this.angle == -90){
                    this.sight.direction = "left";
                    this.sight.angle = -180;
                    this.sight.anchor.setTo(1,0);
                    this.sight.y += 15;
                    this.sight.body.velocity.x = -10;
                    this.sight.body.velocity.y = 0;
                    this.sight.endPosX = this.x - this.width - 50;
                }
            }
            else if(i == 2){
                if(this.angle == 0){
                    this.sight.direction = "down";
                    this.sight.angle = 90;
                    this.sight.anchor.setTo(1,1);
                    this.sight.x -= 25;
                    this.sight.body.velocity.x = 0;
                    this.sight.body.velocity.y = 10;
                    this.sight.endPosY = this.y + this.height + 50;
                }
                else if(this.angle == 90){
                    this.sight.direction = "left";
                    this.sight.angle = -180;
                    this.sight.anchor.setTo(0,1);
                    this.sight.y -= 10;
                    this.sight.body.velocity.x = -10;
                    this.sight.body.velocity.y = 0;
                    this.sight.endPosX = this.x - this.width - 50;
                }
                else if(this.angle == -180){
                    this.sight.direction = "up";
                    this.sight.angle = -90;
                    this.sight.anchor.setTo(0,1);
                    this.sight.x += 25;
                    this.sight.body.velocity.x = 0;
                    this.sight.body.velocity.y = -10;
                    this.sight.endPosY = this.y - this.height - 50;
                }
                else if(this.angle == -90){
                    this.sight.direction = "right";
                    this.sight.angle = 0;
                    this.sight.anchor.setTo(0,1);
                    this.sight.y += 15;
                    this.sight.body.velocity.x = 10;
                    this.sight.body.velocity.y = 0;
                    this.sight.endPosX = this.x + this.width + 50;
                }
            }
            
        }
    }
};

Zombie.prototype.updateSights = function(){
    //if(this.isLocatedEnemy == false){
    for(var i = 0; i < this.enemySights.children.length; i++){
            if(this.enemySights.children[i].alive){
                this.enemySights.children[i].x += this.enemySights.children[i].body.velocity.x;
                this.enemySights.children[i].y += this.enemySights.children[i].body.velocity.y;
                
                if(this.enemySights.children[i].direction == "right"){
                    if(this.enemySights.children[i].x > this.enemySights.children[i].endPosX)
                        this.enemySights.children[i].kill();
                }
                else if(this.enemySights.children[i].direction == "downRight"){
                    if(this.enemySights.children[i].y > this.enemySights.children[i].endPosY)
                        this.enemySights.children[i].kill();
                }
                else if(this.enemySights.children[i].direction == "down"){
                    if(this.enemySights.children[i].y > this.enemySights.children[i].endPosY)
                        this.enemySights.children[i].kill();
                }
                else if(this.enemySights.children[i].direction == "downLeft"){
                    if(this.enemySights.children[i].y > this.enemySights.children[i].endPosY)
                        this.enemySights.children[i].kill();
                }
                else if(this.enemySights.children[i].direction == "left"){
                    if(this.enemySights.children[i].x < this.enemySights.children[i].endPosX)
                        this.enemySights.children[i].kill();
                }
                else if(this.enemySights.children[i].direction == "upLeft"){
                    if(this.enemySights.children[i].y < this.enemySights.children[i].endPosY)
                        this.enemySights.children[i].kill();
                }
                else if(this.enemySights.children[i].direction == "up"){
                    if(this.enemySights.children[i].y < this.enemySights.children[i].endPosY)
                        this.enemySights.children[i].kill();
                }
                else if(this.enemySights.children[i].direction == "upRight"){
                    if(this.enemySights.children[i].y < this.enemySights.children[i].endPosY)
                        this.enemySights.children[i].kill();
                }
            }
        }
    //}
    
};

Zombie.prototype.enemySeePlayer = function(){
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    
    
    for(var i = 0; i < 8; i++){
        //this.moveToSights[i] = new Sprite(game, this.x, this.y, "bullet");
    }
    if(this.newSights == false){
        for(var i = 0; i < 8; i++){
        this.sight = this.enemySights.getFirstDead();
        this.sight.width = 10;
        this.sight.height = 300;
        this.sight.enableBody = true;
        this.sight.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.arcade.enableBody(this.sight);
        this.sight.reset(this.x, this.y);
        this.sight.anchor.setTo(1,1);
        if(i == 0){
            this.sight.sig = "up";
            this.sight.angle = 0;
        }
        if(i == 1){
            this.sight.sig = "upRight";
            this.sight.angle = 45;
        }
        if(i == 2){
            this.sight.sig = "right";
            this.sight.angle = 90;
        }
        if(i == 3){
            this.sight.sig = "downRight";
            this.sight.angle = 135;
        }
        if(i == 4){
            this.sight.sig = "down";
            this.sight.angle = 180;
        }
        if(i == 5){
            this.sight.sig = "downLeft";
            this.sight.angle = -135;
        }
        if(i == 6){
            this.sight.sig = "left";
            this.sight.angle = -90;
        }
        if(i == 7){
            this.sight.sig = "leftUp";
            this.sight.angle = -45;
        }
    }
        this.newSights = true;
    }

        
    /*if(this.game.physics.arcade.collide(this.enemySights, game.player, this.moveToPlayer, null, this)){
        //console.log("hit");
    }*/
    
    /*this.enemySights.children.forEach(function(child){
            //alert(child);
        //console.log(child);
        if(child.alive == true){
            console.log(child);
            if(this.game.physics.arcade.overlap(child, game.player, this.moveToPlayer, null, this)){
                alert("hello");
            }
        }
        });*/
    
    if(game.time.now > this.nextSight){
        this.nextSight = game.time.now + this.sightRate;
        this.game.physics.arcade.overlap(this.enemySights, game.player, this.moveToPlayer)
    }
}

Zombie.prototype.moveToPlayer = function(a,b){
    //console.log("hello");
    //console.log(a.sig);
    //this.angle = a.angle;
    //alert(b.sig);
    
    /*this.enemySights.children.forEach(function(child){
            if(this.game.physics.arcade.overlap(child, game.player, this.moveToPlayer, null, this)){
                alert(child.sig);
            }
        });*/
    //console.log(a.sig);
    a.kill();
};