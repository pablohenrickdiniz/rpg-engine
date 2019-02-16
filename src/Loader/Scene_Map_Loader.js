/**
 * @requires ../RPG.js
 * @requires Resource_Loader.js
 * @requires ../Game_Item.js
 * @requires ../Game_Event.js
 * @requires ../Scene/Scene_Map.js
 * @requires ../Maps.js
 * @requires ../Map.js
 */
(function (root) {
    let Resource_Loader = root.Resource_Loader,
        Game_Item = root.Game_Item,
        Game_Event = root.Game_Event,
        Scene_Map = root.Scene_Map,
        Maps = root.Main.Maps,
        Map = root.Map;
    

    let Scene_Map_Loader = {
        /**
         *
         * @param name
         * @param options
         */
        load: function (name, options) {
            let url = root.baseUrl + 'Scenes/' + name + '.json?t=' + (new Date()).getTime();
            Resource_Loader.loadJSON(url, function (sceneData) {
                let callback = function(map){
                    let length;
                    let conf;

                    let scene = new Scene_Map(name,map);
                    if(sceneData.objects){
                        length = sceneData.objects.length;
                        for(let i =0; i < length;i++){
                            conf = sceneData.objects[i];
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
                };

                if(!Maps.has(sceneData.map)){
                    let url = root.baseUrl+"Maps/"+sceneData.map+".json?t="+ (new Date()).getTime();
                    Resource_Loader.loadJSON(url,function(mapData){
                        let map = new Map(mapData);
                        Maps.set(sceneData.map,map);
                        callback(map);
                    });
                }
                else{
                    callback(Maps.get(sceneData.map));
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