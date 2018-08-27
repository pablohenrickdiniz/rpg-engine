(function (w) {
    if (w.Audio === undefined) {
        throw "AudioLoader requires Audio support"
    }

    /**
     *
     * @param aud
     * @returns {number}
     */
    function current_progress(aud) {
        var loaded = loaded_audio(aud);
        if (loaded >= 0) {
            var total = aud.duration;
            var progress = parseFloat(loaded * 100 / total);
            return isNaN(progress) ? 0 : progress;
        }
        return 0;
    }

    /**
     *
     * @param aud
     * @returns {*}
     */
    function loaded_audio(aud){
        var pos = aud.buffered.length - 1;
        if(pos >= 0){
            return aud.buffered.end(pos);
        }
        return 0;
    }


    var audios = {};


    var Audio_Loader = {
        /**
         *
         * @param urls
         * @param options
         */
        loadAll: function (urls,options) {
            options = options ||{};
            var keys = Object.keys(urls);
            var loaded = [];
            var length = keys.length;
            var onsuccess = options.onsuccess || null;
            var onprogress = options.onprogress || null;
            var onerror = options.onerror || null;
            var onglobalprogress = options.onglobalprogress || null;
            var globalprogress = options.globalprogress || new GlobalProgress();

            if (length > 0) {
                function q(audio, id) {
                    loaded[id] = audio;
                    length--;
                    if (length === 0 && onsuccess) {
                        onsuccess(loaded);
                    }
                }

                for (var k = 0; k < keys.length; k++) {
                    var key = keys[k];
                    Audio_Loader.load(urls[key], key, {
                        onsuccess:q,
                        onprogress:onprogress,
                        onerror:onerror,
                        onglobalprogress:onglobalprogress,
                        globalprogress:globalprogress
                    });
                }
            }
            else if (onsuccess) {
                onsuccess(loaded);
            }
        },
        /**
         *
         * @param url
         * @param id
         * @param options
         */
        load: function (url, id, options) {
            options = options || {};
            var onsuccess = options.onsuccess || null;
            var onprogress = options.onprogress || null;
            var onerror = options.onerror || null;
            var onglobalprogress = options.onglobalprogress || null;
            var globalprogress = options.globalprogress || new GlobalProgress();

            if (audios[url] === undefined) {
                var audio = new Audio();
                //img.crossOrigin = "Anonymous";
                audio.src = url;
                audio.volume = 0;
                audio.currentTime = loaded_audio(audio);
                audios[url] = audio;

                function unbind() {
                    audio.removeEventListener('error', onerror_callback);
                    audio.removeEventListener('timeupdate', timeupdate_callback);
                    audio.removeEventListener('canplaythrough', can_play_callback);
                }

                function onsuccess_callback() {
                    unbind();
                    if (onsuccess) {
                        onsuccess(id,url);
                    }
                }

                function onerror_callback () {
                    unbind();
                    if (onerror) {
                        onerror(id);
                    }
                }

                var old_progress = 0;
                var media = null;

                function timeupdate_callback () {
                    var loaded = loaded_audio(audio);

                    if(loaded === audio.duration){
                        audio.pause();
                        audio.volume = 1;
                        audio.playbackRate = audio.defaultPlaybackRate;
                        audio.currentTime = 0;
                        onsuccess_callback();
                    }
                    else {
                        var progress = current_progress(audio);
                        if(progress !== old_progress){
                            old_progress = progress;
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

                            if(onglobalprogress){
                                onglobalprogress(globalprogress.progress());
                            }

                            if (onprogress) {
                                onprogress(id, progress);
                            }
                        }
                        else{
                            var diff = audio.duration - loaded;
                            if(diff > 0){
                                audio.currentTime = loaded;
                                audio.playbackRate = diff;
                                audio.play();
                            }
                        }
                    }
                }

                function can_play_callback() {
                    audio.playbackRate = Math.min(audio.duration,16);
                    audio.play();
                }

                audio.addEventListener('error', onerror_callback);
                audio.addEventListener('timeupdate', timeupdate_callback);
                audio.addEventListener('canplaythrough', can_play_callback);

                audio.load();
            }
            else if (onsuccess) {
                onsuccess(id,url);
            }
        }
    };

    w.Audio_Loader = Audio_Loader;
})(window);