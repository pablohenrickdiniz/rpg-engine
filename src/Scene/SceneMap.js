(function (root) {
    if (root.Scene == undefined) {
        throw "SceneMap requires Scene"
    }

    if(root.System == undefined){
        throw "SceneMap requires System"
    }

    if(root.System.Video == undefined){
        throw "SceneMap requires System.Video"
    }


    var Scene = root.Scene,
        Video = root.System.Video;
    var SceneMap = function () {
        var self = this;
        Scene.call(self, arguments);
        self.focused_event = null;//Evento que está sendo focado
        self.BGRefreshed = false;
    };

    SceneMap.prototype = Object.create(Scene.prototype);
    SceneMap.constructor = SceneMap;

    SceneMap.prototype.refreshBG = function () {
        var self = this;
        if (!self.BGRefreshed) {
            self.clearBGLayers();
            self.drawMapArea(self, self.x, self.y, self.width, self.height);
            self.BGRefreshed = true;
        }
    };

    /*
     clearEvents():void
     Limpa todos os eventos do mapa
     rever localização
     */
    SceneMap.prototype.clearAreas = function (areas) {
        var self = this;
        for (var i = 0; i < areas.length; i++) {
            var g_set = areas[i];
            self.clearArea(g_set.x, g_set.y, g_set.width, g_set.height, g_set.layer);
        }
    };

    SceneMap.prototype.drawGraphics = function (graphics) {
        var self = this;
        for (var i = 0; i < graphics.length; i++) {
            var g_set = graphics[i];
            self.drawGraphic(g_set.graphic, g_set.x, g_set.y, g_set.layer);
        }
    };

    SceneMap.prototype.drawMapArea = function (map, sx, sy, width, height) {
        var interval = map.getAreaInterval({x: sx, y: sy, width: width, height: height});
        for (var i = interval.si; i <= interval.ei; i++) {
            for (var j = interval.sj; j <= interval.ej; j++) {
                if (map.tiles[i] !== undefined && map.tiles[i][j] !== undefined) {
                    map.tiles[i][j].forEach(function (tile, index) {
                        var layer = Video.getLayer(index);
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
    };

    SceneMap.prototype.prepareGraphicsToClear = function () {
        var player = RPG.Main.player;
        var map = RPG.Main.map;
        var bounds = player.bounds;
        var graphic = player.graphic;
        var event;
        var g_sets = [];
        var i;

        g_sets.push({
            x: bounds.lx,
            y: bounds.ly,
            width: graphic.width,
            height: graphic.height,
            layer: player.layer
        });

        var events = map.events;
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
    };

    SceneMap.prototype.prepareGraphicsToDraw = function () {
        var player = RPG.Main.player;
        var events = RPG.Main.map.events;
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

        var frame = player.getCurrentFrame();

        if (frame !== undefined) {
            graphic = frame.getGraphic();
            bounds = player.bounds;
            var x = bounds.x - RPG.Video.x;
            var y = bounds.y - RPG.Video.y;
            graphic_sets.push({
                x: x,
                y: y,
                layer: player.layer,
                graphic: graphic
            });
            bounds.lx = x;
            bounds.ly = y;
            player._refreshed = true;
        }

        return graphic_sets;
    };


    /*
     _focusOnEvent(Character character):void
     Focaliza a câmera em um character específico
     */
    SceneMap.prototype.focusOnEvent = function (event) {
        var self = this;
        if (self.focused_event !== null) {
            self.focused_event.camera_focus = false;
        }
        event.camera_focus = true;
        self.focused_event = event;
    };
    /*
     stepFocus():void
     executa o passo que focaliza em um evento
     */
    SceneMap.prototype.stepFocus = function () {
        var self = this;
        if (self.focused_event != null) {
            var event = self.focused_event;
            var m = root.Main.map;

            var screen_width =  Video.width;
            var screen_height = Video.height;

            var screen_x = event.bounds.x - (screen_width / 2) + (event.graphic.width / 2);
            var screen_y = event.bounds.y - (screen_height / 2) + (event.graphic.width / 2);
            var max_screen_x = m.getWidth() - screen_width;
            var max_screen_y = m.getWidth() - screen_height;

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

            Video.setX(screen_x);
            Video.setY(screen_y);
        }
    };

    SceneMap.prototype.step = function () {
        var Main = root.Main;
        var self = this;
        Main.player.step();
        Main.map.stepEvents();
        self.stepFocus();
        self.refreshBG();
        var clear_areas = self.prepareGraphicsToClear();
        var graphics = self.prepareGraphicsToDraw();
        self.clearAreas(clear_areas);
        self.drawGraphics(graphics);
        self.stepAnimations();
    };

    root.SceneMap = SceneMap;
})(RPG);
