/**
 * @requires RPG.js
 * @requires Game_Character.js
 */
(function(root,w){
    let Game_Character = root.Game_Character,
        Keyboard = w.Keyboard,
        Main = root.Main;

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Game_Actor = function(options){
        let self = this;
        Game_Character.call(self, options);
        options = options || {};
        self.id = options.id;
        self.invulnerable = options.invulnerable || false;
    };

    Game_Actor.prototype = Object.create(Game_Character.prototype);
    Game_Actor.prototype.constructor = Game_Actor;

    /**
     * @returns {void}
     */
    Game_Actor.prototype.update = function () {
        let self = this;
        if(Main.currentPlayerID == self.id){
            let keyboard = root.Keyboard;
            if (keyboard.state[Keyboard.LEFT]) {
                self.stepLeft();
            }
            else if (keyboard.state[Keyboard.RIGHT]) {
                self.stepRight();
            }
            else if (keyboard.state[Keyboard.DOWN]) {
                self.stepDown();
            }
            else if (keyboard.state[Keyboard.UP]) {
                self.stepUp();
            }
            else{
                self.stop();
            }
        }

        Game_Character.prototype.update.call(self);
    };

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