'use strict';
(function (root) {
    if(root.Main === undefined){
        throw "Tileset requires Main";
    }
    else{
        if(root.Main.Graphics === undefined){
            throw "Tileset requires Graphics";
        }
    }

    if (root.Tile === undefined) {
        throw "Tileset requires Tile";
    }

    if(root.Game_Graphic === undefined){
        throw "Tileset requires Game_Graphic";
    }

    let Tile= root.Tile,
        Graphics = root.Main.Graphics,
        Game_Graphic = root.Game_Graphic;

    /**
     *
     * @param options
     * @constructor
     */
    let Tileset = function (options) {
        let self = this;
        Game_Graphic.call(self,options);
        initialize(self);
        options = options || {};
        self.rows = options.rows || null;
        self.cols = options.cols || null;
        self.sprites = [];
        self.collision = [];
        self.graphicType = 'tilesets';
    };

    Tileset.prototype = Object.create(Game_Graphic.prototype);
    Tileset.prototype.constructor = Tileset;

    /**
     *
     * @returns {{image: (self.src|*|src|Audio.src|Audio_File.src|Image.src), rows: (*|.map.tileset.rows|.charas.char1.rows|Chara.rows|Matrix.rows|null), cols: (*|.map.tileset.cols|.charas.char1.cols|Chara.cols|Matrix.cols|null), width: *, height: *, collision: Array}}
     */
    Tileset.prototype.toOBJ = function(){
        let self  =this;
        return {
            image:self.image.src,
            rows:self.rows,
            cols:self.cols,
            width:self.width,
            height:self.height,
            collision:self.collision
        };
    };

    /**
     *
     * @returns {*[]}
     */
    Tileset.prototype.toJSON = function(){
        let self  =this;
        return [
            self.image.src, //image
            self.rows,      //rows
            self.cols,      //cols
            self.width,     //width
            self.height,    //height
            collisiontoJSON(self.collision)  //collision
        ];
    };


    /**
     *
     * @param i
     * @param j
     * @returns {*}
     */
    Tileset.prototype.get = function (i, j) {
        let self = this;
        if (i >= 0 && i < self.rows && j >= 0 && j < self.cols) {
            if (self.sprites[i] === undefined) {
                self.sprites[i] = [];
            }

            if (self.sprites[i][j] === undefined) {
                self.sprites[i][j] = new Tile({
                    tileset:self,
                    i:i,
                    j:j
                });
            }

            return self.sprites[i][j];
        }
        return null;
    };

    /**
     *
     * @param i
     * @param j
     * @param val
     */
    Tileset.prototype.setCollision = function(i,j,val){
        let self = this;
        if(i >= 0 && i < self.rows && j >= 0 && j < self.cols){
            if(val){
                if(self.collision[i] === undefined){
                    self.collision[i] = [];
                }
                self.collision[i][j] = 1;
            }
            else{
                if(self.collision[i] && self.collision[i][j]){
                    delete self.collision[i][j];
                }
            }
        }
    };

    /**
     *
     * @param i
     * @param j
     * @returns {*|boolean}
     */
    Tileset.prototype.isPassable = function(i,j){
        let self = this;
        return !self.collision[i] || !self.collision[i][j];
    };

    /**
     *
     * @param self
     */
    function initialize(self){
        let rows = 1;
        let cols = 1;

        Object.defineProperty(self,'tileDWidth',{
            /**
             *
             * @returns {number}
             */
            get:function(){
              return self.tileSHeight*self.scale;
            }
        });

        Object.defineProperty(self,'tileDHeight',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return self.tileSHeight*self.scale;
            }
        });

        Object.defineProperty(self,'tileSWidth',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return  self.width / self.cols;
            }
        });

        Object.defineProperty(self,'tileSHeight',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return self.height / self.rows;
            }
        });


        Object.defineProperty(self,'rows',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return rows;
            },
            /**
             *
             * @param r
             */
            set:function(r){
                if(r !== rows){
                    rows = r;
                    self.sprites = [];
                    self.collision = [];
                }
            }
        });

        Object.defineProperty(self,'cols',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return cols;
            },
            /**
             *
             * @param c
             */
            set:function(c){
                if(c !== cols){
                    cols = c;
                    self.sprites = [];
                    self.collision = [];
                }
            }
        });
    }

    /**
     *
     * @param json
     * @returns {Tileset}
     */
    Tileset.fromJSON = function(json){
        let image_data = json[0];
        let rows = parseInt(json[1]);
        let cols = parseInt(json[2]);
        let width = parseFloat(json[3]);
        let height = parseFloat(json[4]);

        let image = new Image();
        image.src = image_data;

        let tileset = new Tileset({
            image:image,
            rows:rows,
            cols:cols,
            width:width,
            height:height
        });

        let collision = json[5];
        let length = collision.length;
        for(let i =0; i < length;i++){
            let c = collision[i];
            tileset.setCollision(parseInt(c[0]),parseInt(c[1]),true);
        }

        return tileset;
    };

    /**
     *
     * @param collision
     * @returns {Array}
     */
    function collisiontoJSON(collision){
        let c = [];
        for(let i in collision){
            for(let j in collision[i]){
                c.push([parseInt(i),parseInt(j)]);
            }
        }
        return c;
    }

    Object.defineProperty(root,'Tileset',{
        /**
         *
         * @returns {Tileset}
         */
       get:function(){
           return Tileset;
       }
    });
})(RPG);