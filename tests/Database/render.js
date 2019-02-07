(function(root,w){
    let Canvas = w.Canvas,
        Consts = root.Consts,
        Tile = root.Tile,
        Game_Graphic = root.Game_Graphic,
        Main = root.Main;

    let clear_queue = [];
    let bg_refreshed = false;

    function timelight(){
        let now = new Date();
        let time = now.getHours()*60*60+now.getSeconds();
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
            percent:percent
        });
    }

    function objectlight(){
        let self = this;
        let objs = self.objs.filter(function(obj){
            return obj.light;
        });

        objs = objs.sort(function(a,b){
            return a.y-b.y;
        });

        for(let i =0; i < objs.length;i++){
            let objx = objs[i].x-Canvas.x;
            let objy = objs[i].y-Canvas.y;
            Canvas.lighten({
                x:objx,
                y:objy,
                percent:100,
                color:objs[i].lightColor,
                radius:objs[i].lightRadius
            });
        }
    }

    /**
     *
     * @param scene {Scene}
     */
    function draw(scene){
        if(!bg_refreshed){
            let sx = Canvas.x;
            let sy = Canvas.y;
            let spriteset = scene.spriteset;
            let width = Math.min(Canvas.width,spriteset.realWidth);
            let height = Math.min(Canvas.height,spriteset.realHeight);
            let map = scene.map;

            if(!map.loop_x){
                sx = Math.max(sx,0);
            }

            if(!map.loop_y) {
                sy = Math.max(sy, 0);
            }

            let images = spriteset.getArea(sx,sy,width,height);
            let layers = Object.keys(images);
            for(let i = 0; i < layers.length;i++){
                let layer = layers[i];



                Canvas.getLayer(layer > 1?Consts.FOREGROUND_LAYER:Consts.BACKGROUND_LAYER, layer).context.putImageData(images[layer],0,0,0,0,width,height);
            }

            bg_refreshed = true;
        }

        let objs = scene.objs.sort(function(a,b){
            return a.y-b.y;
        });

        for(let i =0; i < objs.length;i++){
            draw_object(objs[i]);
        }
        //
        // if(root.debug){
        //     let length = scene.engine.world.bodies.length;
        //     for(let i =0; i < length;i++){
        //         let body = scene.engine.world.bodies[i];
        //         draw_body(body);
        //     }
        // }
    }

    /**
     *
     * @param body
     */
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
            let layer = Canvas.getLayer(Consts.UI_LAYER,0);
            let ctx = layer.context;

            if(body.label === 'Rectangle Body'){
                x = Math.round(x-Canvas.x);
                y = Math.round(y-Canvas.y);
                ctx.save();
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'black';
                ctx.strokeRect(x,y,width,height);
                ctx.restore();
            }
            else if(body.label === 'Circle Body'){
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

    function clear() {
        if (!bg_refreshed) {
            Canvas.clear(Consts.BACKGROUND_LAYER);
            Canvas.clear(Consts.FOREGROUND_LAYER);
        }

        Canvas.clear(Consts.EFFECT_LAYER);
        Canvas.clear(Consts.EVENT_LAYER);

        // while(clear_queue.length > 0){
        //     let clear = clear_queue.pop();
        //     Canvas.clear(clear.layer_type, clear.layer, clear.x, clear.y, clear.width, clear.height);
        // }
    }

    /**
     *
     * @param object {Game_Object}
     */
    function draw_object(object){
        let frame = object.currentFrame;
        if (frame && (frame instanceof Tile || frame instanceof Game_Graphic) && frame.image) {
            let objx = object.x-Canvas.x;
            let objy = object.y-Canvas.y;
            let image = frame.image;
            let dWidth = frame.dWidth, dHeight = frame.dHeight;
            let x = Math.round(objx-(dWidth/2));
            let y = Math.round(objy-(dHeight/2));





            Canvas.getLayer(Consts.EVENT_LAYER,object.layer).context.drawImage(image,frame.sx,frame.sy,frame.sWidth,frame.sHeight,x,y,dWidth,dHeight);


            clear_queue.push({
                layer_type:Consts.EVENT_LAYER,
                layer:object.layer,
                x:x,
                y:y,
                width:dWidth,
                height:dHeight
            });
        }
    }

    function set_bg_refreshed_false(){
        bg_refreshed = false;
    }

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
                else if(degree > 225 && degree <= 315){
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
                else if((degree > 315 && degree <= 45) || (degree > 135 && degree <= 225)){
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


                let objx = object.x-Canvas.x;
                let objy = object.y-Canvas.y;
                let x = Math.round(objx-(frame.dWidth/2));
                let y = Math.round(objy-(frame.dHeight/2));

                shadows.push({
                    degree:degree,
                    frame:f,
                    distance:distance,
                    alpha:alpha,
                    // skewX:Math.degreeToRadians(skewX),
                    //skewY:Math.degreeToRadians(skewY),
                    scaleX:scaleX,
                    scaleY:scaleY,
                    translateX:objx,
                    translateY:objy+(object.height/2)
                });
            }
        }
        return shadows;
    }

    function draw_shadows(object){
        let layer = Canvas.getLayer(Consts.EVENT_LAYER,0);
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

    function objectshadow(){
        let objs = self.objs.filter(function(obj){
            return !obj.light;
        });

        objs = objs.sort(function(a,b){
            return a.y-b.y;
        });

        for(let i = 0;  i < objs.length;i++){
            draw_shadows(objs[i]);
        }
        for(let i =0; i < objs.length;i++){
            let objx = objs[i].x-Canvas.x;
            let objy = objs[i].y-Canvas.y;
            Canvas.lighten({
                x:objx,
                y:objy,
                percent:100,
                color:objs[i].lightColor,
                radius:100,
                type: Consts.EVENT_LAYER
            });
        }
    }

    /**
     *
     * @param scene {Scene}
     * @param obj {Game_Object}
     */
    function focus(scene,obj){
        let graphic = obj.graphic;
        if(graphic){
            let spriteset = scene.spriteset;
            let viewport_width = Math.min(Canvas.width, spriteset.realWidth);
            let viewport_height = Math.min(Canvas.height, spriteset.realHeight);
            let viewport_x = (obj.x) - (viewport_width / 2);
            let viewport_y = (obj.y) - (viewport_height / 2);
            let max_screen_x = spriteset.realWidth - viewport_width;
            let max_screen_y = spriteset.realHeight - viewport_height;

            if(!scene.map.loop_x){
                if (viewport_x < 0) {
                    viewport_x = 0;
                }
                else if (viewport_x > max_screen_x) {
                    viewport_x = max_screen_x;
                }
            }

            if(!scene.map.loop_y){
                if (viewport_y < 0) {
                    viewport_y = 0;
                }
                else if (viewport_y > max_screen_y) {
                    viewport_y = max_screen_y;
                }
            }

            Canvas.x = viewport_x;
            Canvas.y = viewport_y;
        }
    }

    root.Events.on('initialize',function(){
        Canvas.initialize({
            container: 'canvas-container',
            width: w.innerWidth,
            height: w.innerHeight
        });
    });

    root.Events.on('sceneUpdate',function(scene){
        if(Main.currentPlayer){
            focus(scene,Main.currentPlayer);
        }
        clear();
        draw(scene);
    });

    Canvas.on('changeX',set_bg_refreshed_false);
    Canvas.on('changeY',set_bg_refreshed_false);
    Canvas.on('resize',set_bg_refreshed_false);

    /**
     *
     * @param o {object}
     * @param vw {number}
     * @returns {Array}
     */


    /*
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
    }*/

    /**
     *
     * @param o {object}
     * @param vh {number}
     * @returns {Array}
     */

    /*
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

    */

    /**
     *
     * @param obj {object}
     * @param vw {number}
     * @param vh {number}
     * @returns {Array}
     */

    /*
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
    */

    /*
    if(self.shadows){
        self.on('collisionActive,light,objectBody',function(light,objectBody){
            let object = objectBody.plugin.object;
            let lightSourceObject = light.plugin.object;
            if(object !== lightSourceObject && lightSourceObject.light && !object.light && object.shadow){
                object.lights.push(light);
            }
        });
    }
    */
})(RPG,window);