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
     setTile(int i, int j, Object tile):void
     Altera o tile na posição [i][j][tile.layer]
     */
    Map.prototype.setTile = function (i, j, tile) {
        var self = this;
        if(tile instanceof Tile){
            if (self.tiles[i] === undefined) {
                self.tiles[i] = [];
            }

            if (self.tiles[i][j] === undefined) {
                self.tiles[i][j] = [];
            }

            if(self.tiles[i][j][tile.layer] == undefined){
                self.tile_count++;
            }

            self.tiles[i][j][tile.layer] = tile;
        }

        return self;
    };

    /*
     getTile(int i, int j, int layer): Object
     Retorna o tile do mapa na posição [i][j][layer]
     */
    Map.prototype.getTile = function(i,j,layer){
        var self = this;
        if(self.tiles[i] !== undefined && self.tiles[i][j] !== undefined && self.tiles[i][j][layer] !== undefined){
            return self.tiles[i][j][layer];
        }
        return null;
    };

    /*
     removeTile(int i, int j, int layer):void
     Remove o tile do mapa na posição [i][j][layer]
     */
    Map.prototype.removeTile = function(i, j,layer){
        var self = this;
        if(self.tiles[i] !== undefined && self.tiles[i][j] !== undefined && self.tiles[i][j][layer] !== undefined){
            delete self.tiles[i][j][layer];
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
        for(var i = 0; i < self.height;i++){
            for(var j = 0; j < self.width;j++){
                if(self.tiles[i] !== undefined && self.tiles[i][j] !== undefined){
                    self.tiles[i][j].forEach(function(tile,layer){
                        callback(tile,i,j,layer);
                    });
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

