(function(root){
    var Graphic = function(options){
        var self = this;
        var image = options.image;
        if(image instanceof Image){
            throw "image is null";
        }

        self.parent = options.parent || null;
        self.image = image;
        self.dx = options.dx || 0;
        self.dy = options.dy || 0;
        self.dWidth = options.dWidth || image.width;
        self.dHeight = options.dHeight || image.height;
        self.sx = options.sx || 0;
        self.sy = options.sy || 0;
        self.sWidth = options.sWidth || 0;
        self.sHeight = options.sHeight || 0;
        self.eventListeners = [];
        self.changed = false;
        self.visible = true;
        self.fadeInEffect = null;
        self.fadeOutEffect = null;
    };

    Graphic.prototype.fadeIn = function(time,callback){
        var self =this;
        if(!self.fadeInEffect){
            self.fadeInEffect = {
                time:time,
                callback:callback
            };
        }
    };

    Graphic.prototype.fadeOut = function(time,callback){
        var self = this;
        if(!self.fadeOutEffect){
            self.fadeOutEffect = {
                time:time,
                callback:callback
            };
        }
    };

    Graphic.prototype.animateTo = function(x,y,time){

    };

    Graphic.prototype.clear = function(){
        var self = this;
    };

    Graphic.prototype.draw = function(){
        var self = this;
    };

    Graphic.prototype.update = function(){

    };

    Graphic.prototype.addEventListener = function(eventName,callback){

    };

    Graphic.prototype.trigger = function(event){

    };

    root.Graphic = Graphic;
})(window);