(function (root) {
    if(root.Main == undefined){
        throw "Tileset requires Main"
    }
    else{
        if(root.Main.Graphics == undefined){
            throw "Tileset requires Graphics"
        }
    }

    if (root.Tile == undefined) {
        throw "Tileset requires Tile"
    }

    var Tile= root.Tile,
        Graphics = root.Main.Graphics;

    /**
     *
     * @param options
     * @constructor
     */
    var Tileset = function (options) {
        var self = this;
        initialize(self);
        options = options || {};
        self.width = options.width || 0;
        self.height = options.height || 0;
        self.rows = options.rows || null;
        self.cols = options.cols || null;
        self.graphicID = options.graphicID || null;
        self.sprites = [];
        self.collision = [];
        self.id = options.id || null;
    };

    /**
     *
     * @returns {{image: *, rows: (*|self.rows|tileset.rows|Character_Graphic.rows|Tileset.rows|Matrix.rows), cols: (*|self.cols|tileset.cols|Character_Graphic.cols|Tileset.cols|Matrix.cols), width: (options.width|*|number|Tileset.width), height: (options.height|*|number|Tileset.height), collision: Array}}
     */
    Tileset.prototype.toOBJ = function(){
        var self  =this;
        return {
            image:self.image.src,
            rows:self.rows,
            cols:self.cols,
            width:self.width,
            height:self.height,
            collision:self.collision
        };
    };

    Tileset.prototype.toJSON = function(){
        var self  =this;
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
        var self = this;
        if (i >= 0 && i < self.rows && j >= 0 && j < self.cols) {
            if (self.sprites[i] == undefined) {
                self.sprites[i] = [];
            }

            if (self.sprites[i][j] == undefined) {
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
        var self = this;
        if(i >= 0 && i < self.rows && j >= 0 && j < self.cols){
            if(val){
                if(self.collision[i] == undefined){
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
        var self = this;
        return !self.collision[i] || !self.collision[i][j];
    };

    /**
     *
     * @param self
     */
    var initialize = function(self){
        var rows = 1;
        var cols = 1;

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

        Object.defineProperty(self,'rows',{
            get:function(){
                return rows;
            },
            set:function(r){
                if(r != rows){
                    rows = r;
                    self.sprites = [];
                    self.collision = [];
                }
            }
        });

        Object.defineProperty(self,'cols',{
            get:function(){
                return cols;
            },
            set:function(c){
                if(c != cols){
                    cols = c;
                    self.sprites = [];
                    self.collision = [];
                }
            }
        });

        Object.defineProperty(self,'image',{
            get:function(){
                return Graphics.get('tilesets',self.graphicID);
            }
        });
    };

    Tileset.fromJSON = function(json){
        var image_data = json[0];
        var rows = parseInt(json[1]);
        var cols = parseInt(json[2]);
        var width = parseFloat(json[3]);
        var height = parseFloat(json[4]);

        var image = new Image();
        image.src = image_data;

        var tileset = new Tileset({
            image:image,
            rows:rows,
            cols:cols,
            width:width,
            height:height
        });

        var collision = json[5];
        var length = collision.length;
        for(var i =0; i < length;i++){
            var c = collision[i];
            tileset.setCollision(parseInt(c[0]),parseInt(c[1]),true);
        }

        return tileset;
    };


    function collisiontoJSON(collision){
        var c = [];
        for(var i in collision){
            for(var j in collision[i]){
                c.push([parseInt(i),parseInt(j)]);
            }
        }
        return c;
    }

    root.Tileset = Tileset;
})(RPG);