'use strict';
(function (root) {
    if (CE === undefined) {
        throw "Viewport requires Canvas Engine";
    }

    if(root.Consts === undefined){
        throw "Canvas requires Consts";
    }

    let Consts= root.Consts;

    root.Canvas = {
        visible: true,
        engine: null,
        layers:[[], [], [], [], []],
        listeners:[],
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
            self.engine = CE.create(container, {
                width: width,
                height: height,
                scale:scale,
                style: {
                    backgroundColor: 'black',
                    zIndex:1
                },
                resizeLayers:true
            });

            self.engine.addEventListener('resize',function(){
                self.trigger('resize');
            });
        },
        zoomIn:function(){
            let self = this;
            self.engine.scale += 0.1;
        },
        zoomOut:function(){
            let self = this;
            self.engine.scale -= 0.1;
        },
        /**
         *
         * @param event
         * @param callback
         */
        addEventListener:function(event,callback){
            let self = this;
            if(self.listeners[event] === undefined){
                self.listeners[event] = [];
            }
            if(self.listeners[event].indexOf(callback) === -1){
                self.listeners[event].push(callback);
            }
        },
        /**
         *
         * @param event
         * @param callback
         */
        removeEventListener:function(event,callback){
            let self = this;
            if(self.listeners[event] !== undefined){
                let index = self.listeners[event].indexOf(callback);
                if(index !== -1){
                    self.listeners[event].splice(index,1);
                }
            }
        },
        /**
         *
         * @param event
         * @param args
         */
        trigger:function(event,args){
            let self = this;
            if(self.listeners[event] !== undefined){
                let length = self.listeners[event].length;
                for(var i =0; i < length;i++){
                    self.listeners[event][i].apply(self,args);
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
            let keys = Object.keys(self.layers);
            let i;
            let length = keys.length;
            let s_index = 0;
            let key;

            if(index !== undefined){
                for(i =0; i < length;i++){
                    key = parseInt(keys[i]);
                    if(type !== key){
                        s_index+=self.layers[key].length;
                    }
                    else{
                        while(index > self.layers[key].length-1){
                            let layer = self.engine.createLayer({
                                zIndex:s_index+self.layers[key].length
                            });
                            self.layers[key].push(layer);
                        }
                        return self.layers[key][index];
                    }
                }
            }
            else if(self.layers[type] !== undefined){
                return self.layers[type];
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
                    for(var i =0; i < length;i++){
                        layer[i].clear(x, y, width, height);
                    }
                }
                else{
                    layer.clear(x,y,width,height);
                }
            }
        }
    };

    let x = 0;
    let y = 0;
    let canvas = root.Canvas;

    Object.defineProperty(canvas,'x',{
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

    Object.defineProperty(canvas,'y',{
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

    Object.defineProperty(canvas,'width',{
        /**
         *
         * @returns {*}
         */
        get:function(){
            return canvas.engine.width;
        },
        /**
         *
         * @param w
         */
        set:function(w){
            canvas.engine.width = w;
        }
    });

    Object.defineProperty(canvas,'height',{
        /**
         *
         * @returns {*}
         */
        get:function(){
            return canvas.engine.height;
        },
        /**
         *
         * @param h
         */
        set:function(h){
            canvas.engine.height = h;
        }
    });

    Object.defineProperty(canvas,'scale',{
        /**
         *
         * @returns {*}
         */
        get:function(){
            return canvas.engine.scale;
        },
        /**
         *
         * @param scale
         */
        set:function(scale){
            canvas.engine.scale = scale;
        }
    });
})(RPG);