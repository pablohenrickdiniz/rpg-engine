/**
 * @requires RPG.js
 * @requires Tilesets.js
 */
(function (root) {
    let Tilesets = root.Main.Tilesets;
    /**
     *
     * @param options {object}
     * @constructor
     */
    let Spriteset_Map = function (options) {
        let self = this;
        initialize(self);
        options = options || {};
        self.width = options.width || 10;
        self.height = options.height || 10;
        self.tileWidth = options.tileWidth || 32;
        self.tileHeight = options.tileHeight || 32;
        self.data =  options.data || [];
        self.cache = [];
    };
    /**
     *
     * @param i {number}
     * @param j {number}
     * @param k {number}
     * @param tile {Tile}
     * @returns {Spriteset_Map}
     */
    Spriteset_Map.prototype.set = function (i, j, k, tile) {
        let self = this;

        if (i < self.height && j < self.width) {
            if (!self.data[i]) {
                self.data[i] = [];
            }

            if(!self.data[i][j]){
                self.data[i][j] = [];
            }

            self.data[i][j][k] = tile;
            setCache(self,i,j,k,tile);
        }

        return self;
    };

    function setCache(self,i,j,k,t){
        if(self.cache[k] === undefined){
            let canvas = document.createElement('canvas');
            canvas.width = self.realWidth;
            canvas.height  = self.realHeight;
            self.cache[k] = canvas;
        }
        let ctx = self.cache[k].getContext('2d');
        let tileset = Tilesets.get(t[0]);
        let tile = tileset.get(t[1],t[2]);
        if(tile != null){
            let tw = self.tileWidth;
            let th = self.tileHeight;
            let dx = j * tw;
            let dy = i * th;
            dx = parseInt(dx);
            dy = parseInt(dy);
            ctx.drawImage(tile.image, tile.sx, tile.sy,tw,th, dx, dy, tw,th);
        }
    }
    
    function updateCache(self){
        if(self.data){
            let keysA = Object.keys(self.data);
            for(let i = 0; i < keysA.length;i++){
                let keyA = keysA[i];
                let keysB = Object.keys(self.data[keyA]);
                for(let j = 0; j < keysB.length;j++){
                    let keyB = keysB[j];
                    let keysC = Object.keys(self.data[keyA][keyB]);
                    for(let k = 0; k < keysC.length;k++){
                        let keyC = keysC[k];
                        setCache(self,keyA,keyB,keyC,self.data[keyA][keyB][keyC]);
                    }
                }
            }
        }
    }

    Spriteset_Map.prototype.getArea = function(x,y,width,height){
        let self = this;
        let images = [];
        let layers = Object.keys(self.cache);

        for(let i = 0; i < layers.length;i++){
            images[layers[i]] = self.cache[layers[i]].getContext('2d').getImageData(x,y,width,height);
        }
        return images;
    };

    /**
     *
     * @param i {number}
     * @param j {number}
     * @param k {number}
     * @returns {Tile}
     */
    Spriteset_Map.prototype.get = function (i, j, k) {
        let self = this;
        return self.data[i] && self.data[i][j] && self.data[i][j][k]?self.data[i][j][k]:null;
    };

    /**
     *
     * @param i {number}
     * @param j {number}
     * @param k {number}
     */
    Spriteset_Map.prototype.unset = function (i, j, k) {
        let self = this;
        if (self.data[i]  && self.data[i][j]  && self.data[i][j][k]) {
            delete self.data[i][j][k];
        }
    };

    /**
     *
     * @returns {object}
     */
    Spriteset_Map.prototype.toJSON = function(){
        let self = this;
        return [
            self.data,
            self.width,
            self.height,
            self.tileWidth,
            self.tileHeight
        ];
    };

    /**
     *
     * @param self {Spriteset_Map}
     */
    function initialize(self){
        let width = 0;
        let height = 0;
        let tileWidth  = 32;
        let tileHeight = 32;
        let cache = [];

        Object.defineProperty(self,'tileWidth',{
            get:function(){
                return tileWidth;
            },
            set:function(tw){
                tw = parseInt(tw);
                if(!isNaN(tw) && tw >= 0 && tw !== tileWidth){
                    tileWidth = tw;
                    cache = [];
                    updateCache(self);
                }
            }
        });

        Object.defineProperty(self,'tileHeight',{
            get:function(){
                return tileHeight;
            },
            set:function(th){
                th = parseInt(th);
                if(!isNaN(th) && th >= 0 && th !== tileHeight){
                    tileHeight = th;
                    cache = [];
                    updateCache(self);
                }
            }
        });

        Object.defineProperty(self,'width',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return width;
            },
            /**
             *
             * @param w {number}
             */
            set:function(w){
                w = parseInt(w);
                if(!isNaN(w) && w >= 0 && w !== width){
                    width = w;
                    updateCache(self);
                }
            }
        });

        Object.defineProperty(self,'height',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return height;
            },
            /**
             *
             * @param h {number}
             */
            set:function(h){
                h = parseInt(h);
                if(!isNaN(h) && h >= 0 && h !== height){
                    height = h;
                    updateCache(self);
                }
            }
        });

        Object.defineProperty(self,'realWidth',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return width * tileWidth;
            }
        });

        Object.defineProperty(self,'realHeight',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return height * tileHeight;
            }
        });

    }

    Object.defineProperty(root,'Spriteset_Map',{
        /**
         *
         * @returns {Spriteset_Map}
         */
        get:function(){
            return Spriteset_Map;
        }
    });
})(RPG);