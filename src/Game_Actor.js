(function(root){
    if(root.Game_Character == undefined){
        throw "Game_Actor requires Game_Character"
    }

    var Game_Character = root.Game_Character;

    var Game_Actor = function(options){
        var self = this;
        options = options || {};
        self.name = options.name || 'Player';
        self.level = options.level || 1;
        self.hp = options.hp || 100;
        self.mp = options.mp || 100;
        self.items = options.items || [];
        self.skills = [];
        self.equiped_items = options.equiped_items || [];
    };

    Game_Actor.prototype = Object.create(Game_Character.prototype);
    Game_Actor.prototype.constructor = Game_Actor;

    root.Game_Actor = Game_Actor;
})(RPG);