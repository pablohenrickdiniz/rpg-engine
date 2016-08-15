(function (w) {
    var ImageLoader = {
        images: {},//Imagens que já foram carregadas
        /*
         loadAll(Array[String] urls, function onsuccess, function onprogress):void
         Carrega todas as images de urls e passa o
         resultado para a função callback
         */
        loadAll: function (urls, onsuccess, onprogress, onerror) {
            var keys = Object.keys(urls);
            var loaded = [];
            var length = keys.length;

            if (length > 0) {
                var q = function (image, id) {
                    loaded[id] = image;
                    length--;
                    if (length <= 0) {
                        onsuccess(loaded);
                    }
                };

                for (var k = 0; k < keys.length; k++) {
                    var key = keys[k];
                    ImageLoader.load(urls[key], key, q, onprogress, onerror);
                }
            }
            else if (onsuccess) {
                onsuccess(loaded);
            }
        },
        /*
         load:(String url,String id,function onsucess,function onprogress):void
         Carrega a imagem da url e passa o resultado
         para a função callback
         */
        load: function (url, id, onsuccess, onprogress, onerror) {
            if (ImageLoader.images[url] === undefined) {
                var request = new XMLHttpRequest();
                request.onprogress = function (e) {
                    var computable = e.lengthComputable;
                    if (computable) {
                        var progress = parseInt(e.loaded / e.total * 100);
                        if (onprogress) {
                            onprogress(id, progress);
                        }
                    }
                };

                request.onload = function () {
                    var reader = new window.FileReader();
                    reader.readAsDataURL(this.response);
                    reader.onloadend = function () {
                        var base64data = reader.result;
                        var image = document.createElement('img');
                        image.src = base64data;

                        var onload = function () {
                            image.removeEventListener('load', onload);
                            ImageLoader.images[url] = image;
                            if (onsuccess) {
                                onsuccess(image, id);
                            }
                        };

                        image.addEventListener('load', onload);
                    };
                };

                request.onerror = function () {
                    if (onerror) {
                        onerror(id);
                    }
                };
                request.open("GET", url, true);
                request.responseType = "blob";
                request.send();
            }
            else if (onsuccess) {
                onsuccess(ImageLoader.images[url], id);
            }
        },
        /*
         toDataURL(Image img, function callback):void
         Gera uma url para a imagem img e passa para a
         função callback
         */
        toDataURL: function (img, id, callback) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            var dataUrl = canvas.toDataURL();
            callback(dataUrl, id);
            canvas = null;
        },
        toDataURLS: function (urls, callback) {
            ImageLoader.loadAll(urls, function (loaded) {
                var keys = Object.keys(loaded);
                var loaded_data = [];
                var length = keys.length;
                var q = function (dataUrl, id) {
                    loaded_data[id] = dataUrl;
                    length--;
                    if (length <= 0) {
                        callback(loaded_data);
                    }
                };
                for (var k = 0; k < keys.length; k++) {
                    var key = keys[k];
                    ImageLoader.toDataURL(urls[key], key, q);
                }
            });
        },
        fromDataURL: function (data, callback) {
            if (data != null) {
                var img = new Image();
                img.src = data;

                var load_callback = function () {
                    this.removeEventListener('load', load_callback);
                    this.removeEventListener('error', error_callback);
                    callback(img);
                };

                var error_callback = function () {
                    this.removeEventListener('load', load_callback);
                    this.removeEventListener('error', error_callback);
                    callback(null);
                };

                img.addEventListener('load', load_callback);
                img.addEventListener('error', error_callback);
            }
            else {
                callback(null);
            }
        }
    };

    w.ImageLoader = ImageLoader;
})(window);