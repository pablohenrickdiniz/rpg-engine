/**
 * @requires ../RPG.js
 * @requires Resource_Loader.js
 * @requires ../Tileset.js
 * @requires ../Game/Main.s
 * @requires ../Chara.js
 * @requires ../Game_Actor.js
 * @requires ../Game_Face.js
 * @requires ../Item.js
 * @requires ../Game_Icon.js
 * @requires ../Game_Item.js
 * @requires ../Game_Event.js
 * @requires ../Tilesets.js
 * @requires ../Charas.js
 * @requires ../Faces.js
 * @requires ../Items.js
 * @requires ../Icons.js
 * @requires ../Actors.js
 */
(function (root) {
    let Resource_Loader = root.Resource_Loader,
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
    
    /**
     *
     * @constructor
     */
    let Scene_Map_Loader = function () {
    };

    Scene_Map_Loader.prototype = Object.create(Resource_Loader.prototype);
    Scene_Map_Loader.prototype.constructor = Scene_Map_Loader;

    let load = Resource_Loader.prototype.load;

    /**
     *
     * @param scene
     * @param options
     */
    Scene_Map_Loader.prototype.load = function (scene, options) {
        let url = options.url || 'resources.json';
        load.apply(this,[url+'?=t'+(new Date()).getMilliseconds(),{
            progress:options.progress,
            complete:function(data){
                let map = scene.map;
                let keys;
                let length;
                let key;
                let conf;

                if(map.tileset && map.tileset.graphicID){
                    let id = map.tileset.graphicID;
                    if(!Tileset.has(id)){
                        let tileset = new Tileset(map.tileset);
                        Tilesets.set(id,tileset);
                    }
                }

                if(map.tilesets && map.tilesets instanceof Array){
                    for(let i =0; i < map.tilesets.length;i++){
                        if(map.tilesets[i].graphicID){
                            let id = map.tilesets[i].graphicID;
                            if(!Tilesets.has(id)){
                                let tileset = new Tileset(map.tilesets[i]);
                                Tilesets.set(id,tileset);
                            }
                        }
                    }
                }

                if(data.icons && data.icons.constructor === {}.constructor){
                    keys = Object.keys(data.icons);
                    length = keys.length;
                    for(let i =0; i < length;i++){
                        key = keys[i];
                        if(!Icons.has(key)){
                            conf = data.icons[key];
                            Icons.set(key,new Game_Icon(conf));
                        }
                    }
                }

                if(data.faces && data.faces.constructor === {}.constructor){
                    keys = Object.keys(data.faces);
                    length = keys.length;
                    for(let i =0; i < length;i++){
                        key = keys[i];
                        if(!Faces.has(key)){
                            conf = data.faces[key];
                            Faces.set(key,new Game_Face(conf));
                        }
                    }
                }

                if(data.charas && data.charas.constructor === {}.constructor){
                    keys = Object.keys(data.charas);
                    length = keys.length;
                    for(let i =0; i < length;i++){
                        key = keys[i];
                        if(!Charas.has(key)){
                            conf = data.charas[key];
                            let chara = new Chara(conf);
                            Charas.set(key,chara);
                        }
                    }
                }

                if(data.items && data.items.constructor === {}.constructor){
                    keys = Object.keys(data.items);
                    length = keys.length;
                    for(let i =0; i < length;i++){
                        key = keys[i];
                        if(!Items.has(key)){
                            conf = data.items[key];
                            conf = Object.assign({id:key},conf);
                            Items.set(key,new Item(conf));
                        }
                    }
                }

                if(data.actors && data.actors.constructor === {}.constructor){
                    keys = Object.keys(data.actors);
                    length = keys.length;
                    for(let i =0; i < length;i++){
                        key = keys[i];
                        let actor = null;
                        if(!Actors.has(key)){
                            conf = data.actors[key];
                            conf.id = key;
                            actor = new Game_Actor(conf);
                            Actors.set(key,actor);
                        }
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

                if(options.complete){
                    options.complete(scene);
                }
            }
        }]);
    };

    Object.defineProperty(root,'Scene_Map_Loader',{
        /**
         *
         * @returns {Scene_Map_Loader}
         */
       get:function(){
           return Scene_Map_Loader;
       }
    });
})(RPG);