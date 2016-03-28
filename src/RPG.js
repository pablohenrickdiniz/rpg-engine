(function(window){
    var CE = window.CE,
        CanvasEngine = CE.CE;

    var Utils = {
        calculate_final_position: function (bounds, ex, ey, time) {
            var final = {x: ex, y: ey, width: bounds.width, height: bounds.height};
            var vec = {x: ex - bounds.x, y: ey - bounds.y};


            var quadtree = RPG.Globals.current_map._colideTree;
            QuadTree.remove(bounds);
            quadtree.insert(final);
            var colisions = QuadTree.getCollisions(final);
            QuadTree.remove(final);
            quadtree.insert(bounds);
            colisions.forEach(function (colision) {
                if (vec.x > 0 && colision.x < (final.x + bounds.width)) {
                    final.x = colision.x - bounds.width;
                }
                else if (vec.x < 0 && ((colision.x + colision.width) > final.x)) {
                    final.x = colision.x + colision.width;
                }

                if (vec.y > 0 && colision.y < (final.y + bounds.height)) {
                    final.y = colision.y - bounds.height;
                }
                else if (vec.y < 0 && ((colision.y + colision.height) > final.y)) {
                    final.y = colision.y + colision.height;
                }
            });


            if(final.x < 0){
                final.x = 0;
            }
            else if(final.x > RPG.Globals.current_map.getFullWidth()-32){
                final.x = RPG.Globals.current_map.getFullWidth()-32;
            }
            else if(vec.x > 0){
                final.x = Math.max(final.x, bounds.x);
            }
            else if(vec.x < 0){
                final.x =  Math.min(final.x, bounds.x);
            }
            else {
                final.x = bounds.x;
            }

            if(final.y < 0){
                final.y = 0;
            }
            else if(final.y > RPG.Globals.current_map.getFullHeight()-32){
                final.y = RPG.Globals.current_map.getFullHeight()-32;
            }
            else if(vec.y > 0){
                final.y = Math.max(final.y, bounds.y);
            }
            else if(vec.y < 0){
                final.y = Math.min(final.y, bounds.y);
            }
            else{
                final.y = bounds.y;
            }

;
            var self = this;
            var distance_a = self.distance({x:bounds.x,y:bounds.y},{x:ex,y:ey});
            var distance_b = self.distance({x:bounds.x,y:bounds.y},{x:final.x,y:final.y});
            time = (time*distance_b)/distance_a;

            return {
                x:final.x,
                y:final.y,
                time:time
            };
        },
        distance: function (va, vb) {
            return Math.sqrt(Object.keys(va).reduce(function (p, c) {
                return p + Math.pow(va[c] - vb[c], 2);
            }, 0));
        }
    };

    var RPG = {
        Globals:{
            current_map:null,
            current_player:null,
            switches:[],
            variables:[],
            paused:true,
            start_time:null
        },
        _screen_width:600,
        _screen_height:600,
        _switches_callbacks:[],
        _canvas_engine:null,
        _key_reader:null,
        _interval:null,
        _running:false,
        _debug:false,
        _layers:{
            BG1:null,
            BG2:null,
            BG3:null,
            EV1:null,
            EV2:null,
            BG4:null,
            BG5:null,
            BG6:null,
            BG7:null,
            BG8:null,
            QUAD:null,
            menu1:null,
            menu2:null,
            menu3:null
        },
        _switchCallback:function(name,status,event,callback){
            var self = this;
            if(RPG._switches_callbacks[name] === undefined){
                RPG._switches_callbacks[name] = [];
            }
            var pos = status?1:0;
            if(RPG._switches_callbacks[name][pos] === undefined){
                RPG._switches_callbacks[name][pos] = [];
            }

            RPG._switches_callbacks[name][pos].push(callback);
        },
        initialize:function(container){
            var engine = CE.createEngine({
                width:RPG._screen_width,
                height:RPG._screen_height,
                container:container
            },CanvasEngineRpg);
            var key_reader =  engine.getKeyReader();
            RPG._layers.BG1 = engine.createLayer();
            RPG._layers.BG2 = engine.createLayer();
            RPG._layers.BG3 = engine.createLayer();
            RPG._layers.EV1 = engine.createLayer();
            RPG._layers.EV2 = engine.createLayer();
            RPG._layers.BG4 = engine.createLayer();
            RPG._layers.BG5 = engine.createLayer();
            RPG._layers.BG6 = engine.createLayer();
            RPG._layers.BG7 = engine.createLayer();
            RPG._layers.BG8 = engine.createLayer();
            RPG._layers.QUAD = engine.createLayer();
            RPG._layers.menu1 = engine.createLayer();
            RPG._layers.menu2 = engine.createLayer();
            RPG._layers.menu3 = engine.createLayer();
            key_reader.on(['KEY_ENTER'],function(){
                if(RPG.Globals.paused){
                    RPG.start();
                }
                else{
                    RPG.pause();
                }
            });

            RPG._key_reader = key_reader;
            RPG._canvas_engine = engine;
        },
        loadMap:function(map){
            RPG.Globals.current_map = map;
            var width = map.getFullWidth();
            var height = map.getFullHeight();
            RPG._layers.BG1.set({width:width,height:height});
            RPG._layers.BG2.set({width:width,height:height});
            RPG._layers.BG3.set({width:width,height:height});
            RPG._layers.EV1.set({width:width,height:height});
            RPG._layers.EV2.set({width:width,height:height});
            RPG._layers.BG4.set({width:width,height:height});
            RPG._layers.BG5.set({width:width,height:height});
            RPG._layers.BG6.set({width:width,height:height});
            RPG._layers.BG7.set({width:width,height:height});
            RPG._layers.BG8.set({width:width,height:height});
            RPG._layers.QUAD.set({width:width,height:height});
            RPG._canvas_engine.set({aligner_width:width,aligner_height:height});
            RPG._canvas_engine.drawMap(map);
            map._colideTree.insert(RPG.Globals.current_player.bounds);
        },
        enableSwitch:function(name){
            var self = this;
            RPG.Globals.switches[name] = true;
            if(RPG._switches_callbacks[name] !== undefined && RPG._switches_callbacks[name][1] !== undefined){
                RPG._switches_callbacks[name][1].forEach(function(callback){
                    callback();
                });
            }
        },
        disableSwitch:function(name){
            var self = this;
            RPG.Globals.switches[name] = false;
            if(RPG._switches_callbacks[name] !== undefined && RPG._switches_callbacks[name][0] !== undefined){
                RPG._switches_callbacks[name][0].forEach(function(callback){
                    callback();
                });
            }
        },
        run:function(){
            RPG.Globals.start_time = (new Date()).getTime();
            console.log('game started');
            if(!RPG._running){
                RPG._running = true;
                RPG.step();
            }
        },
        end:function(){
            var self = this;
            RPG._running = false;
            window.cancelAnimationFrame(RPG._interval);
        },
        stepEvents:function(){
            var self = this;
            var current_player = RPG.Globals.current_player;
            var key_reader = RPG._key_reader;

            if(!current_player.moving){
                if(key_reader.isActive('KEY_LEFT')){
                    current_player.step(Direction.LEFT);
                }
                else if(key_reader.isActive('KEY_RIGHT')){
                    current_player.step(Direction.RIGHT);
                }
                else if(key_reader.isActive('KEY_DOWN')){
                    current_player.step(Direction.DOWN);
                }
                else if(key_reader.isActive('KEY_UP')){
                    current_player.step(Direction.UP);
                }
                else{
                    current_player.graphic.animations[current_player.direction].pauseToFrame(1);
                    current_player.refreshed = false;
                }
            }
            else{
                current_player.timeStepMove();
                current_player.refreshed = false;
            }
        },
        drawEvents:function(){
            var current_player = RPG.Globals.current_player;
            if(!current_player.refreshed){
                RPG._canvas_engine.drawCharacter(current_player);
            }
        },
        step:function(){
            if(RPG._running){
                RPG._interval = window.requestAnimationFrame(function () {
                    RPG.step();
                });
                RPG.stepEvents();
                RPG.drawEvents();
                if(RPG._debug){
                    RPG._canvas_engine.drawQuadTree(RPG.Globals.current_map._colideTree,10);
                }
            }
        },
        getSeconds:function(){
            return parseInt(((new Date()).getTime() - RPG.Globals.start_time)/1000);
        }
    };



    var drawQuadTreeCallback = function(quadtree,layer,first){
        first = first === undefined?true:first;
        if(first){
            layer.clear();
        }
        layer.rect(quadtree.bounds);

        if(first){
            var objects = quadtree.objects;
            objects.forEach(function(object){
                layer.rect(object);
            });
        }

        if(!quadtree.isLeaf()){
            for(var i =0; i < quadtree.nodes.length;i++){
                drawQuadTreeCallback(quadtree.nodes[i],layer,false);
            }
        }
    };


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

    CanvasEngineRpg.prototype.drawQuadTree = function(quadtree,layer){
        var self = this;
        layer = self.getLayer(layer);
        drawQuadTreeCallback(quadtree,layer);
    };

    CanvasEngineRpg.prototype.drawCharacter = function(character){
        if(!character.refreshed && character.graphic !== null){
            var layer_index = character.layer;
            var self = this;
            if(self.layers[layer_index] !== undefined){
                var layer = self.layers[layer_index];
                var bounds = character.bounds;
                var graphic = character.graphic;

                layer.clearRect({
                    x:graphic.lx,
                    y:graphic.ly,
                    width:graphic.width,
                    height:graphic.height
                });

                var frame = character.getCurrentFrame();
                var x = bounds.x-(Math.max(graphic.width-32,0));
                var y = bounds.y-(Math.max(graphic.height-32,0));

                if(frame !== undefined){
                    var image = {
                        image:frame.image,
                        sx:frame.sx,
                        sy:frame.sy,
                        dx:x,
                        dy:y,
                        dWidth:frame.dWidth,
                        dHeight:frame.dHeight,
                        sWidth:frame.sWidth,
                        sHeight:frame.sHeight
                    };
                    layer.image(image);
                    graphic.lx = x;
                    graphic.ly = y;
                    character.refreshed = true;
                }

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



    var Animation = function(options){
        var self = this;
        var frames = options.frames === undefined?[]:options.frames;
        var fps = parseFloat(options.fps);
        fps = isNaN(fps) || fps <= 0?3:fps;
        self.fps = fps;
        self.frames = frames;
        self.start_time = null;
        self.end_time = null;
        self.running = false;
    };

    Animation.prototype.getIndexFrame = function(){
        var self = this;
        var size = self.frames.length;
        var diff = null;
        if(self.running){
            diff = (new Date()).getTime() - self.start_time;
        }
        else{
            diff = self.end_time - self.start_time;
        }

        var mod = ((diff/1000)*self.fps) % size;
        mod =  mod === 0? size-1:mod-1;
        return Math.abs(Math.ceil(mod));
    };

    Animation.prototype.stop = function(){
        var self = this;
        self.pause();
    };

    Animation.prototype.execute = function(){
        var self = this;
        if(!self.running){
            self.start_time = (new Date()).getTime();
            self.running = true;
        }
    };

    Animation.prototype.pause = function(){
        var self = this;
        if(self.running){
            self.end_time = (new Date()).getTime();
            self.running = false;
        }
    };

    Animation.prototype.pauseToFrame = function(index){
        var self = this;
        if(self.frames[index] !== undefined){
            var diff = (index/self.fps)*1000;
            self.end_time = self.start_time + diff;
            self.running = false;
        }
    };


    var Direction = {
        DOWN:0,
        LEFT:1,
        RIGHT:2,
        UP:3
    };

    var CharacterGraphic = function(options){
        var self = this;
        var image = options.image;
        var rows = parseInt(options.rows);
        var cols = parseInt(options.cols);
        rows = isNaN(rows)?1:rows;
        cols = isNaN(cols)?1:cols;
        var up = parseInt(options.up);
        var left = parseInt(options.left);
        var right = parseInt(options.right);
        var down = parseInt(options.down);
        down = isNaN(down)?Direction.DOWN:down;
        left = isNaN(left)?Direction.LEFT:left;
        right = isNaN(right)?Direction.RIGHT:right;
        up = isNaN(up)?Direction.UP:up;
        self.up = up;
        self.down = down;
        self.right = right;
        self.left = left;
        self.image = image;
        self.rows = rows;
        self.cols = cols;
        self.width = image.width/self.cols;
        self.height = image.height/self.rows;
        self.animations = [];
        self.lx = 0;
        self.ly = 0;
        self.initialize();
    };

    CharacterGraphic.prototype.initialize = function(){
        var self = this;
        for(var i = 0; i< self.rows;i++){
            var frames = [];
            for(var j = 0; j < self.cols;j++){
                var frame = {
                    image:self.image,
                    sWidth:self.width,
                    sHeight:self.height,
                    dWidth:self.width,
                    dHeight:self.height,
                    sx:j*self.width,
                    sy:i*self.height
                };
                frames.push(frame);
            }
            self.animations[i] = new Animation({
                frames:frames,
                fps:self.cols*2
            });
        }

    };

    var Character = function(options){
        var self = this;
        options = options === undefined?{}:options;
        self.initialize(options);
    };

    Character.prototype.initialize = function(options){
        var self = this;
        var speed = parseInt(options.speed);
        var x = parseInt(options.x);
        var y = parseInt(options.y);
        x = isNaN(x)?0:x;
        y = isNaN(y)?0:y;
        speed = isNaN(speed)?5:Math.abs(speed);
        self.speed = speed;
        self.graphic = null;

        self.bounds = {
            x:x,
            y:y,
            width:32,
            height:32
        };

        self.layer = 2;
        self.moving = false;
        self.direction = Direction.DOWN;
        self.refreshed = false;
        self.h_speed = 32;
        self.v_speed = 32;
        self.start_moving_time = (new Date()).getTime();
        self.moving_time = 0;
        self.moving_callback = null;
        self.start_position = {x:x, y:y};
        self.end_position = {x:x,y:y};
    };

    Character.prototype.moveTo = function (x,y,time,callback) {
        var self = this;
        var final = Utils.calculate_final_position(self.bounds,x,y,time);
        self.start_moving_time = (new Date()).getTime();
        self.moving_time = final.time;
        self.start_position = {x:self.bounds.x, y:self.bounds.y};
        self.end_position = {x:final.x, y:final.y};
        self.moving_callback = callback;
    };

    Character.prototype.timeStepMove = function(){
        var self = this;
        var now = (new Date()).getTime();
        var diff = now - self.start_moving_time;
        if(diff >= self.moving_time){
            self.bounds.x = self.end_position.x;
            self.bounds.y = self.end_position.y;
            var callback = self.moving_callback;
            self.moving_callback = null;
            if(typeof callback === 'function'){
                callback();
            }
        }
        else{
            var distance_x = (self.end_position.x-self.start_position.x);
            var distance_y = (self.end_position.y-self.start_position.y);
            var x =  self.start_position.x + ((distance_x*diff)/self.moving_time);
            var y =  self.start_position.y + ((distance_y*diff)/self.moving_time);
            self.bounds.x = x;
            self.bounds.y = y;


            var screen_width = RPG._screen_width;
            var screen_height = RPG._screen_height;
            var half_width = screen_width/2;
            var half_height = screen_height/2;
            var viewX = -x+half_width-(self.graphic.width/2);
            var viewY = -y+half_height-(self.graphic.height/2);


            RPG._canvas_engine.set({
                viewX:viewX,
                viewY:viewY
            });
            QuadTree.reInsert(self.bounds);
            var colisions = QuadTree.getCollisions(self.bounds);
            colisions.forEach(function(colision){
                colision.backgroundColor = 'rgba(0,0,255,0.5)';
            });
        }
    };

    Character.prototype.setGraphic = function(graphic){
        var self = this;
        self.graphic = graphic;
        graphic.lx = self.bounds.x;
        graphic.ly = self.bounds.y;
    };

    Character.prototype.getCurrentFrame = function(){
        var self = this;
        var animation = self.graphic.animations[self.direction];
        return animation.frames[animation.getIndexFrame()];
    };

    Character.prototype.step = function(direction,times,end,allow){
        var self = this;
        allow = allow == undefined?false:allow;
        if(!self.moving || allow){
            self.moving = true;
            var x = self.bounds.x;
            var y = self.bounds.y;
            var time = 1000/self.speed;

            times = times === undefined?1:times;
            switch(direction){
                case Direction.UP:
                    y -= self.h_speed;
                    break;
                case Direction.RIGHT:
                    x += self.h_speed;
                    break;
                case Direction.LEFT:
                    x-= self.h_speed;
                    break;
                case Direction.DOWN:
                    y+= self.h_speed;
                    break;
            }

            if(times < 1){
                self.moving = false;
                if(typeof end === 'function'){
                    end();
                }
            }
            else{
                self.graphic.animations[direction].execute();
                self.direction = direction;
                self.moveTo(x,y,time,function(){
                    times--;
                    self.step(direction,times,end,true);
                });
            }
        }
    };


    Character.prototype.stepForward = function(){
        var self = this;
        self.step(self.direction);
    };



    var Event = function(options){
        var self = this;
        Character.call(self,options);
        self.switches = [];
        self._switches_callbacks = [];
        self.activePage = -1;
    };

    Event.prototype = Object.create(Character.prototype);
    Event.constructor = Event;


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
        if(self.switches_callbacks[name] === undefined){
            self.switches_callbacks[name] = [];
        }
        var pos = status?1:0;
        if(self.switches_callbacks[name][pos] === undefined){
            self.switches_callbacks[name][pos] = [];
        }

        self.switches_callbacks[name][pos].push(callback);
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

    var Player = function(options){
        var self = this;
        self.level = 1;
        self.hp = 100;
        self.mp = 100;
        self.items = [];
        self.equiped_items = [];
        Character.call(self,options);
    };

    Player.prototype = Object.create(Character.prototype);
    Player.constructor = Player;


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
        self._colideTree = null;
        self.colision = [];
    };

    Map.prototype.initializeColision = function(){
        var self = this;
        self._colideTree = new QuadTree({
            x:0,
            y:0,
            width:self.getFullWidth(),
            height:self.getFullHeight()
        });
        var size1 = self.colision.length;
        for(var i = 0; i < size1;i++){
            var size2 = self.colision[i].length;
            for(var j = 0; j < size2;j++){
                var colision = self.colision[i][j];
                if(colision === true){
                    self._colideTree.insert({
                        x:j*self.tile_w,
                        y:i*self.tile_h,
                        width:self.tile_w,
                        height:self.tile_h
                    });
                }
            }
        }
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
            map.colision = data.colision !== undefined?data.colision:[];


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
    RPG.CharacterGraphic = CharacterGraphic;
    RPG.Character = Character;
    RPG.CanvasEngine = CanvasEngineRpg;
    RPG.Event = Event;
    RPG.Page = Page;
    RPG.Map = Map;
    RPG.MapLoader = MapLoader;
    RPG.Player = Player;

    window.RPG = RPG;
})(window);