(function (root) {
    /**
     *
     * @param options
     * @constructor
     */
    var Spriteset_Map = function (options) {
        var self = this;
        initialize(self);
        options = options || {};
        self.width = options.width || 20;
        self.height = options.height || 20;
        self.tileWidth = options.tileWidth || 32;
        self.tileHeight = options.tileHeight || 32;
        self.data =  options.data || [];
    };

    /**
     *
     * @param i
     * @param j
     * @param k
     * @param tile
     * @returns {Spriteset_Map}
     */
    Spriteset_Map.prototype.set = function (i, j, k, tile) {
        var self = this;

        if (i < self.height && j < self.width) {
            if (self.data[i] === undefined) {
                self.data[i] = [];
            }

            if(self.data[i][j] == undefined){
                self.data[i][j] = [];
            }

            self.data[i][j][k] = tile;
        }

        return self;
    };

    /**
     *
     * @param i
     * @param j
     * @param k
     * @returns {*}
     */
    Spriteset_Map.prototype.get = function (i, j, k) {
        var self = this;
        if (self.data[i] !== undefined && self.data[i][j] !== undefined && self.data[i][j][k] !== undefined) {
            return self.data[i][j][k];
        }

        return null;
    };

    /**
     *
     * @param i
     * @param j
     * @param k
     */
    Spriteset_Map.prototype.unset = function (i, j, k) {
        var self = this;
        if (self.data[i] !== undefined && self.data[i][j] !== undefined && self.data[i][j][k] !== undefined) {
            delete self.data[i][j][k];
        }
    };

    /**
     *
     * @returns {*[]}
     */
    Spriteset_Map.prototype.toJSON = function(){
        var self = this;
        return [ //tilesets
            self.data,  //sprites
            self.width,    //width
            self.height,   //height
            self.tileWidth,//tileWidth
            self.tileHeight//tileHeight
        ];
    };

    /**
     *
     * @param self
     */
    function initialize(self){
       var width = 0;
       var height = 0;
       Object.defineProperty(self,'width',{
           get:function(){
               return width;
           },
           set:function(w){
               w = parseInt(w);
               if(!isNaN(w) && w >= 0 && w != width){
                   width = w;
               }
           }
       });

        Object.defineProperty(self,'height',{
            get:function(){
                return height;
            },
            set:function(h){
                h = parseInt(h);
                if(!isNaN(h) && h >= 0 && h != height){
                    height = h;
                }
            }
        });

    }

    root.Spriteset_Map = Spriteset_Map;
})(RPG);