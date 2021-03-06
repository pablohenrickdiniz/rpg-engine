/**
 * @requires ../System/Audio/Audio.js
 * @requires ../System/Events.js
 */
(function (root,w) {
    let Events = root.Events;
    /**
     *
     * @param aud
     * @returns {number}
     */
    function current_progress(aud) {
        let loaded = loaded_audio(aud);
        if (loaded >= 0) {
            let total = aud.duration;
            let progress = parseFloat(loaded * 100 / total);
            return isNaN(progress) ? 0 : progress;
        }
        return 0;
    }

    /**
     *
     * @param aud
     * @returns {number}
     */
    function loaded_audio(aud){
        let pos = aud.buffered.length - 1;
        if(pos >= 0){
            return aud.buffered.end(pos);
        }
        return 0;
    }

    let audios = {};

    let Audio_Loader = {
        /**
         *
         * @param urls {Array[]<string>}
         * @param options {object}
         */
        loadAll: function (urls,options) {
            options = options ||{};
            let keys = Object.keys(urls);
            let loaded = [];
            let length = keys.length;
            let globalprogress = options.globalprogress || new GlobalProgress();

            if (length > 0) {
                let q = function(audio, id) {
                    loaded[id] = audio;
                    length--;
                    if (toptions.success && length === 0) {
                        options.success(loaded);
                    }
                };

                for (let k = 0; k < keys.length; k++) {
                    let key = keys[k];
                    Audio_Loader.load(urls[key], key, {
                        success:q,
                        progress:options.progress,
                        error:options.error,
                        totalprogress:options.totalprogress,
                        globalprogress:globalprogress
                    });
                }
            }
            else if (options.success) {
                options.success(loaded);
            }
        },
        /**
         *
         * @param url {string}
         * @param id {string}
         * @param options {object}
         */
        load: function (url, id, options) {
            options = options || {};
            let globalprogress = options.globalprogress || new GlobalProgress();

            if (audios[url] === undefined) {
                let audio = new Audio();
                //img.crossOrigin = "Anonymous";
                audio.src = url;
                audio.muted = true;
                audio.currentTime = loaded_audio(audio);
                audios[url] = audio;

                let error = function() {
                    unbind();
                    if (options.error) {
                        options.error(id);
                    }
                };

                let success = function() {
                    unbind();
                    if (options.success) {
                        options.success(id,url);
                    }
                };

                let oprogress = 0;
                let media = null;

                let timeupdate = function() {
                    let loaded = loaded_audio(audio);

                    if(loaded === audio.duration){
                        audio.pause();
                        audio.muted = false;
                        audio.playbackRate = audio.defaultPlaybackRate;
                        audio.currentTime = 0;
                        success();
                    }
                    else {
                        let progress = current_progress(audio);
                        if(progress !== oprogress){
                            oprogress = progress;
                            if(globalprogress){
                                if(media == null){
                                    media = {
                                        loaded:progress,
                                        total:100
                                    };
                                    globalprogress.add(media);
                                }
                                else{
                                    media.loaded = progress;
                                }
                            }

                            if(options.totalprogress){
                                options.totalprogress(globalprogress.progress());
                            }

                            if (options.progress) {
                                options.progress(id, progress);
                            }
                        }
                        else{
                            let diff = audio.duration - loaded;
                            if(diff > 0){
                                audio.currentTime = loaded;
                                audio.playbackRate = diff;
                                audio.play();
                            }
                        }
                    }
                };

                let canplay = function() {
                    audio.playbackRate = Math.min(audio.duration,16);
                    let promisse = audio.play();
                    if(promisse){
                        promisse
                            .catch(function(){
                                Events.trigger('requireDOMInteraction',[canplay]);
                            });
                    }
                };

                let unbind = function() {
                    audio.removeEventListener('error', error);
                    audio.removeEventListener('timeupdate', timeupdate);
                    audio.removeEventListener('canplaythrough', canplay);
                };

                audio.addEventListener('error', error);
                audio.addEventListener('timeupdate', timeupdate);
                audio.addEventListener('canplaythrough', canplay);
                audio.load();
            }
            else if (options.success) {
                options.success(id,url);
            }
        }
    };

    Object.freeze(Audio_Loader);
    Object.defineProperty(w,'Audio_Loader',{
        /**
         *
         * @returns {Audio_Loader}
         */
        get:function(){
            return Audio_Loader;
        }
    });
})(RPG,window);