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
                return self.j*self.sWidth + (self.tileset?self.tileset.sx:0);
            }
        });

        Object.defineProperty(self,'sy',{
            get:function(){
                return self.i*self.sHeight + (self.tileset?self.tileset.sy:0);
            }
        });

        Object.defineProperty(self,'dWidth',{
            get:function(){
                return self.tileset?self.tileset.tileDWidth:0;
            }
        });

        Object.defineProperty(self,'dHeight',{
            get:function(){
                return self.tileset?self.tileset.tileDHeight:0;
            }
        });

        Object.defineProperty(self,'sHeight',{
            get:function(){
                return self.tileset?self.tileset.tileSHeight:0;
            }
        });

        Object.defineProperty(self,'sWidth',{
            get:function(){
                return self.tileset?self.tileset.tileSWidth:0;
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