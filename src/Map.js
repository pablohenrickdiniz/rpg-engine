(function(w){
    if(w.QuadTree == undefined){
        throw "Map requires QuadTree"
    }

    var Map = function (options) {
        var self = this;
        options = options==undefined?{}:options;
        var width = parseInt(options.width);
        var height = parseInt(options.height);
        var tile_w = parseInt(options.tile_w);
        var tile_h = parseInt(options.tile_h);
        var events = options.events;

        width = isNaN(width)?5:width;
        height = isNaN(height)?5:height;
        tile_w=  isNaN(tile_w)?32:tile_w;
        tile_h = isNaN(tile_h)?32:tile_h;

        self.width = width;
        self.height = height;
        self.tile_w = tile_w;
        self.tile_h = tile_h;
        self.tiles = [];
        self.animated_tiles = [];
        self.events = [];
        self.parent = null;
        self.tile_count = 0;
        self._collideTree = null;
    };

    /*
     _getCollideTree():QuadTree
     Retorna a árvore de colisão do mapa
     */
    Map.prototype._getCollideTree = function(){
        var self = this;
        if(self._collideTree === null){
            self._collideTree = new QuadTree({
                x:0,
                y:0,
                width:self.getFullWidth(),
                height:self.getFullHeight()
            });
        }
        return self._collideTree;
    };

    /*
     initializeCollision():void
     Inicializa as colisões do mapa
     */
    Map.prototype.initializeCollision = function(){
        var self = this;

        var tree = self._getCollideTree();
        self.eachTile(function(tile){
            if(tile.bounds !== undefined){
                var bounds = tile.bounds;
                tree.insert({
                    x:tile.dx+bounds.x,
                    y:tile.dy+bounds.y,
                    width:bounds.width,
                    height:bounds.height,
                    groups:['MAP','EV','STEP']
                });
            }
        });
    };

    /*
     getAreaInterval(Object options):Object
     Obtém o intervalo si,sj,ei,ei de uma área dentro do mapa
     */
    Map.prototype.getAreaInterval = function (options) {
        var self = this;
        var x = parseInt(options.x);
        var y = parseInt(options.y);
        var width = parseInt(options.width);
        var height = parseInt(options.height);
        x = isNaN(x)?0:x;
        y = isNaN(y)?0:y;
        width = isNaN(width)?0:width;
        height = isNaN(height)?0:height;
        var si = parseInt(Math.floor(y / self.tile_h));
        var sj = parseInt(Math.floor(x / self.tile_w));
        var ei = parseInt(Math.floor((y + height) / self.tile_h));
        var ej = parseInt(Math.floor((x + width) / self.tile_w));
        return {si: si, sj: sj, ei: ei, ej: ej};
    };

    /*
     setTile(int i, int j,int k, Object tile):void
     Altera o tile na posição [i][j][k]
     */
    Map.prototype.setTile = function (i, j, k, tile) {
        var self = this;

        if(tile instanceof AnimatedTile){
            if (self.animated_tiles[i] === undefined) {
                self.animated_tiles[i] = [];
            }

            if (self.animated_tiles[i][j] === undefined) {
                self.animated_tiles[i][j] = [];
            }

            if(self.animated_tiles[i][j][k] == undefined){
                self.tile_count++;
            }

            self.animated_tiles[i][j][k] = tile;
        }
        else if(tile instanceof Tile){
            if (self.tiles[i] === undefined) {
                self.tiles[i] = [];
            }

            if (self.tiles[i][j] === undefined) {
                self.tiles[i][j] = [];
            }

            if(self.tiles[i][j][k] == undefined){
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
    Map.prototype.getTile = function(i,j,k){
        var self = this;
        if(self.tiles[i] !== undefined && self.tiles[i][j] !== undefined && self.tiles[i][j][k] !== undefined){
            return self.tiles[i][j][k];
        }
        else if(self.animated_tiles[i] !== undefined && self.animated_tiles[i][j] !== undefined && self.animated_tiles[i][j][k] != undefined){
            return self.animated_tiles[i][j][k];
        }
        return null;
    };

    /*
     removeTile(int i, int j, int k):void
     Remove o tile do mapa na posição [i][j][k]
     */
    Map.prototype.removeTile = function(i, j,k){
        var self = this;
        if(self.tiles[i] !== undefined && self.tiles[i][j] !== undefined && self.tiles[i][j][k] !== undefined){
            delete self.tiles[i][j][k];
            self.tile_count--;
        }
    };


    /*
     getFullWidth():Double
     Obtém a largura total do mapa em pixels
     */
    Map.prototype.getFullWidth = function () {
        var self = this;
        return self.width * self.tile_w;
    };

    /*
     getFullHeight():Double
     Obtém a altura total do mapa em pixels
     */
    Map.prototype.getFullHeight = function () {
        var self = this;
        return self.height * self.tile_h;
    };

    /*
     addEvent(Event event):void
     Adiciona um evento no mapa
     */
    Map.prototype.addEvent = function(event){
        var self = this;
        self.events.push(event);
        self._getCollideTree().insert(event.bounds);
    };

    /*
     eachTile(function calback):void
     Pecorre todos os tiles válidos do mapa
     e passa seus parâmetros para a função de callback
     */
    Map.prototype.eachTile = function(callback){
        var self = this;
        var keys_a = Object.keys(self.tiles);

        for(var i = 0; i < keys_a.length;i++){
            var r = keys_a[i];
            var keys_b = Object.keys(self.tiles[r]);
            for(var j = 0; j < keys_b.length;j++){
                var c = keys_b[j];
                if(self.tiles[r] !== undefined && self.tiles[r][c] !== undefined){
                    var keys_c = Object.keys(self.tiles[r][c]);
                    for(var k = 0; k < keys_c;k++){
                        var l = keys_c[k];
                        callback(self.tiles[r][c][l],i,j,l);
                    }
                }
            }
        }
    };

    /*
     eachAnimatedTile(function calback):void
     Pecorre todos os tiles animados válidos do mapa
     e passa seus parâmetros para a função de callback
     */
    Map.prototype.eachAnimatedTile = function(callback){
        var self = this;
        var keys_a = Object.keys(self.animated_tiles);

        for(var i = 0; i < keys_a.length;i++){
            var r = keys_a[i];
            var keys_b = Object.keys(self.animated_tiles[r]);
            for(var j = 0; j < keys_b.length;j++){
                var c = keys_b[j];
                if(self.animated_tiles[r] !== undefined && self.animated_tiles[r][c] !== undefined){
                    var keys_c = Object.keys(self.animated_tiles[r][c]);
                    for(var k = 0; k < keys_c;k++){
                        var l = keys_c[k];
                        callback(self.animated_tiles[r][c][l],i,j,l);
                    }
                }
            }
        }
    };

    Map.prototype.isEmpty = function(){
        var self = this;
        return self.events.length == 0 && self.tile_count == 0;
    };

    w.Map = Map;
})(window);

