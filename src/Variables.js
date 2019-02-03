/**
 * @requires RPG.js
 * @requires Game/Main.js
 */
(function(root){
    let Main = root.Main;
    let variables = [];
    let Variables = {
        /**
         *
         * @param id {string}
         * @param value {*}
         */
        set:function(id,value){
            variables[id] = value;
        },
        /**
         *
         * @param id {string}
         * @returns {*}
         */
        get:function(id){
            if(variables[id] !== undefined){
                return variables[id];
            }
            return null;
        }
    };

    Object.defineProperty(Main,'Variables',{
        /**
         *
         * @returns {Variables}
         */
       get:function(){
           return Variables;
       }
    });
})(RPG);