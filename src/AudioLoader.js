(function (w) {
    if (w.Audio == undefined) {
        throw "AudioLoader requires Audio support"
    }
    /*
     current_progress(Audio aud):int

     */
    var current_progress = function (aud) {
        var pos = aud.buffered.length - 1;
        if (pos >= 0) {
            var loaded = aud.buffered.end(pos);
            var total = aud.duration;
            var progress = parseInt(loaded * 100 / total);
            return isNaN(progress) ? 0 : progress;
        }
        return 0;
    };

    var AudioLoader = {
        audios: {},//Audios que já foram carregadas
        /*
         loadAll(Array[String] urls, function callback):void
         Carrega todos as audios de urls e passa o
         resultado para a função callback
         */
        loadAll: function (urls, onsuccess, onprogress, onerror) {
            var keys = Object.keys(urls);
            var loaded = [];
            var length = keys.length;

            if (length > 0) {
                var q = function (audio, id) {
                    loaded[id] = audio;
                    length--;
                    if (length <= 0) {
                        onsuccess(loaded);
                    }
                };

                for (var k = 0; k < keys.length; k++) {
                    var key = keys[k];
                    AudioLoader.load(urls[key], key, q, onprogress, onerror);
                }
            }
            else if (onsuccess) {
                onsuccess(loaded);
            }
        },
        /*
         load:(String url,string id,function onsuccess,function onerror):void
         Carrega o audio da url
         url: Caminho para o arquivo de audio;
         id:  Identificador para diferenciar os arquivos (carregamento asíncrono);
         onsuccess: Essa função é chamada quando o audio foi carregado completamente;
         onprogress: Essa função é chamada quando o audio está sendo carregado, e mosta o progresso;
         */
        load: function (url, id, onsuccess, onprogress, onerror) {
            var self = this;
            if (self.audios[url] == undefined) {
                var audio = new Audio();
                //img.crossOrigin = "Anonymous";
                audio.src = url;
                audio.volume = 0;
                self.audios[url] = audio;

                var unbind = function () {
                    audio.removeEventListener('error', onerror_callback);
                    audio.removeEventListener('timeupdate', timeupdate_callback);
                    audio.removeEventListener('canplaythrough', can_play_callback);
                };

                var onsuccess_callback = function () {
                    unbind();
                    if (onsuccess) {
                        onsuccess(audio, id);
                    }
                };

                var onerror_callback = function () {
                    unbind();
                    if (onerror) {
                        onerror(id);
                    }
                };

                var old_progress = 0;

                var timeupdate_callback = function () {
                    var progress = current_progress(audio);

                    if (progress == 100) {
                        audio.pause();
                        audio.volume = 1;
                        audio.playbackRate = audio.defaultPlaybackRate;
                        audio.currentTime = 0;
                        onsuccess_callback();
                    }
                    else if (progress > old_progress) {
                        old_progress = progress;
                        if (onprogress) {
                            onprogress(id, progress);
                        }
                    }
                };

                var can_play_callback = function () {
                    audio.playbackRate = audio.duration;
                    audio.play();
                };

                audio.addEventListener('error', onerror_callback);
                audio.addEventListener('timeupdate', timeupdate_callback);
                audio.addEventListener('canplaythrough', can_play_callback);

                audio.load();
            }
            else if (onsuccess) {
                onsuccess(self.audios[url], id);
            }
        }
    };

    w.AudioLoader = AudioLoader;
})(window);