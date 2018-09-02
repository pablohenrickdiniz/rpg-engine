'use strict';
(function (root) {
    if (root.Scene_Loader === undefined) {
        throw "Scene_Map_Loader requires Scene_Loader";
    }

    if (root.Spriteset_Map === undefined) {
        throw "Scene_Map_Loader requires Spriteset_Map";
    }

    if (root.Game_Map === undefined) {
        throw "Scene_Map_Loader requires Game_Map";
    }

    if (root.Tile === undefined) {
        throw "Scene_Map_Loader requires Tile";
    }

    if(root.Tileset === undefined){
        throw "Scene_Map_Loader requires Tileset";
    }

    if(root.Game_Icon === undefined){
        throw "Scene_Map_Loader requires Game_Icon";
    }

    if(root.Game_Item === undefined){
        throw "Scene_Map_Loader requires Game_Item";
    }

    if(root.Game_Event === undefined){
        throw "Scene_Map_Loader requires Game_Event";
    }

    if(root.Main === undefined){
        throw "Scene_Map_Loader requires Main";
    }
    else{
        if(root.Main.Tilesets === undefined){
            throw "Scene_Map_Loader requires Tilesets";
        }

        if(root.Main.Charas === undefined){
            throw "Scene_Map_Loader requires Charas";
        }

        if(root.Main.Faces === undefined){
            throw "Scene_Map_Loader requires Faces";
        }

        if(root.Main.Items === undefined){
            throw "Scene_Map_Loader requires Items";
        }

        if(root.Main.Icons === undefined){
            throw "Scene_Map_Loader requires Icons";
        }

        if(root.Main.Actors === undefined){
            throw "Scene_Map_Loader requires Actors";
        }
    }

    if(root.Chara === undefined){
        throw "Scene_Map_Loader requires Chara";
    }

    if(root.Game_Actor === undefined){
        throw "Scene_Map_Loader requires Game_Actor";
    }

    if(root.Game_Face === undefined){
        throw "Scene_Map_Loader requires Game_Face";
    }

    if(root.Item === undefined){
        throw "Scene_Map_Loader requires Item";
    }

    let Scene_Loader = root.Scene_Loader,
        Tileset = root.Tileset,
        Main = root.Main,
        Chara = root.Chara,
        Game_Actor = root.Game_Actor,
        Game_Face = root.Game_Face,
        Item = root.Item,
        Game_Icon = root.Game_Icon,
        Game_Item = root.Game_Item,
        Game_Event = root.Game_Event,
        Tilesets = Main.Tilesets,
        Charas  = Main.Charas,
        Faces = Main.Faces,
        Items = Main.Items,
        Icons = Main.Icons,
        Actors = Main.Actors;

    let fields = [
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
    let Scene_Map_Loader = function () {
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
            let map = scene.map;
            let keys;
            let length;
            let key;
            let conf;

            if(map.tileset && map.tileset.graphicID){
                let id = map.tileset.graphicID;
                let tileset = new Tileset(map.tileset);
                Tilesets.set(id,tileset);
            }

            if(map.tilesets && map.tilesets instanceof Array){
                for(let i =0; i < map.tilesets.length;i++){
                    if(map.tilesets[i].graphicID){
                        let id = map.tilesets[i].graphicID;
                        let tileset = new Tileset(map.tilesets[i]);
                        Tilesets.set(id,tileset);
                    }
                }
            }

            if(scene.icons && scene.icons.constructor === {}.constructor){
                keys = Object.keys(scene.icons);
                length = keys.length;
                for(let i =0; i < length;i++){
                    key = keys[i];
                    conf = scene.icons[key];
                    Icons.set(key,new Game_Icon(conf));
                }
            }


            if(scene.faces && scene.faces.constructor === {}.constructor){
                keys = Object.keys(scene.faces);
                length = keys.length;
                for(let i =0; i < length;i++){
                    key = keys[i];
                    conf = scene.faces[key];
                    Faces.set(key,new Game_Face(conf));
                }
            }


            if(scene.charas && scene.charas.constructor === {}.constructor){
                keys = Object.keys(scene.charas);
                length = keys.length;
                for(let i =0; i < length;i++){
                    key = keys[i];
                    conf = scene.charas[key];
                    let chara = new Chara(conf);
                    Charas.set(key,chara);
                }
            }

            if(scene.items && scene.items.constructor === {}.constructor){
                keys = Object.keys(scene.items);
                length = keys.length;
                for(let i =0; i < length;i++){
                    key = keys[i];
                    conf = scene.items[key];
                    conf = Object.assign({id:key},conf);
                    Items.set(key,new Item(conf));
                }
            }

            if(scene.actors && scene.actors.constructor === {}.constructor){
                keys = Object.keys(scene.actors);
                length = keys.length;
                for(let i =0; i < length;i++){
                    key = keys[i];
                    conf = scene.actors[key];
                    Actors.set(key,new Game_Actor(conf));
                }
            }

            if(scene.objects){
                length = scene.objects.length;
                for(let i =0; i < length;i++){
                    conf = scene.objects[i];
                    switch(conf.class){
                        case 'Item':
                            scene.add(new Game_Item(conf));
                            break;
                        case 'Event':
                            scene.add(new Game_Event(conf));
                            break;
                    }
                }
            }

            callback(scene);
        });
    };

    root.Scene_Map_Loader = Scene_Map_Loader;
})(RPG);