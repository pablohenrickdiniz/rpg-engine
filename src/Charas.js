/**
 * @requires RPG.js
 */
(function(root){
    let Main = root.Main;
    let charas = [];

    let Charas = {
        /**
         *
         * @param id {string}
         * @returns {Chara}
         */
        get:function(id){
            return charas[id]?charas[id]:null;
        },
        /**
         *
         * @param id {string}
         * @param chara {Chara}
         */
        set:function(id,chara){
            charas[id] = chara;
        },
        /**
         *
         * @param id
         * @returns {boolean}
         */
        has:function(id){
            return !!charas[id];
        }
    };

    Object.defineProperty(Main,'Charas',{
        /**
         *
         * @returns {Charas}
         */
       get:function(){
           return Charas;
       }
    });
})(RPG);