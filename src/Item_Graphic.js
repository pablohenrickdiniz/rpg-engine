(function(root){
    if(root.Graphic == undefined){
        throw "Item_Graphic requires Graphic"
    }

    if(root.Tile == undefined){
        throw "Item_Graphic requires Tile"
    }

    var Graphic = root.Graphic,
        Tile = root.Tile;

    var Item_Graphic = function(options){
        var self = this;
        Graphic.call(self,options);
        initialize(self);
        self.frame = null;
        self.graphic_type = 'icon';
    };

    Item_Graphic.prototype = Object.create(Graphic.prototype);
    Item_Graphic.prototype.constructor = Item_Graphic;

    Item_Graphic.prototype.getFrame = function(){
        var self = this;
        if(self.frame == null){
            self.frame = new Tile({
                image:self.image,
                sx:self.sx,
                sy:self.sy,
                width:self.sWidth,
                height:self.sHeight,
                parent:self
            });
        }

        return self.frame;
    };


    var initialize = function(self){
        Object.defineProperty(self,'width',{
            get:function(){
                return self.sWidth;
            }
        });

        Object.defineProperty(self,'height',{
            get:function(){
                return self.sHeight;
            }
        });
    };

    root.Item_Graphic = Item_Graphic;
})(RPG);