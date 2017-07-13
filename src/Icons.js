(function(root){
    if(root.Game_Actor == undefined){
        throw "Actors requires Game_Actor"
    }

    if(root.Main == undefined){
        throw "Actors requires RPG Main";
    }

    var Main = root.Main;
    var Game_Icon = root.Game_Icon;
    var icons = [];

    Main.Icons = {
        set:function(id,icon){
            if(icon instanceof Game_Icon){
                icons[id] = icon;
            }
        },
        get:function(id){
            if(icons[id] != undefined){
               return icons[id];
            }
            return null;
        }
    };
})(RPG);