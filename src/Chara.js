'use strict';
(function (root) {
    if (!root.Tile) {
        throw "Chara requires Tile";
    }

    if(!root.Main){
        throw "Chara requires Main";
    }
    else{
        if(!root.Main.Graphics){
            throw "Chara requires Graphics";
        }
    }

    if(!root.Game_Graphic){
        throw "Chara requires Game_Graphic";
    }

    let Tile = root.Tile,
        Game_Graphic = root.Game_Graphic;

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Chara = function (options) {
        let self = this;
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
     * @param i {number}
     * @param j {number}
     * @returns {Tile}
     */
    Chara.prototype.get = function (i, j) {
        let self = this;
        if (i >= 0 && i < self.rows && j >= 0 && j < self.cols) {

            if (self.sprites[i] === undefined) {
                self.sprites[i] = [];
            }

            if (self.sprites[i][j] === undefined) {
                self.sprites[i][j] = new Tile({
                    i:i,
                    j:j,
                    tileset:self
                });
            }

            return self.sprites[i][j];
        }
    };
    /**
     *
     * @param self {Chara}
     */
    function initialize(self){
        Object.defineProperty(self,'tileSWidth',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return self.sWidth/self.cols;
            }
        });

        Object.defineProperty(self,'tileSHeight',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return self.sHeight/self.rows;
            }
        });

        Object.defineProperty(self,'tileDWidth',{
            /**
             * @returns {number}
             */
            get:function(){
                return self.tileSWidth;
            }
        });

        Object.defineProperty(self,'tileDHeight',{
            /**
             * @returns {number}
             */
            get:function(){
                return self.tileSHeight;
            }
        });
    }

    Object.defineProperty(root,'Chara',{
        /**
         *
         * @returns {Chara}
         */
       get:function(){
           return Chara;
       }
    });
})(RPG);