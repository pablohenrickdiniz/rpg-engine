(function (root) {
    root.Audio = {
        playing: [],
        audio:[],
        freeze: function () {
            var self = this;
            var length = self.playing.length;
            var i;
            for (i = 0; i < length; i++) {
                self.playing[i].pause();
            }
        },
        resume: function () {
            var self = this;
            var length = self.playing.length;
            var i;
            for (i = 0; i < length; i++) {
                self.playing[i].play();
            }
        },
        play: function (type, name) {
            var self = this;
            var audio = self.get(type, name);
            if (audio != null && self.playing.indexOf(audio) == -1) {
                self.playing.push(audio);
                audio.play();
            }
            else {
                console.error('Audio ' + name + ' ' + type + ' not loaded!');
            }
        },
        stop: function (type, name) {
            var self = this;
            if (self.exists(type, name)) {
                var audio = self.get(type, name);
                audio.pause();
                audio.currentTime = 0;
                var index = self.playing.indexOf(audio);
                if (index != -1) {
                    self.playing.splice(index, 1);
                }
            }
        },
        pause: function (type, name) {
            var self = this;
            if (self.exists(type, name)) {
                var audio = self.get(type, name);
                audio.pause();
                var index = self.playing.indexOf(audio);
                if (index != -1) {
                    self.playing.splice(index, 1);
                }
            }
        },
        setVolume: function (type, name, volume) {
            var self = this;
            if (self.exists(type, name)) {
                volume = volume > 100 ? 100 : volume < 0 ? 0 : volume;
                self.get(type, name).volume = volume / 100;
            }
        },
        getVolume: function (type, name) {
            var self = this;
            if (self.exists(type, name)) {
                return self.get(type, name).volume;
            }
            return 0;
        },
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