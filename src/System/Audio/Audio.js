'use strict';
(function (root) {
    if(root.Game_Timer === undefined){
        throw "Audio requires Game_Timer"
    }

    if(root.Audio_File === undefined){
        throw "Audio requires AudioInstance"
    }

    let Game_Timer = root.Game_Timer;
    let Audio_Instance  = root.Audio_File;

    let playing = {};
    let fade = {};
    let paused = {};
    let audios = {};

    let Audio = {
        freeze: function () {
            let keys = Object.keys(playing);
            let i;
            for (i = 0; i < keys.length; i++) {
                playing[keys[i]].pause();
            }
        },
        resume: function () {
            let keys = Object.keys(playing);
            let i;
            for (i = 0; i < keys.length; i++) {
                playing[keys[i]].play();
            }
        },
        /**
         *
         * @param type
         * @param name
         * @param id
         * @param loop
         * @returns {*}
         */
        play: function (type, name, id,loop) {
            if (audios[type] && audios[type][name]) {
                let src =audios[type][name];
                if(playing[type] === undefined){
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
        /**
         *
         * @param type
         * @param id
         */
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
        /**
         *
         * @param type
         * @param id
         * @param time
         * @param finish
         */
        fade:function(type,id,time,finish){
            if(playing[type] && playing[type][id]){
                if(fade[type] === undefined){
                    fade[type] = {};
                }

                let audio_obj = playing[type][id];
                if(!fade[type][id]){
                    fade[type][id]  = audio_obj;
                    let start_time = Game_Timer.currentTime;
                    let end_time = start_time+time;
                    let volume = audio_obj.volume;

                    let callback = function(){
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
                            let passed_time = end_time - Game_Timer.currentTime;
                            audio_obj.volume = passed_time*volume/time;
                        }
                    };
                    Game_Timer.addEventListener('tick',callback);
                }
            }
        },
        /**
         *
         * @param type
         * @param id
         */
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
        /**
         *
         * @param type
         * @param name
         * @param src
         */
        set: function (type, name, src) {
            if (audios[type] === undefined) {
                audios[type] = {};
            }

            if (audios[type][name] !== src) {
                audios[type][name] = src;
            }
        },
        /**
         *
         * @param type
         * @param name
         */
        unset: function (type, name) {
            if (audios[type] !== undefined) {
                if (audios[type][name] !== undefined) {
                    delete audios[type][name];
                }
            }
        }
    };

    Object.defineProperty(root,'Audio',{
        /**
         *
         * @returns {{freeze: freeze, resume: resume, play: play, stop: stop, fade: fade, pause: pause, set: set, unset: unset}}
         */
       get:function(){
           return Audio;
       }
    });
})(RPG);