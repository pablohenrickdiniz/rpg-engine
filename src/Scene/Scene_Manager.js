/**
 * @requires ../RPG.js
 * @requires ../Loader/Scene_Map_Loader.js
 * @requires Scene_Map.js
 * @requires Scene.js
 * @requires ../Game/Main.js
 * @requires ../System/Events.js
 * @requires ../System/Screen.js
 */
(function (root,w) {
    let Scene_Map_Loader = root.Scene_Map_Loader,
        Scene_Map = root.Scene_Map,
        Scene = root.Scene,
        Main = root.Main,
        Events = root.Events,
        Screen = w.Screen;

    let Scenes = Main.Scenes;
    let Scene_Manager = {
        /**
         *
         * @param name
         */
        call: function (name) {
            let scene = Scenes.get(name);
            /**
             *
             * @param scene {Scene}
             */
            let complete = function(scene){
                Events.trigger('sceneLoaded',[name]);
                scene.start();
                Screen.fadeOut(2500);
            };

            let progress = function(progress){
                Events.trigger('sceneProgress',[progress]);
            };

            let current_scene = Main.currentScene;
            if(current_scene){
                current_scene.end();
            }
            Screen.fadeIn(1000,function(){
                Main.currentScene = scene;
                if(scene instanceof Scene_Map){
                    Scene_Map_Loader.load(scene,{
                        url:root.baseUrl+'resources.json',
                        name:name,
                        complete:complete,
                        progress:progress
                    });
                }
            });
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
})(RPG,window);