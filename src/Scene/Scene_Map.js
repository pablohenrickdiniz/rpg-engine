(function (root) {
    if (window.QuadTree == undefined) {
        throw "Scene_Map requires QuadTree"
    }

    if (root.Scene == undefined) {
        throw "Scene_Map requires Scene"
    }

    if (root.Canvas == undefined) {
        throw "Scene_Map requires Canvas"
    }

    if (root.Game_Item == undefined) {
        throw "Scene_Map requires Game_Item"
    }

    if (root.Game_Event == undefined) {
        throw "Scene_Map requires Game_Event"
    }

    if(root.Main == undefined){
        throw "Scene_Map requires Main"
    }
    else{
        if (root.Main.Graphics == undefined) {
            throw "Scene_Map requires Graphics"
        }

        if(root.Main.Tilesets == undefined){
            throw "Scene_Map requires Tilesets"
        }
    }

    if(root.Spriteset_Map == undefined){
        throw "Scene_Map requires Spriteset_Map"
    }

    if(root.Game_Object == undefined){
        throw "Scene_Map requires Game_Object"
    }

    var Scene = root.Scene,
        Canvas = root.Canvas,
        Consts = root.Consts,
        Main = root.Main,
        Game_Event = root.Game_Event,
        Game_Item = root.Game_Item,
        Spriteset_Map = root.Spriteset_Map,
        Game_Object = root.Game_Object,
        Tilesets = Main.Tilesets,
        Graphics =  Main.Graphics;

    var clear_queue = [];
    var bg_refreshed = false;
    var focused_object = null;

    /**
     *
     * @param options
     * @constructor
     */
    var Scene_Map = function (options) {
        var self = this;
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
        var self = this;
        self.objs.push(object);
        if(object.bounds){
            self.tree.insert(object.bounds);
        }
    };

    /**
     * Remove um objeto da cena
     * @param object
     */
    Scene_Map.prototype.remove = function(object){
        var self = this;
        var index = self.objs.indexOf(object);
        if(index != -1){
            self.objs.splice(index,1);
        }
        if(object.bounds){
            self.tree.remove(object.bounds);
        }
    };

    /**
     * Mantêm a câmera focada em um obeto
     * @param object
     */
    Scene_Map.prototype.focus = function (object) {
        if(object instanceof Game_Object){
            if (focused_object !== null) {
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
        var self = this;
        Scene.prototype.step.apply(this);
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
     * Renderiza o mapa de sprites
     */
    function refresh_spriteset_map(self) {
        var sx = Canvas.x;
        var sy = Canvas.y;
        var spriteset = self.spriteset;


        var width = Math.min(Canvas.width,self.spriteset.realWidth);
        var height = Math.min(Canvas.height,self.spriteset.realHeight);


        var tileWidth = spriteset.tileWidth;
        var tileHeight = spriteset.tileHeight;

        var interval = get_area_interval({x: sx, y: sy, width: width, height: height});
        var maxi = spriteset.height-1;
        var maxj = spriteset.width-1;

        for (var i = interval.si; i <= interval.ei; i++) {
            var ti = i;

            if(ti < 0){
                ti = maxi + 1 + ti;
            }
            else if(ti > maxi){
                ti = (ti % (maxi+1));
            }


            for(var j = interval.sj; j <= interval.ej;j++){
                var tj = j;

                if(tj < 0){
                    tj = maxj + 1 + tj;
                }
                else if(tj > maxj){
                    tj = (tj % (maxj+1));
                }
                if (spriteset.data[ti] !== undefined && spriteset.data[ti][tj] !== undefined) {
                    for (var k in  spriteset.data[ti][tj]) {
                        var tile_data = spriteset.data[ti][tj][k];
                        var tileset = Tilesets.get(tile_data[0]);
                        var tile = tileset.get(tile_data[1],tile_data[2]);
                        if(tile != null){
                            var type = Consts.BACKGROUND_LAYER;
                            if(k > 1){
                                type = Consts.FOREGROUND_LAYER;
                            }
                            var layer = Canvas.getLayer(type, k);
                            if (layer != null) {
                                var context = layer.context;
                                var dx = j * tileWidth - sx;
                                var dy = i * tileHeight - sy;
                                var wdx = width-dx;
                                var hdy = height-dy;
                                dx = parseInt(dx);
                                dy = parseInt(dy);
                                var tw = Math.min(tileWidth,wdx);
                                var th = Math.min(tileHeight,hdy);
                                var tsw = Math.min(tile.sWidth,wdx);
                                var tsh = Math.min(tile.sHeight,hdy);
                                context.drawImage(tile.image, tile.sx, tile.sy, tsw,tsh, dx, dy, tw,th);
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
     * Renderiza o ambiente, chão, casas,etc
     */
    function refresh_bg(self) {
        if (!bg_refreshed) {
            Canvas.clear(Consts.BACKGROUND_LAYER);
            Canvas.clear(Consts.FOREGROUND_LAYER);
            refresh_spriteset_map(self);
            bg_refreshed = true;
        }
    }


    /**
     *
     * @param self
     * Apaga o gráfico dos objetos
     */
    function clear_graphics(self) {
        while(clear_queue.length > 0){
            var clear = clear_queue.pop();
            Canvas.clear(clear.layer_type, clear.layer, clear.x, clear.y, clear.width, clear.height);
        }
    }

    /**
     *
     * @param self
     * Renderiza os objetos no mapa
     */
    function draw_graphics(self) {
        var i;
        var sx = root.Canvas.x;
        var sy = root.Canvas.y;
        var spriteset = self.spriteset;
        var vw = Math.min(root.Canvas.width,spriteset.realWidth);
        var vh = Math.min(root.Canvas.height,spriteset.realHeight);
        var object;
        var collision;

        var collisions = self.tree.retrieve({
            x:sx,
            y:sy,
            width:vw,
            height:vh
        });

        collisions = collisions.sort(function (a, b) {
            return a.yb-b.yb;
        });

        var size = collisions.length;
        var bounds;
        var mw = spriteset.realWidth;
        var mh = spriteset.realHeight;
        var x;
        var y;

        for (i = 0; i < size; i++) {
            collision = collisions[i];
            object = collision.object;
            bounds = object.currentFrame;
            x = collision.xb-sx;
            y = collision.yb-sy;

            draw_object(x,y,object,mw,mh);
        }


    }

    function splith(o,vw){
        var frames = [];

        var dxw = o.dx+o.dWidth;

        if(o.dx > vw){
            frames[0] = clone(o);
            Object.assign(frames[0],{dx:o.dx-vw});
        }
        else if(dxw > vw){
            frames[0] = clone(o);
            frames[1] = clone(o);
            var d = vw-o.dx;
            var ds = d*(o.sWidth/o.dWidth);

            Object.assign(frames[0],{dWidth:d,sWidth:ds});
            Object.assign(frames[1],{dx:0,sx:o.sx+ds,sWidth:o.sWidth-ds,dWidth:o.dWidth-d});
        }
        else if(o.dx < 0){
            if(dxw > 0){
                frames[0] = clone(o);
                frames[1] = clone(o);
                var d = Math.abs(o.dx);
                var ds = d*(o.sWidth/o.dWidth);

                Object.assign(frames[0],{dWidth:d,sWidth:ds,dx:vw-d});
                Object.assign(frames[1],{dx:0,sx:o.sx+ds,sWidth:o.sWidth-ds,dWidth:o.dWidth-d});
            }
            else{
                frames[0] = clone(o);
                Object.assign(frames[0],{dx:vw+o.dx});
            }
        }
        else{
            frames[0] = clone(o);
        }

        return frames;
    }

    function splitv(o,vh){
        var frames = [];
        var dxh = o.dy+o.dHeight;
        if(o.dy > vh){
            frames[0] = clone(o);
            Object.assign(frames[0],{dy:o.dy-vh});
        }
        else if(dxh > vh){
            frames[0] = clone(o);
            frames[1] = clone(o);
            var d = vh-o.dy;
            var ds = d*(o.sHeight/o.dHeight);

            Object.assign(frames[0],{dHeight:d,sHeight:ds});
            Object.assign(frames[1],{dy:0,sy:o.sy+ds,sHeight:o.sHeight-ds,dHeight:o.dHeight-d});
        }
        else if(o.dy < 0){
            if(dxh > 0){
                frames[0] = clone(o);
                frames[1] = clone(o);
                var d = Math.abs(o.dy);
                var ds = d*(o.sHeight/o.dHeight);

                Object.assign(frames[0],{dHeight:d,sHeight:ds,dy:vh-d});
                Object.assign(frames[1],{dy:0,sy:o.sy+ds,sHeight:o.sHeight-ds,dHeight:o.dHeight-d});
            }
            else{
                frames[0] = clone(o);
                Object.assign(frames[0],{dy:vh+o.dy});
            }
        }
        else{
            frames[0] = clone(o);
        }

        return frames;
    }


    function split(obj,vw,vh){
        var frames = [];

        var tmp = splith(obj,vw);

        var length = tmp.length;

        for(var i =0; i < length;i++){
            var tmp2 = splitv(tmp[i],vh);
            var length2 = tmp2.length;
            for(var j = 0; j < length2;j++){
                frames.push(tmp2[j]);
            }
        }

        return frames;
    }


    /**
     *
     * @param x
     * @param y
     * @param object
     * @param vw
     * @param vh
     */
    function draw_object(x,y,object,vw,vh){
        var frame = object.currentFrame;

        if (frame != null && frame.image) {
            var image = frame.image;
            var i;

            var draws = split({
                dx:x,
                dy:y,
                dWidth: frame.dWidth,
                dHeight: frame.dHeight,
                sx: frame.sx,
                sy: frame.sy,
                sWidth: frame.sWidth,
                sHeight: frame.sHeight,
                layer: object.layer,
                type: Consts.EVENT_LAYER
            },vw,vh);

            for(i =0; i < draws.length;i++){
                Canvas.drawImage(image,draws[i]);
                clear_queue.push({
                    layer_type:draws[i].type,
                    layer:draws[i].layer,
                    x:draws[i].dx,
                    y:draws[i].dy,
                    width:draws[i].dWidth,
                    height:draws[i].dHeight
                });
            }
        }
    }

    /**
     *
     * @param self
     * Foca a câmera em um objeto
     */
    function step_focus(self) {
        if (focused_object != null) {
            var obj = focused_object;
            var graphic = obj.graphic;
            if(graphic != null){
                var spriteset = self.spriteset;
                var viewport_width = Math.min(Canvas.width, spriteset.realWidth);
                var viewport_height = Math.min(Canvas.height, spriteset.realHeight);
                var viewport_x = obj.bounds.x - (viewport_width / 2) + (obj.graphic.tileDWidth / 2);
                var viewport_y = obj.bounds.y - (viewport_height / 2) + (obj.graphic.tileDHeight / 2);
                var max_screen_x = spriteset.realWidth - viewport_width;
                var max_screen_y = spriteset.realHeight - viewport_height;

                if(!self.map.loop_x){
                    if (viewport_x < 0) {
                        viewport_x = 0;
                    }
                    else if (viewport_x > max_screen_x) {
                        viewport_x = max_screen_x;
                    }
                }

                if(!self.map.loop_y){
                    if (viewport_y < 0) {
                        viewport_y = 0;
                    }
                    else if (viewport_y > max_screen_y) {
                        viewport_y = max_screen_y;
                    }
                }


                viewport_x = parseInt(viewport_x);
                viewport_y = parseInt(viewport_y);

                if (Canvas.x != viewport_x || Canvas.y != viewport_y) {
                    bg_refreshed = false;
                }

                Canvas.x = viewport_x;
                Canvas.y = viewport_y;
            }
        }
    }

    /**
     *
     * @param self
     */
    function step_events(self) {
        var objs = self.objs;
        var length = objs.length;
        var i;

        for (i = 0; i < length; i++) {
            objs[i].update();
        }
    }

    /**
     *
     * @param self
     */
    function action_events(self) {
        var player = Main.currentPlayer;
        var tree = self.tree;

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
            obj = collision.object;
            if (obj instanceof Game_Event && obj.currentPage) {
                var page = obj.currentPage;
                if (typeof page.script == 'function') {
                    if (page.trigger === Consts.TRIGGER_PLAYER_TOUCH || (page.trigger === Consts.TRIGGER_ACTION_BUTTON && self.action_button)) {
                        page.script.apply(obj);
                    }
                }

            }
        }

        bounds_tmp = {
            x: player.bounds.x,
            y: player.bounds.y,
            width: player.bounds.width,
            height: player.bounds.height,
            groups: ['ITEM']
        };

        collisions = tree.retrieve(bounds_tmp, 'ITEM');
        length = collisions.length;
        for (i = 0; i < length; i++) {
            collision = collisions[i];
            obj = collision.object;
            if (obj instanceof Game_Item) {
                if(obj.capture === Consts.TRIGGER_PLAYER_TOUCH || (obj.capture === Consts.TRIGGER_ACTION_BUTTON && self.action_button)){
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
        //first = first || false;
        //var layer = root.Canvas.getLayer(Consts.UI_LAYER,0);
        //layer.rect({
        //    x:tree.bounds.x-Canvas.x,
        //    y:tree.bounds.y-Canvas.y,
        //    width:tree.bounds.width,
        //    height:tree.bounds.height,
        //    strokeStyle:'black',
        //    lineWidth:1
        //});
        //if(first){
        //    Object.keys(tree.objects).forEach(function(key){
        //        var ob = tree.objects[key];
        //        layer.rect({
        //            x:ob.x-Canvas.x,
        //            y:ob.y-Canvas.y,
        //            width:ob.width,
        //            height:ob.height,
        //            strokeStyle:'black',
        //            lineWidth:1
        //        });
        //    });
        //}
        //
        //
        //
        //for(var i = 0; i < tree.nodes.length;i++){
        //    drawquadtree(tree.nodes[i]);
        //}
    }

    /**
     *
     * @param self
     */
    function initialize(self){
        var tree = null;
        Object.defineProperty(self,'tree',{
            get:function(){
                if(tree == null){
                    tree = new QuadTree({
                        x: 0,
                        y: 0,
                        width: self.spriteset.realWidth || 640,
                        height: self.spriteset.realHeight || 640
                    },{
                        loop_x:true,
                        loop_y:true
                    });
                }
                return tree;
            }
        });

        Object.defineProperty(self,'bg_refreshed',{
            get:function(){
                return bg_refreshed;
            },
            set:function(bgr){
                bg_refreshed = bgr?ture:false;
            }
        });
    }

    function clone(obj){
        return Object.assign({},obj);
    }

    root.Scene_Map = Scene_Map;
})(RPG);
