var Zombie = function(game, x, y, key, frame){
    key = "zombieMove";
    Phaser.Sprite.call(this, game, x, y, key, frame);
    
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
    
    this.addChild(game.make.sprite(0, -50, 'enemysights'));
    //this.children[0].scale.setTo(200, 200);
    this.children[0].width += 150;
    this.children[0].height += 100;
    /*game.physics.arcade.enableBody(zombie.children[0]);
    zombie.children[0].enableBody = true;
    zombie.children[0].physicsBodyType = Phaser.Physics.ARCADE;
    zombie.children[0].anchor = 0.5;
    enemyGroup.add(zombie);*/
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
    
    this.game.physics.arcade.overlap(this.children[0], this.player, this.enemySeePlayer, null, this);
    
    //this.children[0].x++;
    
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
}

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
    
}

Zombie.prototype.enemySeePlayer = function(){
    alert("hello internal");
}