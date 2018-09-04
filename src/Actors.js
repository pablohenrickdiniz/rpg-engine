'use strict';
(function(root){
    if(!root.Game_Actor){
        throw "Actors requires Game_Actor";
    }

    if(!root.Main){
        throw "Actors requires RPG Main";
    }

    let Main = root.Main;
    let Game_Actor = root.Game_Actor;
    let actors = [];
    let Actors = {
        /**
         *
         * @param id {string}
         * @param actor {Game_Actor}
         */
        set:function(id,actor){
            if(actor instanceof Game_Actor){
                actors[id] = actor;
            }
        },
        /**
         *
         * @param id {string}
         * @returns {Game_Actor}
         */
        get:function(id){
            if(actors[id] !== undefined){
               return actors[id];
            }
            return null;
        }
    };

    Object.defineProperty(Main,'Actors',{
        /**
         *
         * @returns {Actors}
         */
        get:function(){
            return Actors;
        }
    })
})(RPG);