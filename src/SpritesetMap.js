(function(root){

    if (root.Tile == undefined) {
        throw "Map requires Tile"
    }

    if (root.AnimatedTile == undefined) {
        throw "Map requires Animated Tile"
    }

    var Tile = root.Tile,
        AnimatedTile = root.AnimatedTile;

    var SpritesetMap = function(options){
        var self = this;
        options = options || {};
        self.width = options.width || 5;
        self.height = options.height || 5;
        self.tile_w = options.tile_w || 32;
        self.tile_h = options.tile_h || 32;
        self.tile_map = [];
        self.animated_tile_map = [];
    };

    /*
     setTile(int i, int j,int k, Object tile):void
     Altera o tile na posição [i][j][k]
     */
    SpritesetMap.prototype.set = function (i, j, k, tile) {
        var self = this;

        if (tile instanceof AnimatedTile) {
            if (self.animated_tile_map[i] === undefined) {
                self.animated_tile_map[i] = [];
            }

            if (self.animated_tile_map[i][j] === undefined) {
                self.animated_tile_map[i][j] = [];
            }

            self.animated_tile_map[i][j][k] = tile;
        }
        else if (tile instanceof Tile) {
            if (self.tile_map[i] === undefined) {
                self.tile_map[i] = [];
            }

            self.tile_map[i][j][k] = tile;
        }

        return self;
    };

    /*
     getTile(int i, int j, int k): Object
     Retorna o tile do mapa na posição [i][j][k]
     */
    SpritesetMap.prototype.get= function (i, j, k) {
        var self = this;
        if (self.tile_map[i] !== undefined && self.tile_map[i][j] !== undefined && self.tile_map[i][j][k] !== undefined) {
            return self.tile_map[i][j][k];
        }
        else if (self.animated_tile_map[i] !== undefined && self.animated_tile_map[i][j] !== undefined && self.animated_tile_map[i][j][k] != undefined) {
            return self.animated_tile_map[i][j][k];
        }
        return null;
    };

    /*
     removeTile(int i, int j, int k):void
     Remove o tile do mapa na posição [i][j][k]
     */
    SpritesetMap.prototype.remove = function (i, j, k) {
        var self = this;
        if (self.tile_map[i] !== undefined && self.tile_map[i][j] !== undefined && self.tile_map[i][j][k] !== undefined) {
            delete self.tile_map[i][j][k];
        }
    };

    SpritesetMap.prototype.eachAnimated = function (callback) {
        var self = this;
        var keys_a = Object.keys(self.animated_tile_map);

        for (var i = 0; i < keys_a.length; i++) {
            var r = keys_a[i];
            var keys_b = Object.keys(self.animated_tile_map[r]);
            for (var j = 0; j < keys_b.length; j++) {
                var c = keys_b[j];
                if (self.animated_tile_map[r] !== undefined && self.animated_tile_map[r][c] !== undefined) {
                    var keys_c = Object.keys(self.animated_tile_map[r][c]);
                    for (var k = 0; k < keys_c; k++) {
                        var l = keys_c[k];
                        callback(self.animated_tile_map[r][c][l], i, j, l);
                    }
                }
            }
        }
    };

    /*
     eachTile(function calback):void
     Pecorre todos os tiles válidos do mapa
     e passa seus parâmetros para a função de callback
     */
    SpritesetMap.prototype.each= function (callback) {
        var self = this;
        var keys_a = Object.keys(self.tile_map);

        for (var i = 0; i < keys_a.length; i++) {
            var r = keys_a[i];
            var keys_b = Object.keys(self.tile_map[r]);
            for (var j = 0; j < keys_b.length; j++) {
                var c = keys_b[j];
                if (self.tile_map[r] !== undefined && self.tile_map[r][c] !== undefined) {
                    var keys_c = Object.keys(self.tile_map[r][c]);
                    for (var k = 0; k < keys_c; k++) {
                        var l = keys_c[k];
                        callback(self.tile_map[r][c][l], i, j, l);
                    }
                }
            }
        }
    };

    root.SpritesetMap = SpritesetMap;
})(RPG);