(function(root){
    if(CE == undefined){
       throw "Screen requires Canvas Engine"
    }

    if(root.Animation == undefined){
        throw "Screen requires Animation"
    }

    var Animation = root.Animation;

    root.Screen = {
        x: 0,
        y: 0,
        width: 600,
        height: 600,
        BGRefreshed: false,
        fps: 60,
        focused_event: null,//Evento que está sendo focado
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
        },
        /*
         _focusOnEvent(Character character):void
         Focaliza a câmera em um character específico
         */
        focusOnEvent: function (event) {
            var self = this;
            if (self.focused_event !== null) {
                self.focused_event.camera_focus = false;
            }
            event.camera_focus = true;
            self.focused_event = event;
        },
        /*
         stepFocus():void
         executa o passo que focaliza em um evento
         */
        stepFocus: function () {
            var self = this;
            if (self.focused_event != null) {
                var event = self.focused_event;
                var m = root.Game.current_scene;

                var screen_width = self.width;
                var screen_height = self.height;

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

                self.setPosition(screen_x, screen_y);
            }
        }
    };
})(RPG);