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
            img.onload = function(){
                ImageLoader.toDataURL(img,function(data){
                    var shaObj = new jsSHA("SHA-1", "TEXT");
                    shaObj.update(data);
                    var hash = shaObj.getHash("HEX");
                    if(self.loadedImages[hash] === undefined){
                        self.loadedImages[hash] = img;
                    }
                    else{
                        callback(self.loadedImages[hash]);
                    }
                    callback(img);
                });
            };

            img.onerror = function(){
                callback(null);
            };
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
        fromDataUrl:function(data,callback){
            if(data != null){
                var img = new Image();
                img.src = data;
                img.addEventListener('load',function(){
                    callback(img);
                });

                img.addEventListener('error',function(){
                   callback(null);
                });
            }
            else{
                callback(null);
            }
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