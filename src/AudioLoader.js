(function(w){
    if(w.Audio == undefined){
        throw "AudioLoader requires Audio support"
    }

    var AudioLoader = {
        audios:[],//Audios que já foram carregadas
        /*
         loadAll(Array[String] urls, function callback):void
         Carrega todos as audios de urls e passa o
         resultado para a função callback
         */
        loadAll:function(urls,callback){
            var keys = Object.keys(urls);
            var loaded = [];
            var length = keys.length;

            if(length > 0){
                var q = function(audio,id){
                    loaded[id] = audio;
                    length--;
                    if(length <= 0){
                        callback(loaded);
                    }
                };

                for(var k =0; k < keys.length;k++){
                    var key = keys[k];
                    AudioLoader.load(urls[key],key,q);
                }
            }
            else{
               callback(loaded);
            }
        },
        /*
         load:(String url, function callback):void
         Carrega o audio da url e passa o resultado
         para a função callback
         */
        load:function(url,id,callback){
            var self = this;
            if(self.audios[url] == undefined){
                var audio = new Audio();
                //img.crossOrigin = "Anonymous";
                audio.src = url;

                var can_play_callback = function(){
                    var audio = this;
                    audio.removeEventListener('canplaythrough',can_play_callback);
                    audio.removeEventListener('error',onerror_callback);
                    callback(audio,id);
                };

                var onerror_callback = function(){
                    audio.removeEventListener('canplaythrough',can_play_callback);
                    audio.removeEventListener('error',onerror_callback);
                    callback(null,id);
                };

                audio.addEventListener('canplaythrough',can_play_callback);
                audio.addEventListener('error',onerror_callback);
            }
            else{
                callback(self.audios[url],id);
            }
        }
    };
    //
    //var loadAll = function(keys,urls,loaded,callback){
    //    loaded = loaded === undefined?[]:loaded;
    //    if(keys.length > 0){
    //        var key = keys.shift();
    //        AudioLoader.load(urls[key],function(audio){
    //            loaded[key] = audio;
    //            loadAll(keys,urls,loaded,callback);
    //        });
    //    }
    //    else if(typeof callback === 'function'){
    //        callback(loaded);
    //    }
    //};

    w.AudioLoader = AudioLoader;
})(window);