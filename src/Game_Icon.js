'use strict';
(function (root) {
    if(root.Game_Graphic === undefined){
        throw "Game_Icon requires Game_Graphic";
    }

    let Game_Graphic = root.Game_Graphic;

    /**
     *
     * @param options
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