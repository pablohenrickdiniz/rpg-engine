'use strict';
(function(root){
    if(root.Main === undefined){
        throw "Icons requires Main";
    }

    if(root.Game_Icon === undefined){
        throw "Icons requires Game_Icon";
    }

    let Main = root.Main;
    let Game_Icon = root.Game_Icon;
    let icons = [];
    let Icons = {
        /**
         *
         * @param id
         * @param icon
         */
        set:function(id,icon){
            if(icon instanceof Game_Icon){
                icons[id] = icon;
            }
        },
        /**
         *
         * @param id
         * @returns {*}
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
         * @returns {{set: set, get: get}}
         */
       get:function(){
           return Icons;
       }
    });
})(RPG);