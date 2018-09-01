'use strict';
(function (root,w) {
    if (root.Scene === undefined) {
        throw "Scene_Map requires Scene";
    }

    if (root.Canvas === undefined) {
        throw "Scene_Map requires Canvas";
    }

    if (root.Game_Item === undefined) {
        throw "Scene_Map requires Game_Item";
    }

    if (root.Event_Page === undefined) {
        throw "Scene_Map requires Event_Page";
    }

    if(root.Game_Actor === undefined){
        throw "Scene_Map requires Game_Actor";
    }

    if(root.Main === undefined){
        throw "Scene_Map requires Main";
    }
    else{
        if (root.Main.Graphics === undefined) {
            throw "Scene_Map requires Graphics";
        }

        if(root.Main.Tilesets === undefined){
            throw "Scene_Map requires Tilesets";
        }
    }

    if(root.Spriteset_Map === undefined){
        throw "Scene_Map requires Spriteset_Map";
    }

    if(root.Game_Object === undefined){
        throw "Scene_Map requires Game_Object";
    }

    if(w.Matter === undefined){
        throw "Scene_Map requires Matter";
    }

    if(root.Canvas === undefined){
        throw "Scene_Map requires Canvas";
    }

    let Scene = root.Scene,
        Canvas = root.Canvas,
        Consts = root.Consts,
        Main = root.Main,
        Event_Page = root.Event_Page,
        Game_Item = root.Game_Item,
        Game_Actor = root.Game_Actor,
        Spriteset_Map = root.Spriteset_Map,
        Game_Object = root.Game_Object,
        Tilesets = Main.Tilesets,
        Matter = w.Matter,
        Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Events = Matter.Events;

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
        self.map = options.map || {};
        self.action = false;
        self.spriteset = new Spriteset_Map(self.map.spriteset || {});
        self.objs = [];
        self.charas = options.charas || {};
        self.actors = options.actors || {};
        self.faces = options.faces || {};
        self.items = options.items || {};
        self.icons = options.icons || {};
        self.objects = options.objects || [];
        initialize(self);

        self.addEventListener('collisionActive',function(a,b){
            let page = null;
            let actor = null;
            if(a instanceof Event_Page){
                page = a;
            }
            else if(a instanceof Game_Actor){
                actor = a;
            }

            if(b instanceof Event_Page){
                page = b;
            }
            else if(b instanceof Game_Actor){
                actor = b;
            }

            if (page !== null && actor !== null) {
                if (typeof page.script === 'function') {
                    if (page.trigger === Consts.TRIGGER_PLAYER_TOUCH || (page.trigger === Consts.TRIGGER_ACTION_BUTTON && self.action)) {
                        self.action = false;
                        page.script.apply(page.event);
                    }
                }
            }
        });
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
        if(object.body){
            World.add(self.engine.world,object.body);
        }
    };

    /**
     * Remove um objeto da cena
     * @param object
     */
    Scene_Map.prototype.remove = function(object){
        let self = this;
        let index = self.objs.indexOf(object);
        if(index !== -1){
            self.objs.splice(index,1);
        }
        if(object.body){
            World.remove(self.engine.world,object.body);
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
        let self = this;
        Scene.prototype.step.apply(this);
        Engine.update(self.engine);
        self.action = false;
        step_events(self);
        step_focus(self);
        refresh_bg(self);
        clear_graphics(self);
        draw_graphics(self);
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
        let si = parseInt(Math.floor(y / tileHeight));
        let sj = parseInt(Math.floor(x / tileWidth));
        let ei = parseInt(Math.floor((y + height) / tileHeight));
        let ej = parseInt(Math.floor((x + width) / tileWidth));
        return {si: si, sj: sj, ei: ei, ej: ej};
    }

    /**
     *
     * @param self
     * Renderiza o mapa de sprites
     */
    function refresh_spriteset_map(self) {
        let sx = Canvas.x;
        let sy = Canvas.y;
        let spriteset = self.spriteset;

        let width = Math.min(Canvas.width,self.spriteset.realWidth);
        let height = Math.min(Canvas.height,self.spriteset.realHeight);

        let tileWidth = spriteset.tileWidth;
        let tileHeight = spriteset.tileHeight;
        let loop_x = self.map.loop_x;
        let loop_y = self.map.loop_y;

        if(!loop_x){
            sx = Math.max(sx,0);
        }

        if(!loop_y){
            sy = Math.max(sy,0);
        }

        let interval = get_area_interval({x: sx, y: sy, width: width, height: height});
        let maxi = spriteset.height-1;
        let maxj = spriteset.width-1;

        for (let i = interval.si; i <= interval.ei; i++) {
            let ti = i;
            if(ti < 0){
                ti = maxi + 1 + ti;
            }
            else if(ti > maxi){
                ti = (ti % (maxi+1));
            }

            for(let j = interval.sj; j <= interval.ej;j++){
                let tj = j;

                if(tj < 0){
                    tj = maxj + 1 + tj;
                }
                else if(tj > maxj){
                    tj = (tj % (maxj+1));
                }
                if (spriteset.data[ti] !== undefined && spriteset.data[ti][tj] !== undefined) {
                    for (let k in  spriteset.data[ti][tj]) {
                        let tile_data = spriteset.data[ti][tj][k];
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
                                let dx = j * tileWidth - sx;
                                let dy = i * tileHeight - sy;

                                let wdx = width-dx;
                                let hdy = height-dy;

                                if(wdx > 0 && hdy > 0){
                                    dx = parseInt(dx);
                                    dy = parseInt(dy);
                                    let tw = Math.min(tileWidth,wdx);
                                    let th = Math.min(tileHeight,hdy);
                                    context.drawImage(tile.image, tile.sx, tile.sy,tw,th, dx, dy, tw,th);
                                }
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
        let spriteset = self.spriteset;
        let mw = spriteset.realWidth;
        let mh = spriteset.realHeight;

        let objs = self.objs.sort(function(a,b){
            return a.y-b.y;
        });


        for(let i =0; i < objs.length;i++){
            draw_object(objs[i].x,objs[i].y,objs[i],mw,mh);
        }

        if(RPG.debug){
            let length = self.engine.world.bodies.length;
            for(let i =0; i < length;i++){
                let body = self.engine.world.bodies[i];
                let x = body.body.min.x;
                let y = body.body.min.y;
                let width = body.body.max.x-x;
                let height = body.body.max.y-y;
                x = Math.round(x-Canvas.x);
                y = Math.round(y-Canvas.y);
                Canvas.drawRect({
                    x:x,
                    y:y,
                    width:width,
                    height:height,
                    type: Consts.UI_LAYER,
                    layer:0,
                    lineWidth:1
                });
                clear_queue.push({
                    layer_type:Consts.UI_LAYER,
                    layer:0,
                    x:x-1,
                    y:y-1,
                    width:width+2,
                    height:height+2
                });
            }
        }
    }

    /**
     *
     * @param o
     * @param vw
     * @returns {Array}
     */
    function splith(o,vw){
        let frames = [];

        let dxw = o.dx+o.dWidth;

        if(o.dx >= vw){
            frames[0] = clone(o);
            Object.assign(frames[0],{dx:o.dx-vw});
        }
        else if(dxw > vw){
            frames[0] = clone(o);
            frames[1] = clone(o);
            let d = vw-o.dx;
            let ds = d*(o.sWidth/o.dWidth);

            Object.assign(frames[0],{dWidth:d,sWidth:ds});
            Object.assign(frames[1],{dx:0,sx:o.sx+ds,sWidth:o.sWidth-ds,dWidth:o.dWidth-d});
        }
        else if(o.dx < 0){
            if(dxw > 0){
                frames[0] = clone(o);
                frames[1] = clone(o);
                let d = Math.abs(o.dx);
                let ds = d*(o.sWidth/o.dWidth);

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

    /**
     *
     * @param o
     * @param vh
     * @returns {Array}
     */
    function splitv(o,vh){
        let frames = [];
        let dxh = o.dy+o.dHeight;
        if(o.dy >= vh){
            frames[0] = clone(o);
            Object.assign(frames[0],{dy:o.dy-vh});
        }
        else if(dxh > vh){
            frames[0] = clone(o);
            frames[1] = clone(o);
            let d = vh-o.dy;
            let ds = d*(o.sHeight/o.dHeight);

            Object.assign(frames[0],{dHeight:d,sHeight:ds});
            Object.assign(frames[1],{dy:0,sy:o.sy+ds,sHeight:o.sHeight-ds,dHeight:o.dHeight-d});
        }
        else if(o.dy < 0){
            if(dxh > 0){
                frames[0] = clone(o);
                frames[1] = clone(o);
                let d = Math.abs(o.dy);
                let ds = d*(o.sHeight/o.dHeight);

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

    /**
     *
     * @param obj
     * @param vw
     * @param vh
     * @returns {Array}
     */
    function split(obj,vw,vh){
        let frames = [];
        let tmp = splith(obj,vw);
        let length = tmp.length;

        for(let i =0; i < length;i++){
            let tmp2 = splitv(tmp[i],vh);
            let length2 = tmp2.length;
            for(let j = 0; j < length2;j++){
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
        let frame = object.currentFrame;
        if (frame != null && frame.image) {
            let image = frame.image;
            x = Math.round(x-Canvas.x-(object.width/2));
            y = Math.round(y-Canvas.y-(object.height/2));
            Canvas.drawImage(image,{
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
            });
            clear_queue.push({
                layer_type:Consts.EVENT_LAYER,
                layer:frame.layer,
                x:x,
                y:y,
                width:frame.dWidth,
                height:frame.dHeight
            });
            // }
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

            if(graphic != null){
                let spriteset = self.spriteset;
                let viewport_width = Math.min(Canvas.width, spriteset.realWidth);
                let viewport_height = Math.min(Canvas.height, spriteset.realHeight);
                let viewport_x = (obj.x) - (viewport_width / 2) + (obj.graphic.tileDWidth / 2);
                let viewport_y = (obj.y) - (viewport_height / 2) + (obj.graphic.tileDHeight / 2);


                let max_screen_x = spriteset.realWidth - viewport_width;
                let max_screen_y = spriteset.realHeight - viewport_height;

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

                viewport_x = Math.round(viewport_x);
                viewport_y = Math.round(viewport_y);

                if (Canvas.x !== viewport_x || Canvas.y !== viewport_y) {
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
        let objs = self.objs;
        let length = objs.length;
        let i;

        for (i = 0; i < length; i++) {
            objs[i].update();
        }
    }

    /**
     *
     * @param self
     */
    function action_events(self) {
        // let player = Main.currentPlayer;
        //
        //
        // let length;
        // let collisions;
        // let i;
        // let collision;
        // let obj;
        //
        // collisions = tree.retrieve(bounds_tmp, 'ACTION_BUTTON');
        // length = collisions.length;
        // for (i = 0; i < length; i++) {
        //     collision = collisions[i];
        //     obj = collision.object;

        // }
        //
        // bounds_tmp = {
        //     x: player.body.x,
        //     y: player.body.y,
        //     width: player.body.width,
        //     height: player.body.height,
        //     groups: ['ITEM']
        // };
        //
        // collisions = tree.retrieve(bounds_tmp, 'ITEM');
        // length = collisions.length;
        // for (i = 0; i < length; i++) {
        //     collision = collisions[i];
        //     obj = collision.object;
        //     if (obj instanceof Game_Item) {
        //         if(obj.capture === Consts.TRIGGER_PLAYER_TOUCH || (obj.capture === Consts.TRIGGER_ACTION_BUTTON && self.action_button)){
        //             player.inventory.addItem(obj.item,obj.amount);
        //             self.remove(obj);
        //         }
        //     }
        // }
        //
        // self.action_button = false;
    }

    /**
     *
     * @param self
     */
    function initialize(self){
        let engine = Engine.create();
        engine.world.gravity = {
            x:0,
            y:0
        };
        let size = 20;
        World.add(engine.world,[
            Bodies.rectangle(self.spriteset.realWidth/2, -size/2, self.spriteset.realWidth, size, { isStatic: true,friction: 0 }),
            Bodies.rectangle(self.spriteset.realWidth+size/2, self.spriteset.realHeight/2, size, self.spriteset.realHeight, { isStatic: true,friction:0 }),
            Bodies.rectangle(self.spriteset.realWidth/2, self.spriteset.realHeight+(size/2), self.spriteset.realWidth, size, { isStatic: true,friction:0}),
            Bodies.rectangle(-size/2, self.spriteset.realHeight/2, size, self.spriteset.realHeight, { isStatic: true, friction:0})
        ]);

        Events.on(engine,'collisionStart',function(event){
            let pairs = event.pairs;
            // change object colours to show those starting a collision
            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i];
                if(pair.bodyA.plugin.ref !== undefined && pair.bodyB.plugin.ref !== undefined){
                    self.trigger('collisionStart',[pair.bodyA.plugin.ref,pair.bodyB.plugin.ref]);
                }
            }
        });

        Events.on(engine,'collisionActive',function(event){
            let pairs = event.pairs;
            // change object colours to show those starting a collision
            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i];
                if(pair.bodyA.plugin.ref !== undefined && pair.bodyB.plugin.ref !== undefined){
                    self.trigger('collisionActive',[pair.bodyA.plugin.ref,pair.bodyB.plugin.ref]);
                }
            }
        });

        Events.on(engine,'collisionEnd',function(event){
            let pairs = event.pairs;
            // change object colours to show those starting a collision
            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i];
                if(pair.bodyA.plugin.ref !== undefined && pair.bodyB.plugin.ref !== undefined){
                    self.trigger('collisionEnd',[pair.bodyA.plugin.ref,pair.bodyB.plugin.ref]);
                }
            }
        });


        Object.defineProperty(self,'bg_refreshed',{
            /**
             *
             * @returns {boolean}
             */
            get:function(){
                return bg_refreshed;
            },
            /**
             *
             * @param bgr
             */
            set:function(bgr){
                bg_refreshed = !!bgr;
            }
        });

        Object.defineProperty(self,'engine',{
            /**
             *
             * @returns {engine}
             */
            get:function(){
                return engine;
            }
        });
    }

    function clone(obj){
        return Object.assign({},obj);
    }

    root.Scene_Map = Scene_Map;
})(RPG,window);
