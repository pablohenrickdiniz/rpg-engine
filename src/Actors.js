'use strict';
(function(root){
    if(root.Game_Actor === undefined){
        throw "Actors requires Game_Actor";
    }

    if(root.Main === undefined){
        throw "Actors requires RPG Main";
    }

    let Main = root.Main;
    let Game_Actor = root.Game_Actor;
    let actors = [];

    Main.Actors = {
        /**
         *
         * @param id
         * @param actor
         */
        set:function(id,actor){
            if(actor instanceof Game_Actor){
                actors[id] = actor;
            }
        },
        /**
         *
         * @param id
         * @returns {*}
         */
        get:function(id){
            if(actors[id] !== undefined){
               return actors[id];
            }
            return null;
        }
    };
})(RPG);