(function (root) {
    if (root.Game_Character == undefined) {
        throw new Error('Player Requires Character');
    }



    var Character = root.Game_Character,
        Consts = root.Consts;

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
    Player.prototype.constructor = Player;



    Player.prototype.update = function(){
        var self = this;

        if (!self.moving) {
            if (Keyboard.state.KEY_LEFT) {
                self.moveTo(Consts.LEFT);
            }
            else if (Keyboard.state.KEY_RIGHT) {
                self.moveTo(Consts.RIGHT);
            }
            else if (Keyboard.state.KEY_DOWN) {
                self.moveTo(Consts.DOWN);
            }
            else if (Keyboard.state.KEY_UP) {
                self.moveTo(Consts.UP);
            }
            else if (self.graphic !== null) {
                self.animations[self.direction].pauseToFrame(1);
                self.player_refreshed = false;
            }
        }
        else {
            self.player_refreshed = false;
        }
    };

    root.Player = Player;
})(RPG);