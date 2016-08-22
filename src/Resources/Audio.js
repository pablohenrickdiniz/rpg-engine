(function(root){
    if(root.Resources == undefined){
        throw "Audio requires Resources"
    }

    var Resources = root.Resources;

    Resources.Audio = {
        audio: {},
        get:function(type, name){
            var self = this;
            if (self.audio[type] != undefined && self.audio[type][name] != undefined) {
                return self.audio[type][name];
            }
            return null;
        },
        set: function (type, name, audio) {
            var self = this;
            if (self.audio[type] == undefined) {
                self.audio[type] = {};
            }

            if (self.audio[type][name] != audio) {
                if (self.audio[type][name] != undefined) {
                    self.audio[type][name].currentTime = 0;
                }
                self.audio[type][name] = audio;
            }
        },
        setAll: function (type, data) {
            var self = this;
            var names = Object.keys(data);
            for (var i = 0; i < names.length; i++) {
                var name = names[i];
                var audio = data[name];
                self.set(type, name, audio);
            }
        },
        unset: function (type, name) {
            var self = this;
            if (self.audio[type] != undefined) {
                if (self.audio[type][name] != undefined) {
                    delete self.audio[type][name];
                }
            }
        },
        exists: function (type, name) {
            var self = this;
            return self.audio[type] && self.audio[type][name];
        }
    };
})(RPG);