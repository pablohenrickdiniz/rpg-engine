(function (root, window) {
    if (root.Game_Character == undefined) {
        throw new Error('Player Requires Character');
    }

    var Game_Character = root.Game_Character,
        Consts = root.Consts,
        Keyboard = window.Keyboard;

    /**
     *
     * @param options
     * @constructor
     */
    var Game_Player = function (options) {
        var self = this;
        options = options || {};
        Game_Character.call(self, options);
        self.type = 'player';
    };

    Game_Player.prototype = Object.create(Game_Character.prototype);
    Game_Player.prototype.constructor = Game_Player;

    Game_Player.prototype.update = function () {
        var self = this;
        var keyboard = root.Controls.Keyboard;

        if(!self.moving){
            if (keyboard.state[Keyboard.LEFT]) {
                self.moveTo(Consts.CHARACTER_DIRECTION_LEFT);
            }
            else if (keyboard.state[Keyboard.RIGHT]) {
                self.moveTo(Consts.CHARACTER_DIRECTION_RIGHT);
            }
            else if (keyboard.state[Keyboard.DOWN]) {
                self.moveTo(Consts.CHARACTER_DIRECTION_DOWN);
            }
            else if (keyboard.state[Keyboard.UP]) {
                self.moveTo(Consts.CHARACTER_DIRECTION_UP);
            }
            else{
                self.stop();
            }
        }



        Game_Character.prototype.update.call(self);
    };

    root.Game_Player = Game_Player;
})(RPG, window);