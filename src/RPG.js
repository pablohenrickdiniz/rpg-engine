(function(window){
    var CE = window.CE,
        CanvasEngine = CE.CE;

    var Utils = {
        calculate_final_position: function (bounds, ex, ey, time) {
            var final_bounds = {x: ex, y: ey, width: bounds.width, height: bounds.height};
            var vec = {x: ex - bounds.x, y: ey - bounds.y};
            var quadtree = RPG.Globals.current_map._colideTree;
            QuadTree.remove(bounds);
            quadtree.insert(final_bounds);
            var collisions = QuadTree.getCollisions(final_bounds,'MAP');
            QuadTree.remove(final_bounds);
            quadtree.insert(bounds);
            collisions.forEach(function (colision) {
                if (vec.x > 0 && colision.x < (final_bounds.x + bounds.width)) {
                    final_bounds.x = colision.x - bounds.width;
                }
                else if (vec.x < 0 && ((colision.x + colision.width) > final_bounds.x)) {
                    final_bounds.x = colision.x + colision.width;
                }

                if (vec.y > 0 && colision.y < (final_bounds.y + bounds.height)) {
                    final_bounds.y = colision.y - bounds.height;
                }
                else if (vec.y < 0 && ((colision.y + colision.height) > final_bounds.y)) {
                    final_bounds.y = colision.y + colision.height;
                }
            });

            if(final_bounds.x < 0){
                final_bounds.x = 0;
            }
            else if(final_bounds.x > RPG.Globals.current_map.getFullWidth()-32){
                final_bounds.x = RPG.Globals.current_map.getFullWidth()-32;
            }
            else if(vec.x > 0){
                final_bounds.x = Math.max(final_bounds.x, bounds.x);
            }
            else if(vec.x < 0){
                final_bounds.x =  Math.min(final_bounds.x, bounds.x);
            }
            else {
                final_bounds.x = bounds.x;
            }

            if(final_bounds.y < 0){
                final_bounds.y = 0;
            }
            else if(final_bounds.y > RPG.Globals.current_map.getFullHeight()-32){
                final_bounds.y = RPG.Globals.current_map.getFullHeight()-32;
            }
            else if(vec.y > 0){
                final_bounds.y = Math.max(final_bounds.y, bounds.y);
            }
            else if(vec.y < 0){
                final_bounds.y = Math.min(final_bounds.y, bounds.y);
            }
            else{
                final_bounds.y = bounds.y;
            }

            var self = this;
            var distance_a = self.distance({x:bounds.x,y:bounds.y},{x:ex,y:ey});
            var distance_b = self.distance({x:bounds.x,y:bounds.y},{x:final_bounds.x,y:final_bounds.y});
            time = (time*distance_b)/distance_a;

            return {
                x:final_bounds.x,
                y:final_bounds.y,
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
        _focused_event:null,
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
        _switchCallback:function(name,callback){
            var self = RPG;
            if(self._switches_callbacks[name] === undefined){
                self._switches_callbacks[name] = [];
            }

            self._switches_callbacks[name].push(callback);
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
            key_reader.keydown('KEY_ESC',function(){
                if(!RPG._running){
                    RPG.run();
                }
                else{
                    RPG.end();
                }
            });
            key_reader.keydown('KEY_ENTER',function(){
                RPG.actionEvents();
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
            RPG._canvas_engine.drawMap(map);
            map._colideTree.insert(RPG.Globals.current_player.bounds);
        },
        enableSwitch:function(name){
            var self = this;
            RPG.Globals.switches[name] = true;
            if(RPG._switches_callbacks[name] !== undefined){
                RPG._switches_callbacks[name].forEach(function(callback){
                    callback();
                });
            }
        },
        disableSwitch:function(name){
            var self = this;
            RPG.Globals.switches[name] = false;
            if(RPG._switches_callbacks[name] !== undefined){
                RPG._switches_callbacks[name].forEach(function(callback){
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
        actionEvents:function(){
            var current_player = RPG.Globals.current_player;
            var tree = RPG.Globals.current_map._colideTree;

            var bounds_tmp = {
                x:current_player.bounds.x,
                y:current_player.bounds.y,
                width:current_player.bounds.width,
                height:current_player.bounds.height,
                groups:['EV']
            };

            var direction = current_player.direction;
            switch(direction){
                case Direction.UP:
                    bounds_tmp.y -= bounds_tmp.height;
                    bounds_tmp.height*=2;
                    break;
                case Direction.RIGHT:
                    bounds_tmp.width*=2;
                    break;
                case Direction.DOWN:
                    bounds_tmp.height*=2;
                    break;
                case Direction.LEFT:
                    bounds_tmp.x -= bounds_tmp.width;
                    bounds_tmp.width*=2;
                    break;
            }

            QuadTree.remove(current_player.bounds);
            tree.insert(bounds_tmp);
            var collisions = QuadTree.getCollisions(bounds_tmp,'EV');
            QuadTree.remove(bounds_tmp);
            tree.insert(current_player.bounds);

            var key_reader = RPG._key_reader;
            collisions.forEach(function(colision){
                if(colision._ref !== undefined){
                    var event = colision._ref;
                    if(event.current_page !== undefined && event.current_page !== null){
                        var current_page = event.current_page;
                        if(current_page.trigger === Trigger.PLAYER_TOUCH){
                            current_page.script();
                        }
                        else if(current_page.trigger === Trigger.ACTI0N_BUTTON && key_reader.isActive('KEY_ENTER')){
                            current_page.script();
                        }
                    }
                }
            });
        },
        stepPlayer:function(){
            var current_player = RPG.Globals.current_player;
            var key_reader = RPG._key_reader;
            if(!current_player._moving){
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
                    var animation_name = 'step_'+current_player.direction;
                    current_player.graphic.animations[animation_name].pauseToFrame(1);
                    current_player._refreshed = false;
                }
            }
            else{
                current_player._timeStepMove();
                current_player._refreshed = false;
            }
        },
        stepEvents:function(){
            var self = this;
            var events = RPG.Globals.current_map.events;
            events.forEach(function(event){
                if(event.current_page !== null){
                    if(!event._moving){
                        var animation_name = 'step_'+event.direction;
                        event.graphic.animations[animation_name].pauseToFrame(1);
                        event._refreshed = false;
                    }
                    else{
                        event._timeStepMove();
                        event._refreshed = false;
                    }
                }
            });
        },
        clearEvents:function(){
            var current_player = RPG.Globals.current_player;
            var canvas_engine = RPG._canvas_engine;
            var current_map = RPG.Globals.current_map;
            canvas_engine.clearGraphic(current_player.layer,current_player.graphic);
            var events = current_map.events;
            var size =events.length;
            for(var i = 0; i < size;i++) {
                var event = events[i];
                if(event.current_page !== null){
                    var graphic = event.graphic;
                    if(graphic !== null){
                        canvas_engine.clearGraphic(event.layer,graphic);
                    }

                }

            }
        },
        drawEvents:function(){
            var current_player = RPG.Globals.current_player;
            var canvas_engine = RPG._canvas_engine;
            var current_map = RPG.Globals.current_map;
            var events = current_map.events;
            var size =events.length;
            for(var i = 0; i < size;i++) {
                var event = events[i];
                if (event.current_page !== null) {
                    canvas_engine.drawEvent(event);
                }
            }
            canvas_engine.drawCharacter(current_player);
        },
        step:function(){
            if(RPG._running){
                RPG._interval = window.requestAnimationFrame(function () {
                    RPG.step();
                });
                RPG.stepPlayer();
                RPG.stepEvents();
                RPG.clearEvents();
                RPG.drawEvents();
                if(RPG._debug){
                    RPG._canvas_engine.drawQuadTree(RPG.Globals.current_map._colideTree,10);
                }
            }
        },
        getSeconds:function(){
            return parseInt(((new Date()).getTime() - RPG.Globals.start_time)/1000);
        },
        _focusOnEvent:function(event){
            var self = this;
            if(self._focused_event !== null){
                self._focused_event._camera_focus = false;
            }
            event._camera_focus = true;
            self._focused_event = event;
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

    CanvasEngineRpg.prototype.drawEvent = function(event){
        var graphic = event.current_page.graphic;
        if(graphic !== null){
            var layer_index = event.layer;
            var self = this;
            if(self.layers[layer_index] !== undefined){
                var layer = self.layers[layer_index];
                var bounds = event.bounds;
                var frame = event.getCurrentFrame();
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
                    event._refreshed = true;
                }

            }
        }
    };

    CanvasEngineRpg.prototype.clearGraphic = function(layer_index,graphic){
        var self = this;
        if(self.layers[layer_index] !== undefined){
            var layer = self.layers[layer_index];
            layer.clearRect({
                x:graphic.lx,
                y:graphic.ly,
                width:graphic.width,
                height:graphic.height
            });
        }
    };

    CanvasEngineRpg.prototype.drawCharacter = function(character){
        if(character.graphic !== null){
            var layer_index = character.layer;
            var self = this;
            if(self.layers[layer_index] !== undefined){
                var layer = self.layers[layer_index];
                var bounds = character.bounds;
                var graphic = character.graphic;
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
                    character._refreshed = true;
                }

            }
        }
    };

    var Animation = function(options){
        var self = this;
        var frames = options.frames === undefined?[]:options.frames;
        var fps = parseFloat(options.fps);
        fps = isNaN(fps) || fps <= 0?3:fps;
        self.name = options.name === undefined?'':options.name;
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

    Animation.create = function(options){
        var fps = parseFloat(options.fps);
        var rows = parseInt(options.rows);
        var cols = parseInt(options.cols);
        var si = parseInt(options.si);
        var ei = parseInt(options.ei);
        var sj = parseInt(options.sj);
        var ej = parseInt(options.ej);
        rows = isNaN(rows)?1:rows;
        cols = isNaN(cols)?1:cols;
        fps = isNaN(fps)?cols*2:fps;
        si = isNaN(si)?0:si;
        ei = isNaN(ei)?rows-1:ei;
        sj = isNaN(sj)?0:sj;
        ej = isNaN(ej)?cols-1:ej;

        var image = options.image;
        var width = image.width/cols;
        var height = image.height/rows;
        var name = options.name;

        var frames = [];

        for(var i = si; i <= ei && i < rows;i++){
            for(var j = sj; j <= ej && j < cols;j++){
                var frame = {
                    image:image,
                    sWidth:width,
                    sHeight:height,
                    dWidth:width,
                    dHeight:height,
                    sx:j*width,
                    sy:i*height
                };
                frames.push(frame);
            }
        }
        return new Animation({
            name:'name',
            frames:frames,
            fps:fps
        });
    };


    var Direction = {
        DOWN:'down',
        LEFT:'left',
        RIGHT:'right',
        UP:'up'
    };

    var Graphic = function(options){
        var self = this;
        var image = options.image;
        var rows = parseInt(options.rows);
        var cols = parseInt(options.cols);
        rows = isNaN(rows)?1:rows;
        cols = isNaN(cols)?1:cols;
        self.image = image;
        self.rows = rows;
        self.cols = cols;
        self.width = image.width/self.cols;
        self.height = image.height/self.rows;
        self.animations = {};
        self.lx = 0;
        self.ly = 0;
        self._initialize();
    };

    Graphic.prototype._initialize = function(){
        var self = this;
        var image = self.image;
        self.animations.step_down = Animation.create({rows:4, cols:4,si:0,ei:0,image:image});
        self.animations.step_left = Animation.create({rows:4, cols:4,si:1,ei:1,image:image});
        self.animations.step_right = Animation.create({rows:4, cols:4,si:2,ei:2,image:image});
        self.animations.step_up = Animation.create({rows:4, cols:4,si:3,ei:3,image:image});
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
            height:32,
            _ref:self,
            groups:['EV', 'default']
        };

        self.layer = 2;
        self.direction = Direction.DOWN;
        self.h_speed = 32;
        self.v_speed = 32;

        self._moving = false;
        self._refreshed = false;
        self._start_moving_time = (new Date()).getTime();
        self._moving_time = 0;
        self._moving_callback = null;
        self._start_position = {x:x, y:y};
        self._end_position = {x:x,y:y};
        self._camera_focus = false;
    };


    Character.prototype.setPosition = function(x,y){
        var self = this;
        self.bounds.x = x;
        self.bounds.y = y;
        self.updateFocus();
    };

    Character.prototype.moveTo = function (x,y,time,callback) {
        var self = this;
        var final_bounds = Utils.calculate_final_position(self.bounds,x,y,time);
        self._start_moving_time = (new Date()).getTime();
        self._moving_time = final_bounds.time;
        self._start_position = {x:self.bounds.x, y:self.bounds.y};
        self._end_position = {x:final_bounds.x, y:final_bounds.y};
        self._moving_callback = callback;
    };
    
    Character.prototype._timeStepMove = function(){
        var self = this;
        var now = (new Date()).getTime();
        var diff = now - self._start_moving_time;
        if(diff >= self._moving_time){
            self.bounds.x = self._end_position.x;
            self.bounds.y = self._end_position.y;
            var callback = self._moving_callback;
            self._moving_callback = null;
            if(typeof callback === 'function'){
                callback();
            }
        }
        else{
            var distance_x = (self._end_position.x-self._start_position.x);
            var distance_y = (self._end_position.y-self._start_position.y);
            var x =  self._start_position.x + ((distance_x*diff)/self._moving_time);
            var y =  self._start_position.y + ((distance_y*diff)/self._moving_time);
            self.bounds.x = x;
            self.bounds.y = y;
            self.updateFocus();
            QuadTree.reInsert(self.bounds);
        }
    };

    Character.prototype.updateFocus = function(){
        var self = this;
        if(self._camera_focus){
            var screen_width = RPG._screen_width;
            var screen_height = RPG._screen_height;
            var half_width = screen_width/2;
            var half_height = screen_height/2;
            var x= self.bounds.x;
            var y = self.bounds.y;
            var viewX = -x+half_width-(self.graphic.width/2);
            var viewY = -y+half_height-(self.graphic.height/2);
            RPG._canvas_engine.set({
                viewX:viewX,
                viewY:viewY
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
        var animation_name = 'step_'+self.direction;
        var animation = self.graphic.animations[animation_name];
        return animation.frames[animation.getIndexFrame()];
    };

    Character.prototype.step = function(direction,times,end,allow){
        var self = this;
        allow = allow === undefined?false:allow;
        if(!self._moving || allow){
            self._moving = true;
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
                self._moving = false;
                if(typeof end === 'function'){
                    end();
                }
            }
            else{
                var animation_name = 'step_'+direction;
                self.graphic.animations[animation_name].execute();
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

    Character.prototype.stepRandom = function(){
        var self = this;
        var directions = Object.keys(Direction);
        var pos = Math.floor(Math.random()*directions.length);
        var direction = directions[pos];
        self.step(Direction[direction]);
    };

    var Status = {
        ON:'ON',
        OFF:'OFF'
    };

    var Trigger = {
        AUTO_RUN:'auto_run',
        PLAYER_TOUCH:'player_touch',
        ACTI0N_BUTTON:'action_button'
    };


    var Page = function(options){
        var self = this;
        if(options === undefined || !(options.event instanceof Event)){
            throw new Error('Page requires an event');
        }

        var graphic = options.graphic;
        self.conditions = options.conditions === undefined?{}:options.conditions;
        self.graphic = graphic instanceof Graphic?graphic:null;
        self.script = options.script === undefined?function(){}:options.script;
        self.event = options.event;
        self.conditionsCound = 0;
        self.trigger = options.trigger === undefined? Trigger.AUTO_RUN:options.trigger;
        self._initializeConditions();
    };

    Page.prototype._initializeConditions = function(){
        var self = this;
        var global_switch = self.conditions.global_switch;
        var local_switch = self.conditions.local_switch;

        var global_active = false;
        var local_active = false;
        var name_global = null;
        var name_local = null;
        var status_global = null;
        var status_local = null;
        var global_switches = RPG.Globals.switches;
        var local_switches = self.event.switches;

        if(global_switch !== undefined && global_switch[0] !== undefined && global_switch[1] !== undefined){
            name_global = global_switch[0];
            status_global = global_switch[1];
            global_active = true;
        }

        if(local_switch !== undefined && local_switch[0] !== undefined && local_switch[1] !== undefined){
            name_local = local_switch[0];
            status_local = local_switch[1];
            local_active = true;
        }

        var callback = function(){
            var active = (!global_active || (global_active && global_switches[name_global] === true)) &&
                         (!local_active || (local_active && local_switches[name_local] === true));
            if(active){
                self.event.current_page = self;
            }
            else if(self.event.current_page === self){
                self.event.current_page = null;
            }
        };

        if(global_active){
            RPG._switchCallback(name_global,callback);
        }
        if(local_active){
            self.event._switchCallback(name_local,callback);
        }
    };

    Page.prototype._initializeTrigger = function(){

    };

    Page.prototype.setGraphic = function(graphic){
        var self = this;
        self.graphic = graphic;
    };

    var Event = function(options){
        var self = this;
        Character.call(self,options);
        self._switches_callbacks = [];
        self.switches = [];
        self.current_page = null;
        self.pages = [];
        self.bounds.groups = ['EV','default'];
        Object.defineProperty(self,'graphic',{
            get:function(){
                if(self.current_page !== null && self.current_page.graphic !== null){
                    return self.current_page.graphic;
                }
                return null;
            }
        });
    };

    Event.prototype = Object.create(Character.prototype);
    Event.constructor = Event;




    Event.prototype.getCurrentFrame = function(){
        var self = this;
        if(self.current_page !== null){
            var animation_name = 'step_'+self.direction;
            var animation = self.current_page.graphic.animations[animation_name];
            return animation.frames[animation.getIndexFrame()];
        }
        return null;
    };


    Event.prototype.enableSwitch = function(name){
        var self = this;
        self.switches[name] = true;
        if(self._switches_callbacks[name] !== undefined){
            self._switches_callbacks[name].forEach(function(callback){
                callback();
            });
        }
    };

    Event.prototype.disableSwitch = function(name){
        var self = this;
        self.switches[name] = false;
        if(self._switches_callbacks[name] !== undefined){
            self._switches_callbacks[name].forEach(function(callback){
                callback();
            });
        }
    };

    Event.prototype._switchCallback = function(name,callback){
        var self = this;
        if(self._switches_callbacks[name] === undefined){
            self._switches_callbacks[name] = [];
        }

        self._switches_callbacks[name].push(callback);
    };

    Event.prototype.addPage = function(page){
        var self = this;
        self.pages.push(page);
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
                        height:self.tile_h,
                        groups:['MAP','EV']
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
        self._colideTree.insert(event.bounds);
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
    RPG.Graphic = Graphic;
    RPG.Character = Character;
    RPG.CanvasEngine = CanvasEngineRpg;
    RPG.Event = Event;
    RPG.Page = Page;
    RPG.Map = Map;
    RPG.MapLoader = MapLoader;
    RPG.ImageLoader = ImageLoader;
    RPG.Player = Player;
    RPG.Trigger = Trigger;

    window.RPG = RPG;
})(window);