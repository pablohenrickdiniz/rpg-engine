(function (root) {
    if (root.Tile == undefined) {
        throw "Character_Graphic requires Tile"
    }

    if(root.Graphics == undefined){
        throw "Character_Graphic requires Graphics"
    }

    if(root.Game_Graphic == undefined){
        throw "Chara requires Game_Graphic"
    }

    var Tile = root.Tile,
        Graphics = root.Graphics,
        Game_Graphic = root.Game_Graphic;

    /**
     *
     * @param options
     * @constructor
     */
    var Chara = function (options) {
        var self = this;
        options = options || {};
        Game_Graphic.call(self,options);
        initialize(self);
        self.rows = options.rows || 1;
        self.cols = options.cols || 1;
        self.sprites = [];
        self.startFrame = options.startFrame || 0;
        self.graphicType = 'charasets';
    };


    Chara.prototype = Object.create(Game_Graphic.prototype);
    Chara.prototype.constructor = Chara;

    /**
     *
     * @param i
     * @param j
     * @returns {*}
     */
    Chara.prototype.get = function (i, j) {
        var self = this;
        if (i >= 0 && i < self.rows && j >= 0 && j < self.cols) {

            if (self.sprites[i] == undefined) {
                self.sprites[i] = [];
            }

            if (self.sprites[i][j] == undefined) {
                self.sprites[i][j] = new Tile({
                    i:i,
                    j:j,
                    tileset:self
                });
            }

            return self.sprites[i][j];
        }
    };

    function initialize(self){
        Object.defineProperty(self,'tileWidth',{
            get:function(){
                var width = self.sWidth;
                if(width == null){
                    if(self.image != null){
                        width = self.image.width;
                    }
                }
                if(width != null){
                    return width/self.cols;
                }

                return 0;
            }
        });

        Object.defineProperty(self,'tileHeight',{
            get:function(){
                var height = self.sHeight;
                if(height == null){
                    if(self.image != null){
                        height = self.image.height;
                    }
                }
                if(height != null){
                    return height/self.rows;
                }
                return 0;
            }
        });
    }

    root.Chara = Chara;
})(RPG);