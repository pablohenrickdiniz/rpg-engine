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
        self.tiles = [];
        self.animated_tiles = [];
        self.tile_count = 0;
    };

    /*
     setTile(int i, int j,int k, Object tile):void
     Altera o tile na posição [i][j][k]
     */
    SpritesetMap.prototype.set = function (i, j, k, tile) {
        var self = this;

        if (tile instanceof AnimatedTile) {
            if (self.animated_tiles[i] === undefined) {
                self.animated_tiles[i] = [];
            }

            if (self.animated_tiles[i][j] === undefined) {
                self.animated_tiles[i][j] = [];
            }

            if (self.animated_tiles[i][j][k] == undefined) {
                self.tile_count++;
            }

            self.animated_tiles[i][j][k] = tile;
        }
        else if (tile instanceof Tile) {
            if (self.tiles[i] === undefined) {
                self.tiles[i] = [];
            }

            if (self.tiles[i][j] === undefined) {
                self.tiles[i][j] = [];
            }

            if (self.tiles[i][j][k] == undefined) {
                self.tile_count++;
            }

            self.tiles[i][j][k] = tile;
        }

        return self;
    };

    /*
     getTile(int i, int j, int k): Object
     Retorna o tile do mapa na posição [i][j][k]
     */
    SpritesetMap.prototype.get= function (i, j, k) {
        var self = this;
        if (self.tiles[i] !== undefined && self.tiles[i][j] !== undefined && self.tiles[i][j][k] !== undefined) {
            return self.tiles[i][j][k];
        }
        else if (self.animated_tiles[i] !== undefined && self.animated_tiles[i][j] !== undefined && self.animated_tiles[i][j][k] != undefined) {
            return self.animated_tiles[i][j][k];
        }
        return null;
    };

    /*
     removeTile(int i, int j, int k):void
     Remove o tile do mapa na posição [i][j][k]
     */
    SpritesetMap.prototype.remove = function (i, j, k) {
        var self = this;
        if (self.tiles[i] !== undefined && self.tiles[i][j] !== undefined && self.tiles[i][j][k] !== undefined) {
            delete self.tiles[i][j][k];
            self.tile_count--;
        }
    };

    SpritesetMap.prototype.eachAnimated = function (callback) {
        var self = this;
        var keys_a = Object.keys(self.animated_tiles);

        for (var i = 0; i < keys_a.length; i++) {
            var r = keys_a[i];
            var keys_b = Object.keys(self.animated_tiles[r]);
            for (var j = 0; j < keys_b.length; j++) {
                var c = keys_b[j];
                if (self.animated_tiles[r] !== undefined && self.animated_tiles[r][c] !== undefined) {
                    var keys_c = Object.keys(self.animated_tiles[r][c]);
                    for (var k = 0; k < keys_c; k++) {
                        var l = keys_c[k];
                        callback(self.animated_tiles[r][c][l], i, j, l);
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
        var keys_a = Object.keys(self.tiles);

        for (var i = 0; i < keys_a.length; i++) {
            var r = keys_a[i];
            var keys_b = Object.keys(self.tiles[r]);
            for (var j = 0; j < keys_b.length; j++) {
                var c = keys_b[j];
                if (self.tiles[r] !== undefined && self.tiles[r][c] !== undefined) {
                    var keys_c = Object.keys(self.tiles[r][c]);
                    for (var k = 0; k < keys_c; k++) {
                        var l = keys_c[k];
                        callback(self.tiles[r][c][l], i, j, l);
                    }
                }
            }
        }
    };

    /*
     getAreaInterval(Object options):Object
     Obtém o intervalo si,sj,ei,ei de uma área dentro do mapa
     */
    SpritesetMap.prototype.getAreaInterval = function (options) {
        var self = this;
        var x = parseInt(options.x);
        var y = parseInt(options.y);
        var width = parseInt(options.width);
        var height = parseInt(options.height);
        x = isNaN(x) ? 0 : x;
        y = isNaN(y) ? 0 : y;
        width = isNaN(width) ? 0 : width;
        height = isNaN(height) ? 0 : height;
        var si = parseInt(Math.floor(y / self.tile_h));
        var sj = parseInt(Math.floor(x / self.tile_w));
        var ei = parseInt(Math.floor((y + height) / self.tile_h));
        var ej = parseInt(Math.floor((x + width) / self.tile_w));
        return {si: si, sj: sj, ei: ei, ej: ej};
    };

    root.SpritesetMap = SpritesetMap;
})(RPG);