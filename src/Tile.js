(function(w){
    var Tile = function(image,sx,sy,width,height){
        var self= this;
        self.image = image;
        self.parent = null;
        self.bounds = {
            sx:sx,
            sy:sy,
            width:width,
            height:height,
            groups:['MAP']
        };
    };

    Tile.prototype.addCollisionGroup =function(group){
        var self = this;
        if(self.bounds.groups.indexOf(group) != -1){
            self.bounds.groups.push(group);
        }
    };

    Tile.prototype.removeCollisionGroup = function(group){
        var self = this;
        var index = self.bounds.groups.indexOf(group);
        if(index != -1){
            self.bounds.groups.splice(index,1);
        }
    };

    Tile.prototype.setSx = function(sx){
        var self = this;
        self.bounds.sx = sx;
    };

    Tile.prototype.setSy = function(sy){
        var self = this;
        self.bounds.sy = sy;
    };

    Tile.prototype.setParent = function(parent){
        var self = this;
        self.parent = parent;
    };

    Tile.prototype.getWidth = function(){
        var self= this;
        return self.bounds.width;
    };

    Tile.prototype.getHeight = function(){
        var self= this;
        return self.bounds.height;
    };

    Tile.prototype.hasTransparency = function(){
        var self = this;
        var width = self.getWidth();
        var height = self.getHeight();

        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(self.image, self.sx, self.sy, width, height, 0, 0, width, height);
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
            image:self.image,
            sx:self.bounds.sx,
            sy:self.bounds.sy,
            sWidth:tile_width,
            sHeight:tile_height,
            dWidth:tile_width,
            dHeight:tile_height
        };
    };

    Tile.merge = function(tiles,sx,sy){
        if(arguments.length > 1){
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var width = null;
            var height = null;

            for(var i = 0; i < tiles.length;i++){
                if(width == null || width < tiles[i].getWidth()){
                    width = tiles[i].getWidth();
                }

                if(height == null || height < tiles[i].getHeight()){
                    height = tiles[i].getHeight();
                }
            }

            canvas.width = width;
            canvas.height = height;

            for(var i = 0; i < tiles.length;i++){
                var g = tiles[i].getGraphic();
                ctx.drawImage(g.image, g.sx, g.sy, g.sWidth, g.sHeight, 0, 0, g.dWidth, g.dHeight);
            }
            var image = new Image();
            image.src = canvas.toDataURL("image/png");
            return new Tile(image,sx,sy,width,height);
        }
        return null;
    };

    w.Tile = Tile;
})(window);