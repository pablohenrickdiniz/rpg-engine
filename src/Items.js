/**
 * @requires RPG.js
 * @requires Game/Main.js
 * @requires Item.js
 */
(function(root){
    let Item = root.Item,
        Main = root.Main;

    let items = [];
    let Items = {
        /**
         *
         * @param id {string}
         * @returns {Item}
         */
        get:function(id){
            if(items[id] !== undefined){
                return items[id];
            }
            return null;
        },
        /**
         *
         * @param id {string}
         * @param item {Item}
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
         * @returns {Items}
         */
       get:function(){
           return Items;
       }
    });
})(RPG);