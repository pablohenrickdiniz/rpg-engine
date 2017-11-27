(function (root) {
    if (CE == undefined) {
        throw "Viewport requires Canvas Engine"
    }

    if(root.Consts == undefined){
        throw "Canvas requires Consts"
    }

    var Consts= root.Consts;

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
            var self = this;
            options = options || {};
            var container = options.container;
            var width = options.width;
            var height = options.height;
            var scale = options.scale | 1;
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
            var self = this;
            self.engine.scale += 0.1;
        },
        zoomOut:function(){
            var self = this;
            self.engine.scale -= 0.1;
        },
        /**
         *
         * @param event
         * @param callback
         */
        addEventListener:function(event,callback){
            var self = this;
            if(self.listeners[event] == undefined){
                self.listeners[event] = [];
            }
            if(self.listeners[event].indexOf(callback) == -1){
                self.listeners[event].push(callback);
            }
        },
        /**
         *
         * @param event
         * @param callback
         */
        removeEventListener:function(event,callback){
            var self = this;
            if(self.listeners[event] != undefined){
                var index = self.listeners[event].indexOf(callback);
                if(index != -1){
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
            var self = this;
            if(self.listeners[event] != undefined){
                var length = self.listeners[event].length;
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
            var self = this;
            var keys = Object.keys(self.layers);
            var i;
            var length = keys.length;
            var s_index = 0;
            var key;

            if(index != undefined){
                for(i =0; i < length;i++){
                    key = keys[i];
                    if(type != key){
                        s_index+=self.layers[key].length;
                    }
                    else{
                        while(index > self.layers[key].length-1){
                            var layer = self.engine.createLayer({
                                zIndex:s_index+self.layers[key].length
                            });
                            self.layers[key].push(layer);
                        }
                        return self.layers[key][index];
                    }
                }
            }
            else if(self.layers[type] != undefined){
                return self.layers[type];
            }

            return null;
        },
        /**
         *
         * @param image
         * @param options
         */
        drawImage: function (image, options) {
            var self = this;
            var type = options.type || Consts.EFFECT_LAYER;
            var index = options.layer || 0;
            var layer = self.getLayer(type,index);
            var context = layer.context;
            var sx = options.sx || 0;
            var sy = options.sy || 0;
            var dx = options.dx || 0;
            var dy = options.dy || 0;
            var vAlign = options.vAlign || null;
            var hAlign = options.hAlign || null;

            var sWidth = options.sWidth || image.width;
            var sHeight = options.sHeight || image.height;

            var per = /^[0-9]+(\.[0-9]+)?%$/;
            if (per.test(sWidth)) {
                sWidth = (image.width * parseFloat(sWidth)) / 100;
            }

            if (per.test(sHeight)) {
                sHeight = (image.height * parseFloat(sHeight)) / 100;
            }

            var dWidth = options.dWidth || sWidth;
            var dHeight = options.dHeight || sHeight;


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
            var self = this;
            var layer = self.getLayer(type,index);
            if(layer != null){
                if(layer instanceof Array){
                    var length = layer.length;
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

    var x = 0;
    var y = 0;
    var canvas = root.Canvas;


    Object.defineProperty(canvas,'x',{
        get:function(){
            return x;
        },
        set:function(nx){
            nx = parseFloat(nx);
            if(!isNaN(nx) && nx != x){
                x = nx;
            }
        }
    });

    Object.defineProperty(canvas,'y',{
        get:function(){
            return y;
        },
        set:function(ny){
            ny = parseFloat(ny);
            if(!isNaN(ny) && ny != y){
                y = ny;
            }
        }
    });

    Object.defineProperty(canvas,'width',{
        get:function(){
            return canvas.engine.width;
        },
        set:function(w){
            canvas.engine.width = w;
        }
    });

    Object.defineProperty(canvas,'height',{
        get:function(){
            return canvas.engine.height;
        },
        set:function(h){
            canvas.engine.height = h;
        }
    });

    Object.defineProperty(canvas,'scale',{
        get:function(){
            return canvas.engine.scale;
        },
        set:function(scale){
            canvas.engine.scale = scale;
        }
    });
})(RPG);