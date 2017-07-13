(function(root){
    if(root.Game_Graphic == undefined){
        throw "Game_Face requires Game_Graphic"
    }

    var Game_Graphic = root.Game_Graphic;
    var Game_Face = function(options){
        var self = this;
        options = options || {};
        Game_Graphic.call(self,options);
        self.graphicType = 'faces';
    };

    Game_Face.prototype = Object.create(Game_Graphic.prototype);
    Game_Face.prototype.constructor = Game_Graphic;

    root.Game_Face = Game_Face;
})(RPG);