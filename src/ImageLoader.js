(function(w){
    if(w.jsSHA == undefined){
        throw "ImageLoader requires jsSHA"
    }


    var ImageLoader = {
        loadedImages:[],//Imagens que já foram carregadas
        /*
         loadAll(Array[String] urls, function callback):void
         Carrega todas as images de urls e passa o
         resultado para a função callback
         */
        loadAll:function(urls,callback){
            loadAll(urls,[],callback);
        },
        /*
         load:(String url, function callback):void
         Carrega a imagem da url e passa o resultado
         para a função callback
         */
        load:function(url,callback){
            var self = this;
            var img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = url;

            var onload_callback = function(){
                var img = this;
                img.removeEventListener('load',onload_callback);
                ImageLoader.toDataURL(img,function(data){
                    var shaObj = new jsSHA("SHA-1", "TEXT");
                    shaObj.update(data);
                    var hash = shaObj.getHash("HEX");
                    var exists = false;
                    if(ImageLoader.loadedImages[hash] === undefined){
                        img.hash = hash;
                        ImageLoader.loadedImages[hash] = img;
                    }
                    else{
                        img = self.loadedImages[hash];
                        exists=true;
                    }
                    callback(img,exists);
                });
            };

            var onerror_callback = function(){
                img.removeEventListener('error',onerror_callback);
                callback(null,false);
            };

            img.addEventListener('load',onload_callback);
            img.addEventListener('error',onerror_callback);
        },
        /*
         toDataURL(Image img, function callback):void
         Gera uma url para a imagem img e passa para a
         função callback
         */
        toDataURL:function(img,callback){
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img,0,0);
            var dataUrl = canvas.toDataURL();
            callback(dataUrl);
            canvas = null;
        },
        toDataURLS:function(urls,callback){
           toDataUrls(urls,[],callback);
        },
        fromDataURL:function(data,callback){
            if(data != null){
                var img = new Image();
                img.src = data;

                var load_callback = function(){
                    this.removeEventListener('load',load_callback);
                    callback(img);
                };

                var error_callback = function(){
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

    var toDataUrls = function(urls,parsed,callback){
        parsed = parsed === undefined?[]:parsed;
        if(urls.length > 0){
            var url = urls.shift();
            ImageLoader.load(url,function(img){
                ImageLoader.toDataURL(img,function(data){
                    parsed.push(data);
                    toDataUrls(urls,parsed,callback);
                })
            });
        }
        else if(typeof callback === 'function'){
            callback(parsed);
        }
    };

    var loadAll = function(urls,loaded,callback){
        loaded = loaded === undefined?[]:loaded;
        if(urls.length > 0){
            var url = urls.shift();
            ImageLoader.load(url,function(img){
                loaded.push(img);
                loadAll(urls,loaded,callback);
            });
        }
        else if(typeof callback === 'function'){
            callback(loaded);
        }
    };

    w.ImageLoader = ImageLoader;
})(window);