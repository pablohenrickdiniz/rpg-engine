(function (root) {
    if (root.System == undefined) {
        throw "Audio requires System"
    }

    if(root.Resources == undefined || root.Resources.Audio == undefined){
        throw "System Audio requires Resources Audio"
    }

    var System = root.System,
        Audio = root.Resources.Audio;

    System.Audio = {
        playing_audio:[],
        systemFreeze: function () {
            var self = this;
            var length = self.playing_audio.length;
            var i;
            for(i =0; i < length;i++){
                self.playing_audio[i].pause();
            }
        },
        systemResume:function(){
            var self = this;
            var length = self.playing_audio.length;
            var i;
            for(i =0; i < length;i++){
                self.playing_audio[i].play();
            }
        },
        play: function (type, name) {
            var self = this;
            var audio = Audio.get(type,name);
            if (audio != null && self.playing_audio.indexOf(audio) == -1) {
                self.playing_audio.push(audio);
                audio.play();
            }
            else {
                console.error('Audio ' + name + ' ' + type + ' not loaded!');
            }
        },
        stop: function (type, name) {
            if (Audio.exists(type,name)) {
                var audio = Audio.get(type,name);
                audio.pause();
                audio.currentTime = 0;
                var self = this;
                var index = self.playing_audio.indexOf(audio);
                if(index != -1){
                    self.playing_audio.splice(index,1);
                }
            }
        },
        pause: function (type, name) {

            if (Audio.exists(type,name)) {
                var audio = Audio.get(type,name);
                audio.pause();
                var self = this;
                var index = self.playing_audio.indexOf(audio);
                if(index != -1){
                    self.playing_audio.splice(index,1);
                }
            }
        },
        setVolume: function (type, name, volume) {
            if(Audio.exists(type,name)){
                volume = volume > 100 ? 100 : volume < 0 ? 0 : volume;
                Audio.get(type,name).volume = volume/100;
            }
        },
        getVolume: function (type, name) {
            if(Audio.exists(type,name)){
                return Audio.get(type,name).volume;
            }
            return 0;
        }
    };
})(RPG);