'use strict';
(function(root){
    if(!root.Main){
        throw "Variables requires RPG Main";
    }

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