/**
 * @requires RPG.js
 * @requires Game/Main.js
 * @requires Game_Map.js
 */
(function(root){
    let Main = root.Main,
        Game_Map = root.Game_Map;

    let maps = [];
    let Maps = {
        /**
         *
         * @param id {string}
         * @param map {Game_Map}
         */
        set:function(id,map){
            if(map instanceof Game_Map){
                maps[id] = map;
            }
        },
        /**
         *
         * @param id {string}
         * @returns {Game_Map}
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
         * @returns {Maps}
         */
       get:function(){
           return Maps;
       }
    });
})(RPG);