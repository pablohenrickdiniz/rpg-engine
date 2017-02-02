(function (root) {
    if (root.Tile == undefined) {
        throw "Character_Graphic requires Tile"
    }

    if(root.Graphics == undefined){
        throw "Character_Graphic requires Graphics"
    }

    if(root.Game_Graphic == undefined){
        throw "Character_Graphic requires Game_Graphic"
    }

    var Tile = root.Tile,
        Graphics = root.Graphics,
        Game_Graphic = root.Game_Graphic;

    /**
     *
     * @param options
     * @constructor
     */
    var Character_Graphic = function (options) {
        var self = this;
        options = options || {};
        Game_Graphic.call(self,options);
        initialize(self);
        self.rows = options.rows || 1;
        self.cols = options.cols || 1;
        self.sprites = [];
        self.startFrame = options.startFrame || 0;
        self.graphicType = 'characters';
    };


    Character_Graphic.prototype = Object.create(Game_Graphic.prototype);
    Character_Graphic.prototype.constructor = Character_Graphic;

    /**
     *
     * @param i
     * @param j
     * @returns {*}
     */
    Character_Graphic.prototype.get = function (i, j) {
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

    root.Character_Graphic = Character_Graphic;
})(RPG);