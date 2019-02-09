/**
 * @requires ../RPG.js
 * @requires ../Loader/Scene_Map_Loader.js
 * @requires Scene_Map.js
 * @requires Scene.js
 * @requires ../Game/Main.js
 * @requires ../System/Events.js
 */
(function (root) {
    let Scene_Map_Loader = new root.Scene_Map_Loader(),
        Scene_Map = root.Scene_Map,
        Scene = root.Scene,
        Main = root.Main,
        Game_Timer = root.Game_Timer,
        Events = root.Events;

    let Scenes = Main.Scenes;
    let Scene_Manager = {
        /**
         *
         * @param name {string}
         * @param options {object}
         */
        call: function (name) {
            let scene = Scenes.get(name);
            if(!scene){
                throw new Error('Cena '+name+' não existe!');
            }

            /**
             *
             * @param scene {Scene}
             */
            let complete = function(scene){
                Events.trigger('sceneLoaded',[name]);
                scene.initialize();
                Game_Timer.run();
            };

            let progress = function(progress){
                Events.trigger('sceneProgress',[progress]);
            };

            let current_scene = Main.currentScene;
            if(scene instanceof Scene && current_scene !== scene){
                if(current_scene){
                    current_scene.finalize();
                }
                Game_Timer.stop();
                Main.currentScene = scene;
                if(scene instanceof Scene_Map){
                    Scene_Map_Loader.load(scene,{
                        url:'../tests/Database/resources.json',
                        complete:complete,
                        progress:progress
                    });
                }
            }
        }
    };

    Object.defineProperty(root,'Scene_Manager',{
        /**
         *
         * @returns {Scene_Manager}
         */
        get:function(){
            return Scene_Manager;
        }
    });
})(RPG);