/**
 * @requires RPG.js
 * @requires Game_Actor.js
 * @requires Game/Main.js
 */
(function(root){
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