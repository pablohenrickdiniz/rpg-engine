(function (root) {
    if (root.Frame == undefined) {
        throw "Character_Graphic requires Frame"
    }

    if(root.Graphics == undefined){
        throw "Character_Graphic requires Graphics"
    }

    var Frame = root.Frame,
        Graphics = root.Graphics;
    /**
     *
     * @param image
     * @param options
     * @constructor
     */
    var Character_Graphic = function (options) {
        var self = this;
        initialize(self);
        options = options || {};
        self.rows = options.rows || 1;
        self.cols = options.cols || 1;
        self.sx = options.sx || 0;
        self.sy = options.sy || 0;
        self.sWidth = options.sWidth || null;
        self.sHeight = options.sHeight || null;
        self.image = options.image || '';
        self.sprites = [];
        self.startFrame = options.startFrame || 0;
    };
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
                var sx = self.sx + (j * self.width);
                var sy = self.sy + (i * self.height);
                self.sprites[i][j] = new Frame({
                    image:self.image,
                    sx:sx,
                    sy:sy,
                    width:self.width,
                    height:self.height,
                    parent:self
                });
            }

            return self.sprites[i][j];
        }
    };

    var initialize = function(self){
        Object.defineProperty(self,'width',{
            get:function(){
                var width = self.sWidth;
                if(width == null){
                    var image = Graphics.get('characters',self.image);
                    if(image != null){
                        width = image.width;
                    }
                }
                if(width != null){
                    return width/self.cols;
                }

                return 0;
            }
        });

        Object.defineProperty(self,'height',{
            get:function(){
                var height = self.sHeight;
                if(height == null){
                    var image = Graphics.get('characters',self.image);
                    if(image != null){
                        height = image.height;
                    }
                }
                if(height != null){
                    return height/self.rows;
                }
                return 0;
            }
        });
    };


    root.Character_Graphic = Character_Graphic;
})(RPG);