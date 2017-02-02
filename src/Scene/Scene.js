(function (root) {
    if(root.Animation == undefined){
        throw "Scene requires Animation"
    }

    if(root.Canvas == undefined){
        throw "Scene requires Viewport"
    }

    if(root.Consts == undefined){
        throw "Scene requires Consts"
    }

    var Animation = root.Animation,
        Canvas = root.Canvas,
        Consts = root.Consts;


    var Scene =  function (options) {
        var self = this;
        options = options || {};
        self.audios = options.audios || {};
        self.graphics = options.graphics || {};
        self.animation_queue = [];
        self.fps = options.fps || 60;
        self.eventListeners = {};


        if(options.start){
            self.addEventListener('start',options.start);
        }

        if(options.beforeload){
            self.addEventListener('beforeload',options.beforeload);
        }

        if(options.afterload){
            self.addEventListener('afterload',options.afterload);
        }

        if(options.onaudioprogress){
            self.addEventListener('onaudioprogress',options.onaudioprogress);
        }

        if(options.ongraphicprogress){
            self.addEventListener('ongraphicprogress',options.ongraphicprogress);
        }

        if(options.onprogress){
            self.addEventListener('onprogress',options.onprogress);
        }
    };


    /**
     *
     * @param time
     * @param oncomplete
     */
    Scene.prototype.fadeIn = function (time, oncomplete) {
        fade_screen_effect.apply(this, [time, oncomplete, 'negative']);
    };

    /**
     *
     * @param time
     * @param oncomplete
     */
    Scene.prototype.fadeOut =  function (time, oncomplete) {
        fade_screen_effect.apply(this, [time, oncomplete, 'positive']);
    };


    Scene.prototype.exit = function(){

    };

    /**
     *
     * @param event
     * @param args
     */
    Scene.prototype.trigger = function(event,args){
        var self = this;
        if(self.eventListeners[event] != undefined){
            var length = self.eventListeners[event].length;
            for(var i = 0; i < length;i++){
                self.eventListeners[event][i].apply(self,args);
            }
        }
    };

    /**
     *
     * @param event
     * @param callback
     */
    Scene.prototype.addEventListener = function(event,callback){
        var self = this;
        if(self.eventListeners[event] == undefined){
            self.eventListeners[event] = [];
        }
        if(self.eventListeners[event].indexOf(callback) == -1){
            self.eventListeners[event].push(callback);
        }
    };

    Scene.prototype.removeEventListener = function(event,callback){
        var self = this;
        if(self.eventListeners[event] != undefined){
            var index =self.eventListeners[event].indexOf(callback);
            if(index != -1){
                self.eventListeners[event].splice(index,1);
            }
        }
    };

    /**
     *
     * @param image
     * @param options
     * @param oncomplete
     */
    Scene.prototype.fadeInGraphic = function (image, options, oncomplete) {
        fade_graphic_effect.apply(this, [image, options, oncomplete, 'positive']);
    };
    Scene.prototype.fadeOutGraphic = function (image, options, oncomplete) {
        fade_graphic_effect.apply(this, [image, options, oncomplete, 'negative']);
    };

    /**
     *
     */
    Scene.prototype.step = function(){
        var self = this;
        step_animations(self);
    };

    /**
     *
     * @param image
     * @param options
     * @param oncomplete
     * @param direction
     * @returns {{type: string, time: (*|number), image_data: {sx: (options.sx|*|number), sy: (options.sy|*|number), sWidth: (*|Animated_Tile.getGraphic.sWidth|sWidth|root.Graphic.sWidth), sHeight: (*|Animated_Tile.getGraphic.sHeight|sHeight|root.Graphic.sHeight), dx: (*|dx|number), dy: (*|dy|number), dWidth: (*|Animated_Tile.getGraphic.dWidth|dWidth), dHeight: (*|Animated_Tile.getGraphic.dHeight|dHeight), image: *}, animation: root.Animation, oncomplete: *}}
     */
    function fade_graphic_effect(image, options, oncomplete, direction) {
        options = options || {};
        var sx = options.sx || 0;
        var sy = options.sy || 0;
        var sWidth = options.sWidth || image.width;
        var sHeight = options.sHeight || image.height;
        var dx = options.dx || 0;
        var dy = options.dy || 0;
        var dWidth = options.dWidth || image.width;
        var dHeight = options.dHeight || image.height;
        var time = options.time || 1000;
        var vAlign = options.vAlign || null;
        var hAlign = options.hAlign || null;
        var layer = Canvas.getLayer(Consts.EFFECT_LAYER,Consts.FADE_SCREEN_LAYER);

        var self = this;

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

        var animation = new Animation(self.fps, self.fps * (time / 1000));
        var type = '';
        if (direction == 'positive') {
            type = 'fade_in_graphic'
        }
        else {
            direction = 'negative';
            type = 'fade_out_graphic'
        }

        animation.run(true, direction);
        var animation_set = {
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
     * @param self
     */
    function step_animations(self) {
        var length = self.animation_queue.length;
        var i;
        for (i = 0; i < length; i++) {
            var animation_set = self.animation_queue[i];
            var animation = null;
            var running = false;
            var index = 0;
            var opacity = null;
            var ctx = null;

            switch (animation_set.type) {
                case 'fade_in_screen':
                case 'fade_out_screen':
                    animation = animation_set.animation;
                    running = animation.isRunning();
                    index = animation.getIndexFrame();
                    if (!running) {
                        if (animation.direction == 'negative') {
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
                //    var layer = Canvas.getLayer(layer_name);
                //    var image_data = animation_set.image_data;
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
     * @param time
     * @param oncomplete
     * @param direction
     */
    function fade_screen_effect(time, oncomplete, direction) {
        var self = this;
        time = parseInt(time);
        time = isNaN(time) || time < 0 ? 2000 : time;
        var type = '';
        if (direction == 'negative') {
            type = 'fade_out_screen';
        }
        else {
            direction = 'positive';
            type = 'fade_in_screen';
        }

        var animation = new Animation(self.fps, self.fps * (time / 1000));
        animation.execute(true, direction);
        var animation_set = {
            type: type,
            time: time,
            oncomplete: oncomplete,
            animation: animation
        };

        self.animation_queue.push(animation_set);
    }


    root.Scene = Scene;
})(RPG);