/**
 * @requires RPG.js
 * @requires Game/Main.js
 * @requires Scene/Scene.js
 */
(function(root){
    let Main = root.Main,
        Scene = root.Scene;

    let scenes = [];

    let Scenes = {
        /**
         *
         * @param id {string}
         * @param scene {Scene}
         */
        set:function(id,scene){
            if(scene instanceof Scene){
                scenes[id] = scene;
            }
        },
        /**
         *
         * @param id {string}
         * @returns {Scene}
         */
        get:function(id){
            if(scenes[id] !== undefined){
                return scenes[id];
            }
            return null;
        }
    };

    Object.defineProperty(Main,'Scenes',{
        /**
         *
         * @returns {Scenes}
         */
       get:function(){
           return Scenes;
       }
    });
})(RPG);