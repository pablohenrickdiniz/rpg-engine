(function(root){
    if(root.Game_Timer === undefined){
        throw "Audio_File requires Game_Timer"
    }

    var Game_Timer = root.Game_Timer;
    var Audio_File = function(options){
        options = options || {};
        var self  =this;
        initialize(self);
        self.name = options.name || '';
        self.type = options.type;
        self.src = options.src;
        self.volume = options.volume || 1;
        self.loop = options.loop || false;
    };

    Audio_File.prototype.play = function(){
        var self = this;
        if(!self.playing){
            self.audio.play();
        }
    };

    Audio_File.prototype.pause = function(){
        var self = this;
        if(self.playing){
            self.audio.pause();
        }
    };

    Audio_File.prototype.stop = function(){
        var self = this;
        self.audio.pause();
        self.audio.currentTime = 0;
    };

    function initialize(self){
        var audio = null;
        var aux_aud = new Audio();
        var loop = false;
        var timeupdate = function(){
            if(loop){
                if(audio.currentTime+audio.playbackRate > audio.duration){
                    audio.removeEventListener('timeupdate',timeupdate);
                    var tmp = audio;
                    audio = aux_aud;
                    aux_aud = tmp;
                    audio.addEventListener('timeupdate',timeupdate);
                    audio.currentTime = 0;
                    audio.play();
                }
                else if(aux_aud.playing){
                    aux_aud.pause();
                }
            }
        };

        Object.defineProperty(self,'src',{
            get:function(){
                return self.audio.src;
            },
            set:function(src){
                self.audio.src = src;
                aux_aud.src = src;
            }
        });

        Object.defineProperty(self,'volume',{
            get:function(){
                return self.audio.volume;
            },
            set:function(volume){
                volume  = parseFloat(volume);
                if(!isNaN(volume) && volume <= 1 && volume >= 0){
                    self.audio.volume = volume;
                    aux_aud.volume = volume;
                }
            }
        });

        Object.defineProperty(self,'audio',{
            get:function(){
                if(audio == null){
                    audio = new Audio();
                    audio.addEventListener('timeupdate',timeupdate);
                }
                return audio;
            }
        });

        Object.defineProperty(self,'loop',{
            get:function(){
                return loop;
            },
            set:function(l){
               loop = l?true:false;
            }
        });

        Object.defineProperty(self,'playing',{
            get:function(){
                return self.audio.playing;
            }
        });
    }

    root.Audio_File = Audio_File;
})(RPG);