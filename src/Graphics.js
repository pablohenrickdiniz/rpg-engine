'use strict';
(function (root) {
    if(root.Main === undefined){
        throw "Graphics requires Main";
    }

    let Main = root.Main;

    let graphics =  {};

    Main.Graphics = {
        /**
         *
         * @param type
         * @param name
         * @returns {*}
         */
        get: function (type, name) {
            if (graphics[type] && graphics[type][name]) {
                return graphics[type][name];
            }
            return null;
        },
        /**
         *
         * @param type
         * @param name
         * @param graphic
         */
        set: function (type, name, graphic) {
            if (graphics[type] === undefined) {
                graphics[type] = {};
            }
            graphics[type][name] = graphic;
        },
        /**
         *
         * @param type
         * @param name
         */
        unset: function (type, name) {
            if (graphics[type] !== undefined) {
                if (graphics[type][name] !== undefined) {
                    delete graphics[type][name];
                }
            }
        }
    };
})(RPG);