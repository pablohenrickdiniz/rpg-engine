(function (root) {
    if (root.Character == undefined) {
        throw new Error('Player Requires Character');
    }

    var Character = root.Character;

    var Player = function (options) {
        var self = this;
        self.level = 1;
        self.hp = 100;
        self.mp = 100;
        self.items = [];
        self.equiped_items = [];
        self.active = false;
        Character.call(self, options);
    };

    Player.prototype = Object.create(Character.prototype);
    Player.constructor = Player;
    root.Player = Player;
})(RPG);