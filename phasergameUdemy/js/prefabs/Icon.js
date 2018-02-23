var Icon = function(game, x, y){
    var key = "icon";
    Phaser.Sprite.call(this, game, x, y, key);
    
    this.inputEnabled = true;
    this.input.enableDrag(true);
};

Icon.prototype = Object.create(Phaser.Sprite.prototype);

Icon.prototype.constuctor = Icon;

Icon.prototype.update = function(){
    
}
