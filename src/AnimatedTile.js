(function(w){
    var AnimatedTile = function(parent,sx,sy,ex,ey,width,height,speed){
        var self = this;
        Tile.call(self,[parent,sx,sy]);
        self.ex = ex;
        self.ey = ey;
        self.width= width;
        self.height = height;
        self.speed = speed;
    };

    AnimatedTile.prototype = Object.create(Tile.prototype);
    AnimatedTile.constructor = AnimatedTile;


    AnimatedTile.prototype.setEx = function(ex){
        var self= this;
        self.ex=ex;
    };

    AnimatedTile.prototype.setEy = function(ey){
        var self= this;
        self.ey = ey;
    };

    AnimatedTile.prototype.setWidth = function(width){
        var self = this;
        self.width = width;
    };

    AnimatedTile.prototype.setHeight = function(height){
        var self= this;
        self.height = height;
    };

    AnimatedTile.prototype.setSpeed = function(speed){
        var self = this;
        self.speed = speed;
    };


    w.AnimatedTile = AnimatedTile;
})(window);