(function(w){
    if(w.Audio == undefined){
        (function(w){
            var context =new (w.AudioContext || w.webkitAudioContext)();
            var load_audio = function(url){
                var self = this;
                var request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'arraybuffer';

                request.onload = function () {
                    context.decodeAudioData(request.response, function (buffer) {
                        self.buffer = buffer;
                        self.trigger('load');
                    });
                };

                request.send();
            };


            var Audio = function(){
                var self = this;
                var src  = '';
                self.events = [];
                self.buffer = null;
                self.source = null;
                self.paused = true;
                self.timeStart = null;
                var currentTime = 0;

                Object.defineProperty(self,'src',{
                    set:function(newSrc){
                        if(src != newSrc){
                            src = newSrc;
                            load_audio.apply(self,[src]);
                        }
                    },
                    get:function(){
                        return src;
                    }
                });

                Object.defineProperty(self,'currentTime',{
                    set:function(newTime){
                        currentTime = newTime;
                    },
                    get:function(){
                        return self.paused?currentTime:(new Date()).getTime()-self.time_start;
                    }
                });
            };

            Audio.prototype.play = function(){
                var self = this;
                if(self.paused && self.buffer != null){
                    if(self.time_start == null){
                        self.time_start = (new Date()).getTime();
                    }
                    else{
                        self.time_start = (new Date()).getTime()-self.currentTime;
                    }

                    var source =  context.createBufferSource();
                    source.buffer = self.buffer;
                    source.connect(context.destination);
                    source.start(0,self.currentTime/1000);
                    self.source = source;
                    self.paused = false;
                }
            };

            Audio.prototype.pause = function(){
                var self = this;
                if(!self.paused){
                    self.paused = true;
                    self.source.stop();
                    self.currentTime = (new Date()).getTime() - self.time_start;
                }
            };

            Audio.prototype.addEventListener = function(event,callback){
                var self = this;
                if(self.events[event] == undefined){
                    self.events[event] = [];
                }
                self.events[event].push(callback);
            };

            Audio.prototype.removeEventListener = function(event,callback){
                var self = this;
                if(self.events[event] != undefined){
                    var index = self.events[event].indexOf(callback);
                    if(index != -1){
                        self.events[event].splice(index,1);
                    }
                }
            };

            Audio.prototype.trigger = function(event){
                var self = this;
                if(self.events[event] != undefined){
                    var i;
                    for(i =0; i < self.events[event].length;i++){
                        self.events[event][i].apply(self);
                    }
                }
            };

            w.Audio = Audio;
        })(w);
    }
    else{
        if(w.Audio.prototype.stop == undefined){
            w.Audio.prototype.stop = function(){
                var self = this;
                self.pause();
                self.currentTime = 0;
            };
        }
    }
})(window);