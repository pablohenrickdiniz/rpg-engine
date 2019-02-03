/**
 * @requires ../../src/Consts.js
 * @requires ../../src/Scene/Filters.js
 * @requires ../../src/System/Canvas.js
 * @requires ../../plugins/math-lib/src/Math.js
 */
(function(root){
    let Filters = root.Filters,
        Canvas = root.Canvas,
        Consts = root.Consts;

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

    Filters.set('timelight',function(){
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
    });

    Filters.set('objectlight',function(){
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
    });

    Filters.set('objectshadow',function(){
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
    });
})(RPG);