'use strict';
(function(root){
    if(root.Main === undefined){
        throw "Scenes requires RPG Main";
    }

    if(root.Scene === undefined){
        throw "Scenes requires Scene";
    }

    let Main = root.Main,
        Scene = root.Scene;
    let scenes = [];

    let Scenes = {
        /**
         *
         * @param id
         * @param scene
         */
        set:function(id,scene){
            if(scene instanceof Scene){
                scenes[id] = scene;
            }
        },
        /**
         *
         * @param id
         * @returns {*}
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
         * @returns {{set: set, get: get}}
         */
       get:function(){
           return Scenes;
       }
    });
})(RPG);