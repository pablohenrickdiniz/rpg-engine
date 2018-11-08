'use strict';
(function (root) {
    if (!root.Scene_Loader) {
        throw "Scene_Manager requires Scene_Loader";
    }

    if(!root.Scene_Map_Loader){
        throw "Scene_Manager requires Scene_Map_Loader";
    }

    if (!root.Main) {
        throw "Scene_Manager requires Main";
    }

    else if(!root.Main.Scenes){
        throw "Scene_Manager requires Main.Scenes";
    }

    if(!root.Game_Timer){
        throw "Scene_Manager requires Game_Timer";
    }

    if(!root.Scene_Map){
        throw "Scene_Manager requires Scene_Map";
    }

    let Scene_Loader = new root.Scene_Loader(),
        Scene_Map_Loader = new root.Scene_Map_Loader(),
        Scene_Map = root.Scene_Map,
        Scene = root.Scene,
        Main = root.Main,
        Game_Timer = root.Game_Timer;

    let Scenes = Main.Scenes;
    /**
     *
     * @param scene {Scene}
     */
    function load(scene){
        scene.trigger('afterload',[root]);
        scene.trigger('start',[root]);
        scene.initialize();
        Game_Timer.run();
    }

    let Scene_Manager = {
        /**
         *
         * @param type {string}
         * @param name {string}
         * @param options {object}
         * @returns {Scene}
         */
        new: function (type,name, options) {
            let scene = null;
            options = options || {};
            switch (type) {
                case 'map':
                    scene = new Scene_Map(options);
                    break;
                default:
                    scene = new Scene(options);
            }
            Scenes.set(name,scene);
            return scene;
        },
        /**
         *
         * @param name {string}
         */
        call: function (name) {
            let scene = Scenes.get(name);
            if(scene == null){
                throw new Error('Cena '+name+' não existe!');
            }

            let current_scene = Main.currentScene;
            if(scene instanceof Scene && current_scene !== scene){
                if(current_scene !== null){
                    console.log('finalizando cena...');
                    current_scene.finalize();
                }
                Game_Timer.stop();
                Main.currentScene = scene;
                console.log('inicializando cena '+name+'...');
                if(scene instanceof Scene_Map){
                    scene.trigger('beforeload',[root]);
                    Scene_Map_Loader.load(scene, load);
                }
                else{
                    scene.trigger('beforeload',[root]);
                    Scene_Loader.load(scene, load);
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