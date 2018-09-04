'use strict';
(function(root){
    if(!root.Game_Graphic){
        throw "Item_Graphic requires Game_Graphic";
    }

    if(!root.Tile){
        throw "Item_Graphic requires Tile";
    }

    let Game_Graphic = root.Game_Graphic,
        Tile = root.Tile;

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Item_Graphic = function(options){
        let self = this;
        Game_Graphic.call(self,options);
        initialize(self);
        self.frame = null;
        self.graphicType = 'icons';
    };

    Item_Graphic.prototype = Object.create(Game_Graphic.prototype);
    Item_Graphic.prototype.constructor = Item_Graphic;

    /**
     *
     * @returns {Tile}
     */
    Item_Graphic.prototype.getFrame = function(){
        let self = this;
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
     * @param self {Item_Graphic}
     */
    function initialize(self){
        Object.defineProperty(self,'width',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return self.sWidth;
            }
        });

        Object.defineProperty(self,'height',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return self.sHeight;
            }
        });
    }

    Object.defineProperty(root,'Item_Graphic',{
        /**
         *
         * @returns {Item_Graphic}
         */
       get:function(){
           return Item_Graphic;
       }
    });
})(RPG);