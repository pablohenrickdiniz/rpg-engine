(function (root) {
    if (root.Scene.Scene_Loader == undefined) {
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

    var Spriteset_Map = root.Spriteset_Map,
        Game_Map = root.Game_Map,
        Scene_Loader = root.Scene.Scene_Loader,
        Graphics = root.Graphics,
        Tile = root.Tile,
        Main = root.Main;

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
            var data = scene.data || {};
            var playerX = 0;
            var playerY = 0;

            if (Main.Player) {
                if (data.player) {
                    playerX = data.player.x || playerX;
                    playerY = data.player.y || playerY;
                }
                Main.Player.x = playerX;
                Main.Player.y = playerY;
                scene.focusOnCharacter(Main.Player);
            }

            callback();
        });
    };

    root.Scene.Scene_Map_Loader = Scene_Map_Loader;
})(RPG);