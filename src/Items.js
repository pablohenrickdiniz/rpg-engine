/**
 * @requires RPG.js
 * @requires Game/Main.js
 */
(function(root){
    let Main = root.Main;

    let items = [];
    let Items = {
        /**
         *
         * @param id {string}
         * @returns {Item}
         */
        get:function(id){
            return items[id]?items[id]:null;
        },
        /**
         *
         * @param id {string}
         * @param item {Item}
         */
        set:function(id,item){
            items[id] = item;
        },
        /**
         *
         * @param id
         * @returns {boolean}
         */
        has:function(id){
            return !!items[id];
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