/**
 * @requires RPG.js
 * @requires Game/Main.js
 */
(function(root){
    let Main = root.Main;

    let maps = [];
    let Maps = {
        /**
         *
         * @param id {string}
         * @param map {Game_Map}
         */
        set:function(id,map){
            maps[id] = map;
        },
        /**
         *
         * @param id {string}
         * @returns {Game_Map}
         */
        get:function(id){
            return maps[id]?maps[id]:null;
        }
    };

    Object.freeze(Maps);
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