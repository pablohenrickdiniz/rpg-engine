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
        throw "Scene_Map_Loader requires Tileset"
    }

    if(root.Tilesets == undefined){
        throw "Scene_Map_Loader requires Tilesets"
    }

    if(root.Main == undefined){
        throw "Scene_Map_Loader requires Main"
    }

    if(root.Chara == undefined){
        throw "Scene_Map_Loader requires Chara"
    }

    if(root.Charas == undefined){
        throw "Scene_Map_Loader requires Charas"
    }

    if(root.Game_Actor == undefined){
        throw "Scene_Map_Loader requires Game_Actor"
    }


    var Spriteset_Map = root.Spriteset_Map,
        Game_Map = root.Game_Map,
        Scene_Loader = root.Scene_Loader,
        Graphics = root.Graphics,
        Tile = root.Tile,
        Tileset = root.Tileset,
        Tilesets = root.Tilesets,
        Main = root.Main,
        Chara = root.Chara,
        Charas  = root.Charas,
        Game_Actor = root.Game_Actor;

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
            var keys;
            var length;
            var key;
            var i;
            var conf;

            if(map.tileset && map.tileset.graphicID){
                var id = map.tileset.graphicID;
                var tileset = new Tileset(map.tileset);
                Tilesets.set(id,tileset);
            }

            if(scene.charas && scene.charas.constructor == {}.constructor){
                keys = Object.keys(scene.charas);
                length = keys.length;
                for(i =0; i < length;i++){
                    key = keys[i];
                    conf = scene.charas[key];
                    var chara = new Chara(conf);
                    Charas.set(key,chara);
                }
            }



            if(scene.actors && scene.actors.constructor == {}.constructor){
                keys = Object.keys(scene.actors);
                length = keys.length;
                for(i =0; i < length;i++){
                    key = keys[i];
                    conf = scene.actors[key];
                    Main.Actors.set(key,new Game_Actor(conf));
                }
            }

            callback();
        });
    };

    root.Scene_Map_Loader = Scene_Map_Loader;
})(RPG);