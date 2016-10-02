(function (root) {
    /**
     *
     * @param options
     * @constructor
     */
    var Frame = function (options) {
        var self = this;
        options = options || {};
        self.image = options.image || '';
        self.sx = options.sx || 0;
        self.sy = options.sy || 0;
        self.width = options.width || 0;
        self.height = options.height || 0;
        self.parent = options.parent || null;
    };

    /**
     *
     * @param x
     * @param y
     * @returns {{dx: (*|number), dy: (*|number), sx: (options.sx|*|number), sy: (options.sy|*|number), sWidth: (options.width|*|number), sHeight: (options.height|*|number), dWidth: *, dHeight: *}}
     */
    Frame.prototype.getBounds = function (x,y) {
        var self = this;
        var bounds = self.toJSON();
        bounds.dx = x = x || 0;
        bounds.dy = y = y || 0;
        return bounds;
    };

    /**
     *
     * @returns {{sx: (options.sx|*|number), sy: (options.sy|*|number), sWidth: (options.width|*|number), sHeight: (options.height|*|number), dWidth: *, dHeight: *}}
     */
    Frame.prototype.toJSON = function(){
        var self = this;
        return {
            sx:self.sx,
            sy:self.sy,
            sWidth:self.width,
            sHeight:self.height,
            dWidth:self.width,
            dHeight:self.height
        };
    };

    ///**
    // *
    // * @returns {boolean}
    // */
    //Frame.prototype.hasTransparency = function () {
    //    var self = this;
    //    var width = self.getWidth();
    //    var height = self.getHeight();
    //
    //    var canvas = document.createElement('canvas');
    //    canvas.width = width;
    //    canvas.height = height;
    //    var ctx = canvas.getContext('2d');
    //    ctx.drawImage(self.image, self.sx, self.sy, width, height, 0, 0, width, height);
    //    var p = ctx.getImageData(0, 0, width, height).data;
    //    for (var i = 0; i < p.length; i += 4) {
    //        if (p[3] === undefined || p[3] === 0) {
    //            return true;
    //        }
    //    }
    //    return false;
    //};



    //Tile.merge = function (tiles, sx, sy) {
    //    if (arguments.length > 1) {
    //        var canvas = document.createElement('canvas');
    //        var ctx = canvas.getContext('2d');
    //        var width = null;
    //        var height = null;
    //        var i;
    //
    //        for (i = 0; i < tiles.length; i++) {
    //            if (width == null || width < tiles[i].getWidth()) {
    //                width = tiles[i].getWidth();
    //            }
    //
    //            if (height == null || height < tiles[i].getHeight()) {
    //                height = tiles[i].getHeight();
    //            }
    //        }
    //
    //        canvas.width = width;
    //        canvas.height = height;
    //
    //        for (i = 0; i < tiles.length; i++) {
    //            var g = tiles[i].getGraphic();
    //            ctx.drawImage(g.image, g.sx, g.sy, g.sWidth, g.sHeight, 0, 0, g.dWidth, g.dHeight);
    //        }
    //        var image = new Image();
    //        image.src = canvas.toDataURL("image/png");
    //        return new Tile(image, sx, sy, width, height);
    //    }
    //    return null;
    //};

    root.Frame = Frame;
})(RPG);