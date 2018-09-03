'use strict';
(function (root) {
    /**
     *
     * @param options
     * @constructor
     */
    let Tile = function (options) {
        let self = this;
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
        let self = this;
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
        let self = this;
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
    let initialize = function(self){
        Object.defineProperty(self,'sx',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return self.j*self.sWidth + (self.tileset?self.tileset.sx:0);
            }
        });

        Object.defineProperty(self,'sy',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return self.i*self.sHeight + (self.tileset?self.tileset.sy:0);
            }
        });

        Object.defineProperty(self,'dWidth',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return self.tileset?self.tileset.tileDWidth:0;
            }
        });

        Object.defineProperty(self,'dHeight',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return self.tileset?self.tileset.tileDHeight:0;
            }
        });

        Object.defineProperty(self,'sWidth',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return self.tileset?self.tileset.tileSWidth:0;
            }
        });

        Object.defineProperty(self,'sHeight',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return self.tileset?self.tileset.tileSHeight:0;
            }
        });


        Object.defineProperty(self,'image',{
            /**
             *
             * @returns {null}
             */
            get:function(){
                return self.tileset?self.tileset.image:null;
            }
        });

        Object.defineProperty(self,'passable',{
            /**
             *
             * @returns {boolean}
             */
            get:function(){
                return self.tileset?self.tileset.isPassable(self.i,self.j):true;
            }
        });
    };

    Object.defineProperty(root,'Tile',{
        /**
         *
         * @returns {Tile}
         */
       get:function(){
           return Tile;
       }
    });
})(RPG);