'use strict';
(function(root){
    if(root.Game_Graphic === undefined){
        throw "Item_Graphic requires Game_Graphic";
    }

    if(root.Tile === undefined){
        throw "Item_Graphic requires Tile";
    }

    var Game_Graphic = root.Game_Graphic,
        Tile = root.Tile;

    /**
     *
     * @param options
     * @constructor
     */
    var Item_Graphic = function(options){
        var self = this;
        Game_Graphic.call(self,options);
        initialize(self);
        self.frame = null;
        self.graphicType = 'icons';
    };

    Item_Graphic.prototype = Object.create(Game_Graphic.prototype);
    Item_Graphic.prototype.constructor = Item_Graphic;

    /**
     *
     * @returns {null}
     */
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

    /**
     *
     * @param self
     */
    function initialize(self){
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
    }

    root.Item_Graphic = Item_Graphic;
})(RPG);