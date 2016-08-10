(function(w){
    var ImageLoader = {
        images:[],//Imagens que já foram carregadas
        /*
         loadAll(Array[String] urls, function callback):void
         Carrega todas as images de urls e passa o
         resultado para a função callback
         */
        loadAll:function(urls,callback){
            var keys = Object.keys(urls);
            var loaded = [];
            var length = keys.length;

            if(length > 0){
                var q = function(image,id){
                    loaded[id] = image;
                    length--;
                    if(length <= 0){
                        callback(loaded);
                    }
                };

                for(var k =0; k < keys.length;k++){
                    var key = keys[k];
                    ImageLoader.load(urls[key],key,q);
                }
            }
            else{
                callback(loaded);
            }
        },
        /*
         load:(String url, function callback):void
         Carrega a imagem da url e passa o resultado
         para a função callback
         */
        load:function(url,id,callback){
            if(ImageLoader.images[url] === undefined){
                var img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = url;
                var onload_callback = function(){
                    var img = this;
                    img.removeEventListener('load',onload_callback);
                    img.removeEventListener('error',onerror_callback);
                    ImageLoader.images[url] = img;
                    callback(img,id);
                };

                var onerror_callback = function(){
                    img.removeEventListener('load',onload_callback);
                    img.removeEventListener('error',onerror_callback);
                    callback(null,id);
                };

                img.addEventListener('load',onload_callback);
                img.addEventListener('error',onerror_callback);
            }
            else{
                callback(ImageLoader.images[url],id);
            }
        },
        /*
         toDataURL(Image img, function callback):void
         Gera uma url para a imagem img e passa para a
         função callback
         */
        toDataURL:function(img,id,callback){
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img,0,0);
            var dataUrl = canvas.toDataURL();
            callback(dataUrl,id);
            canvas = null;
        },
        toDataURLS:function(urls,callback){
            ImageLoader.loadAll(urls,function(loaded){
                var keys = Object.keys(loaded);
                var loaded_data = [];
                var length = keys.length;
                var q = function(dataUrl,id){
                    loaded_data[id] = dataUrl;
                    length--;
                    if(length <= 0){
                        callback(loaded_data);
                    }
                };
                for(var k =0; k < keys.length;k++){
                    var key = keys[k];
                    ImageLoader.toDataURL(urls[key],key,q);
                }
            });
        },
        fromDataURL:function(data,callback){
            if(data != null){
                var img = new Image();
                img.src = data;

                var load_callback = function(){
                    this.removeEventListener('load',load_callback);
                    this.removeEventListener('error',error_callback);
                    callback(img);
                };

                var error_callback = function(){
                    this.removeEventListener('load',load_callback);
                    this.removeEventListener('error',error_callback);
                    callback(null);
                };

                img.addEventListener('load',load_callback);
                img.addEventListener('error',error_callback);
            }
            else{
                callback(null);
            }
        }
    };

    //var toDataUrls = function(keys,urls,parsed,callback){
    //    parsed = parsed === undefined?[]:parsed;
    //    if(keys.length > 0){
    //        var key = keys.shift();
    //        ImageLoader.load(urls[key],function(img){
    //            ImageLoader.toDataURL(img,function(data){
    //                parsed[key] = data;
    //                toDataUrls(keys,urls,parsed,callback);
    //            })
    //        });
    //    }
    //    else if(typeof callback === 'function'){
    //        callback(parsed);
    //    }
    //};
    //
    //var loadAll = function(keys,urls,loaded,callback){
    //    loaded = loaded === undefined?[]:loaded;
    //    if(keys.length > 0){
    //        var key = keys.shift();
    //        ImageLoader.load(urls[key],function(img){
    //            loaded[key] = img;
    //            loadAll(keys,urls,loaded,callback);
    //        });
    //    }
    //    else if(typeof callback === 'function'){
    //        callback(loaded);
    //    }
    //};

    w.ImageLoader = ImageLoader;
})(window);