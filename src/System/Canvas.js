(function (root) {
    if (CE == undefined) {
        throw "Viewport requires Canvas Engine"
    }

    if(root.Consts == undefined){
        throw "Canvas requires Consts"
    }

    var Consts= root.Consts;

    root.Canvas = {
        width: 600,
        height: 600,
        visible: true,
        engine: null,
        layers:[[], [], [], [], []],
        /**
         *
         * @param container
         */
        initialize: function (container) {
            var self = this;
            var width = self.width;
            var height = self.height;
            self.engine = CE.create(container, {
                width: width,
                height: height,
                style: {
                    backgroundColor: 'black'
                }
            });
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


    Object.defineProperty(root.Canvas,'x',{
        get:function(){
            return x;
        },
        set:function(nx){
            if(nx >0 && nx != x){
                x = nx;
            }
        }
    });

    Object.defineProperty(root.Canvas,'y',{
        get:function(){
            return y;
        },
        set:function(ny){
            if(ny >0 && ny != y){
                y = ny;
            }
        }
    });
})(RPG);