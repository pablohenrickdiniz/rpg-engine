'use strict';
(function(root){
    if(root.Main === undefined){
        throw "Maps requires Main";
    }

    if(root.Game_Map === undefined){
        throw "Maps requires Game_Map";
    }

    let Main = root.Main,
        Game_Map = root.Game_Map;

    let maps = [];
    let Maps = {
        /**
         *
         * @param id
         * @param map
         */
        set:function(id,map){
            if(map instanceof Game_Map){
                maps[id] = map;
            }
        },
        /**
         *
         * @param id
         * @returns {*}
         */
        get:function(id){
            if(maps[id] !== undefined){
                return maps[id];
            }
            return null;
        }
    };

    Object.defineProperty(Main,'Maps',{
        /**
         *
         * @returns {{set: set, get: get}}
         */
       get:function(){
           return Maps;
       }
    });
})(RPG);