'use strict';
(function (root,w) {
    if (!root.Scene) {
        throw "Scene_Map requires Scene";
    }

    if (!root.Canvas) {
        throw "Scene_Map requires Canvas";
    }

    if (!root.Game_Item) {
        throw "Scene_Map requires Game_Item";
    }

    if (!root.Event_Page) {
        throw "Scene_Map requires Event_Page";
    }

    if(!root.Game_Actor){
        throw "Scene_Map requires Game_Actor";
    }

    if(!root.Tile){
        throw "Scene_Map requires Tile";
    }

    if(!root.Game_Graphic){
        throw "Scene_Map requires Game_Graphic";
    }

    if(!root.Main){
        throw "Scene_Map requires Main";
    }
    else{
        if (!root.Main.Graphics) {
            throw "Scene_Map requires Graphics";
        }

        if(!root.Main.Tilesets){
            throw "Scene_Map requires Tilesets";
        }
    }

    if(!root.Spriteset_Map){
        throw "Scene_Map requires Spriteset_Map";
    }

    if(!root.Game_Object){
        throw "Scene_Map requires Game_Object";
    }

    if(!w.Matter){
        throw "Scene_Map requires Matter";
    }

    if(!root.Canvas){
        throw "Scene_Map requires Canvas";
    }

    let Scene = root.Scene,
        Canvas = root.Canvas,
        Consts = root.Consts,
        Main = root.Main,
        Event_Page = root.Event_Page,
        Game_Actor = root.Game_Actor,
        Spriteset_Map = root.Spriteset_Map,
        Game_Object = root.Game_Object,
        Tilesets = Main.Tilesets,
        Matter = w.Matter,
        Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Events = Matter.Events,
        Tile = root.Tile,
        Game_Graphic = root.Game_Graphic;

    let clear_queue = [];
    let bg_refreshed = false;
    let focused_object = null;

    /**
     *
     * @param options {object}
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

        self.on('collisionActive,objectBody,objectBody',function(a,b){
            if(a.plugin.object !== undefined && b.plugin.object !== undefined){
                let eventName = [
                    'collisionActive',
                    [a.plugin.object.type,b.plugin.object.type].sort(sortAsc).join()
                ].join();
                self.trigger(eventName,[a.plugin.object,b.plugin.object].sort(sortByType));
            }
        });

        self.on('collisionActive,Game_Actor,Game_Event',function(actor,event){
            let page = event.currentPage;
            if (page.script !== null) {
                if (page.isTrigger(Consts.TRIGGER_PLAYER_TOUCH) || (page.isTrigger(Consts.TRIGGER_ACTION_BUTTON) && self.action)) {
                    self.action = false;
                    page.executeScript(actor);
                }
            }
        });

        self.on('collisionActive,light,objectBody',function(light,objectBody){
            let object = objectBody.plugin.object;
            let lightSourceObject = light.plugin.object;
            if(object !== lightSourceObject && lightSourceObject.light && !object.light && object.shadow){
                object.lights.push(light);
            }

        });
    };

    function get_shadows(object){
        let frame = object.currentFrame;
        let shadows = [];
        if(frame !== null){
            let objectBody = object.objectBody;
            for(let i = 0; i < object.lights.length;i++){
                let light = object.lights[i];
                let va = {
                    x:light.position.x,
                    y:light.position.y
                };
                let vb = {
                    x:objectBody.position.x,
                    y:objectBody.position.y
                };
                let vec = Math.vmv(vb,va);
                let distance = Math.distance(va,vb);
                let radius = parseFloat(light.circleRadius);
                if(isNaN(radius)){
                    radius = distance;
                }
                let scaleX = 1;
                let scaleY = distance/frame.dHeight;
                let vector = Math.normalize(vec);
                if(vector.y > 0){
                    //scaleY = -scaleY;
                 //   scaleX *= -1;
                }
                let degree = Math.clockWiseDegreeFromVec(vec);
                let skewX = 0;
                let skewY = 0;
                let alpha = Math.max(1-(distance/radius),0)*0.6;

                if(degree >= 270 && degree <= 360){
                    //skewY = Math.min(360-degree,45);
                }
                else if(degree >= 0 && degree <= 90){
                    //skewY = -Math.min(degree,45);
                }
                else if(degree >= 90 && degree <= 180){
                    //skewY = Math.min(180-degree,45);
                }
                else if(degree > 180 && degree <= 270){
                    //skewY = -Math.min(degree-180,45);
                }

                let f = frame;


                if(degree > 45 && degree <= 135){
                    switch(frame.i){
                        case Consts.CHARACTER_DIRECTION_DOWN:
                            f = object.rightFrame;
                            break;
                        case Consts.CHARACTER_DIRECTION_RIGHT:
                            f = object.downFrame;
                            break;
                        case Consts.CHARACTER_DIRECTION_LEFT:
                            f = object.upFrame;
                            break;
                        case Consts.CHARACTER_DIRECTION_UP:
                            f = object.leftFrame;
                            break;
                    }
                }
                else if(degree > 225 && degree <= 270){
                    switch(frame.i){
                        case Consts.CHARACTER_DIRECTION_DOWN:
                            f = object.leftFrame;
                            break;
                        case Consts.CHARACTER_DIRECTION_RIGHT:
                            f = object.upFrame;
                            break;
                        case Consts.CHARACTER_DIRECTION_LEFT:
                            f = object.downFrame;
                            break;
                        case Consts.CHARACTER_DIRECTION_UP:
                            f = object.rightFrame;
                            break;
                    }
                }
                else if((degree > 270 && degree <= 45) || (degree > 135 && degree <= 225)){
                    switch(frame.i){
                        case Consts.CHARACTER_DIRECTION_DOWN:
                            f = object.upFrame;
                            break;
                        case Consts.CHARACTER_DIRECTION_RIGHT:
                            f = object.leftFrame;
                            break;
                        case Consts.CHARACTER_DIRECTION_LEFT:
                            f = object.rightFrame;
                            break;
                        case Consts.CHARACTER_DIRECTION_UP:
                            f = object.downFrame;
                            break;
                    }
                }

                shadows.push({
                    degree:degree,
                    frame:f,
                    distance:distance,
                    alpha:alpha,
                    skewX:Math.degreeToRadians(skewX),
                    skewY:Math.degreeToRadians(skewY),
                    scaleX:scaleX,
                    scaleY:scaleY,
                    translateX:object.x-Canvas.x,
                    translateY: object.y-Canvas.y+Math.round(f.dHeight/2)
                });
            }
        }
        return shadows;
    }

    Scene_Map.prototype = Object.create(Scene.prototype);
    Scene_Map.prototype.constructor = Scene_Map;

    /**
     *
     * @param object {Game_Object}
     */
    Scene_Map.prototype.add= function(object){
        let self = this;
        self.objs.push(object);
        if(object.body){
            World.add(self.engine.world,object.body);
        }

        object.on('remove',function(){
            self.remove(object);
        });
    };

    /**
     *
     * @param object {Game_Object}
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
        object.off('remove');
    };

    /**
     *
     * @param object {Game_Object}
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

    Scene_Map.prototype.step = function () {
        let self = this;
        Scene.prototype.step.apply(this);
        Engine.update(self.engine);
        update(self);
        clear();
        draw(self);
    };

    /**
     *
     * @param options {object}
     * @returns {object}
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
     * @param self {Scene_Map}
     */
    function draw_spriteset(self) {
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
     * @param self {Scene_Map}
     */
    function draw_objects(self){
        let objs = self.objs.sort(function(a,b){
            return a.y-b.y;
        });

        for(let i =0; i < objs.length;i++){
            draw_object(objs[i]);
        }

        if(RPG.debug){
            let length = self.engine.world.bodies.length;
            for(let i =0; i < length;i++){
                let body = self.engine.world.bodies[i];
                draw_body(body);
            }
        }
    }

    function draw_body(body){
        let draw = true;
        for(let i = 0; i < body.parts.length;i++){
            if(body.parts[i] !== body){
                draw_body(body.parts[i]);
                draw = false;
            }
        }
        if(draw){
            let b = body.bounds?body.bounds:body.body;
            let x = b.min.x;
            let y = b.min.y;
            let width = b.max.x-x;
            let height = b.max.y-y;
            var layer = Canvas.getLayer(Consts.UI_LAYER,0);
            var ctx = layer.context;

            if(body.label == 'Rectangle Body'){
                x = Math.round(x-Canvas.x);
                y = Math.round(y-Canvas.y);
                ctx.save();
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'black';
                ctx.strokeRect(x,y,width,height);
                ctx.restore();
            }
            else if(body.label == 'Circle Body'){
                x = body.position.x;
                y = body.position.y;
                x = Math.round(x-Canvas.x);
                y = Math.round(y-Canvas.y);
                ctx.save();
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'black';
                ctx.beginPath();
                ctx.arc(x, y, body.circleRadius, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.restore();
                x -= body.circleRadius;
                y -= body.circleRadius;
                width = body.circleRadius*2;
                height = body.circleRadius*2;
            }

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

    function draw_effects(self){
        var now = new Date();
        var time = now.getHours()*60*60+now.getSeconds();
        time = time > 43200?86400-time:time;
        let percent = (time*100/43200);
        percent = 100 - percent;
        percent = Math.round(percent);
        percent = Math.max(percent,0);
        percent = Math.min(percent,100);

        Canvas.darken({
            x:0,
            y:0,
            width:Canvas.width,
            height:Canvas.height,
            percent:80
        });

        let flashobjs = self.objs.filter(function(obj){
            return obj.light;
        });

        flashobjs = flashobjs.sort(function(a,b){
            return a.y-b.y;
        });

        for(let i =0; i < flashobjs.length;i++){
            let objx = flashobjs[i].x-Canvas.x;
            let objy = flashobjs[i].y-Canvas.y;
            Canvas.lighten({
                x:objx,
                y:objy,
                percent:100,
                color:flashobjs[i].lightColor,
                radius:flashobjs[i].lightRadius
            });
        }

        let objs = self.objs.filter(function(obj){
            return !obj.light;
        });

        objs = objs.sort(function(a,b){
            return a.y-b.y;
        });

        for(let i = 0;  i < objs.length;i++){
            draw_shadows(objs[i]);
        }
        for(let i =0; i < flashobjs.length;i++){
            let objx = flashobjs[i].x-Canvas.x;
            let objy = flashobjs[i].y-Canvas.y;
            Canvas.lighten({
                x:objx,
                y:objy,
                percent:100,
                color:flashobjs[i].lightColor,
                radius:100
            });
        }
    }

    function clear() {
        if (!bg_refreshed) {
            Canvas.clear(Consts.BACKGROUND_LAYER);
            Canvas.clear(Consts.FOREGROUND_LAYER);
        }

        Canvas.clear(Consts.EFFECT_LAYER);
        Canvas.clear(Consts.EVENT_LAYER);

        while(clear_queue.length > 0){
            let clear = clear_queue.pop();
            Canvas.clear(clear.layer_type, clear.layer, clear.x, clear.y, clear.width, clear.height);
        }
    }

    /**
     *
     * @param self {Scene_Map}
     */
    function draw(self) {
        if(!bg_refreshed){
            draw_spriteset(self);
            bg_refreshed = true;
        }
        draw_objects(self);
        draw_effects(self);
    }

    /**
     *
     * @param o {object}
     * @param vw {number}
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
     * @param o {object}
     * @param vh {number}
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
     * @param obj {object}
     * @param vw {number}
     * @param vh {number}
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
     * @param object {Game_Object}
     */
    function draw_object(object){
        let frame = object.currentFrame;
        if (frame !== null && (frame instanceof Tile || frame instanceof Game_Graphic) && frame.image) {
            let objx = object.x-Canvas.x;
            let objy = object.y-Canvas.y;
            let image = frame.image;
            let x = Math.round(objx-(frame.dWidth/2));
            let y = Math.round(objy-(frame.dHeight/2));
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
        }
    }

    function draw_shadows(object){
        let layer = Canvas.getLayer(Consts.EFFECT_LAYER,0);
        let ctx = layer.context;
        let shadows = get_shadows(object);
        for(let i = 0; i < shadows.length;i++){
            let shadow = shadows[i];
            let frame = shadow.frame;
            ctx.save();
            ctx.translate(shadow.translateX,shadow.translateY);
            ctx.globalAlpha = shadow.alpha;
            ctx.beginPath();
            ctx.ellipse(0, 0, 8, 4, Math.degreeToRadians(0), 0, Math.degreeToRadians(360));
            ctx.fill();

            if(shadow.degree !== 0){
                ctx.rotate(Math.degreeToRadians(shadow.degree));
            }
            ctx.transform(1,shadow.skewX,shadow.skewY,1,0,0);
            ctx.scale(shadow.scaleX,shadow.scaleY);
            ctx.drawImage(
                frame.shadow,
                frame.sx,
                frame.sy,
                frame.sWidth,
                frame.sHeight,
                -Math.round(frame.dWidth/2),
                -frame.dHeight,
                frame.dWidth,
                frame.dHeight
            );
            ctx.restore();
        }
        object.lights = [];
    }

    /**
     *
     * @param self {Scene_Map}
     */
    function update(self) {
        let objs = self.objs;
        let length = objs.length;
        let i;

        for (i = 0; i < length; i++) {
            objs[i].update();
        }

        if (focused_object != null) {
            let obj = focused_object;
            let graphic = obj.graphic;

            if(graphic != null){
                let spriteset = self.spriteset;
                let viewport_width = Math.min(Canvas.width, spriteset.realWidth);
                let viewport_height = Math.min(Canvas.height, spriteset.realHeight);
                let viewport_x = (obj.x) - (viewport_width / 2);
                let viewport_y = (obj.y) - (viewport_height / 2);
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
        self.action = false;
    }

    /**
     *
     * @param self {Scene_Map}
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

        let collisionStart = function(event){
            let pairs = event.pairs;
            // change object colours to show those starting a collision
            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i];
                if(pair.bodyA.plugin.type  !== undefined && pair.bodyB.plugin.type !== undefined){
                    let eventName = [
                        'collisionStart',
                        [pair.bodyA.plugin.type,pair.bodyB.plugin.type].sort(sortAsc).join()
                    ].join();
                    self.trigger(eventName,[pair.bodyA,pair.bodyB].sort(sortByPlugin));
                }
            }
        };

        let collisionActive = function(event){
            let pairs = event.pairs;
            // change object colours to show those starting a collision
            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i];
                if(pair.bodyA.plugin.type !== undefined && pair.bodyB.plugin.type !== undefined){
                    let eventName = [
                        'collisionActive',
                        [pair.bodyA.plugin.type,pair.bodyB.plugin.type].sort(sortAsc).join()
                    ].join();
                    self.trigger(eventName,[pair.bodyA,pair.bodyB].sort(sortByPlugin));
                }
            }
        };

        let collisionEnd = function(event){
            let pairs = event.pairs;
            // change object colours to show those starting a collision
            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i];
                if(pair.bodyA.plugin.type !== undefined && pair.bodyB.plugin.type !== undefined){
                    let eventName = [
                        'collisionEnd',
                        [pair.bodyA.plugin.type,pair.bodyB.plugin.type].sort(sortAsc).join()
                    ].join();
                    self.trigger(eventName,[pair.bodyA,pair.bodyB].sort(sortByPlugin));
                }
            }
        };

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
             * @param bgr {boolean}
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

        Object.defineProperty(self,'collisionStart',{
            /**
             *
             * @returns {collisionStart}
             */
            get:function(){
                return collisionStart;
            }
        });

        Object.defineProperty(self,'collisionActive',{
            /**
             *
             * @returns {collisionActive}
             */
            get:function(){
                return collisionActive;
            }
        });

        Object.defineProperty(self,'collisionEnd',{
            /**
             *
             * @returns {collisionEnd}
             */
            get:function(){
                return collisionEnd;
            }
        });
    }

    Scene_Map.prototype.initialize = function(){
        let self = this;
        let engine = self.engine;
        Events.on(engine,'collisionStart',self.collisionStart);
        Events.on(engine,'collisionActive',self.collisionActive);
        Events.on(engine,'collisionEnd',self.collisionEnd);
    };

    Scene_Map.prototype.finalize = function(){
        let self = this;
        let engine = self.engine;
        Events.off(engine,'collisionStart',self.collisionStart);
        Events.off(engine,'collisionActive',self.collisionActive);
        Events.off(engine,'collisionEnd',self.collisionEnd);
    };

    /**
     *
     * @param obj {object}
     * @returns {object}
     */
    function clone(obj){
        return Object.assign({},obj);
    }

    /**
     *
     * @param a {string}
     * @param b {string}
     * @returns {boolean}
     */
    function sortAsc(a,b){
        return a.localeCompare(b);
    }

    /**
     *
     * @param a {Game_Object}
     * @param b {Game_Object}
     * @returns {boolean}
     */
    function sortByType(a,b){
        return sortAsc(a.type,b.type);
    }

    /**
     *
     * @param a
     * @param b
     * @returns {boolean}
     */
    function sortByPlugin(a,b){
        return sortByType(a.plugin,b.plugin);
    }


    Object.defineProperty(root,'Scene_Map',{
        /**
         *
         * @returns {Scene_Map}
         */
        get:function(){
            return Scene_Map;
        }
    });
})(RPG,window);
