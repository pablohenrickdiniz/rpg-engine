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

    root.Game_Icon = Game_Icon;
})(RPG);