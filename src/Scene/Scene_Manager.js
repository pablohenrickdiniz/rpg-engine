/**
 * @requires ../RPG.js
 * @requires ../Loader/Scene_Map_Loader.js
 * @requires ../Loader/Resource_Loader.js
 * @requires Scene_Map.js
 * @requires Scene.js
 * @requires ../Game/Main.js
 * @requires ../System/Events.js
 * @requires ../System/Screen.js
 */
(function (root,w) {
    let Scene_Map_Loader = root.Scene_Map_Loader,
        Resource_Loader = root.Resource_Loader,
        Scene_Map = root.Scene_Map,
        Scene = root.Scene,
        Main = root.Main,
        Events = root.Events,
        Screen = w.Screen;

    let Scenes = Main.Scenes;

    let progress = function(progress){
        Events.trigger('sceneProgress',[progress]);
    };

    let Scene_Manager = {
        /**
         *
         * @param name
         */
        call: function (name) {
            console.log("call scene "+name+"...");
            let callback = function(scene){
                console.log("loading scene "+name+" completed!");
                Scenes.set(name,scene);
                let current_scene = Main.currentScene;
                if(current_scene){
                    current_scene.end();
                }
                Main.currentScene = scene;
                Events.trigger('sceneLoaded',[scene.name]);
                scene.start();
                console.log("screen fadeout...");
                Screen.fadeOut(2500);
            };

            if(!Scenes.has(name)){
                console.log("scene "+name+" dont't loaded, loading...");
                console.log("fade in screen...");
                Screen.fadeIn(1500,function(){
                    console.log("fade in completed!");
                    let url = root.baseUrl+'resources.json?t='+(new Date()).getTime();
                    console.log("loading resources url "+url+"...");
                    Resource_Loader.load(url,{
                        progress:progress,
                        complete:function(){
                            console.log("resource url "+url+" loaded!");
                            console.log("loading scene file "+name+".json ...");
                            Scene_Map_Loader.load(name,{
                                complete:callback
                            });
                        }
                    });
                });
            }
            else{
                Screen.fadeIn(1500,function(){
                    callback(Scenes.get(name));
                });
            }
        }
    };

    Object.freeze(Scene_Manager);
    Object.defineProperty(root,'Scene_Manager',{
        /**
         *
         * @returns {Scene_Manager}
         */
        get:function(){
            return Scene_Manager;
        }
    });
})(RPG,this);