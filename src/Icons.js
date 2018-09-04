'use strict';
(function(root){
    if(!root.Main){
        throw "Icons requires Main";
    }

    if(!root.Game_Icon){
        throw "Icons requires Game_Icon";
    }

    let Main = root.Main;
    let Game_Icon = root.Game_Icon;
    let icons = [];
    let Icons = {
        /**
         *
         * @param id {string}
         * @param icon {Game_Icon}
         */
        set:function(id,icon){
            if(icon instanceof Game_Icon){
                icons[id] = icon;
            }
        },
        /**
         *
         * @param id
         * @returns {Game_Icon}
         */
        get:function(id){
            if(icons[id] !== undefined){
               return icons[id];
            }
            return null;
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