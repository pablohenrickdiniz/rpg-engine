(function (root) {
    if (root.Frame == undefined) {
        throw "AnimatedFrame requires Frae"
    }

    var Frame = root.Frame;

    var AnimatedTile = function (parent, sx, sy, ex, ey, speed) {
        var self = this;
        Frame.call(self, [parent, sx, sy]);
        self.ex = ex || 0;
        self.ey = ey || 0;
        self.speed = speed;
        self.animation = null;
        self.initialize();
    };

    AnimatedTile.prototype = Object.create(Frame.prototype);
    AnimatedTile.prototype.constructor = AnimatedTile;


    AnimatedTile.prototype.initialize = function () {
        var self = this;
        var width = self.getWidth();
        var height = self.getHeight();
        var cols = Math.floor(width / (self.ex - self.sx));
        var rows = Math.floor(height / (self.ey - self.sy));
        var frame_count = rows * cols;
        self.animation = new Animation(self.speed, frame_count);
    };

    AnimatedTile.prototype.run = function () {
        var self = this;
        self.animation.run();
    };

    AnimatedTile.prototype.stop = function () {
        var self = this;
        self.animation.stop();
    };

    AnimatedTile.prototype.getGraphic = function () {
        var self = this;
        var tile_width = self.parent.tileWidth;
        var tile_height = self.parent.tileHeight;
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

    root.AnimatedTile = AnimatedTile;
})(RPG);