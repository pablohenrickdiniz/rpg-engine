(function(w){
    if(w.CE == undefined){
        throw new Error('RPG requires Canvas Engine');
    }

    var RPG = {
        Game:{
            current_scene:null,//Cena Atual
            current_player:null,//Jogador Atual
            switches:[],//Switches
            variables:[],//Variáveis
            paused:true,//Jogo Pausado
            current_time:0,//
            switches_callbacks:[],//callbacks de switches
            /*_switchCallback(String name, function callback)
             * Registra função de callback para ativar ou desativar switch global
             * */
            switchCallback:function(name,callback){
                var self = this;
                if(self.switches_callbacks[name] === undefined){
                    self.switches_callbacks[name] = [];
                }

                self.switches_callbacks[name].push(callback);
            },
            /*
             enableSwitch(String name):void
             Ativa um Switch "name" global
             */
            enableSwitch:function(name){
                var self = this;
                self.switches[name] = true;
                if(self.switches_callbacks[name] !== undefined){
                    self.switches_callbacks[name].forEach(function(callback){
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
                self.switches[name] = false;
                if(self.switches_callbacks[name] !== undefined){
                    self.switches_callbacks[name].forEach(function(callback){
                        callback();
                    });
                }
            },
            /*
             loadScene(Scene cena):void
             Carrega a cena atual
             */
            loadScene: function (scene) {
                var self = this;
                self.current_scene = scene;
                var current_player = self.current_player;
                if (current_player != null && current_player.active) {
                    scene.getTree().insert(current_player.bounds);
                }
            }
        },
        Controls:{
            Keyboard:{

            },
            Mouse:{

            }
        },
        Audio:{

        },
        Screen: {
            x: 0,
            y: 0,
            width: 600,
            height: 600,
            BGRefreshed: false,
            fps: 60,
            canvas_engine: null,
            fade_animation: null,
            fade_finished: true,
            fade_callback: null,
            layers: {
                BG1: null,//Background 1
                BG2: null,//Background 2
                BG3: null,//Background 3
                EV1: null,//Eventos 1
                EV2: null,//Eventos 2
                BG4: null,//Background 4
                BG5: null,//Background 5
                BG6: null,//Background 6
                EF1: null,//Effects 1
                EF2: null,//Effects 2
                EF3: null //Effects 3
            },
            initialize: function (container) {
                var self = this;
                var width = self.width;
                var height = self.height;

                var engine = CE.create({
                    width: self.width,
                    height: self.height,
                    container: container
                });

                self.layers.BG1 = engine.createLayer({width: width, height: height});
                self.layers.BG2 = engine.createLayer({width: width, height: height});
                self.layers.BG3 = engine.createLayer({width: width, height: height});
                self.layers.EV1 = engine.createLayer({width: width, height: height});
                self.layers.EV2 = engine.createLayer({width: width, height: height});
                self.layers.BG4 = engine.createLayer({width: width, height: height});
                self.layers.BG5 = engine.createLayer({width: width, height: height});
                self.layers.BG6 = engine.createLayer({width: width, height: height});
                self.layers.EF1 = engine.createLayer({width: width, height: height});
                self.layers.EF2 = engine.createLayer({width: width, height: height});
                self.layers.EF3 = engine.createLayer({width: width, height: height});
                self.canvas_engine = engine;
            },
            setPosition: function (x, y) {
                var self = this;
                x = parseFloat(x);
                y = parseFloat(y);
                var changed = false;
                if (!isNaN(x) && x > 0) {
                    if (parseInt(self.x) != parseInt(x)) {
                        self.x = x;
                        changed = true;
                    }
                }

                if (!isNaN(y) && y > 0) {
                    if (parseInt(self.y) != parseInt(y)) {
                        self.y = y;
                        changed = true;
                    }
                }
                if (changed) {
                    self.BGRefreshed = false;
                }
            },
            drawGraphic:function(graphic,x,y,layer_index){
                var self = this;
                var layer = self.canvas_engine.getLayer(layer_index);
                if (layer !== null) {
                    var context = layer.getContext();
                    context.drawImage(graphic.image, graphic.sx, graphic.sy, graphic.sWidth, graphic.sHeight, x, y, graphic.dWidth, graphic.dHeight);
                }
            },
            /*
             clearGraphic(int layer index, Graphic graphic):void
             Limpa uma região do canvas onde é desenhado um gráfico
             */
            clearArea: function (x,y,width,height,layer_index) {
                var self = this;
                var layer = self.canvas_engine.getLayer(layer_index);
                if (layer !== null) {
                    layer.clearRect({
                        x:x,
                        y:y,
                        width:width,
                        height:height
                    });
                }
            },
            /*
             fadeIn()>void
             */
            fadeIn: function (miliseconds, callback) {
                var self = this;
                miliseconds = parseInt(miliseconds);
                miliseconds = isNaN(miliseconds) || miliseconds < 0 ? 2000 : miliseconds;
                if (self.fade_finished) {
                    if (callback != undefined) {
                        self.fade_callback = callback;
                    }
                    else {
                        self.fade_callback = null;
                    }

                    self.fade_finished = false;
                    self.fade_animation = new Animation(self.fps, self.fps * (miliseconds / 1000));
                    self.fade_animation.execute(true, 'negative');
                }
            },
            /*
             fadeOut():void
             */
            fadeOut: function (miliseconds, callback) {
                var self = this;
                miliseconds = parseInt(miliseconds);
                miliseconds = isNaN(miliseconds) || miliseconds < 0 ? 2000 : miliseconds;
                if (self.fade_finished) {
                    if (callback != undefined) {
                        self.fade_callback = callback;
                    }
                    else {
                        self.fade_callback = null;
                    }

                    self.fade_finished = false;
                    self.fade_animation = new Animation(self.fps, self.fps * (miliseconds / 1000));
                    self.fade_animation.execute(true, 'positive');
                }
            },
            stepFade: function () {
                var self = this;
                if (!self.fade_finished) {
                    var running = self.fade_animation.isRunning();
                    var index = self.fade_animation.getIndexFrame();
                    var opacity = null;
                    if (!running) {
                        if (self.fade_animation.direction == 'negative') {
                            opacity = 0;
                        }
                        else {
                            opacity = 1;
                        }
                    }
                    else {
                        opacity = (index / (self.fade_animation.frame_count - 1));
                    }

                    var ctx = self.layers.EF3.getContext();
                    ctx.clearRect(0, 0, self.width, self.height);

                    if (opacity > 0) {
                        ctx.fillStyle = 'rgba(0,0,0,' + opacity + ')';
                        ctx.fillRect(0, 0, self.width, self.height);
                    }

                    if (!running) {
                        self.fade_finished = true;
                        if (self.fade_callback != null) {
                            self.fade_callback();
                        }
                    }
                }
            },
            /*
             refreshBG():void
             //rever localização
             */
            refreshBG: function (scene) {
                var self = this;
                if (!self.BGRefreshed) {
                    self.clearBGLayers();
                    self.drawMapArea(scene, self.x, self.y, self.width, self.height);
                    self.BGRefreshed = true;
                }
            },
            clearBGLayers: function () {
                var self = this;
                var layers = self.layers;
                layers.BG1.clear();
                layers.BG2.clear();
                layers.BG3.clear();
                layers.BG4.clear();
                layers.BG5.clear();
                layers.BG6.clear();
            },
            /*
             clearEvents():void
             Limpa todos os eventos do mapa
             rever localização
             */
            clearAreas: function (areas) {
                var self = this;
                for(var i = 0; i < areas.length;i++){
                    var g_set = areas[i];
                    self.clearArea(g_set.x,g_set.y,g_set.width,g_set.height,g_set.layer);
                }
            },
            drawGraphics:function(graphics){
                var self = this;
                for(var i = 0; i < graphics.length;i++){
                    var g_set = graphics[i];
                    self.drawGraphic(g_set.graphic,g_set.x,g_set.y,g_set.layer);
                }
            },
            drawMapArea: function (map, sx, sy, width, height) {
                var interval = map.getAreaInterval({x: sx, y: sy, width: width, height: height});
                var self = this;
                for (var i = interval.si; i <= interval.ei; i++) {
                    for (var j = interval.sj; j <= interval.ej; j++) {
                        if (map.tiles[i] !== undefined && map.tiles[i][j] !== undefined) {
                            map.tiles[i][j].forEach(function (tile, layer_index) {
                                var layer = self.canvas_engine.getLayer(layer_index);
                                if (layer != null) {
                                    var context = layer.getContext();
                                    var graphic = tile.getGraphic();
                                    var dx = j * graphic.dWidth - sx;
                                    var dy = i * graphic.dHeight - sy;
                                    dx = parseInt(dx);
                                    dy = parseInt(dy);
                                    context.drawImage(graphic.image, graphic.sx, graphic.sy, graphic.sWidth, graphic.sHeight, dx, dy, graphic.dWidth, graphic.dHeight);
                                }
                            });
                        }
                    }
                }
            }
        },
        _key_reader: null,//leitor de teclado
        _interval: null,//interval de execução
        _running: false,//running execução iniciada
        focused_event: null,//Evento que está sendo focado
        last_loop: null,
        /*
         initialize(String container):void
         inicializa a engine de rpg dentro do elemento container
         */
        initialize: function (container) {
            var self = this;
            self.Screen.initialize(container);
            var keyboard = new KeyboardReader(container);

            keyboard.keydown('KEY_ESC', function () {
                if (!RPG.running) {
                    RPG.run();
                }
                else {
                    RPG.end();
                }
            });
            keyboard.keydown('KEY_ENTER', function () {
                RPG.actionEvents();
            });

            RPG.Controls.Keyboard = keyboard;
        },
        /*
         run():void
         Inicializa a execução do Jogo
         */
        run: function () {
            RPG.Game.start_time = (new Date()).getTime();
            console.log('game started');
            if (!RPG.running) {
                RPG.running = true;
                RPG.step();
            }
        },
        /*
         end():void
         Finaliza a execução do Jogo
         */
        end: function () {
            var self = this;
            RPG.running = false;
            window.cancelAnimationFrame(RPG.interval);
        },
        /*actionEvents():void
         * Tratamento de eventos relacionados às ações do jogador
         */
        actionEvents: function () {
            var current_player = RPG.Game.current_player;
            var tree = RPG.Game.current_scene.getTree();

            var bounds_tmp = {
                x: current_player.bounds.x,
                y: current_player.bounds.y,
                width: current_player.bounds.width,
                height: current_player.bounds.height,
                groups: ['ACTION_BUTTON']
            };

            var direction = current_player.direction;
            switch (direction) {
                case Direction.UP:
                    bounds_tmp.y -= bounds_tmp.height;
                    bounds_tmp.height *= 2;
                    break;
                case Direction.RIGHT:
                    bounds_tmp.width *= 2;
                    break;
                case Direction.DOWN:
                    bounds_tmp.height *= 2;
                    break;
                case Direction.LEFT:
                    bounds_tmp.x -= bounds_tmp.width;
                    bounds_tmp.width *= 2;
                    break;
            }

            var collisions = tree.retrieve(bounds_tmp, 'ACTION_BUTTON');
            var key_reader = RPG.key_reader;
            collisions.forEach(function (colision) {
                if (colision.ref !== undefined) {
                    var event = colision.ref;
                    if (event.current_page !== undefined && event.current_page !== null) {
                        var current_page = event.current_page;
                        if (current_page.trigger === Trigger.PLAYER_TOUCH) {
                            current_page.script();
                        }
                        else if (current_page.trigger === Trigger.ACTI0N_BUTTON && key_reader.isActive('KEY_ENTER')) {
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
        stepPlayer: function () {
            var current_player = RPG.Game.current_player;
            var key_reader = RPG.Controls.Keyboard;
            if (!current_player.moving) {
                if (key_reader.isActive('KEY_LEFT')) {
                    current_player.step(Direction.LEFT);
                }
                else if (key_reader.isActive('KEY_RIGHT')) {
                    current_player.step(Direction.RIGHT);
                }
                else if (key_reader.isActive('KEY_DOWN')) {
                    current_player.step(Direction.DOWN);
                }
                else if (key_reader.isActive('KEY_UP')) {
                    current_player.step(Direction.UP);
                }
                else if (current_player.graphic !== null) {
                    var name = Direction.getName(current_player.direction);
                    var animation_name = 'step_' + name;
                    current_player.animations[animation_name].pauseToFrame(1);
                    current_player.refreshed = false;
                }
            }
            else {
                current_player.timeStepMove();
                current_player.refreshed = false;
            }
        },
        /*
         stepEvents():void
         Tratamento de ações relacionadas aos eventos do jogo
         */
        stepEvents: function () {
            var self = this;

            var events = RPG.Game.current_scene.events;
            events.forEach(function (event) {
                if (event.current_page !== null) {
                    if (!event.moving) {
                        if (event.follow !== null) {
                            event.look(event.follow);
                            event.stepForward();
                        }
                        else if (event.graphic !== null) {
                            var name = Direction.getName(event.direction);
                            var animation_name = 'step_' + name;
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
        stepAnimatedTiles: function () {
            var self = this;
            var current_scene = RPG.Game.current_scene;
            current_scene.eachAnimatedTile(function (tile, i, j, layer) {

            });
        },
        /*
         stepFocus():void
         executa o passo que focaliza em um evento
         */
        stepFocus: function () {
            var self = this;
            if (self.focused_event != null) {
                var event = self.focused_event;
                var s = self.Screen,
                    m = self.Game.current_scene;

                var screen_width = s.width;
                var screen_height = s.height;

                var screen_x = event.bounds.x - (screen_width / 2) + (event.graphic.width / 2);
                var screen_y = event.bounds.y - (screen_height / 2) + (event.graphic.width / 2);
                var max_screen_x = m.getFullWidth() - screen_width;
                var max_screen_y = m.getFullWidth() - screen_height;

                if (screen_x < 0) {
                    screen_x = 0;
                }
                else if (screen_x > max_screen_x) {
                    screen_x = max_screen_x;
                }

                if (screen_y < 0) {
                    screen_y = 0;
                }
                else if (screen_y > max_screen_y) {
                    screen_y = max_screen_y;
                }

                s.setPosition(screen_x, screen_y);
            }
        },
        /*
         step():void
         executa um passo de tempo no jogo
         */
        step: function () {
            if (RPG.running) {
                RPG.interval = window.requestAnimationFrame(function () {
                    RPG.step();
                });

                var passed = 0;
                var current_time = new Date().getTime();

                if (RPG.last_loop != null) {
                    passed = current_time - RPG.last_loop;
                }

                RPG.Game.current_time += passed;

                var scene = RPG.Game.current_scene;

                if (scene != null) {
                    RPG.stepPlayer();
                    RPG.stepEvents();
                    RPG.stepFocus();
                    RPG.Screen.stepFade();
                    RPG.Screen.refreshBG(scene);

                    var clear_areas = RPG.prepareClearAreas();
                    var graphics = RPG.prepareDrawGraphics();

                    RPG.Screen.clearAreas(clear_areas);
                    RPG.Screen.drawGraphics(graphics);
                }
                RPG.last_loop = current_time;
            }
        },
        prepareClearAreas:function(){
            var current_player = RPG.Game.current_player;
            var current_scene = RPG.Game.current_scene;
            var self = this;
            var bounds = current_player.bounds;
            var graphic = current_player.graphic;
            var event;
            var g_sets = [];

            g_sets.push({
                x:bounds.lx,
                y:bounds.ly,
                width:graphic.width,
                height:graphic.height,
                layer:current_player.layer
            });

            var events = current_scene.events;
            var size = events.length;
            for (i = 0; i < size; i++) {
                event = events[i];
                if (event.current_page !== null) {
                    bounds = event.bounds;
                    graphic = event.graphic;
                    g_sets.push({
                        x:bounds.lx,
                        y:bounds.ly,
                        width:graphic.width,
                        height:graphic.height,
                        layer:event.layer
                    });
                }
            }
            return g_sets;
        },
        prepareDrawGraphics:function(){
            var current_scene = RPG.Game.current_scene;
            var current_player = RPG.Game.current_player;
            var events = current_scene.events;
            var self =this;
            var size = events.length;
            var bounds;
            var graphic;
            var graphic_sets = [];

            for (var i = 0; i < size; i++) {
                var event = events[i];
                if (event.current_page !== null) {
                    bounds = event.bounds;
                    graphic = event.graphic;
                    graphic_sets.push({
                        x:bounds.x,
                        y:bounds.y,
                        layer:event.layer,
                        graphic:graphic
                    });
                }
            }

            var frame = current_player.getCurrentFrame();

            if (frame !== undefined) {
                graphic = frame.getGraphic();
                bounds = current_player.bounds;
                var x = bounds.x - RPG.Screen.x;
                var y = bounds.y - RPG.Screen.y;
                graphic_sets.push({
                    x:x,
                    y:y,
                    layer:current_player.layer,
                    graphic:graphic
                });
                bounds.lx = x;
                bounds.ly = y;
                current_player._refreshed = true;
            }

            return graphic_sets;
        },
        /*
         _focusOnEvent(Character character):void
         Focaliza a câmera em um character específico
         */
        _focusOnEvent: function (event) {
            var self = this;
            if (self.focused_event !== null) {
                self.focused_event.camera_focus = false;
            }
            event.camera_focus = true;
            self.focused_event = event;
        }
    };

    w.RPG = RPG;
})(window);