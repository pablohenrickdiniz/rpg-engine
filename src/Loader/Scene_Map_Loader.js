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
 * @requires ../Scene/Scene_Map.js
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
        Actors = Main.Actors,
        Scene_Map = root.Scene_Map;
    

    let Scene_Map_Loader = {
        /**
         *
         * @param name
         * @param options
         */
        load: function (name, options) {
            let url = root.baseUrl + 'Scenes/' + name + '.json' + '?t=' + (new Date()).getTime();
            Resource_Loader.loadJSON(url, function (data) {
                let scene = new Scene_Map(name,data);
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

                if(data.objects){
                    length = data.objects.length;
                    for(let i =0; i < length;i++){
                        conf = data.objects[i];
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
            });
        }
    };

    Object.freeze(Scene_Map_Loader);
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