(function (root) {
    if(root.Game_Graphic == undefined){
        throw "Game_Icon requires Game_Graphic"
    }

    var Game_Graphic = root.Game_Graphic;

    var Game_Icon = function(options){
        self.graphic = options.graphicID;
        self.graphicType = 'icons';
    };

    Game_Icon.prototype = Object.create(Game_Graphic.prototype);
    Game_Icon.prototype.constructor = Game_Icon;

    root.Game_Icon = Game_Icon;
})(RPG);