(function (root) {
    if (root.Tile == undefined) {
        throw "AnimatedTile requires Tile"
    }

    var Tile = root.Tile;

    var AnimatedTile = function (parent, sx, sy, ex, ey, speed) {
        var self = this;
        Tile.call(self, [parent, sx, sy]);
        self.ex = ex;
        self.ey = ey;
        self.speed = speed;
        self.animation = null;
        self.initialize();
    };

    AnimatedTile.prototype = Object.create(Tile.prototype);
    AnimatedTile.constructor = AnimatedTile;


    AnimatedTile.prototype.initialize = function () {
        var self = this;
        var width = self.getWidth();
        var height = self.getHeight();
        var cols = Math.floor(width / (self.ex - self.sx));
        var rows = Math.floor(height / (self.ey - self.sy));
        var frame_count = rows * cols;
        self.animation = new Animation(self.speed, frame_count);
    };

    AnimatedTile.prototype.execute = function () {
        var self = this;
        self.animation.execute();
    };

    AnimatedTile.prototype.stop = function () {
        var self = this;
        self.animation.stop();
    };

    AnimatedTile.prototype.getGraphic = function () {
        var self = this;
        var tile_width = self.parent.getTileWidth();
        var tile_height = self.parent.getTileHeight();
        var frame = self.animation.getIndexFrame();

        var cols = Math.floor(width / (self.ex - self.sx));
        var i = Math.floor(frame / cols);
        var j = frame % cols;

        return {
            image: self.parent.image,
            sx: self.sx + (tile_width * j),
            sy: self.sy + (tile_height * i),
            sWidth: tile_width,
            sHeight: tile_height,
            dWidth: tile_width,
            dHeight: tile_height
        };
    };

    AnimatedTile.prototype.setEx = function (ex) {
        var self = this;
        self.ex = ex;
    };

    AnimatedTile.prototype.setEy = function (ey) {
        var self = this;
        self.ey = ey;
    };

    AnimatedTile.prototype.setWidth = function (width) {
        var self = this;
        self.width = width;
    };

    AnimatedTile.prototype.setHeight = function (height) {
        var self = this;
        self.height = height;
    };

    AnimatedTile.prototype.setSpeed = function (speed) {
        var self = this;
        self.speed = speed;
    };


    root.AnimatedTile = AnimatedTile;
})(RPG);