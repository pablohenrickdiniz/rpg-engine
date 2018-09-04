'use strict';
(function (root) {
    if(!root.Animation){
        throw "Scene requires Animation"
    }

    if(!root.Canvas){
        throw "Scene requires Canvas"
    }

    if(!root.Consts){
        throw "Scene requires Consts"
    }

    let Animation = root.Animation,
        Canvas = root.Canvas,
        Consts = root.Consts;

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Scene =  function (options) {
        let self = this;
        options = options || {};
        self.audios = options.audios || {};
        self.graphics = options.graphics || {};
        self.animation_queue = [];
        self.fps = options.fps || 60;
        self.listeners = [];

        if(typeof options.start === 'function'){
            self.addEventListener('start',options.start);
        }

        if(typeof options.beforeload === 'function'){
            self.addEventListener('beforeload',options.beforeload);
        }

        if(typeof options.afterload === 'function'){
            self.addEventListener('afterload',options.afterload);
        }

        if(typeof options.onaudioprogress === 'function'){
            self.addEventListener('onaudioprogress',options.onaudioprogress);
        }

        if(typeof options.ongraphicprogress === 'function'){
            self.addEventListener('ongraphicprogress',options.ongraphicprogress);
        }

        if(typeof options.onprogress === 'function'){
            self.addEventListener('onprogress',options.onprogress);
        }
    };

    /**
     *
     * @param time {number}
     * @param oncomplete {function}
     */
    Scene.prototype.fadeIn = function (time, oncomplete) {
        fade_screen_effect.apply(this, [time, oncomplete, 'negative']);
    };

    /**
     *
     * @param time {number}
     * @param oncomplete {function}
     */
    Scene.prototype.fadeOut =  function (time, oncomplete) {
        fade_screen_effect.apply(this, [time, oncomplete, 'positive']);
    };


    Scene.prototype.exit = function(){

    };

    /**
     *
     * @param eventName {string}
     * @param args {Array}
     */
    Scene.prototype.trigger = function(eventName,args){
        let self = this;
        if(self.listeners[eventName] !== undefined){
            let length = self.listeners[eventName].length;
            for(let i = 0; i < length;i++){
                self.listeners[eventName][i].apply(self,args);
            }
        }
    };

    /**
     *
     * @param eventName {string}
     * @param callback {function}
     */
    Scene.prototype.addEventListener = function(eventName,callback){
        let self = this;
        if(self.listeners[eventName] === undefined){
            self.listeners[eventName] = [];
        }
        if(self.listeners[eventName].indexOf(callback) === -1){
            self.listeners[eventName].push(callback);
        }
    };

    /**
     *
     * @param eventName {string}
     * @param callback {function}
     */
    Scene.prototype.removeEventListener = function(eventName,callback){
        let self = this;
        if(self.listeners[eventName] !== undefined){
            let index =self.listeners[eventName].indexOf(callback);
            if(index !== -1){
                self.listeners[eventName].splice(index,1);
            }
        }
    };

    /**
     *
     * @param image
     * @param options {object}
     * @param oncomplete {function}
     */
    Scene.prototype.fadeInGraphic = function (image, options, oncomplete) {
        fade_graphic_effect.apply(this, [image, options, oncomplete, 'positive']);
    };

    /**
     *
     * @param image
     * @param options {object}
     * @param oncomplete {function}
     */
    Scene.prototype.fadeOutGraphic = function (image, options, oncomplete) {
        fade_graphic_effect.apply(this, [image, options, oncomplete, 'negative']);
    };

    Scene.prototype.step = function(){
        let self = this;
        step_animations(self);
    };

    /**
     *
     * @param image
     * @param options
     * @param oncomplete
     * @param direction
     * @returns {object}
     *
     * **/

    function fade_graphic_effect(image, options, oncomplete, direction) {
        options = options || {};
        let sx = options.sx || 0;
        let sy = options.sy || 0;
        let sWidth = options.sWidth || image.width;
        let sHeight = options.sHeight || image.height;
        let dx = options.dx || 0;
        let dy = options.dy || 0;
        let dWidth = options.dWidth || image.width;
        let dHeight = options.dHeight || image.height;
        let time = options.time || 1000;
        let vAlign = options.vAlign || null;
        let hAlign = options.hAlign || null;
        let layer = Canvas.getLayer(Consts.EFFECT_LAYER,Consts.FADE_SCREEN_LAYER);

        let self = this;

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

        let animation = new Animation(self.fps, self.fps * (time / 1000));
        let type = '';
        if (direction === 'positive') {
            type = 'fade_in_graphic'
        }
        else {
            direction = 'negative';
            type = 'fade_out_graphic'
        }

        animation.run(true, direction);
        let animation_set = {
            type: type,
            time: time,
            image_data: {
                sx: sx,
                sy: sy,
                sWidth: sWidth,
                sHeight: sHeight,
                dx: dx,
                dy: dy,
                dWidth: dWidth,
                dHeight: dHeight,
                image: image
            },
            animation: animation,
            oncomplete: oncomplete
        };
        self.animation_queue.push(animation_set);
        return animation_set;
    }

    /**
     *
     * @param self {Scene}
     */
    function step_animations(self) {
        let length = self.animation_queue.length;
        let i;
        for (i = 0; i < length; i++) {
            let animation_set = self.animation_queue[i];
            let animation = null;
            let running = false;
            let index = 0;
            let opacity = null;
            let ctx = null;

            switch (animation_set.type) {
                case 'fade_in_screen':
                case 'fade_out_screen':
                    animation = animation_set.animation;
                    running = animation.isRunning();
                    index = animation.getIndexFrame();
                    if (!running) {
                        if (animation.direction === 'negative') {
                            opacity = 0;
                        }
                        else {
                            opacity = 1;
                        }
                    }
                    else {
                        opacity = (index / (animation.frame_count - 1));
                    }

                    ctx = Canvas.getLayer(Consts.EFFECT_LAYER,Consts.FADE_SCREEN_LAYER).getContext();
                    ctx.clearRect(0, 0, Canvas.width, Canvas.height);

                    if (opacity > 0) {
                        ctx.fillStyle = 'rgba(0,0,0,' + opacity + ')';
                        ctx.fillRect(0, 0, Canvas.width, Canvas.height);
                    }

                    if (!running) {
                        self.animation_queue.splice(i, 1);
                        i--;
                        length--;
                        if (animation_set.oncomplete) {
                            animation_set.oncomplete();
                        }
                    }
                    break;
                //case 'fade_in_graphic':
                //case 'fade_out_image':
                //    animation = animation_set.animation;
                //    running = animation.isRunning();
                //    index = animation.getIndexFrame();
                //
                //    if (!running) {
                //        if (animation.direction == 'negative') {
                //            opacity = 0;
                //        }
                //        else {
                //            opacity = 1;
                //        }
                //    }
                //    else {
                //        opacity = (index / (animation.frame_count - 1));
                //    }
                //
                //
                //    let layer = Canvas.getLayer(layer_name);
                //    let image_data = animation_set.image_data;
                //    ctx = layer.getContext();
                //
                //    ctx.clearRect(image_data.dx, image_data.dy, image_data.dWidth, image_data.dHeight);
                //
                //    if (opacity > 0) {
                //        ctx.globalAlpha = opacity;
                //        ctx.drawImage(image_data.image, image_data.sx, image_data.sy, image_data.sWidth, image_data.sHeight, image_data.dx, image_data.dy, image_data.dWidth, image_data.dHeight);
                //        ctx.globalAlpha = 1;
                //    }
                //
                //
                //    if (!running) {
                //        self.animation_queue.splice(i, 1);
                //        i--;
                //        length--;
                //
                //        if (animation_set.oncomplete) {
                //            animation_set.oncomplete();
                //        }
                //    }
                //    break;
                default:
            }
        }
    }

    /**
     *
     * @param time {number}
     * @param oncomplete {function}
     * @param direction {string}
     */
    function fade_screen_effect(time, oncomplete, direction) {
        let self = this;
        time = parseInt(time);
        time = isNaN(time) || time < 0 ? 2000 : time;
        let type = '';
        if (direction === 'negative') {
            type = 'fade_out_screen';
        }
        else {
            direction = 'positive';
            type = 'fade_in_screen';
        }

        let animation = new Animation(self.fps, self.fps * (time / 1000));
        animation.execute(true, direction);
        let animation_set = {
            type: type,
            time: time,
            oncomplete: oncomplete,
            animation: animation
        };

        self.animation_queue.push(animation_set);
    }

    Object.defineProperty(root,'Scene',{
        /**
         *
         * @returns {Scene}
         */
       get:function(){
           return Scene;
       }
    });
})(RPG);