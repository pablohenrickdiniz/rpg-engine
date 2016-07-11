(function(w){
    if(w.CE == undefined){
        throw new Error('RPG requires Canvas Engine');
    }
    else if(w.RPGCanvas == undefined){
        throw  new Error('RPG requires RPGCanvas');
    }

    var RPG = {
        Game:{
            current_map:null,//Mapa atual
            current_player:null,//Jogador Atual
            switches:[],//Switches
            variables:[],//Variáveis
            paused:true,//Jogo Pausado
            start_time:null//Data de início
        },
        Screen:{
            width:600,
            height:600,
            layers:{
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
            }
        },
        _switches_callbacks:[],//callbacks de switches
        _canvas_engine:null,//engine de canvas
        _key_reader:null,//leitor de teclado
        _interval:null,//interval de execução
        _running:false,//running execução iniciada
        _debug:false,//modo debug
        _focused_event:null,//Evento que está sendo focado
        /*_switchCallback(String name, function callback)
         * Registra função de callback para ativar ou desativar switch global
         * */
        _switchCallback:function(name,callback){
            var self = RPG;
            if(self.switches_callbacks[name] === undefined){
                self.switches_callbacks[name] = [];
            }

            self.switches_callbacks[name].push(callback);
        },
        /*
         initialize(String container):void
         inicializa a engine de rpg dentro do elemento container
         */
        initialize:function(container){
            var self= this;
            var screen =  self.Screen;

            var engine = CE.create({
                width:screen.width,
                height:screen.height,
                container:container
            },RPGCanvas);

            var key_reader =  engine.getKeyboardReader();
            screen.layers.BG1 = engine.createLayer();
            screen.layers.BG2 = engine.createLayer();
            screen.layers.BG3 = engine.createLayer();
            screen.layers.EV1 = engine.createLayer();
            screen.layers.EV2 = engine.createLayer();
            screen.layers.BG4 = engine.createLayer();
            screen.layers.BG5 = engine.createLayer();
            screen.layers.BG6 = engine.createLayer();
            screen.layers.BG7 = engine.createLayer();
            screen.layers.BG8 = engine.createLayer();
            screen.layers.QUAD = engine.createLayer();
            screen.layers.menu1 = engine.createLayer({fixed:true});
            screen.layers.menu2 = engine.createLayer({fixed:true});
            screen.layers.menu3 = engine.createLayer({fixed:true});
            key_reader.keydown('KEY_ESC',function(){
                if(!RPG.running){
                    RPG.run();
                }
                else{
                    RPG.end();
                }
            });
            key_reader.keydown('KEY_ENTER',function(){
                RPG.actionEvents();
            });

            RPG.key_reader = key_reader;
            RPG.canvas_engine = engine;
        },
        /*
         loadMap(Map map):void
         Carrega e altera o mapa atual
         */
        loadMap:function(map){
            var self = this;
            self.Game.current_map = map;
            var width = map.getFullWidth();
            var height = map.getFullHeight();
            var screen = self.Screen;
            screen.layers.BG1.set({width:width,height:height});
            screen.layers.BG2.set({width:width,height:height});
            screen.layers.BG3.set({width:width,height:height});
            screen.layers.EV1.set({width:width,height:height});
            screen.layers.EV2.set({width:width,height:height});
            screen.layers.BG4.set({width:width,height:height});
            screen.layers.BG5.set({width:width,height:height});
            screen.layers.BG6.set({width:width,height:height});
            screen.layers.BG7.set({width:width,height:height});
            screen.layers.BG8.set({width:width,height:height});
            screen.layers.QUAD.set({width:width,height:height});
            RPGCanvas.drawMap(map,RPG.canvas_engine);

            var current_player = RPG.Game.current_player;
            if(current_player != null && current_player.active){
                map._getCollideTree().insert(current_player.bounds);
            }
        },
        /*
         enableSwitch(String name):void
         Ativa um Switch "name" global
         */
        enableSwitch:function(name){
            var self = this;
            RPG.Game.switches[name] = true;
            if(RPG.switches_callbacks[name] !== undefined){
                RPG.switches_callbacks[name].forEach(function(callback){
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
            RPG.Game.switches[name] = false;
            if(RPG.switches_callbacks[name] !== undefined){
                RPG.switches_callbacks[name].forEach(function(callback){
                    callback();
                });
            }
        },
        /*
         run():void
         Inicializa a execução do Jogo
         */
        run:function(){
            RPG.Game.start_time = (new Date()).getTime();
            console.log('game started');
            if(!RPG.running){
                RPG.running = true;
                RPG.step();
            }
        },
        /*
         end():void
         Finaliza a execução do Jogo
         */
        end:function(){
            var self = this;
            RPG.running = false;
            window.cancelAnimationFrame(RPG.interval);
        },
        /*actionEvents():void
         * Tratamento de eventos relacionados às ações do jogador
         */
        actionEvents:function(){
            var current_player = RPG.Game.current_player;
            var tree = RPG.Game.current_map.getCollideTree();

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
            var key_reader = RPG.key_reader;
            collisions.forEach(function(colision){
                if(colision.ref !== undefined){
                    var event = colision.ref;
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
            var current_player = RPG.Game.current_player;
            var key_reader = RPG.key_reader;
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
                else if(current_player.graphic !== null){
                    var name = Direction.getName(current_player.direction);
                    var animation_name = 'step_'+name;
                    current_player.animations[animation_name].pauseToFrame(1);
                    current_player.refreshed = false;
                }
            }
            else{
                current_player.timeStepMove();
                current_player.refreshed = false;
            }
        },
        /*
         stepEvents():void
         Tratamento de ações relacionadas aos eventos do jogo
         */
        stepEvents:function(){
            var self = this;
            var events = RPG.Game.current_map.events;
            events.forEach(function(event){
                if(event.current_page !== null){
                    if(!event.moving){
                        if(event.follow !== null){
                            event.look(event.follow);
                            event.stepForward();
                        }
                        else if(event.graphic !== null){
                            var name = Direction.getName(event.direction);
                            var animation_name = 'step_'+name;
                            event.animations[animation_name].pauseToFrame(1);
                        }
                    }
                    else {
                        event.timeStepMove();
                        event.refreshed = false;
                    }
                }
            });
        },
        /*
         stepAnimatedTiles():voi'd
         */
        stepAnimatedTiles:function(){
            var self = this;
            var current_map = RPG.Game.current_map;
            current_map.eachAnimatedTile(function(tile,i,j,layer){

            });
        },
        /*
         clearEvents():void
         Limpa todos os eventos do mapa
         */
        clearEvents:function(){
            var current_player = RPG.Game.current_player;
            var canvas_engine = RPG.canvas_engine;
            var current_map = RPG.Game.current_map;
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
            var current_player = RPG.Game.current_player;
            var canvas_engine = RPG.canvas_engine;
            var current_map = RPG.Game.current_map;
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
            if(RPG.running){
                RPG.interval = window.requestAnimationFrame(function () {
                    RPG.step();
                });
                RPG.stepPlayer();
                RPG.stepEvents();
                RPG.clearEvents();
                RPG.drawEvents();
                if(RPG.debug){
                    RPG.canvas_engine.drawQuadTree(RPG.Game.current_map.getCollideTree(),10);
                }
            }
        },
        /* getSeconds(): int
         Retorna o tempo que o jogo está executando
         */
        getSeconds:function(){
            return parseInt(((new Date()).getTime() - RPG.Game.start_time)/1000);
        },
        /*
         _focusOnEvent(Character character):void
         Focaliza a câmera em um character específico
         */
        _focusOnEvent:function(event){
            var self = this;
            if(self.focused_event !== null){
                self.focused_event.camera_focus = false;
            }
            event.camera_focus = true;
            self.focused_event = event;
        }
    };

    w.RPG = RPG;
})(window);