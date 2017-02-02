(function(root){
    if(root.Graphics == undefined){
        throw "Game_Graphic requires Graphics"
    }

    var Graphics = root.Graphics;

    root.Game_Graphic = function(options){
        var self = this;
        initialize(self);
        options = options || {};
        self.sx = options.sx || 0;
        self.sy = options.sy || 0;
        self.sWidth = options.sWidth || null;
        self.sHeight = options.sHeight || null;
        self.startFrame = 0;
        self.graphicID = options.graphicID;
        self.graphicType = options.graphicType || 'graphic';
    };

    function initialize(self){
        Object.defineProperty(self,'image',{
            get:function(){
                return Graphics.get(self.graphicType,self.graphicID);
            }
        });
    }
})(RPG);