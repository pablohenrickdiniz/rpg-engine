'use strict';
(function (root,w) {
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
         * @returns {*}
         */
        get:function(){
            return current_scene;
        },
        /**
         *
         * @param c
         */
        set:function(c){
            if(c instanceof Scene && c !== current_scene){
                current_scene = c;
            }
        }
    });

    Object.defineProperty(Main,'currentMap',{
        /**
         *
         * @returns {*}
         */
        get:function(){
            return current_map;
        },
        /**
         *
         * @param map
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
         * @returns {*}
         */
        get:function(){
            return current_player_id;
        },
        /**
         *
         * @param player_id
         */
        set:function(player_id){
            if(player_id !== current_player_id){
                if(current_player_id != null){
                    let tmp = Main.Actors.get(current_player_id);
                    if(tmp != null){
                        tmp.type = 'Actor';
                    }
                }

                current_player_id = player_id;
                let scene = Main.currentScene;
                let actor = Main.Actors.get(player_id);
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
         * @returns Actor
         */
        get:function(){
            return Main.Actors.get(current_player_id);
        }
    });

    Object.defineProperty(root,'Main',{
        /**
         *
          */
       get:function(){
           return Main;
       }
    });
})(RPG,window);