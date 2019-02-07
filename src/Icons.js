/**
 * @requires RPG.js
 * @requires Game/Main.js
 */
(function(root){
    let Main = root.Main;
    let icons = [];
    let Icons = {
        /**
         *
         * @param id {string}
         * @param icon {Game_Icon}
         */
        set:function(id,icon){
            icons[id] = icon;
        },
        /**
         *
         * @param id
         * @returns {Game_Icon}
         */
        get:function(id){
            return icons[id]?icons[id]:null;
        }
    };

    Object.defineProperty(Main,'Icons',{
        /**
         *
         * @returns {Icons}
         */
       get:function(){
           return Icons;
       }
    });
})(RPG);