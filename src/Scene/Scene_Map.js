(function (root) {
    if (root.Scene == undefined) {
        throw "SceneMap requires Scene"
    }

    if (root.Canvas == undefined) {
        throw "SceneMap requires Canvas"
    }

    if (root.Graphics == undefined) {
        throw "SceneMap requires Graphics"
    }

    if (root.Game_Item == undefined) {
        throw "SceneMap requires Game_Item"
    }

    if (root.Game_Event == undefined) {
        throw "SceneMap requires Game_Event"
    }

    var Scene = root.Scene,
        Canvas = root.Canvas,
        Consts = root.Consts,
        Main = root.Main,
        Graphics = root.Graphics,
        Game_Event = root.Game_Event,
        Game_Item = root.Game_Item;

    /**
     *
     * @param options
     * @constructor
     */
    var Scene_Map = function (options) {
        var self = this;
        Scene.call(self, options);
        self.focused_character = null;
        self.bg_refreshed = false;
        self.map = null;
        self.action_button = false;
        self.clear_queue = [];
    };

    Scene_Map.prototype = Object.create(Scene.prototype);
    Scene_Map.prototype.constructor = Scene_Map;

    /**
     *
     * @param character
     */
    Scene_Map.prototype.focusOnCharacter = function (character) {
        var self = this;
        if (self.focused_character !== null) {
            self.focused_character.camera_focus = false;
        }
        character.camera_focus = true;
        self.focused_character = character;
    };

    Scene_Map.prototype.step = function () {
        Scene.prototype.step.apply(this);
        var self = this;

        if(self.map != null){
            if(Main.Player){
                action_events(self);
            }
            step_events(self);
            step_focus(self);
            refresh_BG(self);
            clear_graphics(self);
            draw_graphics(self);
        }
    };

    /**
     *
     * @param objects
     * @returns {Array.<T>}
     */
    function sort_objects(objects) {
        return objects.sort(function (a, b) {
            var aby = parseInt(a.y - root.Canvas.y);
            var bby = parseInt(b.y - root.Canvas.y);

            var ah_height = 0;
            var bh_height = 0;
            var a_height = 0;
            var b_height = 0;

            if (a.graphic) {
                a_height = a.graphic.height;
                ah_height = a_height / 2;
            }

            if (b.graphic) {
                b_height = b.graphic.height;
                bh_height = b_height / 2;
            }

            var ya = aby + a.bounds.height / 2 - ah_height;
            var yb = bby + b.bounds.height / 2 - bh_height;

            return ya + a_height > yb + b_height;
        });
    }


    //Private Methods

    /**
     *
     * @param options
     * @returns {{si: Number, sj: Number, ei: Number, ej: Number}}
     */
    function get_area_interval(options) {
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
    }

    /**
     *
     * @param self
     */
    function refresh_spriteset_map(self) {
        var sx = Canvas.x;
        var sy = Canvas.y;
        var width = Canvas.width;
        var height = Canvas.height;
        var spriteset_map = self.map.spriteset_map;
        var tileWidth = spriteset_map.tileWidth;
        var tileHeight = spriteset_map.tileHeight;

        var interval = get_area_interval({x: sx, y: sy, width: width, height: height});
        for (var i = interval.si; i <= interval.ei; i++) {
            for (var j = interval.sj; j <= interval.ej; j++) {
                if (spriteset_map.sprites[i] !== undefined && spriteset_map.sprites[i][j] !== undefined) {
                    for (var k in  spriteset_map.sprites[i][j]) {
                        var tile = spriteset_map.sprites[i][j][k];
                        var type = Consts.BACKGROUND_LAYER;
                        if(k > 1){
                           type = Consts.FOREGROUND_LAYER;
                        }
                        var layer = Canvas.getLayer(type, k);
                        if (layer != null) {
                            var context = layer.context;
                            var dx = j * tileWidth - sx;
                            var dy = i * tileHeight - sy;
                            dx = parseInt(dx);
                            dy = parseInt(dy);
                            context.drawImage(tile.image, tile.sx, tile.sy, tile.width, tile.height, dx, dy, tileWidth, tileHeight);
                        }
                    }
                }
            }
        }
    }

    /**
     *
     * @param self
     */
    function refresh_BG(self) {
        if (!self.bg_refreshed) {
            Canvas.clear(Consts.BACKGROUND_LAYER);
            Canvas.clear(Consts.FOREGROUND_LAYER);
            refresh_spriteset_map(self);
            self.bg_refreshed = true;
        }
    }


    /**
     *
     * @param self
     */
    function clear_graphics(self) {
        while(self.clear_queue.length > 0){
            var clear = self.clear_queue.pop();
            Canvas.clear(clear.layer_type, clear.layer, clear.x, clear.y, clear.width, clear.height);
        }
    }

    /**
     *
     * @param self
     */
    function draw_graphics(self) {
        var objects = self.map.objects;
        var bounds;
        var i;
        var image;
        var frame;
        var x;
        var y;

        if(Main.Player){
            objects = objects.concat(Main.Player);
        }
        objects = sort_objects(objects);
        var size = objects.length;
        for (i = 0; i < size; i++) {
            var object = objects[i];
            frame = object.getCurrentFrame();
            if (frame != null) {
                bounds = object.bounds;
                image = frame.image;
                var bx = parseInt(bounds.x - root.Canvas.x);
                var by = parseInt(bounds.y - root.Canvas.y);
                var h_width = frame.width / 2;
             //   var h_height = frame.height / 2;

                x = bx + bounds.width / 2 - h_width;
                y = by + - bounds.height;

                Canvas.drawImage(image, {
                    dx: x,
                    dy: y,
                    dWidth: frame.width,
                    dHeight: frame.height,
                    sx: frame.sx,
                    sy: frame.sy,
                    sWidth: frame.width,
                    sHeight: frame.height,
                    layer: object.layer,
                    type: Consts.EVENT_LAYER
                });

                self.clear_queue.push({
                    layer_type:Consts.EVENT_LAYER,
                    layer:object.layer,
                    x:Math.min(x, bx),
                    y:Math.min(y, by),
                    width:Math.max(frame.width, 32),
                    height:Math.max(frame.height, 32)
                });

                if (RPG.debug) {
                    var layer = Canvas.getLayer(Consts.EVENT_LAYER, object.layer);
                    layer.rect({
                        x: bx,
                        y: by,
                        width: bounds.width,
                        height: bounds.height,
                        lineWidth: 2
                    });
                }
            }
        }

        //frame = player.getCurrentFrame();
        //if (frame !== null) {
        //    bounds = player.bounds;
        //    x = parseInt(bounds.x - root.Canvas.x);
        //    y = parseInt(bounds.y - root.Canvas.y);
        //    bounds.lx = x;
        //    bounds.ly = y;
        //
        //    image = Graphics.get('characters', frame.image);
        //    Canvas.drawImage(image, {
        //        dx: x,
        //        dy: y,
        //        dWidth: frame.width,
        //        dHeight: frame.height,
        //        sx: frame.sx,
        //        sy: frame.sy,
        //        sWidth: frame.width,
        //        sHeight: frame.height,
        //        layer: player.layer,
        //        type: Consts.EVENT_LAYER
        //    });
        //
        //    self.player_refreshed = true;
        //}
    }

    /**
     *
     * @param self
     */
    function step_focus(self) {
        if (self.focused_character != null) {
            var event = self.focused_character;
            var m = self.map;

            var viewport_width = Math.min(Canvas.width, m.width);
            var viewport_height = Math.min(Canvas.height, m.height);


            var viewport_x = event.bounds.x - (viewport_width / 2) + (event.graphic.tileWidth / 2);
            var viewport_y = event.bounds.y - (viewport_height / 2) + (event.graphic.tileHeight / 2);
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

            if (Canvas.x != viewport_x || Canvas.y != viewport_y) {
                self.bg_refreshed = false;
            }


            Canvas.x = viewport_x;
            Canvas.y = viewport_y;
        }
    }

    /**
     *
     * @param self
     */
    function step_events(self) {
        var events = self.map.objects;
        var length = events.length;
        var i;
        if(Main.Player){
            Main.Player.update();
        }

        for (i = 0; i < length; i++) {
            events[i].update();
        }
    }

    /**
     *
     * @param self
     */
    function action_events(self) {
        var player = Main.Player;
        var map = self.map;
        var tree = map.getTree();

        var bounds_tmp = {
            x: player.bounds.x,
            y: player.bounds.y,
            width: player.bounds.width,
            height: player.bounds.height,
            groups: ['ACTION_BUTTON']
        };

        var d = player.direction;

        switch (d) {
            case Consts.CHARACTER_DIRECTION_UP:
                bounds_tmp.y -= bounds_tmp.height;
                bounds_tmp.height *= 2;
                break;
            case Consts.CHARACTER_DIRECTION_RIGHT:
                bounds_tmp.width *= 2;
                break;
            case Consts.CHARACTER_DIRECTION_DOWN:
                bounds_tmp.height *= 2;
                break;
            case Consts.CHARACTER_DIRECTION_LEFT:
                bounds_tmp.x -= bounds_tmp.width;
                bounds_tmp.width *= 2;
                break;
        }

        var length;
        var collisions;
        var i;
        var collision;
        var obj;

        collisions = tree.retrieve(bounds_tmp, 'ACTION_BUTTON');
        length = collisions.length;
        for (i = 0; i < length; i++) {
            collision = collisions[i];
            if (collision._ref !== undefined) {
                obj = collision._ref;
                if (obj instanceof Game_Event && obj.currentPage) {
                    var page = obj.currentPage;
                    if (typeof page.script == 'function') {
                        if (page.trigger === Consts.TRIGGER_PLAYER_TOUCH || (page.trigger === Consts.TRIGGER_ACTION_BUTTON && self.action_button)) {
                            page.script.apply(obj);
                        }
                    }

                }
            }
        }

        collisions = tree.retrieve(player.bounds, 'ITEM');
        length = collisions.length;
        for (i = 0; i < length; i++) {
            collision = collisions[i];
            if (collision._ref !== undefined) {
                obj = collision._ref;
                if (obj instanceof Game_Item) {
                    if(obj.capture === Consts.TRIGGER_PLAYER_TOUCH || (obj.capture === Consts.TRIGGER_ACTION_BUTTON && self.action_button)){
                        var item = map.remove(obj);
                        player.addItem(obj.id,item.amount);
                    }
                }
            }
        }

        self.action_button = false;
    }

    root.Scene.SceneMap = Scene_Map;
})(RPG);
