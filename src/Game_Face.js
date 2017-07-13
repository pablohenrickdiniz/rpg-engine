(function(root){
    if(root.Game_Graphic == undefined){
        throw "Game_Face requires Fame_Graphic"
    }

    var Game_Graphic = root.Game_Graphic;

    root.Game_Face = function(options){
        var self = this;
        options = options || {};
        Game_Graphic.call(self,options);
        self.graphicType = 'faces';
    };
})(RPG);