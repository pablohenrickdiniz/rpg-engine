'use strict';
(function (root,w) {
    if (!w.CE) {
        throw "Viewport requires Canvas Engine";
    }

    if(!root.Consts){
        throw "Canvas requires Consts";
    }

    let Consts = root.Consts;
    let x = 0;
    let y = 0;
    let engine = null;
    let layers = [[], [], [], [], []];
    let listeners = [];

    let Canvas = {
        visible: true,
        /**
         *
         * @param options {object}
         */
        initialize: function (options) {
            let self = this;
            options = options || {};
            let container = options.container;
            let width = options.width;
            let height = options.height;
            let scale = options.scale | 1;
            engine = CE.create(container, {
                width: width,
                height: height,
                scale:scale,
                style: {
                    backgroundColor: 'black',
                    zIndex:1
                },
                resizeLayers:true
            });

            engine.addEventListener('resize',function(){
                self.trigger('resize');
            });
        },
        zoomIn:function(){
            engine.scale += 0.1;
        },
        zoomOut:function(){
            engine.scale -= 0.1;
        },
        /**
         *
         * @param eventName {string}
         * @param callback {function}
         * @returns {Canvas}
         */
        on:function(eventName,callback){
            if(listeners[eventName] === undefined){
                listeners[eventName] = [];
            }
            if(listeners[eventName].indexOf(callback) === -1){
                listeners[eventName].push(callback);
            }
            return Canvas;
        },
        /**
         *
         * @param eventName {string}
         * @param callback {function}
         */
        removeEventListener:function(eventName,callback){
            if(listeners[eventName] !== undefined){
                let index = listeners[eventName].indexOf(callback);
                if(index !== -1){
                    listeners[eventName].splice(index,1);
                }
            }
        },
        /**
         *
         * @param eventName {string}
         * @param args {Array}
         */
        trigger:function(eventName,args){
            if(listeners[eventName] !== undefined){
                let self = this;
                let length = listeners[eventName].length;
                for(let i =0; i < length;i++){
                    listeners[eventName][i].apply(self,args);
                }
            }
        },
        /**
         *
         * @param type {string}
         * @param index number}
         * @returns {CanvasLayer}
         */
        getLayer: function (type, index) {
            let self = this;
            let keys = Object.keys(layers);
            let i;
            let length = keys.length;
            let s_index = 0;
            let key;

            if(index !== undefined){
                for(i =0; i < length;i++){
                    key = parseInt(keys[i]);
                    if(type !== key){
                        s_index+=layers[key].length;
                    }
                    else{
                        while(index > layers[key].length-1){
                            let layer = self.engine.createLayer({
                                zIndex:s_index+layers[key].length
                            });
                            layers[key].push(layer);
                        }
                        return layers[key][index];
                    }
                }
            }
            else if(layers[type] !== undefined){
                return layers[type];
            }

            return null;
        },
        darken:function(options){
            let self = this;
            let type = options.type || Consts.EFFECT_LAYER;
            let index = options.layer || 0;
            let percent = options.percent || 50;
            let layer = self.getLayer(type,index);
            let ctx = layer.context;
            let x = options.x || 0;
            let y = options.y || 0;
            let width = options.width || self.width;
            let height = options.height || self.height;
            ctx.fillStyle = 'rgba(0,0,0,'+percent/100+')';
            ctx.fillRect(x,y,width,height);
            return self;
        },
        lighten:function(options){
            let self = this;
            let type = options.type || Consts.EFFECT_LAYER;
            let index = options.layer || 0;
            let percent = options.percent || 50;
            let layer = self.getLayer(type,index);
            let ctx = layer.context;
            ctx.save();
            let x = options.x || 0;
            let y = options.y || 0;
            let radius = options.radius || 100;
            ctx.globalCompositeOperation = "destination-out";
            var grd = ctx.createRadialGradient(x,y,1,x,y,radius);
            grd.addColorStop(0,"rgba(255,255,255,"+percent/100+")");
            grd.addColorStop(1,"transparent");
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(x,y,radius,0,2*Math.PI);
            ctx.fill();
            ctx.restore();
        },
        /**
         *
         * @param rect {object}
         * @returns {Canvas}
         */
        drawRect: function(rect){
            let self = this;
            let type = rect.type || Consts.EFFECT_LAYER;
            let index = rect.layer || 0;
            let layer = self.getLayer(type,index);
            layer.rect(rect);
            return self;
        },
        /**
         *
         * @param image {Image}
         * @param options {object}
         * @returns {Canvas}
         */
        drawImage: function (image, options) {
            let self = this;
            let type = options.type || Consts.EFFECT_LAYER;
            let index = options.layer || 0;
            let layer = self.getLayer(type,index);
            let context = layer.context;
            let sx = options.sx || 0;
            let sy = options.sy || 0;
            let dx = options.dx || 0;
            let dy = options.dy || 0;
            let vAlign = options.vAlign || null;
            let hAlign = options.hAlign || null;

            let sWidth = options.sWidth || image.width;
            let sHeight = options.sHeight || image.height;

            let per = /^[0-9]+(\.[0-9]+)?%$/;
            if (per.test(sWidth)) {
                sWidth = (image.width * parseFloat(sWidth)) / 100;
            }

            if (per.test(sHeight)) {
                sHeight = (image.height * parseFloat(sHeight)) / 100;
            }

            let dWidth = options.dWidth || sWidth;
            let dHeight = options.dHeight || sHeight;

            if (vAlign != null) {
                switch (vAlign) {
                    case 'top':
                        dy = 0;
                        break;
                    case 'center':
                        dy = (layer.height / 2) - (dHeight / 2);
                        break;
                    case 'bottom':
                        dy = layer.height - dHeight;
                        break;
                }
            }

            if (hAlign != null) {
                switch (hAlign) {
                    case 'left':
                        dx = 0;
                        break;
                    case 'center':
                        dx = (layer.width / 2) - (dWidth / 2);
                        break;
                    case 'right':
                        dx = layer.width - dWidth;
                        break;
                }
            }
            context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            return self;
        },
        /**
         *
         * @param type {string}
         * @param index {number}
         * @param x {number}
         * @param y {number}
         * @param width {number}
         * @param height {number}
         * @returns {Canvas}
         */
        clear: function (type, index, x, y, width, height) {
            let self = this;
            let layer = self.getLayer(type,index);
            if(layer != null){
                if(layer instanceof Array){
                    let length = layer.length;
                    for(let i =0; i < length;i++){
                        layer[i].clear(x, y, width, height);
                    }
                }
                else{
                    layer.clear(x,y,width,height);
                }
            }
            return self;
        }
    };

    Object.defineProperty(Canvas,'x',{
        /**
         *
         * @returns {number}
         */
        get:function(){
            return x;
        },
        /**
         *
         * @param nx {number}
         */
        set:function(nx){
            nx = parseFloat(nx);
            if(!isNaN(nx) && nx !== x){
                x = nx;
            }
        }
    });

    Object.defineProperty(Canvas,'y',{
        /**
         *
         * @returns {number}
         */
        get:function(){
            return y;
        },
        /**
         *
         * @param ny {number}
         */
        set:function(ny){
            ny = parseFloat(ny);
            if(!isNaN(ny) && ny !== y){
                y = ny;
            }
        }
    });

    Object.defineProperty(Canvas,'width',{
        /**
         *
         * @returns {number}
         */
        get:function(){
            return engine.width;
        },
        /**
         *
         * @param w {number}
         */
        set:function(w){
            engine.width = w;
        }
    });

    Object.defineProperty(Canvas,'height',{
        /**
         *
         * @returns {number}
         */
        get:function(){
            return engine.height;
        },
        /**
         *
         * @param h {number}
         */
        set:function(h){
            engine.height = h;
        }
    });

    Object.defineProperty(Canvas,'scale',{
        /**
         *
         * @returns {number}
         */
        get:function(){
            return engine.scale;
        },
        /**
         *
         * @param scale {number}
         */
        set:function(scale){
            engine.scale = scale;
        }
    });

    Object.defineProperty(Canvas,'engine',{
        /**
         *
         * @returns {CE}
         */
        get:function(){
            return engine;
        }
    });

    Object.defineProperty(root,'Canvas',{
        /**
         *
         * @returns {Canvas}
         */
        get:function(){
           return Canvas;
       }
    });
})(RPG,window);