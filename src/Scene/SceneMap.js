(function (root) {
    if (root.Scene == undefined) {
        throw "SceneMap requires Scene"
    }

    if (root.Canvas == undefined) {
        throw "SceneMap requires Canvas"
    }

    if(root.Graphics == undefined){
        throw "SceneMap requires Graphics"
    }

    var Scene = root.Scene,
        Canvas = root.Canvas,
        Consts = root.Consts,
        Main = root.Main,
        Graphics = root.Graphics;

    /**
     *
     * @param options
     * @constructor
     */
    var SceneMap = function (options) {
        var self = this;
        Scene.call(self, options);
        self.focused_character = null;
        self.bg_refreshed = false;
        self.character_steps = [];
        self.map_data = {
            map: null,
            spriteset_map: null
        };
        self.json_data = options.map || {};
    };

    SceneMap.prototype = Object.create(Scene.prototype);
    SceneMap.prototype.constructor = SceneMap;

    /**
     *
     * @param character
     */
    SceneMap.prototype.focusOnCharacter = function (character) {
        var self = this;
        if (self.focused_character !== null) {
            self.focused_character.camera_focus = false;
        }
        character.camera_focus = true;
        self.focused_character = character;
    };

    SceneMap.prototype.step = function () {
        Scene.prototype.step.apply(this);
        var self = this;
        step_events(self);
        step_focus(self);
        refresh_BG(self);
        clear_graphics(self);
        draw_graphics(self);
    };


    //Private Methods

    /**
     *
     * @param options
     * @returns {{si: Number, sj: Number, ei: Number, ej: Number}}
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

    var refresh_spriteset_map = function (self) {
        var sx = Canvas.x;
        var sy = Canvas.y;
        var width = Canvas.width;
        var height = Canvas.height;
        var spriteset_map = self.map_data.spriteset_map;

        var interval = get_area_interval({x: sx, y: sy, width: width, height: height});
        for (var i = interval.si; i <= interval.ei; i++) {
            for (var j = interval.sj; j <= interval.ej; j++) {
                if (spriteset_map.sprites[i] !== undefined && spriteset_map.sprites[i][j] !== undefined) {
                    for(var k in  spriteset_map.sprites[i][j]){
                        var tile = spriteset_map.sprites[i][j][k];
                        var layer = Canvas.getLayer(Consts.BACKGROUND_LAYER,k);
                        if (layer != null) {
                            var context = layer.getContext();
                            var dx = j * tile.width - sx;
                            var dy = i * tile.height - sy;
                            dx = parseInt(dx);
                            dy = parseInt(dy);
                            var image = Graphics.get('tilesets',tile.image);
                            context.drawImage(image, tile.sx, tile.sy, tile.width, tile.height, dx, dy, tile.width, tile.height);
                        }
                    }
                }
            }
        }
    };

    /**
     *
     * @param self
     */
    var refresh_BG = function (self) {
     //   if (!self.bg_refreshed) {
            Canvas.clear(Consts.BACKGROUND_LAYER);
            refresh_spriteset_map(self);
            self.bg_refreshed = true;
       // }
    };

    var clear_graphics = function (self) {
        var player = Main.Player;
        var map = self.map_data.map;
        var bounds = player.bounds;
        var graphic = player.graphic;
        var event;
        var i;

        Canvas.clear(Consts.EVENT_LAYER,player.layer,bounds.lx, bounds.ly, graphic.width, graphic.height);

        var events = map.events;
        var size = events.length;
        for (i = 0; i < size; i++) {
            event = events[i];
            bounds = event.bounds;
            graphic = event.graphic;
            Canvas.clear(Consts.EVENT_LAYER,event.layer,bounds.lx, bounds.ly, graphic.width, graphic.height);
        }
    };

    /**
     *
     * @param self
     */
    var draw_graphics = function (self) {
        var player = Main.Player;
        var events = self.map_data.map.events;
        var size = events.length;
        var bounds;
        var graphic;
        var i;

        for (i = 0; i < size; i++) {
            var event = events[i];
            if (event.page !== null) {
                bounds = event.bounds;
                graphic = event.graphic;
                Canvas.drawImage(graphic.image, {
                    dx: bounds.x,
                    dy: bounds.y,
                    dWidth: graphic.dWidth,
                    dHeight: graphic.dHeight,
                    sx: graphic.sx,
                    sy: graphic.sy,
                    sWidth: graphic.sWidth,
                    sHeight: graphic.sHeight,
                    layer: event.layer
                });
            }
        }

        var frame = player.getCurrentFrame();
        if (frame !== null) {
            bounds = player.bounds;
            var x = bounds.x - root.Canvas.x;
            var y = bounds.y - root.Canvas.y;

            bounds.lx = x;
            bounds.ly = y;

            var image = Graphics.get('characters',frame.image);
            Canvas.drawImage(image, {
                dx: x,
                dy: y,
                dWidth: frame.width,
                dHeight: frame.height,
                sx: frame.sx,
                sy: frame.sy,
                sWidth: frame.width,
                sHeight: frame.height,
                layer: player.layer,
                type:Consts.EVENT_LAYER
            });

            self.player_refreshed = true;
        }
    };

    /**
     *
     * @param self
     */
    var step_focus = function (self) {
        if (self.focused_character != null) {
            var event = self.focused_character;
            var m = self.map_data.map;

            var viewport_width = Canvas.width;
            var viewport_height = Canvas.height;

            var viewport_x = event.bounds.x - (viewport_width / 2) + (event.graphic.width / 2);
            var viewport_y = event.bounds.y - (viewport_height / 2) + (event.graphic.width / 2);
            var max_screen_x = m.width - viewport_width;
            var max_screen_y = m.height - viewport_height;

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

            Canvas.x = viewport_x;
            Canvas.y = viewport_y;
        }
    };

    var step_events = function (self) {
        var events = self.map_data.map.events;
        var length = events.length;
        var i;
        Main.Player.update();
        for (i = 0; i < length; i++) {
            events[i].update();
        }
    };

    var action_events = function () {
        var self = this;
        var player = self.player;
        var tree = self.map.getTree();

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

    root.Scene.SceneMap = SceneMap;
})(RPG);
