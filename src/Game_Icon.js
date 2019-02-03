/**
 * @requires RPG.js
 * @requires Game_Graphic
 */
(function (root) {
    let Game_Graphic = root.Game_Graphic;
    /**
     *
     * @param options {object}
     * @constructor
     */
    let Game_Icon = function(options){
        let self = this;
        options = options || {};
        Game_Graphic.call(self,options);
        self.graphicType = 'icons';
    };

    Game_Icon.prototype = Object.create(Game_Graphic.prototype);
    Game_Icon.prototype.constructor = Game_Icon;

    Object.defineProperty(root,'Game_Icon',{
        /**
         *
         * @returns {Game_Icon}
         */
       get:function () {
           return Game_Icon;
       }
    });
})(RPG);