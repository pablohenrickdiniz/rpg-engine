'use strict';
(function (root) {
    if (root.Tile === undefined) {
        throw "Animated_Tile requires Tile";
    }

    var Tile = root.Tile;

    /**
     *
     * @param parent
     * @param sx
     * @param sy
     * @param ex
     * @param ey
     * @param speed
     * @constructor
     */
    var Animated_Tile = function (parent, sx, sy, ex, ey, speed) {
        var self = this;
        Tile.call(self, [parent, sx, sy]);
        self.ex = ex || 0;
        self.ey = ey || 0;
        self.animationSpeed = speed;
        self.animation = null;
        self.initialize();
    };

    Animated_Tile.prototype = Object.create(Tile.prototype);
    Animated_Tile.prototype.constructor = Animated_Tile;

    Animated_Tile.prototype.initialize = function () {
        var self = this;
        var width = self.width;
        var height = self.height;
        var cols = Math.floor(width / (self.ex - self.sx));
        var rows = Math.floor(height / (self.ey - self.sy));
        var frame_count = rows * cols;
        self.animation = new Animation(self.animationSpeed, frame_count);
    };

    Animated_Tile.prototype.run = function () {
        var self = this;
        self.animation.run();
    };

    Animated_Tile.prototype.stop = function () {
        var self = this;
        self.animation.stop();
    };

    /**
     *
     * @returns {{image: *, sx: *, sy: *, sWidth, sHeight, dWidth, dHeight}}
     */
    Animated_Tile.prototype.getGraphic = function () {
        var self = this;
        var tile_width = self.parent.tileDWidth;
        var tile_height = self.parent.tileDHeight;
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

    root.Animated_Tile = Animated_Tile;
})(RPG);