'use strict';
(function (root) {
    if(!root.Scene){
        throw "Main requires Scene";
    }

    if(!root.Game_Map){
        throw "Main requires Game_Map";
    }

    let Scene = root.Scene,
        Game_Map = root.Game_Map,
        current_scene = null,
        current_map = null,
        current_player_id = null;

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
            if(s instanceof Scene && s !== current_scene){
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
            if(map instanceof Game_Map){
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
            return current_player_id;
        },
        /**
         *
         * @param id {string}
         */
        set:function(id){
            if(id !== current_player_id){
                if(current_player_id != null){
                    let tmp = Main.Actors.get(current_player_id);
                    if(tmp != null){
                        tmp.type = 'Actor';
                    }
                }

                current_player_id = id;
                let scene = Main.currentScene;
                let actor = Main.Actors.get(id);
                if(scene != null && actor != null){
                    actor.type = 'Player';
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
            return Main.Actors.get(current_player_id);
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