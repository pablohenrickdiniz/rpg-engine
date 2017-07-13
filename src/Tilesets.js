(function(root){
    if(root.Main == undefined){
        throw "Tilesets requires Main"
    }
    else{
        if(root.Main.Graphics == undefined){
            throw "Tilesets requires Graphics"
        }
    }


    if(root.Tileset == undefined){
        throw "Tilesets requires Tileset";
    }

    var Tileset = root.Tileset,
        Main = root.Main,
        Graphics = Main.Graphics;

    var tilesets = [];

    Main.Tilesets = {
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