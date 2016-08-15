(function (root) {
    if(root.System == undefined){
        throw "Image requires System"
    }

    var System = root.System;

    System.Graphic = {
        graphics: {},
        get: function (type, name) {
            var self = this;
            if (self.graphics[type] && self.graphics[type][name]) {
                return self.graphics[type][name];
            }
            return null;
        },
        set: function (type, name, graphics) {
            var self = this;
            if (self.graphics[type] == undefined) {
                self.graphics[type] = {};
            }

            if (self.graphics[type][name] != graphics) {
                if (self.graphics[type][name] != undefined) {
                    self.graphics[type][name].stop();
                }
                self.graphics[type][name] = graphics;
            }
        },
        setAll: function (type, data) {
            var self = this;
            var names = Object.keys(data);
            for (var i = 0; i < names.length; i++) {
                var name = names[i];
                var graphics = data[name];
                self.set(type, name, graphics);
            }
        },
        unset: function (type, name) {
            var self = this;
            if (self.graphics[type] != undefined) {
                if (self.graphics[type][name] != undefined) {
                    delete self.graphics[type][name];
                }
            }
        },
        exists: function (type, name) {
            var self = this;
            return self.graphics[type] && self.graphics[type][name];
        }
    };
})(RPG);