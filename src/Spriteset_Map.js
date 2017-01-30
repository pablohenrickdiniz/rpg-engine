(function (root) {
    if (root.Tile == undefined) {
        throw "SpritesetMap requires Tile"
    }

    if(root.Tileset == undefined){
        throw "SpritesetMap requires Tileset"
    }

    var Tile = root.Tile,
        Tileset = root.Tileset;

    var Spriteset_Map = function (options) {
        var self = this;
        initialize(self);
        options = options || {};
        self.width = options.width || 20;
        self.height = options.height || 20;
        self.tileWidth = options.tileWidth || 32;
        self.tileHeight = options.tileHeight || 32;
        self.sprites =  options.sprites || [];
        self.tilesets = options.tilesets || [];
    };

    function initialize(self){
        var width = 0;
        var height = 0;
        Object.defineProperty(self,'width',{
            get:function(){
                return width;
            },
            set:function(w){
                if(w != width){
                    width = w;
                    if(self.sprites){
                        for(var i in self.sprites){
                            if(self.sprites[i].length > width){
                                self.sprites[i].length =width;
                            }
                        }
                    }
                }
            }
        });

        Object.defineProperty(self,'height',{
            get:function(){
                return height;
            },
            set:function(h){
                if(h != height){
                    height = h;
                    if(self.sprites && self.sprites.length > height){
                        self.sprites.height = height;
                    }
                }
            }
        });
    }


    /**
     *
     * @param tileset
     */
    Spriteset_Map.prototype.addTileset = function(tileset){
        var self = this;
        if(self.tilesets.indexOf(tileset) == -1){
            self.tilesets.push(tileset);
            tileset.id = self.tilesets.length - 1;
        }
    };

    /**
     *
     * @param tileset
     */
    Spriteset_Map.prototype.removeTileset = function(tileset){
        var self = this;
        var index = self.tilesets.indexOf(tileset);
        if(index != -1){
            self.tilesets.splice(index,1);
            for(var i = index; i < self.tilesets.length;i++){
                self.tilesets[i].id = index;
            }
        }
    };

    /**
     *
     * @param id
     * @returns {*}
     */
    Spriteset_Map.prototype.getTileset = function(id){
        var self = this;
        if(self.tilesets[id] != undefined){
            return self.tilesets[id];
        }
        return null;
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

        if (tile instanceof Tile && i < self.height && j < self.width) {
            if (self.sprites[i] === undefined) {
                self.sprites[i] = [];
            }

            if(self.sprites[i][j] == undefined){
                self.sprites[i][j] = [];
            }

            self.sprites[i][j][k] = tile;
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
        if (self.sprites[i] !== undefined && self.sprites[i][j] !== undefined && self.sprites[i][j][k] !== undefined) {
            return self.sprites[i][j][k];
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
        if (self.sprites[i] !== undefined && self.sprites[i][j] !== undefined && self.sprites[i][j][k] !== undefined) {
            delete self.sprites[i][j][k];
        }
    };

    /**
     *
     * @returns {*[]}
     */
    Spriteset_Map.prototype.toJSON = function(){
        var self = this;
        return [
            get_used_tilesets(self.sprites), //tilesets
            self.sprites,  //sprites
            self.width,    //width
            self.height,   //height
            self.tileWidth,//tileWidth
            self.tileHeight//tileHeight
        ];
    };

    Spriteset_Map.fromJSON = function(json){
        json = json || [];
        var tilesets = json[0] || [];
        var length = tilesets.length;
        var tileset;
        var i;
        var j;
        var k;
        var tile;

        for(i =0; i < length;i++){
            tileset = Tileset.fromJSON(tilesets[i]);
            tileset.id = i;
            tilesets[i] = tileset;
        }


        var sprites = json[1];
        var width = parseFloat(json[2]);
        var height = parseFloat(json[3]);
        var tileWidth = parseFloat(json[4]);
        var tileHeight = parseFloat(json[5]);


        var map = new Spriteset_Map({
            width:width,
            height:height,
            tileWidth:tileWidth,
            tileHeight:tileHeight
        });


        for(i in sprites){
            for(j in sprites[i]){
                for(k in sprites[i][j]){
                    var s = sprites[i][j][k];
                    if(s != 0){
                        tileset = tilesets[s[0]];
                        tile = tileset.get(s[1],s[2]);
                        map.set(i,j,k,tile);
                    }
                }
            }
        }

        var used_tilesets = get_used_tilesets(map.sprites);
        while(used_tilesets.length > 0){
            map.addTileset(used_tilesets.pop());
        }

        return map;
    };

    /**
     *
     * @param sprites
     * @returns {Array}
     */
    function get_used_tilesets(sprites){
        var tilesets = [];
        var i;
        var j;
        var k;

        for(i in sprites){
            for(j in sprites[i]){
                for(k in sprites[i][j]){
                    var tile = sprites[i][j][k];
                    if(tile instanceof Tile){
                        var index = tilesets.indexOf(tile.tileset);
                        if(index == -1){
                            tile.tileset.id = tilesets.length;
                            tilesets.push(tile.tileset);
                        }
                    }
                }
            }
        }
        return tilesets;
    }

    root.Spriteset_Map = Spriteset_Map;
})(RPG);