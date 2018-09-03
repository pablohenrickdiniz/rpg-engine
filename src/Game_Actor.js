'use strict';
(function(root,w){
    if(root.Game_Character === undefined){
        throw "Game_Actor requires Game_Character";
    }

    if(root.Game_Inventory === undefined){
        throw "Game_Actor requires Game_Inventory";
    }

    let Game_Character = root.Game_Character,
        Consts = root.Consts,
        Keyboard = w.Keyboard,
        Game_Inventory = root.Game_Inventory;

    /**
     *
     * @param options
     * @constructor
     */
    let Game_Actor = function(options){
        let self = this;
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
        let self = this;
        if(self.type === 'Player'){
            let keyboard = root.Controls.Keyboard;
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

    /**
     *
     * @param self
     */
    function initialize(self){
        let inventory = new Game_Inventory();
        let level = 1;

        Object.defineProperty(self,'inventory',{
            /**
             *
             * @returns {*}
             */
            get:function(){
                return inventory;
            },
            /**
             *
             * @param inv
             */
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
            /**
             *
             * @returns {number}
             */
            get:function(){
                return level;
            },
            /**
             *
             * @param l
             */
            set:function(l){
                l = parseInt(l);
                if(!isNaN(l) && l > 0){
                    level = l;
                }
            }
        });
    }

    Object.defineProperty(root,'Game_Actor',{
        /**
         *
         * @returns {Game_Actor}
         */
        get:function(){
            return Game_Actor;
        }
    });
})(RPG,window);