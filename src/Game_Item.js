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

    var Game_Object = root.Game_Object,
        Consts = root.Consts,
        Items = root.Main.Items;

    /**
     *
     * @param options
     * @constructor
     */
    var Game_Item = function (options) {
        var self = this;
        options = options || {};
        options.type = options.type || 'generic';
        options.through = options.through === true;
        Game_Object.call(self,options);
        initialize(self);
        self.amount = options.amount || 1;
        self.graphic_type = 'icon';
        self.capture = options.capture || Consts.TRIGGER_PLAYER_TOUCH;
        self.body.groups.push('ITEM');
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


    root.Game_Item = Game_Item;
})(RPG);