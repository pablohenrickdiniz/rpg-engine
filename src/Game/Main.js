/**
 * @requires ../RPG.js
 * @requires ../System/Events.js
 */
(function (root) {
    let Events = root.Events,
        currentScene = null,
        currentMap = null,
        currentPlayerID = null;

    let Main = {};

    Object.defineProperty(Main,'currentScene',{
        /**
         *
         * @returns {Scene}
         */
        get:function(){
            return currentScene;
        },
        /**
         *
         * @param s {Scene}
         */
        set:function(s){
            if(s !== currentScene){
                currentScene = s;
                Events.trigger('sceneChanged',[currentScene]);
            }
        }
    });

    Object.defineProperty(Main,'currentMap',{
        /**
         *
         * @returns {Game_Map}
         */
        get:function(){
            return currentMap;
        },
        /**
         *
         * @param map {Game_Map}
         */
        set:function(map){
            if(map !== currentMap){
                currentMap = map;
                Events.trigger('mapChanged',[currentMap]);
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
                let actor = Main.Actors.get(id);
                if(currentScene){
                    currentScene.add(actor);
                }
                Events.trigger('playerChanged',[actor]);
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