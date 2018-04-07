(function(root){
    if(root.Main === undefined){
        throw "Icons requires Main";
    }

    if(root.Game_Icon === undefined){
        throw "Icons requires Game_Icon"
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
            if(icons[id] !== undefined){
               return icons[id];
            }
            return null;
        }
    };
})(RPG);