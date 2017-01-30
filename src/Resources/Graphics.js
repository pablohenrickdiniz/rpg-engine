(function (root) {
    var graphics =  {};

    root.Graphics = {
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
            if (graphics[type] == undefined) {
                graphics[type] = {};
            }

            graphics[type][name] = graphic;
        },
        /**
         *
         * @param type
         * @param data
         */
        setAll: function (type, data) {
            var self = this;
            var names = Object.keys(data);
            for (var i = 0; i < names.length; i++) {
                var name = names[i];
                var graphic = data[name];
                self.set(type, name, graphic);
            }
        },
        /**
         *
         * @param type
         * @param name
         */
        unset: function (type, name) {
            var self = this;
            if (graphics[type] != undefined) {
                if (graphics[type][name] != undefined) {
                    delete graphics[type][name];
                }
            }
        }
    };
})(RPG);