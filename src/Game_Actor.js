/**
 * @requires RPG.js
 * @requires Game_Character.js
 */
(function(root){
    let Game_Character = root.Game_Character;
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

    Object.defineProperty(root,'Game_Actor',{
        /**
         *
         * @returns {Game_Actor}
         */
        get:function(){
            return Game_Actor;
        }
    });
})(RPG);