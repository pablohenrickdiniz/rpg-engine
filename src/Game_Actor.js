(function(root,w){
    if(root.Game_Character == undefined){
        throw "Game_Actor requires Game_Character"
    }

    var Game_Character = root.Game_Character,
        Consts = root.Consts,
        Keyboard = w.Keyboard;


    var Game_Actor = function(options){
        var self = this;
        Game_Character.call(self, options);
        options = options || {};
        self.level = options.level || 1;
        self.MP = options.HP || 100;
        self.HP = options.MP || 100;
        self.items = options.items || {};
        self.skills = [];
        self.equiped_items = options.equiped_items || [];
        self.type = options.type || 'Actor';
    };

    Game_Actor.prototype = Object.create(Game_Character.prototype);
    Game_Actor.prototype.constructor = Game_Actor;

    Game_Actor.prototype.addItem = function(id,amount){
        var self = this;
        if(self.items[id] == undefined){
            self.items[id] = amount;
        }
        else{
            self.items[id] += amount;
        }
    };

    Game_Actor.prototype.dropItem = function(id,amount){
        var self = this;
        if(self.items[id] != undefined){
            self.items[id]-=amount;
            if(self.items[id] <= 0){
                delete self.items[id];
            }
        }
    };

    Game_Actor.prototype.update = function () {
        var self = this;
        if(self.type == 'Player'){
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
        }

        Game_Character.prototype.update.call(self);
    };



    root.Game_Actor = Game_Actor;
})(RPG,window);