(function (root) {
    if(root.Game_Timer == undefined){
        throw "Audio requires Game_Timer"
    }

    if(root.Audio_File == undefined){
        throw "Audio requires AudioInstance"
    }

    var Game_Timer = root.Game_Timer;
    var Audio_Instance  = root.Audio_File;

    var playing = {};
    var fade = {};
    var paused = {};
    var audios = {};

    root.Audio = {
        freeze: function () {
            var keys = Object.keys(playing);
            var i;
            for (i = 0; i < keys.length; i++) {
                playing[keys[i]].pause();
            }
        },
        resume: function () {
            var keys = Object.keys(playing);
            var i;
            for (i = 0; i < keys.length; i++) {
                playing[keys[i]].play();
            }
        },
        play: function (type, name, id,loop) {
            if (audios[type] && audios[type][name]) {
                var src =audios[type][name];
                if(playing[type] == undefined){
                    playing[type] = {};
                }

                if(paused[type] && paused[type][id]){
                    playing[type][id] = paused[type][id];
                    delete paused[type][id];
                }
                else if(!playing[type][id]){
                    playing[type][id] = new Audio_Instance({
                        name:name,
                        src:src,
                        loop:loop
                    });
                }

                playing[type][id].play();
                return playing[type][id];
            }
            return null;
        },
        stop: function (type,id) {
            if(playing[type] && playing[type][id]){
                playing[type][id].stop();
                if(!paused[type]){
                    paused[type] = {};
                }
                paused[type][id] =  playing[type][id];
                delete playing[type][id];
            }
        },
        fade:function(type,id,time,finish){
            if(playing[type] && playing[type][id]){
                if(fade[type] == undefined){
                    fade[type] = {};
                }

                var audio_obj = playing[type][id];
                if(!fade[type][id]){
                    fade[type][id]  = audio_obj;
                    var start_time = Game_Timer.currentTime;
                    var end_time = start_time+time;
                    var volume = audio_obj.volume;

                    var callback = function(){
                        if(Game_Timer.currentTime >= end_time){
                            Game_Timer.removeEventListener('tick',callback);
                            audio_obj.stop();
                            audio_obj.volume = 1;
                            if(!paused[type]){
                                paused[type] = {};
                            }
                            paused[type][id] = fade[type][id];
                            delete fade[type][id];
                            if(finish){
                                finish();
                            }
                        }
                        else{
                            var passed_time = end_time - Game_Timer.currentTime;
                            audio_obj.volume = passed_time*volume/time;
                        }
                    };
                    Game_Timer.addEventListener('tick',callback);
                }
            }
        },
        pause: function (type,id) {
            if(playing[type] && playing[type][id]){
                playing[type][id].pause();
                if(paused[type]){
                    paused[type] = {};
                }
                paused[type][id] = playing[type][id];
                delete playing[type][id];
            }
        },
        set: function (type, name, src) {
            if (audios[type] == undefined) {
                audios[type] = {};
            }

            if (audios[type][name] != src) {
                audios[type][name] = src;
            }
        },
        unset: function (type, name) {
            if (audios[type] != undefined) {
                if (audios[type][name] != undefined) {
                    delete audios[type][name];
                }
            }
        }
    };
})(RPG);