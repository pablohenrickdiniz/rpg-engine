(function (root) {
    if (root.Tile == undefined) {
        throw "Chara requires Tile"
    }

    if(root.Main == undefined){
        throw "Chara requires Main"
    }
    else{
        if(root.Main.Graphics == undefined){
            throw "Chara requires Graphics"
        }
    }


    if(root.Game_Graphic == undefined){
        throw "Chara requires Game_Graphic"
    }

    var Tile = root.Tile,
        Graphics = root.Main.Graphics,
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
        self.scale = options.scale || 1;
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
        Object.defineProperty(self,'tileSWidth',{
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

        Object.defineProperty(self,'tileSHeight',{
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


        Object.defineProperty(self,'tileWidth',{
            get:function(){
              return self.tileSWidth*self.scale;
            }
        });

        Object.defineProperty(self,'tileHeight',{
            get:function(){
                return self.tileSHeight*self.scale;
            }
        });
    }

    root.Chara = Chara;
})(RPG);