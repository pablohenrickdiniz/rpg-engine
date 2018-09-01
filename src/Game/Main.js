'use strict';
(function (root,w) {
    let current_scene = null;
    let current_map = null;
    let current_player_id = null;

    if(root.Scene === undefined){
        throw "Main requires Scene";
    }

    if(root.Game_Map === undefined){
        throw "Main requires Game_Map";
    }

    if(w.QuadTree === undefined){
        throw "Main requires QuadTree";
    }

    let Scene = root.Scene,
        Game_Map = root.Game_Map;

    let Main = {
        Actors: null,   //Atores
        Variables: null,//Variáveis
        Scenes:null,    //Cenas
        Switches:null,  //Switches
        Items:null,     //Items
        Maps:null,      //Maps
        Faces:null      //Faces
    };

    Object.defineProperty(self,'currentScene',{
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
            let self = this;
            if(player_id !== current_player_id){
                if(current_player_id != null){
                    let tmp = self.Actors.get(current_player_id);
                    if(tmp != null){
                        tmp.type = 'Actor';
                    }
                }

                current_player_id = player_id;
                let scene = self.currentScene;
                let actor = self.Actors.get(player_id);
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

    root.Main = Main;
})(RPG,window);