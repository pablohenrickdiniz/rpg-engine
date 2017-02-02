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

    if(root.Character_Graphic == undefined){
        throw "Scene_Map_Loader requires Character_Graphic"
    }

    if(root.Character_Graphics == undefined){
        throw "Scene_Map_Loader requires Character_Graphics"
    }


    var Spriteset_Map = root.Spriteset_Map,
        Game_Map = root.Game_Map,
        Scene_Loader = root.Scene_Loader,
        Graphics = root.Graphics,
        Tile = root.Tile,
        Tileset = root.Tileset,
        Tilesets = root.Tilesets,
        Main = root.Main,
        Character_Graphic = root.Character_Graphic,
        Character_Graphics  = root.Character_Graphics;

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
            if(map.tileset && map.tileset.graphicID){
                var id = map.tileset.graphicID;
                var tileset = new Tileset(map.tileset);
                Tilesets.set(id,tileset);
            }

            var game_player = Main.get_current_player();
            if(scene.player){
                var player = scene.player;
                if(player.x){game_player.x =player.x;}
                if(player.y){game_player.y = player.y}
                if(player.graphic){
                    var id = player.graphic.graphicID;
                    var graphic = new Character_Graphic(player.graphic);
                    Character_Graphics.set(id,graphic);
                    game_player.characterGraphicID = id;
                }
            }

            callback();
        });
    };

    root.Scene_Map_Loader = Scene_Map_Loader;
})(RPG);