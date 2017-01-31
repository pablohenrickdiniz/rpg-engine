(function(root){
    if(root.Graphics == undefined){
        throw "Tilesets requires Graphics"
    }

    if(root.Tileset == undefined){
        throw "Tilesets requires Tileset";
    }

    var Tileset = root.Tileset;
    var tilesets = [];

    root.Tilesets = {
        get:function(id){
            if(tilesets[id] != undefined){
                return tilesets[id];
            }
            return tilesets[id];
        },
        set:function(id,tileset){
            if(tileset instanceof Tileset){
                tilesets[id] = tileset;
            }
        }
    };
})(RPG);