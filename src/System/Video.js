(function (root) {
    if (CE == undefined) {
        throw "Video requires Canvas Engine"
    }

    if (root.Animation == undefined) {
        throw "Video requires Animation"
    }

    if (root.System == undefined) {
        throw "Video requires System"
    }

    var System = root.System;
    var Animation = root.Animation;

    var fade_screen_effect = function (time, oncomplete, direction) {
        var self = this;
        time = parseInt(time);
        time = isNaN(time) || time < 0 ? 2000 : time;
        var type = '';
        if (direction == 'negative') {
            type = 'fade_out_screen';
        }
        else {
            direction = 'positive';
            type = 'fade_in_screen';
        }

        var animation = new Animation(self.fps, self.fps * (time / 1000));
        animation.execute(true, direction);
        var animation_set = {
            type: type,
            time: time,
            oncomplete: oncomplete,
            animation: animation
        };

        self.animation_queue.push(animation_set);
    };

    var fade_image_effect = function (image, options, oncomplete, direction) {
        options = options || {};
        var sx = options.sx || 0;
        var sy = options.sy || 0;
        var sWidth = options.sWidth || image.width;
        var sHeight = options.sHeight || image.height;
        var dx = options.dx || 0;
        var dy = options.dy || 0;
        var dWidth = options.dWidth || image.width;
        var dHeight = options.dHeight || image.height;
        var time = options.time || 1000;
        var layer = options.layer || 'EF1';
        var vAlign = options.vAlign || null;
        var hAlign = options.hAlign || null;

        var self = this;

        if (vAlign != null) {
            switch (vAlign) {
                case 'top':
                    dy = 0;
                    break;
                case 'center':
                    dy = (self.layers[layer].height / 2) - (dHeight / 2);
                    break;
                case 'bottom':
                    dy = self.layers[layer].height - dHeight;
                    break;
            }
        }

        if (hAlign != null) {
            switch (hAlign) {
                case 'left':
                    dx = 0;
                    break;
                case 'center':
                    dx = (self.layers[layer].width / 2) - (dWidth / 2);
                    break;
                case 'right':
                    dx = self.layers[layer].width - dWidth;
                    break;
            }
        }

        var animation = new Animation(self.fps, self.fps * (time / 1000));
        var type = '';
        if (direction == 'positive') {
            type = 'fade_in_image'
        }
        else {
            direction = 'negative';
            type = 'fade_out_image'
        }

        animation.execute(true, direction);
        var animation_set = {
            type: type,
            time: time,
            image_data: {
                sx: sx,
                sy: sy,
                sWidth: sWidth,
                sHeight: sHeight,
                dx: dx,
                dy: dy,
                dWidth: dWidth,
                dHeight: dHeight,
                image: image
            },
            layer: layer,
            animation: animation,
            oncomplete: oncomplete
        };
        self.animation_queue.push(animation_set);
        return animation_set;
    };


    System.Video = {
        x: 0,
        y: 0,
        width: 600,
        height: 600,
        BGRefreshed: false,
        fps: 60,
        focused_event: null,//Evento que está sendo focado
        animation_queue: [],
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

            var engine = CE.create(container, {
                width: self.width,
                height: self.height,
                style: {
                    backgroundColor: 'black'
                }
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
        drawGraphic: function (image, options) {
            var self = this;
            var layer_name = options.layer || 'EF1';
            var layer = self.layers[layer_name];
            var context = layer.getContext();
            var sx = options.sx || 0;
            var sy = options.sy || 0;
            var sWidth = options.sWidth || image.width;
            var sHeight = options.sHeight || image.height;
            var dx = options.dx || 0;
            var dy = options.dy || 0;
            var dWidth = options.dWidth || sWidth;
            var dHeight = options.dHeight || sHeight;
            var vAlign = options.vAlign || null;
            var hAlign = options.hAlign || null;

            if (vAlign != null) {
                switch (vAlign) {
                    case 'top':
                        dy = 0;
                        break;
                    case 'center':
                        dy = (layer.height / 2) - (dHeight / 2);
                        break;
                    case 'bottom':
                        dy = layer.height - dHeight;
                        break;
                }
            }

            if (hAlign != null) {
                switch (hAlign) {
                    case 'left':
                        dx = 0;
                        break;
                    case 'center':
                        dx = (layer.width / 2) - (dWidth / 2);
                        break;
                    case 'right':
                        dx = layer.width - dWidth;
                        break;
                }
            }

            context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

        },
        /*
         clearGraphic(int layer index, Graphic graphic):void
         Limpa uma região do canvas onde é desenhado um gráfico
         */
        clearArea: function (x, y, width, height, layer_name) {
            var self = this;
            var layer = self.layers[layer_name];
            if (layer !== null) {
                layer.clear(x, y, width, height);
            }
        },
        clear:function(layer_name){
            var self = this;
            var layer = self.layers[layer_name];
            if (layer !== null) {
                layer.clear();
            }
        },
        /*
         fadeIn(int time, function callback)>void
         */
        fadeIn: function (time, oncomplete) {
            fade_screen_effect.apply(this, [time, oncomplete, 'negative']);
        },
        /*
         fadeOut(int time, function callback):void
         */
        fadeOut: function (time, oncomplete) {
            fade_screen_effect.apply(this, [time, oncomplete, 'positive']);
        },
        fadeInImage: function (image, options, oncomplete) {
            fade_image_effect.apply(this, [image, options, oncomplete, 'positive']);
        },
        fadeOutImage: function (image, options, oncomplete) {
            fade_image_effect.apply(this, [image, options, oncomplete, 'negative']);
        },
        stepAnimations: function () {
            var self = this;
            var length = self.animation_queue.length;
            var i;
            for (i = 0; i < length; i++) {
                var animation_set = self.animation_queue[i];
                var animation = null;
                var running = false;
                var index = 0;
                var opacity = null;
                var ctx = null;

                switch (animation_set.type) {
                    case 'fade_in_screen':
                    case 'fade_out_screen':
                        animation = animation_set.animation;
                        running = animation.isRunning();
                        index = animation.getIndexFrame();
                        if (!running) {
                            if (animation.direction == 'negative') {
                                opacity = 0;
                            }
                            else {
                                opacity = 1;
                            }
                        }
                        else {
                            opacity = (index / (animation.frame_count - 1));
                        }

                        ctx = self.layers.EF1.getContext();
                        ctx.clearRect(0, 0, self.width, self.height);

                        if (opacity > 0) {
                            ctx.fillStyle = 'rgba(0,0,0,' + opacity + ')';
                            ctx.fillRect(0, 0, self.width, self.height);
                        }

                        if (!running) {
                            self.animation_queue.splice(i, 1);
                            i--;
                            length--;
                            if (animation_set.oncomplete) {
                                animation_set.oncomplete();
                            }
                        }
                        break;
                    case 'fade_in_image':
                    case 'fade_out_image':
                        animation = animation_set.animation;

                        running = animation.isRunning();
                        index = animation.getIndexFrame();
                        if (!running) {
                            if (animation.direction == 'negative') {
                                opacity = 0;
                            }
                            else {
                                opacity = 1;
                            }
                        }
                        else {
                            opacity = (index / (animation.frame_count - 1));
                        }

                        var layer = animation_set.layer;
                        var image_data = animation_set.image_data;

                        ctx = self.layers[layer].getContext();
                        ctx.clearRect(image_data.dx, image_data.dy, image_data.dWidth, image_data.dHeight);

                        if (opacity > 0) {
                            ctx.globalAlpha = opacity;
                            ctx.drawImage(image_data.image, image_data.sx, image_data.sy, image_data.sWidth, image_data.sHeight, image_data.dx, image_data.dy, image_data.dWidth, image_data.dHeight);
                            ctx.globalAlpha = 1;
                        }


                        if (!running) {
                            self.animation_queue.splice(i, 1);
                            i--;
                            length--;

                            if (animation_set.oncomplete) {
                                animation_set.oncomplete();
                            }
                        }
                        break;
                    default:
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
            for (var i = 0; i < areas.length; i++) {
                var g_set = areas[i];
                self.clearArea(g_set.x, g_set.y, g_set.width, g_set.height, g_set.layer);
            }
        },
        drawGraphics: function (graphics) {
            var self = this;
            for (var i = 0; i < graphics.length; i++) {
                var g_set = graphics[i];
                self.drawGraphic(g_set.graphic, g_set.x, g_set.y, g_set.layer);
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