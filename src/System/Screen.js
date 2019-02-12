/**
 * @requires ../RPG.js
 * @requires Time/Timer_Ticker.js
 * @requires ../Consts.js
 * @requires ../../plugins/canvas-engine/src/dist/js/CanvasEngine.js
 * @requires ../../plugins/canvas-engine/src/dist/js/CanvasLayer.js
 */
(function (root,w) {
    let Consts = root.Consts,
        Game_Timer = root.Game_Timer;

    let x = 0;
    let y = 0;
    let engine = null;
    let layers = [[], [], [], [], []];
    let listeners = [];
    let fade = 0;
    let fadding = false;
    let fadeStart = null;
    let fadeEnd = null;
    let fadeCallback = null;
    let fadeType = null;
    let fadeTime = null;

    let Screen = {
        visible: true,
        /**
         *
         * @param options {object}
         */
        initialize: function (options) {
            let self = this;
            options = options || {};
            let width = options.width;
            let height = options.height;
            let scale = options.scale | 1;
            let element = document.getElementById(options.container);
            while(element.children.length > 0){
                element.removeChild(element.firstChild);
            }
            element.setAttribute('class','game-container');

            engine = CE.create(element, {
                width: width,
                height: height,
                scale:scale,
                style: {
                    backgroundColor: 'black',
                    zIndex:1
                },
                resizeLayers:true
            });

            for(let i = 0; i < layers.length;i++){
                for(let j = 0; j < 3;j++){
                    layers[i].push(engine.createLayer());
                }
            }

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
        fadeIn:function(time,callback){
            if(!fadding){
                fadding = true;
                fadeStart = Game_Timer.currentTime;
                fadeTime = time;
                fadeEnd = fadeStart+fadeTime;
                fadeCallback = callback;
                fadeType = 'in';
            }
        },
        fadeOut:function(time,callback){
            if(!fadding){
                fadding = true;
                fadeStart = Game_Timer.currentTime;
                fadeTime = time;
                fadeEnd = fadeStart+fadeTime;
                fadeCallback = callback;
                fadeType = 'out';
            }
        },
        /**
         *
         * @param eventName {string}
         * @param callback {function}
         * @returns {Screen}
         */
        on:function(eventName,callback){
            if(!listeners[eventName]){
                listeners[eventName] = [];
            }
            if(listeners[eventName].indexOf(callback) === -1){
                listeners[eventName].push(callback);
            }

            return Screen;
        },
        /**
         *
         * @param eventName {string}
         * @param callback {function}
         */
        off:function(eventName,callback){
            if(listeners[eventName]){
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
            if(listeners[eventName]){
                let self = this;
                let length = listeners[eventName].length;
                for(let i =0; i < length;i++){
                    listeners[eventName][i].apply(self,args);
                }
            }
        },
        /**
         *
         * @param type {number}
         * @param index number}
         * @returns {CanvasLayer}
         */
        getLayer: function (type, index) {
            if(layers[type]){
                if(index === 0 || index){
                    if(layers[type][index]){
                        return layers[type][index];
                    }
                }
                else{
                    return layers[type];
                }
            }

            return null;
        },
        darken:function(options){
            let self = this;
            if(options.percent !== 0){
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
            }
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
         * @returns {Screen}
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
         * @returns {Screen}
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
         * @returns {Screen}
         */
        clear: function (type, index, x, y, width, height) {
            let self = this;
            let layer = self.getLayer(type,index);
            if(layer){
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

    function fadeUpdate(){
        if(fadding){
            let now = Game_Timer.currentTime;
            let fade =  Math.max(0,Math.min(1,(now-fadeStart)/fadeTime));
            Screen.fade = fadeType === 'in'?fade:1-fade;
            if(now >= fadeEnd){
                if(fadeCallback){
                    fadeCallback();
                    fadeCallback = null;
                }
                fadding = false;
            }
        }
    }

    Game_Timer.on('tick',fadeUpdate);

    Object.defineProperty(Screen,'fade',{
        set:function(f){
            if(f !== fade){
                fade = f;
                let elements = document.getElementsByClassName('game-ui');
                for(let i = 0; i < elements.length;i++){
                    elements[i].style.backgroundColor = 'rgba(0,0,0,'+fade+')';
                }

                /*
                let ctx = Screen.getLayer(Consts.FADE_SCREEN_LAYER,0).context;
                ctx.clearRect(0,0,engine.width,engine.height);
                if(fade > 0){
                    ctx.save();
                    ctx.fillStyle = 'rgba(0,0,0,'+fade+')';
                    ctx.fillRect(0,0,engine.width,engine.height);
                    ctx.restore();
                }*/
            }
        }
    });

    Object.defineProperty(Screen,'x',{
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
            nx = parseInt(nx);
            if(!isNaN(nx) && nx !== x){
                x = nx;
                Screen.trigger('changeX',[x]);
            }
        }
    });

    Object.defineProperty(Screen,'y',{
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
            ny = parseInt(ny);
            if(!isNaN(ny) && ny !== y){
                y = ny;
                Screen.trigger('changeY',[y]);
            }
        }
    });

    Object.defineProperty(Screen,'width',{
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

    Object.defineProperty(Screen,'height',{
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

    Object.defineProperty(Screen,'scale',{
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

    Object.defineProperty(Screen,'engine',{
        /**
         *
         * @returns {CE}
         */
        get:function(){
            return engine;
        }
    });

    Object.defineProperty(w,'Screen',{
        /**
         *
         * @returns {Screen}
         */
        get:function(){
            return Screen;
        }
    });
})(RPG,window);