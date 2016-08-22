(function (root) {
    if (CE == undefined) {
        throw "Video requires Canvas Engine"
    }

    if (root.System == undefined) {
        throw "Video requires System"
    }

    var layers_name = [
        'BG1',//Background 1
        'BG2',//Background 2
        'BG3',//Background 3
        'EV1',//Eventos 1
        'EV2',//Eventos 2
        'EV3',//Eventos 2
        'FR1',//Foreground 4
        'FR2',//Foreground 5
        'FR3',//Foreground 6
        'EF1',//Effects 1
        'EF2',//Effects 2
        'EF3',//Effects 3
        'UI1',//UI 1
        'UI2',//UI 2
        'UI3'//UI3
    ];

    var System = root.System;
    System.Video = {
        x: 0,
        y: 0,
        width: 600,
        height: 600,
        fps: 60,
        layers: {
            BG1: null,//Background 1
            BG2: null,//Background 2
            BG3: null,//Background 3
            EV1: null,//Eventos 1
            EV2: null,//Eventos 2
            EV3: null,//Eventos 2
            FR1: null,//Foreground 4
            FR2: null,//Foreground 5
            FR3: null,//Foreground 6
            EF1: null,//Effects 1
            EF2: null,//Effects 2
            EF3: null,//Effects 3
            UI1:null,//UI 1
            UI2:null,//UI 2
            UI3:null//UI3
        },
        initialize: function (container) {
            var self = this;
            var width = self.width;
            var height = self.height;

            var engine = CE.create(container, {
                width: self.width,
                height: self.height,
                style: {
                    backgroundColor: 'black'
                }
            });
            var length = layers_name.length;
            var i;

            for(i =0; i < length;i++){
                self.layers[layers_name[i]] = engine.createLayer({width: width, height: height});
            }
        },
        getLayer:function(layer){
            var self = this;

            if(/^[0-9]+$/.test(layer)){
                if(layers_name[layer] != undefined){
                    return self.layers[layers_name[layer]];
                }
            }
            else if(self.layers[layer] != undefined){
                return self.layers[layer];
            }
            return null;
        },
        setX:function(x){
            var self = this;
            if(x > 0 && x != self.x){
                self.x = x;
            }
        },
        setY:function(y){
            var self = this;
            if(y > 0 && y != self.y){
                self.y = y;
            }
        },
        drawGraphic: function (image, options) {
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
            if(per.test(sWidth)){
                sWidth = (image.width*parseFloat(sWidth))/100;
            }

            if(per.test(sHeight)){
                sHeight = (image.height*parseFloat(sHeight))/100;
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
        clearArea: function (x, y, width, height, layer_name) {
            var self = this;
            var layer = self.layers[layer_name];
            if (layer !== null) {
                layer.clear(x, y, width, height);
            }
        },
        clear:function(layer_name){
            var self = this;
            var layer = self.layers[layer_name];
            if (layer !== null) {
                layer.clear();
            }
        },
        clearBGLayers: function () {
            var self = this;
            var layers = self.layers;
            layers.BG1.clear();
            layers.BG2.clear();
            layers.BG3.clear();
        }
    };
})(RPG);