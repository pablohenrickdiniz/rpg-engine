'use strict';
(function (root) {
    if (window.QuadTree === undefined) {
        throw "Scane_Map requires QuadTree"
    }

    if (root.Scene === undefined) {
        throw "Scene_Map requires Scene"
    }

    if (root.Canvas === undefined) {
        throw "Scene_Map requires Canvas"
    }

    if (root.Game_Item === undefined) {
        throw "Scene_Map requires Game_Item"
    }

    if (root.Game_Event === undefined) {
        throw "Scene_Map requires Game_Event"
    }

    if(root.Main === undefined){
        throw "Scene_Map requires Main"
    }
    else{
        if (root.Main.Graphics === undefined) {
            throw "Scene_Map requires Graphics"
        }

        if(root.Main.Tilesets === undefined){
            throw "Scene_Map requires Tilesets"
        }
    }

    if(root.Spriteset_Map === undefined){
        throw "Scene_Map requires Spriteset_Map"
    }

    if(root.Game_Object === undefined){
        throw "Scene_Map requires Game_Object"
    }

    let Scene = root.Scene,
        Canvas = root.Canvas,
        Consts = root.Consts,
        Main = root.Main,
        Game_Event = root.Game_Event,
        Game_Item = root.Game_Item,
        Spriteset_Map = root.Spriteset_Map,
        Game_Object = root.Game_Object,
        Tilesets = Main.Tilesets,
        Graphics =  Main.Graphics;

    let clear_queue = [];
    let bg_refreshed = false;
    let focused_object = null;

    /**
     *
     * @param options
     * @constructor
     */
    let Scene_Map = function (options) {
        let self = this;
        Scene.call(self, options);
        initialize(self);
        self.map = options.map || {};
        self.action_button = false;
        self.spriteset = new Spriteset_Map(self.map.spriteset || {});
        self.objs = [];
        self.charas = options.charas || {};
        self.actors = options.actors || {};
        self.faces = options.faces || {};
        self.items = options.items || {};
        self.icons = options.icons || {};
        self.objects = options.objects || [];
    };

    Scene_Map.prototype = Object.create(Scene.prototype);
    Scene_Map.prototype.constructor = Scene_Map;

    /**
     * Adiciona um objeto na cena
     * @param object
     */
    Scene_Map.prototype.add= function(object){
        let self = this;
        self.objs.push(object);
        self.tree.insert(object.body);
    };

    /**
     * Remove um objeto da cena
     * @param object
     */
    Scene_Map.prototype.remove = function(object){
        let self = this;
        let index = self.objs.indexOf(object);
        if(index !=  -1){
            self.objs.splice(index,1);
        }
        self.tree.remove(object.body);
    };

    /**
     * Mantêm a câmera focada em um obeto
     * @param object
     */
    Scene_Map.prototype.focus = function (object) {
        if(object instanceof Game_Object){
            let self = this;
            if (focused_object !=  null) {
                focused_object.focused = false;
            }
            object.focused = true;
            focused_object = object;
        }
    };

    /**
     * Executa passo de tempo da cena
     */
    Scene_Map.prototype.step = function () {
        Scene.prototype.step.apply(this);
        let self = this;

        if(Main.currentPlayer){
            action_events(self);
        }
        step_events(self);
        step_focus(self);
        refresh_bg(self);
        clear_graphics(self);
        draw_graphics(self);
        if(root.debug){
            drawquadtree(self.tree,true);
            clear_queue.push({
                layer_type:Consts.UI_LAYER,
                layer:0,
                x:0,
                y:0,
                width:Canvas.width,
                height:Canvas.height
            });
        }
    };


    //Private Methods

    /**
     *
     * @param options
     * @returns {{si: Number, sj: Number, ei: Number, ej: Number}}
     * Obtém a região do mapa de sprites a ser redenrizada
     */
    function get_area_interval(options) {
        let x = options.x || 0;
        let y = options.y || 0;
        let width = options.width || 0;
        let height = options.height || 0;
        let tileWidth = options.tileWidth || 32;
        let tileHeight = options.tileHeight || 32;
        let si = Math.floor(y / tileHeight);
        let sj = Math.floor(x / tileWidth);
        let ei = Math.floor((y + height) / tileHeight);
        let ej = Math.floor((x + width) / tileWidth);
        return {si: si, sj: sj, ei: ei, ej: ej,width:width,height:height};
    }

    /**
     *
     * @param options
     * @returns {Array}
     */
    function get_area_intervals(options){
        let x = options.x || 0;
        let y = options.y || 0;
        let width = options.width || 0;
        let height = options.height || 0;
        let tileWidth = options.tileWidth || 32;
        let tileHeight = options.tileHeight || 32;
        let mapWidth = options.mapWidth || 32;
        let mapHeight = options.mapHeight || 32;
        let intervals = [];
        let i;
        let j;
        let cols = Math.ceil(width/mapWidth);
        let rows = Math.ceil(height/mapHeight);

        for(i = 0; i < rows;i++){
            for(j = 0;j < cols;j++){
                let mw = j ==0?mapWidth-x:j ==cols-1?width-x:mapWidth;
                let mh = i ==0?mapHeight-y:i ==rows-1?height-y:mapHeight;

                if(intervals[i] ==undefined){
                    intervals[i] = [];
                }
                intervals[i][j] = get_area_interval({
                    x:x,
                    y:y,
                    width:mw,
                    height:mh,
                    tileWidth:tileWidth,
                    tileHeight:tileHeight
                });
            }
        }

        return intervals;
    }


    function draw_spriteset_interval(self,interval,x,y){
        let spriteset = self.spriteset;
        let tileWidth = spriteset.tileWidth;
        let tileHeight = spriteset.tileHeight;

        for (var i = interval.si; i <= interval.ei; i++) {
            for (var j = interval.sj; j <= interval.ej; j++) {
                if (spriteset.data[i] !=  undefined && spriteset.data[i][j] !=  undefined) {
                    for (var k in  spriteset.data[i][j]) {
                        let tile_data = spriteset.data[i][j][k];
                        let tileset = Tilesets.get(tile_data[0]);
                        let tile = tileset.get(tile_data[1],tile_data[2]);

                        if(tile != null){
                            let type = Consts.BACKGROUND_LAYER;
                            if(k > 1){
                                type = Consts.FOREGROUND_LAYER;
                            }
                            let layer = Canvas.getLayer(type, k);
                            if (layer != null) {
                                let context = layer.context;
                                let dx =  x + j * tileWidth;
                                let dy =  y + i * tileHeight;
                                dx = parseInt(dx);
                                dy = parseInt(dy);
                                context.drawImage(tile.image, tile.sx, tile.sy, tile.sWidth, tile.sHeight, dx, dy, tileWidth, tileHeight);
                                context.strokeStyle = 'red';
                                context.strokeText(i+','+j,dx,dy+10);
                                context.strokeRect(dx,dy,tileWidth,tileHeight);
                            }
                        }
                    }
                }
            }
        }
    }


    /**
     *
     * @param self
     * Renderiza o mapa de sprites
     */
    function refresh_spriteset_map(self) {
        let x = Canvas.x;
        let y = Canvas.y;

        let interval = get_area_interval({
            x:x,
            y:y,
            width:Math.min(self.spriteset.width*self.spriteset.tileWidth,Canvas.width),
            height:Math.min(self.spriteset.height*self.spriteset.tileHeight,Canvas.height)
        });

        draw_spriteset_interval(self,interval,-Canvas.x,-Canvas.y);
    }

    /**
     *
     * @param self
     * Renderiza o ambiente, chão, casas,etc
     */
    function refresh_bg(self) {
        //if (!bg_refreshed) {
            Canvas.clear(Consts.BACKGROUND_LAYER);
            Canvas.clear(Consts.FOREGROUND_LAYER);
            refresh_spriteset_map(self);
        //    bg_refreshed = true;
        //}
    }


    /**
     *
     * @param self
     * Apaga o gráfico dos objetos
     */
    function clear_graphics(self) {
        while(clear_queue.length > 0){
            let clear = clear_queue.pop();
            Canvas.clear(clear.layer_type, clear.layer, clear.x, clear.y, clear.width, clear.height);
        }
    }

    /**
     *
     * @param self
     * Renderiza os objetos no mapa
     */
    function draw_graphics(self) {
        let i;
        let sx = root.Canvas.x;
        let sy = root.Canvas.y;
        let cw = root.Canvas.width;
        let ch = root.Canvas.height;
        let object;
        let collision;

        let collisions = self.tree.retrieve({
            x:sx,
            y:sy,
            width:cw,
            height:ch
        });

        collisions = collisions.sort(function (a, b) {
            return a.yb-b.yb;
        });

        let size = collisions.length;
        let bounds;
        let bx;
        let by;
        let mw = self.map.width;
        let mh = self.map.height;
        let xw = sx+cw;
        let yh = sy+ch;
        let x;
        let y;

        for (i = 0; i < size; i++) {
            collision = collisions[i];
            object = collision.object;
            bounds = object.body;
            x = collision.xb;
            y = collision.yb;

            if(y > yh){
                y -= mh;
            }
            else if(y+body.height < sy){
                y += mh;
            }

            if(x > xw){
                x -= mw;
            }
            else if(x+body.width < sx){
                x += mw;
            }

            x-=sx;
            y-=sy;

            draw_object(object,x,y);
        }

        if(Main.currentPlayer){
            object = Main.currentPlayer;
            bounds = object.body;
            x = body.x;
            y = body.y;

            if(y > yh){
                y -= mh;
            }
            else if(y+body.height < sy){
                y += mh;
            }

            if(x > xw){
                x -= mw;
            }
            else if(x+body.width < sx){
                x += mw;
            }

            x-=sx;
            y-=sy;

            draw_object(object,x,y);
        }
    }


    /**
     *
     * @param object
     * @param x
     * @param y
     */
    function draw_object(object,x,y){
        let frame = object.currentFrame;
        if (frame != null && frame.image) {
            let image = frame.image;

            Canvas.drawImage(image, {
                dx: x,
                dy: y,
                dWidth: frame.dWidth,
                dHeight: frame.dHeight,
                sx: frame.sx,
                sy: frame.sy,
                sWidth: frame.sWidth,
                sHeight: frame.sHeight,
                layer: object.layer,
                type: Consts.EVENT_LAYER
            });

            clear_queue.push({
                layer_type:Consts.EVENT_LAYER,
                layer:object.layer,
                x:x,
                y:y,
                width:Math.max(frame.width, 32),
                height:Math.max(frame.height, 32)
            });
        }
    }

    /**
     *
     * @param self
     * Foca a câmera em um objeto
     */
    function step_focus(self) {
        if (focused_object != null) {
            let obj = focused_object;
            let graphic = obj.graphic;
            console.log('stepfocus');
            if(graphic != null) {
                let width = root.Canvas.width > self.map.width ? root.Canvas.width : self.map.width;
                let height = root.Canvas.height > self.map.height ? root.Canvas.height : self.map.height;
                Canvas.x = -(width / 2) + obj.x + (obj.width);
                Canvas.y = -(height / 2) + obj.y + (obj.height);
            }
        }
    }

    /**
     *
     * @param self
     */
    function step_events(self) {
        let objs = self.objs;
        let length = objs.length;
        let i;
        if(Main.currentPlayer){
            Main.currentPlayer.update();
        }

        for (i = 0; i < length; i++) {
            objs[i].update();
        }
    }

    /**
     *
     * @param self
     */
    function action_events(self) {
        let player = Main.currentPlayer;
        let tree = self.tree;

        let bounds_tmp = {
            x: player.body.x,
            y: player.body.y,
            width: player.body.width,
            height: player.body.height,
            groups: ['ACTION_BUTTON']
        };

        let d = player.direction;

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

        let length;
        let collisions;
        let i;
        let collision;
        let obj;

        collisions = tree.retrieve(bounds_tmp, 'ACTION_BUTTON');
        length = collisions.length;
        for (i = 0; i < length; i++) {
            collision = collisions[i];
            obj = collision.object;
            if (obj instanceof Game_Event && obj.currentPage) {
                let page = obj.currentPage;
                if (typeof page.script =='function') {
                    if (page.trigger ==Consts.TRIGGER_PLAYER_TOUCH || (page.trigger ==Consts.TRIGGER_ACTION_BUTTON && self.action_button)) {
                        page.script.apply(obj);
                    }
                }

            }
        }

        collisions = tree.retrieve(player.body, 'ITEM');
        length = collisions.length;
        for (i = 0; i < length; i++) {
            collision = collisions[i];
            obj = collision.object;
            if (obj instanceof Game_Item) {
                if(obj.capture ==Consts.TRIGGER_PLAYER_TOUCH || (obj.capture ==Consts.TRIGGER_ACTION_BUTTON && self.action_button)){
                    player.inventory.addItem(obj.item,obj.amount);
                    self.remove(obj);
                }
            }
        }

        self.action_button = false;
    }

    /**
     *
     * @param tree
     * @param first
     */
    function drawquadtree(tree,first){
        first = first || false;
        let layer = root.Canvas.getLayer(Consts.UI_LAYER,0);
        layer.rect({
            x:tree.body.x-Canvas.x,
            y:tree.body.y-Canvas.y,
            width:tree.body.width,
            height:tree.body.height,
            strokeStyle:'black',
            lineWidth:1
        });

        if(first){
            Object.keys(tree.objects).forEach(function(key){
                let ob = tree.objects[key];
                layer.rect({
                    x:ob.x-Canvas.x,
                    y:ob.y-Canvas.y,
                    width:ob.width,
                    height:ob.height,
                    strokeStyle:'black',
                    lineWidth:1
                });
            });
        }

        for(var i = 0; i < tree.nodes.length;i++){
            drawquadtree(tree.nodes[i]);
        }
    }

    /**
     *
     * @param self
     */
    function initialize(self){
        let tree = null;
        Object.defineProperty(self,'tree',{
            get:function(){
                if(tree == null){
                    tree = new QuadTree({
                        x: 0,
                        y: 0,
                        width: self.map.width || 640,
                        height: self.map.height || 640
                    },{
                        loop_x:self.map.loop_x,
                        loop_y:self.map.loop_y
                    });
                }
                return tree;
            }
        });
    }


    root.Scene_Map = Scene_Map;
})(RPG);
