(function(w){
    if(w.CE == undefined){
        throw new Error('RPG requires Canvas Engine');
    }
    else if(w.RPGCanvas == undefined){
        throw  new Error('RPG requires RPGCanvas');
    }

    w.RPG = {
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
            var engine = CE.create({
                width:RPG._screen_width,
                height:RPG._screen_height,
                container:container
            },RPGCanvas);
            var key_reader =  engine.getKeyboardReader();
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
})(window);