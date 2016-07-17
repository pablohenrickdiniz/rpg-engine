(function(w){
    var AudioLoader = {
        loadedAudio:[],//Audios que já foram carregadas
        /*
         loadAll(Array[String] urls, function callback):void
         Carrega todos as audios de urls e passa o
         resultado para a função callback
         */
        loadAll:function(urls,callback){
            loadAll(urls,[],callback);
        },
        /*
         load:(String url, function callback):void
         Carrega o audio da url e passa o resultado
         para a função callback
         */
        load:function(url,callback){
            var self = this;
            var audio = document.createElement('audio');
            //img.crossOrigin = "Anonymous";
            audio.src = url;

            var onload_callback = function(){
                var audio = this;
                audio.removeEventListener('load',onload_callback);
                var exists = false;

                if(AudioLoader.loadedAudio[audio.src] === undefined){
                    AudioLoader.loadedAudio[audio.src] = audio;
                }
                else{
                    audio = AudioLoader.loadedAudio[audio.src];
                    exists=true;
                }
                callback(audio,exists);
            };

            var onerror_callback = function(){
                audio.removeEventListener('error',onerror_callback);
                callback(null,false);
            };

            audio.addEventListener('load',onload_callback);
            audio.addEventListener('error',onerror_callback);
        }
    };

    var loadAll = function(urls,loaded,callback){
        loaded = loaded === undefined?[]:loaded;
        if(urls.length > 0){
            var url = urls.shift();
            AudioLoader.load(url,function(audio){
                loaded.push(audio);
                loadAll(urls,loaded,callback);
            });
        }
        else if(typeof callback === 'function'){
            callback(loaded);
        }
    };

    w.AudioLoader = AudioLoader;
})(window);