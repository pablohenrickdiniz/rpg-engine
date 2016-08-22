(function (root) {
    if(root.Animation == undefined){
        throw "Scene requires Animation"
    }

    if(root.System == undefined){
        throw "Scene requires System"
    }

    if(root.System.Video == undefined){
        throw "Scene requires System.Video"
    }

    var Animation = root.Animation,
        Video = root.System.Video;

    var Scene =  function (options) {
        var self = this;
        options = options || {};
        self.ready = options.ready || null;
        self.audio = options.audio || {};
        self.images = options.images || {};
        self.animation_queue = [];
    };

    Scene.prototype.onready = function(callback){
        var self = this;
        self.ready = callback;
    };

    /*
     fadeIn(int time, function callback)>void
     */
    Scene.prototype.fadeIn = function (time, oncomplete) {
        fade_screen_effect.apply(this, [time, oncomplete, 'negative']);
    };
    /*
     fadeOut(int time, function callback):void
     */
    Scene.prototype.fadeOut =  function (time, oncomplete) {
        fade_screen_effect.apply(this, [time, oncomplete, 'positive']);
    };
    Scene.prototype.fadeInImage = function (image, options, oncomplete) {
        fade_image_effect.apply(this, [image, options, oncomplete, 'positive']);
    };
    Scene.prototype.fadeOutImage = function (image, options, oncomplete) {
        fade_image_effect.apply(this, [image, options, oncomplete, 'negative']);
    };
    Scene.prototype.stepAnimations = function () {
        var self = this;
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

                    ctx = Video.getLayer('EF1').getContext();
                    ctx.clearRect(0, 0, Video.width, Video.height);

                    if (opacity > 0) {
                        ctx.fillStyle = 'rgba(0,0,0,' + opacity + ')';
                        ctx.fillRect(0, 0, Video.width, Video.height);
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
                case 'fade_in_image':
                case 'fade_out_image':
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

                    var layer_name = animation_set.layer;
                    var layer = Video.getLayer(layer_name);
                    var image_data = animation_set.image_data;

                    ctx = layer.getContext();
                    ctx.clearRect(image_data.dx, image_data.dy, image_data.dWidth, image_data.dHeight);

                    if (opacity > 0) {
                        ctx.globalAlpha = opacity;
                        ctx.drawImage(image_data.image, image_data.sx, image_data.sy, image_data.sWidth, image_data.sHeight, image_data.dx, image_data.dy, image_data.dWidth, image_data.dHeight);
                        ctx.globalAlpha = 1;
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
                default:
            }
        }
    };

    Scene.prototype.drawProgressBar = function(progress){
        var self = this;
        self.clearProgressBar();
        var layer = Video.getLayer('UI3');
        var ctx = layer.getContext();
        var width = Video.width/2;
        var height = width/20;
        var y = Video.height/2 - height/2;
        var x = Video.width/2 - width/2;

        progress = parseInt(progress);
        progress = isNaN(progress) ?0:progress;
        progress = Math.min(progress,100);
        progress = Math.max(progress,0);

        var filled_width = (width*progress)/100;
        var empty_width = width-filled_width;


        ctx.fillStyle = '#666666';
        ctx.fillRect(x+filled_width,y,empty_width,height);
        ctx.fillStyle = 'blue';
        ctx.fillRect(x,y,filled_width,height);

        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 1;
        ctx.lineCap = 'square';
        ctx.strokeRect(x,y,width,height);
        var fontSize = parseInt(ctx.font);
        ctx.fillStyle = 'yellow';
        ctx.fillText(progress+'%',x+filled_width-(fontSize/2),y+(fontSize))
    };

    Scene.prototype.clearProgressBar = function(){
        var layer = Video.getLayer('UI3');
        layer.clear();
    };

    Scene.prototype.step = function(){
        var self = this;
        self.stepAnimations();
    };

    var fade_screen_effect = function (time, oncomplete, direction) {
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

        var animation = new Animation(Video.fps, Video.fps * (time / 1000));
        animation.execute(true, direction);
        var animation_set = {
            type: type,
            time: time,
            oncomplete: oncomplete,
            animation: animation
        };

        self.animation_queue.push(animation_set);
    };

    var fade_image_effect = function (image, options, oncomplete, direction) {
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
        var layer_name = options.layer || 'EF1';
        var vAlign = options.vAlign || null;
        var hAlign = options.hAlign || null;
        var layer = Video.getLayer(layer_name);

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

        var animation = new Animation(Video.fps, Video.fps * (time / 1000));
        var type = '';
        if (direction == 'positive') {
            type = 'fade_in_image'
        }
        else {
            direction = 'negative';
            type = 'fade_out_image'
        }

        animation.execute(true, direction);
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
            layer: layer_name,
            animation: animation,
            oncomplete: oncomplete
        };
        self.animation_queue.push(animation_set);
        return animation_set;
    };


    root.Scene = Scene;
})(RPG);