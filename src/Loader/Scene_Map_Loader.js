(function (root) {
    if (root.Scene_Loader == undefined) {
        throw "Scene_Map_Loader requires Scene_Loader"
    }

    if (root.Spriteset_Map == undefined) {
        throw "Scene_Map_Loader requires Spriteset_Map"
    }

    if (root.Game_Map == undefined) {
        throw "Scene_Map_Loader requires Game_Map"
    }

    if (root.Graphics == undefined) {
        throw "Scene_Map_Loader requires Graphics"
    }

    if (root.Tile == undefined) {
        throw "Scene_Map_Loader requires Tile"
    }

    if(root.Tileset == undefined){
        throw "Scene_Map_Loader requries Tileset"
    }

    if(root.Tilesets == undefined){
        throw "Scene_Map_Loader requries Tilesets"
    }

    var Spriteset_Map = root.Spriteset_Map,
        Game_Map = root.Game_Map,
        Scene_Loader = root.Scene_Loader,
        Graphics = root.Graphics,
        Tile = root.Tile,
        Tileset = root.Tileset,
        Tilesets = root.Tilesets;

    var fields = [
        'image',
        'sx',
        'sy',
        'dWidth',
        'dHeight',
        'sWidth',
        'sHeight'
    ];

    /**
     *
     * @constructor
     */
    var Scene_Map_Loader = function () {
    };

    Scene_Map_Loader.prototype = Object.create(Scene_Loader.prototype);
    Scene_Map_Loader.prototype.constructor = Scene_Map_Loader;

    /**
     *
     * @param scene
     * @param callback
     */
    Scene_Map_Loader.prototype.load = function (scene, callback) {
        Scene_Loader.prototype.load.call(this,scene,function(){
            var map = scene.map;
            if(map.tileset && map.tileset.id){
                var id = map.tileset.id;
                var tileset = new Tileset(map.tileset);
                Tilesets.set(id,tileset);
            }
            callback();
        });
    };

    root.Scene_Map_Loader = Scene_Map_Loader;
})(RPG);