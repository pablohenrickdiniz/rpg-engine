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

    Tileset.prototype.get = function(i,j){
        var self = this;
        if(i >= 0 && i < self.rows && j >= 0 && j < self.cols){
            var tile_width = self.width/self.cols;
            var tile_height = self.height/self.rows;

            if(self.tiles[i] == undefined){
                self.tiles[i] = [];
            }

            if(self.tiles[i][j] == undefined){
                self.tiles[i][j]= {
                    image:self.image,
                    sx:j*tile_width,
                    sy:i*tile_height,
                    sWidth:tile_width,
                    sHeight:tile_height,
                    dWidth:tile_width,
                    dHeight:tile_height
                };
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