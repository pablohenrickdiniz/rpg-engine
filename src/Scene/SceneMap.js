(function (root) {
    if (root.Scene == undefined) {
        throw "SceneMap requires Scene"
    }

    if (root.Viewport == undefined) {
        throw "SceneMap requires Viewport"
    }

    var Scene = root.Scene,
        Viewport = root.Viewport,
        Main = root.Main,
        Consts = root.Consts;


    var SceneMap = function () {
        var self = this;
        Scene.call(self, arguments);
        self.focused_character = null;//Character/Evento/Player que está sendo focado
        self.bg_refreshed = false;
        self.player_refreshed = false;
        self.character_steps = [];
    };

    SceneMap.prototype = Object.create(Scene.prototype);
    SceneMap.prototype.constructor = SceneMap;

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

    SceneMap.prototype.step = function () {
        Scene.prototype.step.apply(this);
        var self = this;
        if (Main.player != null) {
            step_player.apply(this);
        }

        if (Main.map != null) {
            step_events();
            step_focus.apply(self);
            refresh_BG.apply(self);
            clear_graphics();
            draw_graphics.apply(self);
        }
    };


    //Private Methods

    /*
     getAreaInterval(Object options):Object
     Obtém o intervalo si,sj,ei,ei de uma área dentro do mapa
     */
    var get_area_interval = function (options) {
        var x = options.x || 0;
        var y = options.y || 0;
        var width = options.width || 0;
        var height = options.height || 0;
        var tileWidth = options.tileWidth || 32;
        var tileHeight = options.tileHeight || 32;

        var si = parseInt(Math.floor(y / tileHeight));
        var sj = parseInt(Math.floor(x / tileWidth));
        var ei = parseInt(Math.floor((y + height) / tileHeight));
        var ej = parseInt(Math.floor((x + width) / tileWidth));
        return {si: si, sj: sj, ei: ei, ej: ej};
    };

    var refresh_map = function () {
        var sx = Viewport.x;
        var sy = Viewport.y;
        var width = Viewport.width;
        var height = Viewport.height;
        var map = root.Main.map;

        var interval = get_area_interval({x: sx, y: sy, width: width, height: height});
        for (var i = interval.si; i <= interval.ei; i++) {
            for (var j = interval.sj; j <= interval.ej; j++) {
                if (map.tile_map[i] !== undefined && map.tile_map[i][j] !== undefined) {
                    map.tile_map[i][j].forEach(function (tile, index) {
                        var layer = Viewport.getLayer(index);
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

    var refresh_BG = function(){
        var self = this;
        if (!self.bg_refreshed) {
            Viewport.clear('BG1');
            Viewport.clear('BG2');
            Viewport.clear('BG3');
            refresh_map();
            self.bg_refreshed = true;
        }
    };

    var clear_graphics = function () {
        var player = root.Main.player;
        var map = root.Main.map;
        var bounds = player.bounds;
        var graphic = player.graphic;
        var event;
        var i;

        Viewport.clearArea(bounds.lx, bounds.ly, graphic.width, graphic.height, player.layer);

        var events = map.events;
        var size = events.length;
        for (i = 0; i < size; i++) {
            event = events[i];
            bounds = event.bounds;
            graphic = event.graphic;
            Viewport.clearArea(bounds.lx, bounds.ly, graphic.width, graphic.height, event.layer);
        }
    };

    var draw_graphics = function(){
        var player = root.Main.player;
        var events = root.Main.map.events;
        var size = events.length;
        var bounds;
        var graphic;
        var i;

        for (i = 0; i < size; i++) {
            var event = events[i];
            if (event.page !== null) {
                bounds = event.bounds;
                graphic = event.graphic;
                Viewport.drawImage(graphic.image,{
                    dx:bounds.x,
                    dy:bounds.y,
                    dWidth:graphic.dWidth,
                    dHeight:graphic.dHeight,
                    sx:graphic.sx,
                    sy:graphic.sy,
                    sWidth:graphic.sWidth,
                    sHeight:graphic.sHeight,
                    layer:event.layer
                });
            }
        }

        var frame = player.getCurrentFrame();

        if (frame !== undefined) {
            graphic = frame.getGraphic();
            bounds = player.bounds;
            var x = bounds.x - root.Viewport.x;
            var y = bounds.y - root.Viewport.y;
            bounds.lx = x;
            bounds.ly = y;

            Viewport.drawImage(graphic.image,{
                dx:x,
                dy:y,
                dWidth:graphic.dWidth,
                dHeight:graphic.dHeight,
                sx:graphic.sx,
                sy:graphic.sy,
                sWidth:graphic.sWidth,
                sHeight:graphic.sHeight,
                layer:player.layer
            });
            var self = this;
            self.player_refreshed = true;
        }
    };

    /*
     stepFocus():void
     executa o passo que focaliza em um evento
     */
    var step_focus = function(){
        var self = this;
        if (self.focused_event != null) {
            var event = self.focused_event;
            var m = root.Main.map;

            var viewport_width = Viewport.width;
            var viewport_height = Viewport.height;

            var viewport_x = event.bounds.x - (viewport_width / 2) + (event.graphic.width / 2);
            var viewport_y = event.bounds.y - (viewport_height / 2) + (event.graphic.width / 2);
            var max_screen_x = m.getWidth() - viewport_width;
            var max_screen_y = m.getWidth() - viewport_height;

            if (viewport_x < 0) {
                viewport_x = 0;
            }
            else if (viewport_x > max_screen_x) {
                viewport_x = max_screen_x;
            }

            if (viewport_y < 0) {
                viewport_y = 0;
            }
            else if (viewport_y > max_screen_y) {
                viewport_y = max_screen_y;
            }

            Viewport.setX(viewport_x);
            Viewport.setY(viewport_y);
        }
    };

    var step_events = function () {
        var events = Main.map.events;
        var length = events.length;
        var i;
        for(i =0; i < length;i++) {
            events[i].update();
        }
    };


    /*action_events():void
     * Tratamento de eventos relacionados às ações do jogador
     */
    var action_events =  function () {
        var player = Main.player;
        var tree = Main.map.getTree();

        var bounds_tmp = {
            x: player.bounds.x,
            y: player.bounds.y,
            width: player.bounds.width,
            height: player.bounds.height,
            groups: ['ACTION_BUTTON']
        };

        var d = player.direction;

        switch (d) {
            case Consts.UP:
                bounds_tmp.y -= bounds_tmp.height;
                bounds_tmp.height *= 2;
                break;
            case Consts.RIGHT:
                bounds_tmp.width *= 2;
                break;
            case Consts.DOWN:
                bounds_tmp.height *= 2;
                break;
            case Consts.LEFT:
                bounds_tmp.x -= bounds_tmp.width;
                bounds_tmp.width *= 2;
                break;
        }

        var collisions = tree.retrieve(bounds_tmp, 'ACTION_BUTTON');
        var keyboard = root.System.Controls.Keyboard;


        collisions.forEach(function (colision) {
            if (colision.ref !== undefined) {
                var event = colision.ref;
                if (event.page !== undefined && event.page !== null) {
                    var page = event.page;
                    if (page.trigger === Consts.TRIGGER_PLAYER_TOUCH) {
                        page.script();
                    }
                    else if (page.trigger === Consts.TRIGGER_ACTION_BUTTON && keyboard.ENTER) {
                        page.script();
                    }
                }
            }
        });
    };

    root.SceneMap = new SceneMap();
})(RPG);
