(function(w){
    var ImageLoader = {
        images:{},//Imagens que já foram carregadas
        /*
         loadAll(Array[String] urls, function onsuccess, function onprogress):void
         Carrega todas as images de urls e passa o
         resultado para a função callback
         */
        loadAll:function(urls,onsuccess,onprogress,onerror){
            var keys = Object.keys(urls);
            var loaded = [];
            var length = keys.length;

            if(length > 0){
                var q = function(image,id){
                    loaded[id] = image;
                    length--;
                    if(length <= 0){
                        onsuccess(loaded);
                    }
                };

                for(var k =0; k < keys.length;k++){
                    var key = keys[k];
                    ImageLoader.load(urls[key],key,q,onprogress,onerror);
                }
            }
            else if(onsuccess){
                onsuccess(loaded);
            }
        },
        /*
         load:(String url,String id,function onsucess,function onprogress):void
         Carrega a imagem da url e passa o resultado
         para a função callback
         */
        load:function(url,id,onsuccess,onprogress,onerror){
            if(ImageLoader.images[url] === undefined){
                var img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = url;

                var unbind = function(){
                    img.removeEventListener('load',onsuccess_callback);
                    img.removeEventListener('error',onerror_callback);
                    img.removeEventListener('progress',onprogress_callback)
                };

                var onsuccess_callback = function(){
                    unbind();
                    var img = this;
                    ImageLoader.images[url] = img;
                    if(onsuccess){
                        onsuccess(img,id);
                    }
                };

                var onerror_callback = function(){
                    unbind();
                    if(onerror){
                        onerror(id);
                    }
                };

                var onprogress_callback = function(e){
                    if(e.lenghtComputable){
                        var progress = e.loaded / e.total * 100;
                        if(onprogress){
                            onprogress(id,progress);
                        }
                    }
                };

                img.addEventListener('progress',onprogress_callback);
                img.addEventListener('load',onsuccess_callback);
                img.addEventListener('error',onerror_callback);
            }
            else if(onsuccess){
                onsuccess(ImageLoader.images[url],id);
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

    w.ImageLoader = ImageLoader;
})(window);