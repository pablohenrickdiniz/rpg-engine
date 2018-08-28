'use strict';
(function(root){
    if(root.Main === undefined){
        throw "Variables requires RPG Main";
    }

    var Main = root.Main;
    var variables = [];

    Main.Variables = {
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
})(RPG);