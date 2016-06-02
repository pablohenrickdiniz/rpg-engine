(function(window){
    var CE = window.CE,
        CanvasEngine = CE.CE;

    var Utils = {
        /*
         * calculate_final_position(Object bounds,double ex, double ey, int time):Object {x:double, y:double, int: time}
         * Calcula a posição final do character, analisando as possíveis colisões que podem ocorrer pelo caminho
         * */
        calculate_final_position: function (bounds, ex, ey, time) {
            var final_bounds = {x: ex, y: ey, width: bounds.width, height: bounds.height,groups:['STEP']};
            var vec = {x: ex - bounds.x, y: ey - bounds.y};
            var quadtree = RPG.Globals.current_map._getCollideTree();

            var collisions = quadtree.retrieve(final_bounds,'STEP');


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
        }
    };

    var RPG = {
        Globals:{
            current_map:null,//Mapa atual
            current_player:null,//Jogador Atual
            switches:[],//Switches
            variables:[],//Variáveis
            paused:true,//Jogo Pausado
            start_time:null//Data de início
        },
        _screen_width:600,//largura da tela
        _screen_height:400,//altura da tela
        _switches_callbacks:[],//callbacks de switches
        _canvas_engine:null,//engine de canvas
        _key_reader:null,//leitor de teclado
        _interval:null,//interval de execução
        _running:false,//running execução iniciada
        _debug:false,//modo debug
        _focused_event:null,//Evento que está sendo focado
        _layers:{ // camadas
            BG1:null,//Background 1
            BG2:null,//Background 2
            BG3:null,//Background 3
            EV1:null,//Eventos 1
            EV2:null,//Eventos 2
            BG4:null,//Background 4
            BG5:null,//Background 5
            BG6:null,//Background 6
            BG7:null,//Background 7
            BG8:null,//Background 8
            QUAD:null,//QuadTree modo debug
            menu1:null,//Menu 1
            menu2:null,//Menu 2
            menu3:null//Menu 3
        },
        /*_switchCallback(String name, function callback)
         * Registra função de callback para ativar ou desativar switch global
         * */
        _switchCallback:function(name,callback){
            var self = RPG;
            if(self._switches_callbacks[name] === undefined){
                self._switches_callbacks[name] = [];
            }

            self._switches_callbacks[name].push(callback);
        },
        /*
         initialize(String container):void
         inicializa a engine de rpg dentro do elemento container
         */
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
            RPG._layers.menu1 = engine.createLayer({fixed:true});
            RPG._layers.menu2 = engine.createLayer({fixed:true});
            RPG._layers.menu3 = engine.createLayer({fixed:true});
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
        /*
         loadMap(Map map):void
         Carrega e altera o mapa atual
         */
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
            map._getCollideTree().insert(RPG.Globals.current_player.bounds);
        },
        /*
         enableSwitch(String name):void
         Ativa um Switch "name" global
         */
        enableSwitch:function(name){
            var self = this;
            RPG.Globals.switches[name] = true;
            if(RPG._switches_callbacks[name] !== undefined){
                RPG._switches_callbacks[name].forEach(function(callback){
                    callback();
                });
            }
        },
        /*
         disableSwitch(String name):void
         Desativa um switch "name" global
         */
        disableSwitch:function(name){
            var self = this;
            RPG.Globals.switches[name] = false;
            if(RPG._switches_callbacks[name] !== undefined){
                RPG._switches_callbacks[name].forEach(function(callback){
                    callback();
                });
            }
        },
        /*
         run():void
         Inicializa a execução do Jogo
         */
        run:function(){
            RPG.Globals.start_time = (new Date()).getTime();
            console.log('game started');
            if(!RPG._running){
                RPG._running = true;
                RPG.step();
            }
        },
        /*
         end():void
         Finaliza a execução do Jogo
         */
        end:function(){
            var self = this;
            RPG._running = false;
            window.cancelAnimationFrame(RPG._interval);
        },
        /*actionEvents():void
         * Tratamento de eventos relacionados às ações do jogador
         */
        actionEvents:function(){
            var current_player = RPG.Globals.current_player;
            var tree = RPG.Globals.current_map._getCollideTree();

            var bounds_tmp = {
                x:current_player.bounds.x,
                y:current_player.bounds.y,
                width:current_player.bounds.width,
                height:current_player.bounds.height,
                groups:['ACTION_BUTTON']
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

            var collisions = tree.retrieve(bounds_tmp,'ACTION_BUTTON');
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
        /*
         stepPlayer():void
         Tratamento de ações relacionadas ao movimento do jogador
         */
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
                else if(current_player.graphic !== null){
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
        /*
         stepEvents():void
         Tratamento de ações relacionadas aos eventos do jogo
         */
        stepEvents:function(){
            var self = this;
            var events = RPG.Globals.current_map.events;
            events.forEach(function(event){
                if(event.current_page !== null){
                    if(!event._moving){
                        if(event._follow !== null){
                            event.look(event._follow);
                            event.stepForward();
                        }
                        else if(event.graphic !== null){
                            var animation_name = 'step_'+event.direction;
                            event.graphic.animations[animation_name].pauseToFrame(1);
                        }
                    }
                    else {
                        event._timeStepMove();
                        event._refreshed = false;
                    }
                }
            });
        },
        /*
         clearEvents():void
         Limpa todos os eventos do mapa
         */
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
        /*
         drawEvents():void
         Desenha os eventos no mapa
         */
        drawEvents:function(){
            var current_player = RPG.Globals.current_player;
            var canvas_engine = RPG._canvas_engine;
            var current_map = RPG.Globals.current_map;
            var events = current_map.events;
            var size =events.length;
            for(var i = 0; i < size;i++) {
                var event = events[i];
                if (event.current_page !== null) {
                    canvas_engine.drawCharacter(event);
                }
            }
            canvas_engine.drawCharacter(current_player);
        },
        /*
         step():void
         executa um passo de tempo no jogo
         */
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
                    RPG._canvas_engine.drawQuadTree(RPG.Globals.current_map._getCollideTree(),10);
                }
            }
        },
        /* getSeconds(): int
         Retorna o tempo que o jogo está executando
         */
        getSeconds:function(){
            return parseInt(((new Date()).getTime() - RPG.Globals.start_time)/1000);
        },
        /*
         _focusOnEvent(Character character):void
         Focaliza a câmera em um character específico
         */
        _focusOnEvent:function(event){
            var self = this;
            if(self._focused_event !== null){
                self._focused_event._camera_focus = false;
            }
            event._camera_focus = true;
            self._focused_event = event;
        }
    };

    /*
     drawQuadTreeCallback(QuadTree quadtree, CanvasLayer layer,Boolean first):void
     Desenha a árvore de colisão(Modo Debug)
     */
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




    /*UI*/
    var UI_Window = function(bounds,parent){
        var self = this;
        self.bounds = bounds;
        self.parent = parent;
        self.graphic = null;
        self.text = "";
    };

    UI_Window.prototype.setGraphic = function(graphic){
        var self = this;
        self.graphic = graphic;
    };

    UI_Window.prototype.setPosition = function(x,y){
        var self = this;
        switch(x){
            case Position.LEFT:
                self.bounds.x = 0;
                break;
            case Position.CENTER:
                var diff_x = self.parent.width-self.bounds.width*self.size;
                self.bounds.x = diff_x/2;
                break;
            case Position.RIGHT:
                self.bounds.x = self.parent.width-self.bounds.width*self.size;
        }

        switch(y){
            case Position.TOP:
                self.bounds.y = 0;
                break;
            case Position.CENTER:
                var diff_y = self.parent.height-self.bounds.height*self.size;
                self.bounds.y = diff_y/2;
                break;
            case Position.BOTTOM:
                self.bounds.y = self.parent.height-self.bounds.height*self.size;
        }
    };

    var WindowBuilder = {
        top_bounds:{sx:144, sy:0, sWidth:16, sHeight:16},
        right_bounds:{sx:176, sy:16, sWidth:16, sHeight:16},
        bottom_bounds:{sx:144, sy:48, sWidth:16, sHeight:16},
        left_bounds:{sx:128, sy:16, sWidth:16, sHeight:16},
        background_bounds:{sWidth:128, sHeight:128},
        top_left_bounds:{sx:128, sy:0, sWidth:16, sHeight:16, dWidth:16, dHeight:16},
        top_right_bounds:{sx:176, sy:0, sWidth:16, sHeight:16, dWidth:16, dHeight:16},
        bottom_left_bounds:{sx:128, sy:48, sWidth:16, sHeight:16, dWidth:16, dHeight:16},
        bottom_right_bounds:{sx:176, sy:48, sWidth:16, sHeight:16, dWidth:16, dHeight:16},
        size:16,
        setBackgroundsBounds:function(bounds){
            var self = this;
            self.background_bounds =bounds;
        },
        setTopBounds:function(bounds){
            var self = this;
            self.top_bounds = bounds;
        },
        setRightBounds:function(bounds){
            var self = this;
            self.right_bounds = bounds;
        },
        setBottomBounds:function(bounds){
            var self = this;
            self.bottom_bounds = bounds;
        },
        setLeftBounds:function(bounds){
            var self = this;
            self.left_bounds = bounds;
        },
        setTopLeftBounds:function(bounds){
            var self = this;
            self.top_left_bounds = bounds;
        },
        setTopRightBounds :function(bounds){
            var self = this;
            self.top_right_bounds = bounds;
        },
        setBottomRightBounds : function(bounds){
            var self = this;
            self.bottom_right_bounds = bounds;
        },
        setBottomLeftBounds : function(bounds){
            var self = this;
            self.bottom_left_bounds = bounds;
        },
        create:function(options,parent){
            return new UI_Window(options,parent);
        }
    };


    var CanvasEngineRpg = function(options){
        var self = this;
        CanvasEngine.call(self,options);
    };

    CanvasEngineRpg.prototype = Object.create(CanvasEngine.prototype);
    CanvasEngineRpg.constructor = CanvasEngineRpg;

    /*
     drawMap(Map map):void
     Desenha o mapa nas camadas de canvas
     */
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

    /*
     drawQuadTree(QuadTree quadtree, CanvasLayer layer):void
     Desenha a árvore de colisão(Modo debug)
     */
    CanvasEngineRpg.prototype.drawQuadTree = function(quadtree,layer){
        var self = this;
        layer = self.getLayer(layer);
        drawQuadTreeCallback(quadtree,layer);
    };

    /*
     clearGraphic(int layer index, Graphic graphic):void
     Limpa uma região do canvas onde é desenhado um gráfico
     */
    CanvasEngineRpg.prototype.clearGraphic = function(layer_index,graphic){
        var self = this;
        if(graphic != null && self.layers[layer_index] !== undefined){
            var layer = self.layers[layer_index];
            layer.clearRect({
                x:graphic.lx,
                y:graphic.ly,
                width:graphic.width,
                height:graphic.height
            });
        }
    };

    /*
     drawCharacter(Character character):void
     Desenha um character
     */
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

    CanvasEngineRpg.prototype.drawWindow = function(window){
        var parent = window.parent;
        if(window.graphic !== null && window.parent !== null){
            var bounds,size = WindowBuilder.size,dx,dy,count;
            var graphic = window.graphic;
            var x = window.bounds.x;
            var y = window.bounds.y;
            var width = window.bounds.width*size;
            var height = window.bounds.height*size;

            bounds = WindowBuilder.background_bounds;
            parent.image({
                image:graphic,
                sWidth:bounds.sWidth,
                sHeight:bounds.sHeight,
                dx:x,
                dy:y,
                dWidth:width,
                dHeight:height,
                opacity:60
            });

            bounds = WindowBuilder.top_left_bounds;
            parent.image({
                image:graphic,
                dx:x,
                dy:y,
                sx:bounds.sx,
                sy:bounds.sy,
                dWidth:bounds.dWidth,
                dHeight:bounds.dHeight,
                sWidth:bounds.sWidth,
                sHeight:bounds.sHeight
            });

            bounds = WindowBuilder.top_right_bounds;
            parent.image({
                image:graphic,
                dx:(x+width-size),
                dy:y,
                sx:bounds.sx,
                sy:bounds.sy,
                dWidth:bounds.dWidth,
                dHeight:bounds.dHeight,
                sWidth:bounds.sWidth,
                sHeight:bounds.sHeight
            });

            bounds = WindowBuilder.bottom_right_bounds;
            parent.image({
                image:graphic,
                dx:(x+width-size),
                dy:(y+height-size),
                sx:bounds.sx,
                sy:bounds.sy,
                dWidth:bounds.dWidth,
                dHeight:bounds.dHeight,
                sWidth:bounds.sWidth,
                sHeight:bounds.sHeight
            });

            bounds = WindowBuilder.bottom_left_bounds;
            parent.image({
                image:graphic,
                dx:x,
                dy:(y+height-size),
                sx:bounds.sx,
                sy:bounds.sy,
                dWidth:bounds.dWidth,
                dHeight:bounds.dHeight,
                sWidth:bounds.sWidth,
                sHeight:bounds.sHeight
            });

            bounds = WindowBuilder.top_bounds;
            dx = x+16;
            count = 1;
            while(dx < (x+width-16)){
                parent.image({
                    image:graphic,
                    dx:dx,
                    dy:y,
                    sx:bounds.sx+(count%2===0?16:0),
                    sy:bounds.sy,
                    dWidth:16,
                    dHeight:16,
                    sWidth:bounds.sWidth,
                    sHeight:bounds.sHeight
                });
                dx+=16;
                count++;
            }

            bounds = WindowBuilder.right_bounds;
            dy = y+16;
            count = 1;

            while(dy < (y+height-16)){
                parent.image({
                    image:graphic,
                    dx:x+width-size,
                    dy:dy,
                    sx:bounds.sx,
                    sy:bounds.sy+(count%2==0?16:0),
                    dWidth:16,
                    dHeight:16,
                    sWidth:bounds.sWidth,
                    sHeight:bounds.sHeight
                });
                dy+=size;
                count++;
            }

            bounds = WindowBuilder.bottom_bounds;
            dx = x+16;
            count = 1;
            while(dx < (x+width-16)){
                parent.image({
                    image:graphic,
                    dx:dx,
                    dy:y+height-size,
                    sx:bounds.sx+(count%2==0?16:0),
                    sy:bounds.sy,
                    dWidth:16,
                    dHeight:16,
                    sWidth:bounds.sWidth,
                    sHeight:bounds.sHeight
                });
                dx+=size;
                count++;
            }


            bounds = WindowBuilder.left_bounds;
            dy = y+16;
            count = 1;
            while(dy < (y+height-16)){
                parent.image({
                    image:graphic,
                    dx:x,
                    dy:dy,
                    sx:bounds.sx,
                    sy:bounds.sy+(count%2==0?16:0),
                    dWidth:16,
                    dHeight:16,
                    sWidth:bounds.sWidth,
                    sHeight:bounds.sHeight
                });
                dy+=size;
                count++;
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

    /*
     getIndexFrame():int
     Retorna o índice do quadro atual da animação
     */
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

    /*
     stop():void
     Para a execução da animação
     */
    Animation.prototype.stop = function(){
        var self = this;
        self.pause();
    };

    /*
     execute():void
     Executa a animação
     */
    Animation.prototype.execute = function(){
        var self = this;
        if(!self.running){
            self.start_time = (new Date()).getTime();
            self.running = true;
        }
    };

    /*
     pause:Pausa a execução da animação
     */
    Animation.prototype.pause = function(){
        var self = this;
        if(self.running){
            self.end_time = (new Date()).getTime();
            self.running = false;
        }
    };

    /*
     pauseToFrame(int index):void
     Pausa a animação no quadro index
     */
    Animation.prototype.pauseToFrame = function(index){
        var self = this;
        if(self.frames[index] !== undefined){
            var diff = (index/self.fps)*1000;
            self.end_time = self.start_time + diff;
            self.running = false;
        }
    };

    /*
     Animation.create(Object options):Animation
     Cria uma animação
     */
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

    /*
     _initialize():void
     Inicializa as animações do gráfico
     */
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

    /*
     initialize(Object options):void
     Inicializa as variáveis do Character
     */
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
            groups:['EV']
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
        self._follow = null;
    };

    /*
     setPosition(double x, double y):void
     Altera a posição x,y do character
     */
    Character.prototype.setPosition = function(x,y){
        var self = this;
        self.bounds.x = x;
        self.bounds.y = y;
        self.updateFocus();
    };

    /*
     moveTo(double x, double y, int time, function callback):void
     Registra o tempo e a posição final do movimento do character
     */
    Character.prototype.moveTo = function (x,y,time,callback) {
        var self = this;
        var final_bounds = Utils.calculate_final_position(self.bounds,x,y,time);
        self._start_moving_time = (new Date()).getTime();
        self._moving_time = final_bounds.time;
        self._start_position = {x:self.bounds.x, y:self.bounds.y};
        self._end_position = {x:final_bounds.x, y:final_bounds.y};
        self._moving_callback = callback;
    };

    /*
     _timeStepMove():void
     Executa um passo de tempo no movimento do character
     */
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

    /*
     updateFocus():void
     Atualiza a  posição da câmera (se focada nesse character)
     */
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
    /*
     setGraphic(Graphic graphic):void
     Altera o gráfico do character
     */
    Character.prototype.setGraphic = function(graphic){
        var self = this;
        self.graphic = graphic;
        graphic.lx = self.bounds.x;
        graphic.ly = self.bounds.y;
    };

    /*
     getCurrentFrame():Object
     Retorna o gráfico atual do character
     */
    Character.prototype.getCurrentFrame = function(){
        var self = this;
        var animation_name = 'step_'+self.direction;
        var animation = self.graphic.animations[animation_name];
        return animation.frames[animation.getIndexFrame()];
    };

    /*
     look(String|Character direction):void
     Faz o character olhar para a direção/character direction
     */
    Character.prototype.look = function(direction){
        var self = this;
        switch(direction){
            case Direction.UP:
            case Direction.DOWN:
            case Direction.RIGHT:
            case Direction.LEFT:
                self.direction = direction;
                break;
            default:
                if(direction instanceof Character){
                    var d_x = self.bounds.x-direction.bounds.x;
                    var d_y = self.bounds.y-direction.bounds.y;
                    self.direction = (d_x === d_y || d_x === 0)? d_y < 0? Direction.DOWN:Direction.UP:d_x < 0? Direction.RIGHT:Direction.LEFT;
                }
        }
    };

    /*
     step(String direction,int times,function end,Boolean allow):void
     Move o character um passo na direção "direction"
     */
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

    /*
     stepForward():void
     Move o character um passo para frente
     */
    Character.prototype.stepForward = function(){
        var self = this;
        self.step(self.direction);
    };

    /*
     stepRandom():void
     Move o character a um passo aleatório
     */
    Character.prototype.stepRandom = function(){
        var self = this;
        var directions = Object.keys(Direction);
        var pos = Math.floor(Math.random()*directions.length);
        var direction = directions[pos];
        self.step(Direction[direction]);
    };

    /*
     follow(Character character):void
     Segue um character
     */
    Character.prototype.follow = function(character){
        var self = this;
        self._follow = character;
    };

    /*
     unfollow():void
     Deixa de seguir um character
     */
    Character.prototype.unfollow = function(){
        var self = this;
        self._moving = false;
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

    /*
     setGraphic(Graphic graphic):void
     Altera o gráfico da página
     */
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
        self.bounds.groups = ['EV','ACTION_BUTTON'];
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

    /*
     getCurrentFrame():Object
     Retorna o quadtro atual de animação
     */
    Event.prototype.getCurrentFrame = function(){
        var self = this;
        if(self.current_page !== null){
            var animation_name = 'step_'+self.direction;
            var animation = self.current_page.graphic.animations[animation_name];
            return animation.frames[animation.getIndexFrame()];
        }
        return null;
    };

    /*
     enableSwitch(String name):void
     Ativa o evento local "name"
     */
    Event.prototype.enableSwitch = function(name){
        var self = this;
        self.switches[name] = true;
        if(self._switches_callbacks[name] !== undefined){
            self._switches_callbacks[name].forEach(function(callback){
                callback();
            });
        }
    };

    /*
     disableSwitch(String name):void
     Desativa o evento local "name"
     */
    Event.prototype.disableSwitch = function(name){
        var self = this;
        self.switches[name] = false;
        if(self._switches_callbacks[name] !== undefined){
            self._switches_callbacks[name].forEach(function(callback){
                callback();
            });
        }
    };
    /*
     _switchCallback(String name, function callback):void
     Registra a função de callback para ativar ou desativar o switch
     */
    Event.prototype._switchCallback = function(name,callback){
        var self = this;
        if(self._switches_callbacks[name] === undefined){
            self._switches_callbacks[name] = [];
        }

        self._switches_callbacks[name].push(callback);
    };

    /*
     addPage(Page page):void
     Adiciona uma nova página ao evento
     */
    Event.prototype.addPage = function(page){
        var self = this;
        self.pages.push(page);
    };

    var Item = function(options){
        var name = options.name;
        var graphic = options.graphic;

        var self = this;


        self.name = name;
        self.graphic = graphic;
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


    /*Loaders*/

    var ImageLoader = {
        loadedImages:[],//Imagens que já foram carregadas
        /*
         loadAll(Array[String] urls, function callback):void
         Carrega todas as images de urls e passa o
         resultado para a função callback
         */
        loadAll:function(urls,callback){
            loadAll(urls,[],callback);
        },
        /*
         load:(String url, function callback):void
         Carrega a imagem da url e passa o resultado
         para a função callback
         */
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
        /*
         toDataURL(Image img, function callback):void
         Gera uma url para a imagem img e passa para a
         função callback
         */
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

    var loadAll = function(urls,loaded,callback){
        loaded = loaded === undefined?[]:loaded;
        if(urls.length > 0){
            var url = urls.shift();
            ImageLoader.load(url,function(img){
                loaded.push(img);
                loadAll(urls,loaded,callback);
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
        /*
         load:(Object data, Map map,function callback):void
         Carrega todos os dados do object data no objeto mapa,
         se o objeto map não for informado, um novo será criado
         */
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
                                        if(tile[10] !== undefined){
                                            newtile.bounds = {
                                                x:tile[10],
                                                y:tile[11],
                                                width:tile[12],
                                                height:tile[13]
                                            };
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

    var Position = {
        TOP:0,
        RIGHT:1,
        BOTTOM:2,
        LEFT:3,
        CENTER:4
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
    RPG.Position = Position;
    RPG.WindowBuilder = WindowBuilder;

    window.RPG = RPG;
})(window);