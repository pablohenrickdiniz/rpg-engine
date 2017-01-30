(function (root) {
    /**
     *
     * @param options
     * @constructor
     */
    var Tile = function (options) {
        var self = this;
        initialize(self);
        options = options || {};
        self.i = options.i || 0;
        self.j = options.j || 0;
        self.tileset = options.tileset || null;
    };

    /**
     *
     * @returns {*[]}
     */
    Tile.prototype.toJSON = function(){
        var self = this;
        return [
            self.tileset?self.tileset.id:null, //tileset
            self.i,                            //sx
            self.j                             //sy
        ];
    };

    /**
     *
     * @returns {{tileset: *, sx: (*|sx), sy: (*|sy), sWidth: *, sHeight: *}}
     */
    Tile.prototype.toOBJ = function(){
        var self = this;
        return {
            tileset:self.tileset?self.tileset.id:null,
            sx:self.sx,
            sy:self.sy,
            sWidth:self.width,
            sHeight:self.height
        };
    };

    /**
     *
     * @param self
     */
    var initialize = function(self){
        Object.defineProperty(self,'sx',{
            get:function(){
                return self.j*self.width;
            }
        });

        Object.defineProperty(self,'sy',{
            get:function(){
                return self.i*self.height;
            }
        });

        Object.defineProperty(self,'width',{
            get:function(){
                return self.tileset?self.tileset.tileWidth:0;
            }
        });

        Object.defineProperty(self,'height',{
            get:function(){
                return self.tileset?self.tileset.tileHeight:0;
            }
        });

        Object.defineProperty(self,'image',{
            get:function(){
                return self.tileset?self.tileset.image:null;
            }
        });

        Object.defineProperty(self,'passable',{
            get:function(){
                return self.tileset?self.tileset.isPassable(self.i,self.j):true;
            }
        });
    };


    root.Tile = Tile;
})(RPG);