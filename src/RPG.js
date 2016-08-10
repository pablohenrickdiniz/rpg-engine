(function (w) {
    if (w.CE == undefined) {
        throw new Error('RPG requires Canvas Engine');
    }

    if (w.SceneMap == undefined) {
        throw new Error('RPG requires SceneMap');
    }


    var RPG = {
        Game: {
            current_scene: null,//Cena Atual
            current_player: null,//Jogador Atual
            switches: [],//Switches
            variables: [],//Variáveis
            paused: true,//Jogo Pausado
            current_time: 0,//
            switches_callbacks: [],//callbacks de switches
            /*_switchCallback(String name, function callback)
             * Registra função de callback para ativar ou desativar switch global
             * */
            switchCallback: function (name, callback) {
                var self = this;
                if (self.switches_callbacks[name] === undefined) {
                    self.switches_callbacks[name] = [];
                }

                self.switches_callbacks[name].push(callback);
            },
            /*
             enableSwitch(String name):void
             Ativa um Switch "name" global
             */
            enableSwitch: function (name) {
                var self = this;
                self.switches[name] = true;
                if (self.switches_callbacks[name] !== undefined) {
                    self.switches_callbacks[name].forEach(function (callback) {
                        callback();
                    });
                }
            },
            /*
             disableSwitch(String name):void
             Desativa um switch "name" global
             */
            disableSwitch: function (name) {
                var self = this;
                self.switches[name] = false;
                if (self.switches_callbacks[name] !== undefined) {
                    self.switches_callbacks[name].forEach(function (callback) {
                        callback();
                    });
                }
            },
            loadScene: function (scene) {
                var self = this;
                self.current_scene = scene;
                RPG.Game.loadSceneAudio(scene,function(){
                    scene.ready(RPG);
                });
            },
            loadSceneAudio: function (scene, callback) {
                var audio = scene.audio || {};
                var BGM = audio.BGM || {};
                var BGS = audio.BGS || {};
                var SE = audio.SE || {};
                var ME = audio.ME || {};
                var count = 0;
                var q = function(){
                    count++;
                    if(count >= 4){
                        callback();
                    }
                };

                AudioLoader.loadAll(BGM, function (bgms) {
                    RPG.AudioPlayer.setAudios('BGM', bgms);
                    q();
                });

                AudioLoader.loadAll(BGS, function (bgms) {
                    RPG.AudioPlayer.setAudios('BGS', bgms);
                    q();
                });

                AudioLoader.loadAll(SE, function (bgms) {
                    RPG.AudioPlayer.setAudios('SE', bgms);
                    q();
                });

                AudioLoader.loadAll(ME, function (bgms) {
                    RPG.AudioPlayer.setAudios('ME', bgms);
                    q();
                });
            }
        },
        Controls: {
            Keyboard: {},
            Mouse: {}
        },
        AudioPlayer: null,
        Screen: null,
        System: null,
        _key_reader: null,//leitor de teclado
        _interval: null,//interval de execução
        _running: false,//running execução iniciada
        last_loop: null,
        /*
         initialize(String container):void
         inicializa a engine de rpg dentro do elemento container
         */
        initialize: function (container) {
            var self = this;
            if (self.Screen != null) {
                self.Screen.initialize(container);
            }

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
            RPG.last_loop = null;
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
            var Direction = RPG.Direction;

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
            var Direction = RPG.Direction;
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

            var scene = RPG.Game.current_scene;

            if (scene instanceof SceneMap) {
                var events = scene.events;
                var Direction = RPG.Direction;
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
            }

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

                RPG.System.step(passed);
                RPG.Game.current_time += passed;
                var scene = RPG.Game.current_scene;

                if (scene instanceof SceneMap) {
                    RPG.stepPlayer();
                    RPG.stepEvents();
                    RPG.Screen.stepFocus();
                    RPG.Screen.refreshBG(scene);

                    var clear_areas = RPG.prepareClearAreas();
                    var graphics = RPG.prepareDrawGraphics();

                    RPG.Screen.clearAreas(clear_areas);
                    RPG.Screen.drawGraphics(graphics);
                }

                RPG.Screen.stepFade();
                RPG.last_loop = current_time;
            }
        },
        prepareClearAreas: function () {
            var current_player = RPG.Game.current_player;
            var current_scene = RPG.Game.current_scene;
            var self = this;
            var bounds = current_player.bounds;
            var graphic = current_player.graphic;
            var event;
            var g_sets = [];

            g_sets.push({
                x: bounds.lx,
                y: bounds.ly,
                width: graphic.width,
                height: graphic.height,
                layer: current_player.layer
            });

            var events = current_scene.events;
            var size = events.length;
            for (i = 0; i < size; i++) {
                event = events[i];
                if (event.current_page !== null) {
                    bounds = event.bounds;
                    graphic = event.graphic;
                    g_sets.push({
                        x: bounds.lx,
                        y: bounds.ly,
                        width: graphic.width,
                        height: graphic.height,
                        layer: event.layer
                    });
                }
            }
            return g_sets;
        },
        prepareDrawGraphics: function () {
            var current_scene = RPG.Game.current_scene;
            var current_player = RPG.Game.current_player;
            var events = current_scene.events;
            var self = this;
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
                        x: bounds.x,
                        y: bounds.y,
                        layer: event.layer,
                        graphic: graphic
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
                    x: x,
                    y: y,
                    layer: current_player.layer,
                    graphic: graphic
                });
                bounds.lx = x;
                bounds.ly = y;
                current_player._refreshed = true;
            }

            return graphic_sets;
        }
    };

    w.RPG = RPG;
})(window);