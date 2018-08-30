'use strict';
(function (w) {
    if(w.GlobalProgress === undefined){
        throw "ImageLoader requires GlobalProgress"
    }

    var GlobalProgress = w.GlobalProgress;
    var images = {};

    var Graphic_Loader = {
        /**
         *
         * @param urls
         * @param options
         */
        loadAll: function (urls, options) {
            options = options || {};
            var keys = Object.keys(urls);
            var loaded = [];
            var length = keys.length;
            var onsuccess = options.onsuccess || null;
            var onprogress = options.onprogress || null;
            var onglobalprogress = options.onglobalprogress || null;
            var globalprogress = options.globalprogress || new GlobalProgress();

            var onerror = options.onerror || null;

            if (length > 0) {
                var q = function(image, id) {
                    loaded[id] = image;
                    length--;
                    if (length === 0 && onsuccess) {
                        onsuccess(loaded);
                    }
                };

                for (var k = 0; k < keys.length; k++) {
                    var key = keys[k];
                    Graphic_Loader.load(urls[key], key, {
                        onsuccess: q,
                        onprogress: onprogress,
                        onerror: onerror,
                        onglobalprogress: onglobalprogress,
                        globalprogress: globalprogress
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
            var globalprogress = options.globalprogress || new GlobalProgress();
            var onglobalprogress = options.onglobalprogress || null;

            var media = null;

            if (images[url] === undefined) {
                var request = new XMLHttpRequest();
                request.onprogress = function (e) {
                    var computable = e.lengthComputable;
                    if (computable) {
                        if(globalprogress){
                            if(media == null){
                                media = {
                                    loaded: e.loaded,
                                    total: e.total
                                };
                                globalprogress.add(media);
                            }
                            else{
                                media.loaded = e.loaded;
                                media.total = e.total;
                            }
                        }


                        if(onglobalprogress){
                            onglobalprogress(globalprogress.progress());
                        }

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
                            images[url] = image;
                            if (onsuccess) {
                                onsuccess(id,image);
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
                onsuccess(id,images[url]);
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
        /**
         *
         * @param urls
         * @param callback
         */
        toDataURLS: function (urls, callback) {
            Graphic_Loader.loadAll(urls, function (loaded) {
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
                    Graphic_Loader.toDataURL(urls[key], key, q);
                }
            });
        },
        /**
         *
         * @param data
         * @param callback
         */
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

    w.Graphic_Loader = Graphic_Loader;
})(window);