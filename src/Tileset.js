(function(w){
    var Tileset = function(image){
        var self= this;
        self.width = 0;
        self.height = 0;
        self.rows = 1;
        self.cols = 1;
        self.image = null;
        self.tiles = [];
        self.setImage(image);
    };

    Tileset.prototype.setImage = function(image){
        if(image instanceof Image){
            var self =this;
            if(image.complete){
                Tileset.loadCallback.apply(self,[image]);
            }
            else{
                image.addEventListener('load',function(){
                    Tileset.loadCallback.apply(self,[image]);
                });
            }
            self.image = image;
        }
    };

    Tileset.prototype.getTileWidth = function(){
        var self = this;
        return self.width/self.cols;
    };

    Tileset.prototype.getTileHeight = function(){
        var self = this;
        return self.height/self.rows;
    };

    Tileset.prototype.get = function(i,j){
        var self = this;
        if(i >= 0 && i < self.rows && j >= 0 && j < self.cols){
            var tile_width = self.getTileWidth();
            var tile_height = self.getTileHeight();

            if(self.tiles[i] == undefined){
                self.tiles[i] = [];
            }

            if(self.tiles[i][j] == undefined){
                self.tiles[i][j]= new Tile(self.image,j*tile_width,i*tile_height,tile_width,tile_height);
                self.tiles[i][j].setParent(self);
            }

            return self.tiles[i][j];
        }
    };

    Tileset.loadCallback = function(image){
        var self = this;
        self.width = image.width;
        self.height = image.height;
        self.rows = image.height/32;
        self.cols = image.width/32;
    };
    w.Tileset = Tileset;
})(window);