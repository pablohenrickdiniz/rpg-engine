(function(w){

    var Tile = function(parent,sx,sy){
        var self= this;
        self.parent = parent;
        self.sx = sx;
        self.sy = sy;
    };

    Tile.prototype.setSx = function(sx){
        var self = this;
        self.sx = sx;
    };

    Tile.prototype.setSy = function(sy){
        var self = this;
        self.sy = sy;
    };

    Tile.prototype.setParent = function(parent){
        var self = this;
        self.parent = parent;
    };

    Tile.prototype.getWidth = function(){
        var self= this;
        return self.parent.getTileWidth();
    };

    Tile.prototype.getHeight = function(){
        var self= this;
        return self.parent.getTileHeight();
    };

    Tile.prototype.hasTransparency = function(){
        var self = this;
        var width = self.getWidth();
        var height = self.getHeight();

        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(self.parent.image, self.sx, self.sy, width, height, 0, 0, width, height);
        var p = ctx.getImageData(0, 0, width, height).data;
        for(var i = 0; i < p.length; i+=4){
            if(p[3] === undefined || p[3] === 0){
                return true;
            }
        }
        return false;
    };

    Tile.prototype.getGraphic = function(){
        var self= this;
        var tile_width = self.getWidth();
        var tile_height = self.getHeight();
        return {
            image:self.parent.image,
            sx:self.sx,
            sy:self.sy,
            sWidth:tile_width,
            sHeight:tile_height,
            dWidth:tile_width,
            dHeight:tile_height
        };
    };

    w.Tile = Tile;
})(window);