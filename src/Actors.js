/**
 * @requires RPG.js
 * @requires Game/Main.js
 */
(function(root){
    let Main = root.Main;
    let actors = [];
    let Actors = {
        /**
         *
         * @param id {string}
         * @param actor {Game_Actor}
         */
        set:function(id,actor){
            actors[id] = actor;
        },
        /**
         *
         * @param id {string}
         * @returns {Game_Actor}
         */
        get:function(id){
            return actors[id]?actors[id]:null;
        },
        /**
         *
         * @param id
         * @returns {boolean}
         */
        has:function(id){
            return !!actors[id];
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