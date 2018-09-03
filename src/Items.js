'use strict';
(function(root){
    if(root.Item === undefined){
        throw "Items requires Item";
    }

    if(root.Main === undefined){
        throw "Items requires Main";
    }

    let Item = root.Item,
        Main = root.Main;

    let items = [];
    let Items = {
        /**
         *
         * @param id
         * @returns {*}
         */
        get:function(id){
            if(items[id] !== undefined){
                return items[id];
            }
            return null;
        },
        /**
         *
         * @param id
         * @param item
         */
        set:function(id,item){
            if(item instanceof Item){
                items[id] = item;
            }
        }
    };

    Object.defineProperty(Main,'Items',{
        /**
         *
         * @returns {{get: get, set: set}}
         */
       get:function(){
           return Items;
       }
    });
})(RPG);