(function (root) {
    if (CE == undefined) {
        throw "Viewport requires Canvas Engine"
    }


    root.Viewport = {
        left: 0,
        top: 0,
        width: 600,
        height: 600,
        realLeft: 0,
        realTop: 0,
        absoluteLeft: 0,
        absoluteTop: 0,
        realWidth: 600,
        realHeight: 600,
        borderWidth: 0,
        scrollTop:0,
        scrollLeft:0,
        padding:0,
        visible: true,
        layers: {
            BG: [],
            EV: [],
            FR: [],
            EF: [],
            UI: []
        },
        engine: null,
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
        getLayer: function (type, index) {
            var self = this;
            var keys = Object.keys(self.layers);
            var i;
            var length = keys.length;
            var s_index = 0;
            var key;
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
            return null;
        },
        setX: function (x) {
            var self = this;
            if (x > 0 && x != self.x) {
                self.x = x;
            }
        },
        setY: function (y) {
            var self = this;
            if (y > 0 && y != self.y) {
                self.y = y;
            }
        },
        drawImage: function (image, options) {
            var self = this;
            var layer_name = options.layer || 'EF1';
            var layer = self.layers[layer_name];
            var context = layer.getContext();
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
        /*
         clearGraphic(int layer index, Graphic graphic):void
         Limpa uma região do canvas onde é desenhado um gráfico
         */
        clearArea: function (x, y, width, height, layerName) {
            var self = this;
            var layer = self.layers[layerName];
            if (layer !== null) {
                layer.clear(x, y, width, height);
            }
        },
        clear: function (layerName) {
            var self = this;
            var layer = self.layers[layerName];
            if (layer !== null) {
                layer.clear();
            }
        },
        click:function(){

        }
    };
})(RPG);