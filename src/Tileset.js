(function (root) {
    if (root.Frame == undefined) {
        throw "Tileset requires Frame"
    }

    var Frame = root.Frame;
    /**
     *
     * @param image
     * @param options
     * @constructor
     */
    var Tileset = function (image, options) {
        var self = this;
        initialize(self);
        self.width = 0;
        self.height = 0;
        self.rows = options.rows || null;
        self.cols = options.cols || null;
        self.image = image;
        self.sprites = [];
    };
    /**
     *
     * @param i
     * @param j
     * @returns {*}
     */
    Tileset.prototype.get = function (i, j) {
        var self = this;
        if (i >= 0 && i < self.rows && j >= 0 && j < self.cols) {
            var tile_width = self.tileWidth;
            var tile_height = self.tileHeight;

            if (self.sprites[i] == undefined) {
                self.sprites[i] = [];
            }

            if (self.sprites[i][j] == undefined) {
                self.sprites[i][j] = new Frame(self.image, j * tile_width, i * tile_height, tile_width, tile_height);
                self.sprites[i][j].parent = self;
            }

            return self.sprites[i][j];
        }
    };

    /**
     *
     * @param self
     */
    var initialize = function(self){
        Object.defineProperty(self,'tileWidth',{
            get:function(){
                return  self.width / self.cols;
            }
        });

        Object.defineProperty(self,'tileHeight',{
            get:function(){
                return self.height / self.rows;
            }
        });
    };


    root.Tileset = Tileset;
})(RPG);