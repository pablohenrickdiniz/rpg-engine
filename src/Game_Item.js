(function (root) {
    if(root.Main == undefined){
        throw "Game_Item requires Main"
    }
    else{
        if(root.Main.Items == undefined){
            throw "Game_Item requires Items"
        }
    }

    if(root.Game_Object == undefined){
        throw "Game_Item requires Game_Object"
    }

    var Game_Object = root.Game_Object,
        Consts = root.Consts,
        Items = root.Main.Items;

    var Game_Item = function (options) {
        var self = this;
        Game_Object.call(self,options);
        initialize(self);
        options = options || {};
        self.amount = options.amount || 1;
        self.graphic_type = 'icon';
        self.through = options.through || true;
        self.capture = options.capture || Consts.TRIGGER_PLAYER_TOUCH;
        self.bounds.groups.push('ITEM');
        self.itemID = options.itemID;
    };

    Game_Item.prototype = Object.create(Game_Object.prototype);
    Game_Item.prototype.constructor = Game_Item;


    function initialize(self){
        Object.defineProperty(self,'currentFrame',{
            get:function(){
                return Items.get(self.itemID).graphic;
            }
        });
    }


    root.Game_Item = Game_Item;
})(RPG);