(function (root) {
    if (root.System == undefined) {
        throw "Audio requires System"
    }

    var System = root.System;

    System.Audio = {
        audio: {},
        audio_freeze: [],
        systemFreeze: function () {
            var self = this;
            var types = Object.keys(self.audio);
            var length = types.length;
            var t;
            var a;
            var type;
            var audios;
            var length2;
            var name;
            var audio;
            var freeze = [];

            for (t = 0; t < length; t++) {
                type = types[t];
                audios = Object.keys(self.audio[type]);
                length2 = audios.length;
                for (a = 0; a < length2; a++) {
                    name = audios[a];
                    audio = self.audio[type][name];
                    if(!audio.paused){
                        audio.pause();
                        freeze.push(audio);
                    }
                }
            }

            self.audio_freeze = freeze;
        },
        systemResume:function(){
            var self = this;
            while(self.audio_freeze.length > 0){
                self.audio_freeze.pop().play();
            }
        },
        play: function (type, name) {
            var self = this;
            if (self.audio[type] && self.audio[type][name]) {
                self.audio[type][name].play();
            }
            else {
                console.error('Audio ' + name + ' ' + type + ' not loaded!');
            }
        },
        stop: function (type, name) {
            var self = this;
            if (self.audio[type] && self.audio[type][name]) {
                self.audio[type][name].stop();
            }
        },
        pause: function (type, name) {
            var self = this;
            if (self.audio[type] && self.audio[type][name]) {
                self.audio[type][name].pause();
            }
        },
        setVolume: function (type, name, volume) {
            var self = this;
            volume = volume > 100 ? 100 : volume < 0 ? 0 : volume;
            if (self.audio[type] && self.audio[type][name]) {
                self.audio[type][name].volume = volume / 100;
            }
        },
        getVolume: function (type, name) {
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
        setAll: function (type, data) {
            var self = this;
            var names = Object.keys(data);
            for (var i = 0; i < names.length; i++) {
                var name = names[i];
                var audio = data[name];
                self.setAudio(type, name, audio);
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