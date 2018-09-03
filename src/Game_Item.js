'use strict';
(function (root) {
    if(root.Main === undefined){
        throw "Game_Item requires Main";
    }
    else{
        if(root.Main.Items === undefined){
            throw "Game_Item requires Items";
        }
    }

    if(root.Game_Object === undefined){
        throw "Game_Item requires Game_Object";
    }

    let Game_Object = root.Game_Object,
        Consts = root.Consts,
        Items = root.Main.Items;

    /**
     *
     * @param options
     * @constructor
     */
    let Game_Item = function (options) {
        let self = this;
        options = options || {};
        options.type = options.type || 'generic';
        options.through = options.through === true;
        Game_Object.call(self,options);
        initialize(self);
        self.amount = options.amount || 1;
        self.graphic_type = 'icon';
        self.capture = options.capture || Consts.TRIGGER_PLAYER_TOUCH;
        self.itemID = options.itemID;
    };

    Game_Item.prototype = Object.create(Game_Object.prototype);
    Game_Item.prototype.constructor = Game_Item;

    /**
     *
     * @param self
     */
    function initialize(self){
        Object.defineProperty(self,'item',{
            get:function(){
                return Items.get(self.itemID)
            }
        });

        Object.defineProperty(self,'currentFrame',{
            get:function(){
                return self.item.graphic;
            }
        });
    }

    Object.defineProperty(root,'Game_Item',{
        /**
         *
         * @returns {Game_Item}
         */
        get:function(){
            return Game_Item;
        }
    });
})(RPG);