(function (root) {
    root.AudioRegistry = {
        audio: {},
        playAudio: function (type, name) {
            var self = this;
            if (self.audio[type] && self.audio[type][name]) {
                self.audio[type][name].play();
            }
        },
        stopAudio: function (type, name) {
            var self = this;
            if (self.audio[type] && self.audio[type][name]) {
                self.audio[type][name].stop();
            }
        },
        pauseAudio: function (type, name) {
            var self = this;
            if (self.audio[type] && self.audio[type][name]) {
                self.audio[type][name].pause();
            }
        },
        setVolume:function(type, name, volume){
            var self = this;
            volume = volume > 100?100:volume<0?0:volume;
            if (self.audio[type] && self.audio[type][name]) {
                self.audio[type][name].volume = volume/100;
            }
        },
        getVolume:function(type, name){
            var self = this;
            if (self.audio[type] && self.audio[type][name]) {
                return self.audio[type][name].volume;
            }
            return 0;
        },
        setAudio: function (type, name, audio) {
            var self = this;
            if (self.audio[type] == undefined) {
                self.audio[type] = {};
            }

            if (self.audio[type][name] != audio) {
                if (self.audio[type][name] != undefined) {
                    self.audio[type][name].stop();
                }
                self.audio[type][name] = audio;
            }
        },
        setAudios: function (type, data) {
            var self = this;
            var names = Object.keys(data);
            for (var i = 0; i < names.length; i++) {
                var name = names[i];
                var audio = data[name];
                self.setAudio(type, name, audio);
            }
        },
        unsetAudio: function (type, name) {
            var self = this;
            if (self.audio[type] != undefined) {
                if (self.audio[type][name] != undefined) {
                    delete self.audio[type][name];
                }
            }
        },
        audioExists: function (type, name) {
            var self = this;
            return self.audio[type] && self.audio[type][name];
        }
    };
})(RPG);