(function(w){
    if(w.Character == undefined){
        throw new Error('Player Requires Character');
    }


    var Player = function(options){
        var self = this;
        self.level = 1;
        self.hp = 100;
        self.mp = 100;
        self.items = [];
        self.equiped_items = [];
        Character.call(self,options);
    };

    Player.prototype = Object.create(Character.prototype);
    Player.constructor = Player;
    w.Player = Player;
})(window);