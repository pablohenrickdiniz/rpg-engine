/**
 * @requires RPG.js
 * @requires Game/Main.js
 */
(function (root) {
    let Main = root.Main;
    let graphics =  {};
    let Graphics = {
        /**
         *
         * @param type {string}
         * @param name {string}
         * @returns {Game_Graphic}
         */
        get: function (type, name) {
            return graphics[type] && graphics[type][name]?graphics[type][name]:null;
        },
        /**
         *
         * @param type {string}
         * @param name {name}
         * @param graphic {Game_Graphic}
         */
        set: function (type, name, graphic) {
            if (!graphics[type]) {
                graphics[type] = {};
            }
            graphics[type][name] = graphic;
        },
        /**
         *
         * @param type {string}
         * @param name {Game_Graphic}
         */
        unset: function (type, name) {
            if (graphics[type]) {
                if (graphics[type][name]) {
                    delete graphics[type][name];
                }
            }
        }
    };

    Object.defineProperty(Main,'Graphics',{
        /**
         *
         * @returns {Graphics}
         */
        get:function(){
            return Graphics;
        }
    });
})(RPG);