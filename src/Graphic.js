(function(root){
    root.Graphic = function(options){
        var self = this;
        options = options || {};
        self.sx = options.sx || 0;
        self.sy = options.sy || 0;
        self.sWidth = options.sWidth || null;
        self.sHeight = options.sHeight || null;
        self.image = options.image || '';
        self.startFrame = 0;
    };
})(RPG);