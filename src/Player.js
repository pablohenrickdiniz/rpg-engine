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

    Player.prototype.step = function(){
        var Direction = RPG.Direction;
        var self = this;
        if (!self.moving) {
            if (Keyboard.state.KEY_LEFT) {
                self.stepTo(Direction.LEFT);
            }
            else if (Keyboard.state.KEY_RIGHT) {
                self.stepTo(Direction.RIGHT);
            }
            else if (Keyboard.state.KEY_DOWN) {
                self.stepTo(Direction.DOWN);
            }
            else if (Keyboard.state.KEY_UP) {
                self.stepTo(Direction.UP);
            }
            else if (self.graphic !== null) {
                var name = Direction.getName(self.direction);
                var animation_name = 'step_' + name;
                self.animations[animation_name].pauseToFrame(1);
                self.refreshed = false;
            }
        }
        else {
            self.timeStepMove();
            self.refreshed = false;
        }
    };

    root.Player = Player;
})(RPG);