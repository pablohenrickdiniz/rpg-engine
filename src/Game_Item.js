(function (root) {
    if(root.Game_Object == undefined){
        throw "Game_Item requires Game_Object"
    }

    var Game_Object = root.Game_Object,
        Consts = root.Consts;

    var Game_Item = function (options) {
        var self = this;
        Game_Object.call(self,options);
        options = options || {};
        self.durability = options.durability || 'INDESTRUCTIBLE';
        self.amount = options.amount || 1;
        self.effects = [];
        self.graphic_type = 'icon';
        self.through = options.through || true;
        self.capture = options.capture || Consts.TRIGGER_PLAYER_TOUCH;
        self.bounds.groups.push('ITEM');
    };

    Game_Item.prototype = Object.create(Game_Object.prototype);
    Game_Item.prototype.constructor = Game_Item;

    root.Game_Item = Game_Item;
})(RPG);