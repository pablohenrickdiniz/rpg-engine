'use strict';
(function (root) {
    if (root.Tile === undefined) {
        throw "Animated_Tile requires Tile";
    }

    let Tile = root.Tile;

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
    let Animated_Tile = function (parent, sx, sy, ex, ey, speed) {
        let self = this;
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
        let self = this;
        let width = self.width;
        let height = self.height;
        let cols = Math.floor(width / (self.ex - self.sx));
        let rows = Math.floor(height / (self.ey - self.sy));
        let frame_count = rows * cols;
        self.animation = new Animation(self.animationSpeed, frame_count);
    };

    Animated_Tile.prototype.run = function () {
        let self = this;
        self.animation.run();
    };

    Animated_Tile.prototype.stop = function () {
        let self = this;
        self.animation.stop();
    };

    /**
     *
     * @returns {{image: *, sx: *, sy: *, sWidth, sHeight, dWidth, dHeight}}
     */
    Animated_Tile.prototype.getGraphic = function () {
        let self = this;
        let tile_width = self.parent.tileDWidth;
        let tile_height = self.parent.tileDHeight;
        let frame = self.animation.getIndexFrame();

        let cols = Math.floor(width / (self.ex - self.sx));
        let i = Math.floor(frame / cols);
        let j = frame % cols;

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