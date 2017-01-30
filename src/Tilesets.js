(function(root){
    if(root.Main == undefined){
        throw "Tilesets requires Main";
    }

    if(root.Tileset == undefined){
        throw "Tilesets requires Tileset";
    }

    var Tileset = root.Tileset,
        Main = root.Main;

    var tilesets = [];

    Main.Tilesets = {
        get:function(id){
            if(tilesets[id] != undefined){
                return tilesets[id];
            }
            return null;
        },
        set:function(id,tileset){
            if(tileset instanceof Tileset){
                tilesets[id] = tileset;
            }
        }
    };
})(RPG);