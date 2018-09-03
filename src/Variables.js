'use strict';
(function(root){
    if(root.Main === undefined){
        throw "Variables requires RPG Main";
    }

    let Main = root.Main;
    let variables = [];
    let Variables = {
        /**
         *
         * @param id
         * @param value
         */
        set:function(id,value){
            variables[id] = value;
        },
        /**
         *
         * @param id
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
         * @returns {{set: set, get: get}}
         */
       get:function(){
           return Variables;
       }
    });
})(RPG);