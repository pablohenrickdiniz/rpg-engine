(function (root) {
    if (root.Scene.SceneLoader == undefined) {
        throw "SceneMapLoader requires SceneLoader"
    }

    if (root.SpritesetMap == undefined) {
        throw "SceneMapLoader requires SpritesetMap"
    }

    if(root.Graphics == undefined){
        throw "SceneMapLoader requires Graphics"
    }

    if(root.Frame == undefined){
        throw "SceneMapLoader requires Frame"
    }

    var SpritesetMap = root.SpritesetMap,
        Game_Map = root.Game_Map,
        SceneLoader = root.Scene.SceneLoader,
        Graphics = root.Graphics,
        Frame = root.Frame,
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
    var SceneMapLoader = function () {
    };

    SceneMapLoader.prototype = Object.create(SceneLoader.prototype);
    SceneMapLoader.prototype.constructor = SceneMapLoader;

    /**
     *
     * @param scene
     * @param callback
     */
    SceneMapLoader.prototype.load = function (scene, callback) {
        var self = this;
        var spriteset_map = new SpritesetMap();
        var map = new Game_Map();
        var count = 0;

        var q = function(){
            count++;
            if(count == 1){
                scene.map_data = {
                    spriteset_map:spriteset_map,
                    map:map
                };
                callback();
            }
        };

        var data = scene.json_data;
        var playerX = 0;
        var playerY = 0;
        if(data.player){
            playerX = data.player.x || playerX;
            playerY = data.player.y || playerY;
        }

        Main.Player.x = playerX;
        Main.Player.y = playerY;
        scene.focusOnCharacter(Main.Player);
        SceneLoader.prototype.load.call(self, scene, function () {
            spriteset_map = loadSpriteSet(data.spriteset,data.tileWidth,data.tileHeight);
            q();
        });
    };

    /**
     *
     * @param spriteset
     * @param tileWidth
     * @param tileHeight
     */
    var loadSpriteSet = function (spriteset, tileWidth, tileHeight) {
        spriteset = spriteset || [];
        tileWidth = tileWidth || 32;
        tileHeight = tileHeight || 32;

        var spriteset_map = new SpritesetMap({
            tileWidth: tileWidth,
            tileHeight: tileHeight
        });

        for(var i in spriteset){
            for(var j in spriteset[i]){
                for(var k in spriteset[i][j]){
                    var tile = spriteset[i][j][k];
                    if (tile !== undefined) {
                        var frame = new Frame({
                            image:tile[0],
                            sx:tile[1]*tileWidth,
                            sy:tile[2]*tileHeight,
                            width:tile[3],
                            height:tile[4]
                        });
                        spriteset_map.set(i,j,k,frame);
                    }
                    else {
                        spriteset_map.unset(i,j,k);
                    }
                }
            }
        }
        return spriteset_map;
    };

    root.Scene.SceneMapLoader = SceneMapLoader;
})(RPG);