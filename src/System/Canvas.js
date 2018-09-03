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
         * @param options
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
         * @param event
         * @param callback
         */
        addEventListener:function(event,callback){
            if(listeners[event] === undefined){
                listeners[event] = [];
            }
            if(listeners[event].indexOf(callback) === -1){
                listeners[event].push(callback);
            }
        },
        /**
         *
         * @param event
         * @param callback
         */
        removeEventListener:function(event,callback){
            if(listeners[event] !== undefined){
                let index = listeners[event].indexOf(callback);
                if(index !== -1){
                    listeners[event].splice(index,1);
                }
            }
        },
        /**
         *
         * @param event
         * @param args
         */
        trigger:function(event,args){
            if(listeners[event] !== undefined){
                let self = this;
                let length = listeners[event].length;
                for(let i =0; i < length;i++){
                    listeners[event][i].apply(self,args);
                }
            }
        },
        /**
         *
         * @param type
         * @param index
         * @returns {*}
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
        /**
         *
         * @param rect
         */
        drawRect: function(rect){
            let self = this;
            let type = rect.type || Consts.EFFECT_LAYER;
            let index = rect.layer || 0;
            let layer = self.getLayer(type,index);
            layer.rect(rect);
        },
        /**
         *
         * @param image
         * @param options
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
        },
        /**
         *
         * @param type
         * @param index
         * @param x
         * @param y
         * @param width
         * @param height
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
         * @param nx
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
         * @param ny
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
         * @returns {*}
         */
        get:function(){
            return engine.width;
        },
        /**
         *
         * @param w
         */
        set:function(w){
            engine.width = w;
        }
    });

    Object.defineProperty(Canvas,'height',{
        /**
         *
         * @returns {*}
         */
        get:function(){
            return engine.height;
        },
        /**
         *
         * @param h
         */
        set:function(h){
            engine.height = h;
        }
    });

    Object.defineProperty(Canvas,'scale',{
        /**
         *
         * @returns {*}
         */
        get:function(){
            return engine.scale;
        },
        /**
         *
         * @param scale
         */
        set:function(scale){
            engine.scale = scale;
        }
    });

    Object.defineProperty(Canvas,'engine',{
        get:function(){
            return engine;
        }
    });

    Object.defineProperty(root,'Canvas',{
       get:function(){
           return Canvas;
       }
    });
})(RPG,window);