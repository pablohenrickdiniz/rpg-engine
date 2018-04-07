(function(root){
    if(root.Main === undefined){
        throw "Maps requires Main"
    }

    if(root.Game_Map === undefined){
        throw "Maps requires Game_Map"
    }

    var Main = root.Main,
        Game_Map = root.Game_Map;


    var maps = [];

    Main.Maps = {
        set:function(id,map){
            if(map instanceof Game_Map){
                maps[id] = map;
            }
        },
        get:function(id){
            if(maps[id] !== undefined){
                return maps[id];
            }
            return null;
        }
    };
})(RPG);