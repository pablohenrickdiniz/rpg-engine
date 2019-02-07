/**
 * @requires ../RPG.js
 * @requires ../Game_Map.js
 * @requires ../System/Events.js
 */
(function (root) {
    let Events = root.Events,
        Game_Map = root.Game_Map,
        current_scene = null,
        current_map = null,
        currentPlayerID = null;

    let Main = {};

    Object.defineProperty(Main,'currentScene',{
        /**
         *
         * @returns {Scene}
         */
        get:function(){
            return current_scene;
        },
        /**
         *
         * @param s {Scene}
         */
        set:function(s){
            if(s !== current_scene){
                current_scene = s;
            }
        }
    });

    Object.defineProperty(Main,'currentMap',{
        /**
         *
         * @returns {Game_Map}
         */
        get:function(){
            return current_map;
        },
        /**
         *
         * @param map {Game_Map}
         */
        set:function(map){
            if(map !== current_map){
                current_map = map;
            }
        }
    });

    Object.defineProperty(Main,'currentPlayerID',{
        /**
         *
         * @returns {string}
         */
        get:function(){
            return currentPlayerID;
        },
        /**
         *
         * @param id {string}
         */
        set:function(id){
            if(id !== currentPlayerID){
                currentPlayerID = id;
                let scene = Main.currentScene;
                let actor = Main.Actors.get(id);
                Events.trigger('playerChanged',[actor]);
                if(scene && actor){
                    scene.add(actor);
                }
            }
        }
    });

    Object.defineProperty(Main,'currentPlayer',{
        /**
         *
         * @returns {Game_Actor}
         */
        get:function(){
            return Main.Actors.get(currentPlayerID);
        }
    });

    Object.defineProperty(root,'Main',{
        /**
         * @returns {Main}
         */
       get:function(){
           return Main;
       }
    });
})(RPG);