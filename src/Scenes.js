/**
 * @requires RPG.js
 * @requires Game/Main.js
 */
(function(root){
    let Main = root.Main;

    let scenes = [];

    let Scenes = {
        /**
         *
         * @param id {string}
         * @param scene {Scene}
         */
        set:function(id,scene){
            scenes[id] = scene;
        },
        /**
         *
         * @param id {string}
         * @returns {Scene}
         */
        get:function(id){
            return scenes[id]?scenes[id]:null;
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