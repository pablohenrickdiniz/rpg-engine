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
        if(!character.refreshed){
            var layer = character.layer;
            var self = this;
            if(self.layers[layer] !== undefined){
                var context = self.layers[layer].getContext();
                context.clearRect(character.last.x,character.last.y,32,32);
                context.fillRect(character.position.x,character.position.y,32,32);
                character.last.x = character.position.x;
                character.last.y = character.position.y;
                character.refreshed = true;
            }
        }
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
        DOWN:4
    };

    var Character = function(options){
        var self = this;
        self.graphic = null;
        self.speed = 5;
        self.position = {
            x:0,
            y:0
        };
        self.layer = 3;
        self.animate_step = null;
        self.animate_sync = null;
        self.moving = false;
        self.direction = Direction.DOWN;
        self.refreshed = false;
        self.last = {x:0,y:0};
    };


    Character.prototype.moveTo = function (options,callback) {
        var self = this;
        var x = options.x === undefined ? self.position.x : options.x;
        var y = options.y === undefined ? self.position.y : options.y;
        var frameRate = options.frameRate === undefined ? 30 : options.frameRate;
        var time = options.time === undefined ? 1000 : options.time;
        var framesN = (frameRate * time) / 1000;
        var stepTime = 1000/frameRate;
        var init = (new Date()).getTime();
        var end = (new Date()).getTime();
        var dx = (x - self.position.x) / framesN;
        var dy = (y - self.position.y) / framesN;
        var sx = self.position.x;
        var sy = self.position.y;
        self.stepMove(sx, sy, dx, dy, framesN, stepTime, init, time, frameRate,callback);
    };

    Character.prototype.stepMove = function (sx, sy, dx, dy, framesN, stepTime, init, time, frameRate,callback) {
        var self = this;
        var now = (new Date()).getTime();
        var diff = now - init;

        if (diff < time) {
            var frame = (diff * frameRate) / 1000;
            self.position.x = Math.round(sx + (dx * frame));
            self.position.y = Math.round(sy + (dy * frame));
            self.refreshed = false;
            window.requestAnimationFrame(function () {
                self.stepMove(sx, sy, dx, dy, framesN, stepTime, init, time, frameRate,callback);
            });
        }
        else {
            self.position.x = sx + (dx * framesN);
            self.position.y = sy + (dy * framesN);
            self.refreshed = false;
            clearInterval(self.animate_step);
            window.cancelAnimationFrame(self.animate_sync);
            if(callback){
                callback();
            }
        }
    };


    Character.prototype.setGraphic = function(graphic){
        var self = this;
        self.graphic = graphic;
    };


    Character.prototype.step = function(direction,times,end,allow){
        var self = this;
        allow = allow == undefined?false:allow;
        if(!self.moving || allow){
            self.moving = true;
            var mov = {x:self.position.x, y:self.position.y,time:1000/self.speed};
            times = times === undefined?1:times;
            switch(direction){
                case Direction.UP:
                    mov.y -= 32;
                    break;
                case Direction.RIGHT:
                    mov.x += 32;
                    break;
                case Direction.LEFT:
                    mov.x-= 32;
                    break;
                case Direction.DOWN:
                    mov.y+=32;
                    break;
            }
            self.direction = direction;
            self.moveTo(mov,function(){
                if(times > 1){
                    times--;
                    self.step(direction,times,end,true);
                }
                else{
                    self.moving = false;
                    if(typeof end === 'function'){
                        end();
                    }
                }
            });
        }
    };


    Character.prototype.stepForward = function(){
        var self = this;
        self.step(self.direction);
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


    var Game = function(options){
        var self = this;
        options = options === undefined?{}:options;
        var fps = options.fps === undefined?30:options.fps;


        self.switches = [];
        self.switchesCallbacks = [];
        self.variables = [];
        self.currentMap = null;
        self.canvasEngine = null;
        self.key_reader = null;
        self.start_time = null;
        self.fps = fps;
        self.interval1 = null;
        self.interval2 = null;
        self.paused = true;
        self.running = false;
        self.character = null;
        self.command = null;
    };

    Game.prototype.setCharacter = function(character){
        var self = this;
        self.character = character;
    };

    Game.prototype.initialize = function(){
        var self = this;
        if(self.canvasEngine !== null){
            self.canvasEngine.removeLayers(self.canvasEngine.layers);
            for(var i = 0; i < 10;i++){
                self.canvasEngine.createLayer();
            }
            self.key_reader = self.canvasEngine.getKeyReader();
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

    Game.prototype.start = function(){
        var self = this;
        self.start_time = (new Date()).getTime();
        if(!self.running){
            self.running = true;
            self.step();
        }
    };

    Game.prototype.pause = function(){
        var self = this;
        self.running = false;
        clearInterval(self.frameInterval);
        window.cancelAnimationFrame(self.frameSync);
    };

    Game.prototype.step = function(){
        var self = this;
        if(self.running){
            self.interval2 = window.requestAnimationFrame(function () {
                self.step();
            });

            if(!self.character.moving){
                if(self.key_reader.isActive(KeyReader.Keys.KEY_LEFT)){
                    self.character.step(Direction.LEFT);
                }
                else if(self.key_reader.isActive(KeyReader.Keys.KEY_RIGHT)){
                    self.character.step(Direction.RIGHT);
                }
                else if(self.key_reader.isActive(KeyReader.Keys.KEY_DOWN)){
                    self.character.step(Direction.DOWN);
                }
                else if(self.key_reader.isActive(KeyReader.Keys.KEY_UP)){
                    self.character.step(Direction.UP);
                }
            }
            self.canvasEngine.drawCharacter(self.character);
        }
    };

    Game.prototype.getSeconds = function(){
        var self = this;
        return parseInt(((new Date()).getTime() - self.start_time)/1000);
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