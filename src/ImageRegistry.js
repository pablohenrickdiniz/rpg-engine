(function (root) {
    root.ImageRegistry = {
        images: {},
        getImage:function(type, name){
            var self = this;
            if(self.images[type] && self.images[type][name]){
                return self.images[type][name];
            }
            return null;
        },
        setImage: function (type, name, images) {
            var self = this;
            if (self.images[type] == undefined) {
                self.images[type] = {};
            }

            if (self.images[type][name] != images) {
                if (self.images[type][name] != undefined) {
                    self.images[type][name].stop();
                }
                self.images[type][name] = images;
            }
        },
        setImages: function (type, data) {
            var self = this;
            var names = Object.keys(data);
            for (var i = 0; i < names.length; i++) {
                var name = names[i];
                var images = data[name];
                self.setImage(type, name, images);
            }
        },
        unsetImage: function (type, name) {
            var self = this;
            if (self.images[type] != undefined) {
                if (self.images[type][name] != undefined) {
                    delete self.images[type][name];
                }
            }
        },
        exists: function (type, name) {
            var self = this;
            return self.images[type] && self.images[type][name];
        }
    };
})(RPG);