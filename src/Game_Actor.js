(function(root,w){
    if(root.Game_Character === undefined){
        throw "Game_Actor requires Game_Character"
    }

    if(root.Game_Inventory === undefined){
        throw "Game_Actor requires Game_Inventory"
    }

    var Game_Character = root.Game_Character,
        Consts = root.Consts,
        Keyboard = w.Keyboard,
        Game_Inventory = root.Game_Inventory;

    var Game_Actor = function(options){
        var self = this;
        Game_Character.call(self, options);
        options = options || {};
        initialize(self);
        self.level = options.level || 1;
        self.MP = options.HP || 100;
        self.HP = options.MP || 100;
        self.skills = [];
        self.type = options.type || 'Actor';
        self.inventory = options.inventory;
    };

    Game_Actor.prototype = Object.create(Game_Character.prototype);
    Game_Actor.prototype.constructor = Game_Actor;

    Game_Actor.prototype.update = function () {
        var self = this;
        if(self.type === 'Player'){
            var keyboard = root.Controls.Keyboard;
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

    function initialize(self){
        var inventory = new Game_Inventory();
        var level = 1;

        Object.defineProperty(self,'inventory',{
            get:function(){
                return inventory;
            },
            set:function(inv){
                if(inv instanceof Game_Inventory){
                    inventory = inv;
                }
                else if(inv.constructor === {}.constructor){
                    inventory = new Game_Inventory(inv);
                }
            }
        });

        Object.defineProperty(self,'level',{
            get:function(){
                return level;
            },
            set:function(l){
                l = parseInt(l);
                if(!isNaN(l) && l > 0){
                    level = l;
                }
            }
        });
    }

    root.Game_Actor = Game_Actor;
})(RPG,window);