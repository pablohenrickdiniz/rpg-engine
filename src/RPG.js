(function(window){
    var CE = window.CE,
        CanvasEngine = CE.CE;

    var RPG = {};


    var CanvasEngineRpg = function(options){
        var self = this;
        CanvasEngine.call(self,options);
    };

    CanvasEngineRpg.prototype = Object.create(CanvasEngine.prototype);
    CanvasEngineRpg.constructor = CanvasEngineRpg;

    CanvasEngineRpg.prototype.drawMap = function(map){
        var self = this;
        var interval = map.getAreaInterval({
            x:0,
            y:0,
            width:map.getFullWidth(),
            height:map.getFullHeight()
        });
        for(var i = interval.si; i <= interval.ei;i++){
            for(var j = interval.sj; j <= interval.ej;j++){
                if(map.tiles[i] !== undefined && map.tiles[i][j] !== undefined){
                    map.tiles[i][j].forEach(function(tile,layer){
                        if(self.layers[layer] !== undefined){
                            if(tile !== null){
                                self.layers[layer].clearRect({
                                    x:tile.dx,
                                    y:tile.dy,
                                    width:tile.dWidth,
                                    height:tile.dHeight
                                });
                                self.layers[layer].image(tile);
                            }
                        }
                    });
                }
            }
        }
    };

    CanvasEngineRpg.prototype.drawCharacter = function(character){

    };

    var Page = function(event){
        var self = this;
        self.conditions = [];
        self.graphic = null;
        self.script = null;
        self.event = event;
    };

    Page.Conditions = {
        LOCAL_SWITCH:1,
        GLOBAL_SWITH:2,
        VARIABLE:3
    };


    Page.prototype.addCondition = function(type,name,value){
        var self = this;
        var condition = {
            type:type,
            name:name,
            value:value
        };

        self.conditions.push(condition);
        var callback = function(){
            self.event.activePage = self;
        };


        switch(type){
            case Page.Conditions.LOCAL_SWITCH:
                self.event.switchCallback(name,value,callback);
                break;
            case Page.Conditions.GLOBAL_SWITH:
                self.event.game.switchCallback(name,value,callback);
                break;
            case Page.Conditions.VARIABLE:
                break;
        }
    };





    var Event = function(options){
        var self = this;
        var pages = options.pages;
        var position = options.position;
        var direction = options.direction;
        var parent = options.parent;
        var activePage = options.activePage;

        if(pages instanceof Array){
            var size = pages.length;
            for(var i = 0; i < size;i++){
                if((pages[i] instanceof Page)){
                    pages.splice(i,1);
                    i--;
                }
            }
        }
        else{
            pages = [];
        }

        if(position.constructor === {}.constructor){
            var x = parseFloat(position.x);
            var y = parseFloat(position.y);
            x = isNaN(x)?0:x;
            y = isNaN(y)?0:y;
            position.x =x;
            position.y =y;
        }
        else{
            position = {
                x:0,
                y:0
            };
        }

        parent = parent === undefined?null:parent;
        activePage = activePage === undefined?0:activePage;

        self.pages = pages;
        self.position = position;
        self.direction = Event.DOWN;
        self.moving = false;
        self.switches = [];
        self.switchesCallbacks = [];
        self.game = null;
        self.activePage = null;
    };


    Event.prototype.enableSwitch = function(name){
        var self = this;
        self.switches[name] = true;
    };

    Event.prototype.disableSwitch = function(name){
        var self = this;
        self.switches[name] = false;
    };

    Event.prototype.switchCallback = function(name,status,callback){
        var self = this;
        if(self.switchesCallbacks[name] === undefined){
            self.switchesCallbacks[name] = [];
        }
        var pos = status?1:0;
        if(self.switchesCallbacks[name][pos] === undefined){
            self.switchesCallbacks[name][pos] = [];
        }

        self.switchesCallbacks[name][pos].push(callback);
    };

    Event.prototype.addPage = function(page){
        var self = this;
        self.pages.push(page);
    };

    Event.prototype.destroy = function(){

    };

    Event.prototype.setGame = function(game){
        var self = this;
        self.game = game;
    };


    var Direction = {
        UP:0,
        LEFT:1,
        RIGHT:2,
        BOTTOM:4
    };

    var Character = function(options){
        var self = this;
        self.graphic = null;
        self.speed = 1;
    };

    Character.prototype.setGraphic = function(graphic){
        var self = this;
        self.graphic = graphic;
    };

    Character.prototype.stepUp = function(){
        var self = this;
        self.position.y-= self.speed;
    };

    Character.prototype.stepDown = function(){
        var self = this;
        self.position.y-= self.speed;
    };

    Character.prototype.stepLeft = function(){
        var self = this;
        self.position.x-= self.speed;
    };

    Character.prototype.stepRight = function(){
        var self = this;
        self.position.x+= self.speed;
    };

    Character.prototype.stepForward = function(){
        var self = this;
        switch(self.direction){
            case Direction.UP:
                self.stepUp();
                break;
            case Direction.LEFT:
                self.stepLeft();
                break;
            case Direction.RIGHT:
                self.stepRight();
                break;
            case Direction.DOWN:
                self.stepDown();
        }
    };

    var Map = function (options) {
        var self = this;
        var width = parseInt(options.width);
        var height = parseInt(options.height);
        var tile_w = parseInt(options.tile_w);
        var tile_h = parseInt(options.tile_h);
        var events = options.events;

        width = isNaN(width)?10:width;
        height = isNaN(height)?10:height;
        tile_w=  isNaN(tile_w)?32:tile_w;
        tile_h = isNaN(tile_h)?32:tile_h;

        self.width = width;
        self.height = height;
        self.tile_w = tile_w;
        self.tile_h = tile_h;
        self.tiles = [];
        self.events = [];
        self.parent = null;
    };

    /*
     Object: getAreaInterval(Object options)
     obtém o intervalo de linhas e colunas de uma
     área dentro do mapa
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
     Map : setTile(int i, int j, ImageSet tile)
     Altera um tile do mapa, onde i é a linha,
     j é a coluna, e tile é o ImageSet do tileSet
     ImageSet.layer é a coluna
     */
    Map.prototype.setTile = function (i, j, tile) {
        var self = this;
        if (self.tiles[i] === undefined) {
            self.tiles[i] = [];
        }

        if (self.tiles[i][j] === undefined) {
            self.tiles[i][j] = [];
        }


        self.tiles[i][j][tile.layer] = tile;
        return self;
    };

    /*
     getTile(int i, int j, int layer): object
     Retorna o tile do mapa [i][j][layer]
     */
    Map.prototype.getTile = function(i,j,layer){
        var self = this;
        if(self.tiles[i] !== undefined && self.tiles[i][j] !== undefined && self.tiles[i][j][layer] !== undefined){
            return self.tiles[i][j][layer];
        }
        return null;
    };

    Map.prototype.removeTile = function(i, j,layer){
        var self = this;
        if(self.tiles[i] !== undefined && self.tiles[i][j] !== undefined && self.tiles[i][j][layer] !== undefined){
            delete self.tiles[i][j][layer];
        }
    };

    Map.prototype.getFullWidth = function () {
        var self = this;
        return self.width * self.tile_w;
    };

    Map.prototype.getFullHeight = function () {
        var self = this;
        return self.height * self.tile_h;
    };


    Map.prototype.addEvent = function(event){
        var self = this;
        self.events.push(event);
    };

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


    var Game = function(){
        var self = this;
        self.switches = [];
        self.switchesCallbacks = [];
        self.variables = [];
        self.currentMap = null;
        self.canvasEngine = null;
    };

    Game.prototype.initialize = function(){
        var self = this;
        if(self.canvasEngine !== null){
            self.canvasEngine.removeLayers(self.canvasEngine.layers);
            for(var i = 0; i < 10;i++){
                self.canvasEngine.createLayer();
            }
            var key_reader = self.canvasEngine.getKeyReader();
            key_reader.on(CE.KeyReader);
        }
    };

    Game.prototype.initializeMap = function(map){
        var self = this;
        self.canvasEngine.drawMap(map);
    };

    Game.prototype.setCanvasEngine = function(engine){
        var self = this;
        self.canvasEngine = engine;
    };

    Game.prototype.enableSwitch = function(name){
        var self = this;
        self.switches[name] = true;
        if(self.switchesCallbacks[name] !== undefined && self.switchesCallbacks[name][1] !== undefined){
            self.switchesCallbacks[name][1].forEach(function(callback){
                callback();
            });
        }
    };

    Game.prototype.disableSwitch = function(name){
        var self = this;
        self.switches[name] = false;
        if(self.switchesCallbacks[name] !== undefined && self.switchesCallbacks[name][0] !== undefined){
            self.switchesCallbacks[name][0].forEach(function(callback){
                callback();
            });
        }
    };

    Game.prototype.switchCallback = function(name,status,event,callback){
        var self = this;
        if(self.switchesCallbacks[name] === undefined){
            self.switchesCallbacks[name] = [];
        }
        var pos = status?1:0;
        if(self.switchesCallbacks[name][pos] === undefined){
            self.switchesCallbacks[name][pos] = [];
        }

        self.switchesCallbacks[name][pos].push(callback);
    };

    Game.prototype.save = function(){

    };

    Game.prototype.pause = function(){

    };

    Game.prototype.begin = function(){

    };

    Game.prototype.end = function(){

    };


    var Window = function(options,parent){
        var self = this;
        self.width = 10;
        self.height = 10;
        self.x = 0;
        self.y = 0;
        self.parent = parent;
    };

    Window.TOP_LEFT = 0;
    Window.TOP_CENTER = 1;
    Window.TOP_RIGHT = 2;
    Window.CENTER_LEFT = 3;
    Window.CENTER_CENTER = 4;
    Window.CENTER_RIGHT = 5;
    Window.BOTTOM_LEFT = 6;
    Window.BOTTOM_CENTER = 7;
    Window.BOTTOM_RIGHT = 8;


    var ImageLoader = {
        loadedImages:[],
        loadAll:function(images,callback){
            loadAll(images,[],callback);
        },
        load:function(url,callback){
            var self = this;
            var a = document.createElement('a');
            a.href = url;
            url = $(a).prop('href');
            if(self.loadedImages[url] === undefined){
                var img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = url;
                img.onload = function(){
                    self.loadedImages[url] = img;
                    callback(img);
                };
            }
            else{
                callback(self.loadedImages[url]);
            }
        },
        toDataURL:function(img,callback){
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img,0,0);
            var dataUrl = canvas.toDataURL();
            callback(dataUrl);
            canvas = null;
        }
    };

    var loadAll = function(images,loaded,callback){
        loaded = loaded === undefined?[]:loaded;
        if(images.length > 0){
            var url = images.shift();
            ImageLoader.load(url,function(img){
                loaded.push(img);
                loadAll(images,loaded,callback);
            });
        }
        else if(typeof callback === 'function'){
            callback(loaded);
        }
    };


    var MapLoader = {
        fields : [
            'image',
            'dWidth',
            'dHeight',
            'sWidth',
            'sHeight',
            'sx',
            'sy',
            'dx',
            'dy',
            'layer'
        ],
        load : function(data,map,callback){
            var self = this;
            map = map === undefined || !(map instanceof  Map)?new Map():map;
            var tile_w = parseInt(data.tile_w);
            var tile_h = parseInt(data.tile_h);
            tile_w = isNaN(tile_w)?32:tile_w;
            tile_h = isNaN(tile_h)?32:tile_h;

            map.tile_w = tile_w;
            map.tile_h = tile_h;
            var tilesets = data.tilesets !== undefined?data.tilesets:[];
            var tiles = data.tiles !== undefined?data.tiles:[];

            ImageLoader.loadAll(tilesets,function(tilesets){
                tiles.forEach(function(row,indexA){
                    if(row !== null){
                        row.forEach(function(col,indexB){
                            if(col !== null){
                                col.forEach(function(tile,layer){
                                    if(tile !== null){
                                        var newtile = {};
                                        self.fields.forEach(function(name,index){
                                            if(tile[index] !== undefined){
                                                newtile[name] = tile[index];
                                            }
                                        });

                                        if(newtile.image !== undefined){
                                            var id = newtile.image;
                                            if(tilesets[id] !== undefined){
                                                newtile.image = tilesets[id];
                                            }
                                        }

                                        map.setTile(indexA,indexB,newtile);
                                    }
                                    else{
                                        map.removeTile(indexA,indexB);
                                    }
                                });
                            }
                        });
                    }
                });
                callback(map);
            });
        }
    };

    RPG.Direction = Direction;
    RPG.Character = Character;
    RPG.CanvasEngine = CanvasEngineRpg;
    RPG.Event = Event;
    RPG.Page = Page;
    RPG.Map = Map;
    RPG.Game = Game;
    RPG.MapLoader = MapLoader;

    window.RPG = RPG;
})(window);