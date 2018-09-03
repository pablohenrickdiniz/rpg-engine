'use strict';
(function (w) {
    if(!w.GlobalProgress){
        throw "Graphic_Loader requires GlobalProgress";
    }

    let GlobalProgress = w.GlobalProgress;
    let images = {};

    let Graphic_Loader = {
        /**
         *
         * @param urls
         * @param options
         */
        loadAll: function (urls, options) {
            options = options || {};
            let keys = Object.keys(urls);
            let loaded = [];
            let length = keys.length;
            let onsuccess = options.onsuccess || null;
            let onprogress = options.onprogress || null;
            let onglobalprogress = options.onglobalprogress || null;
            let globalprogress = options.globalprogress || new GlobalProgress();

            let onerror = options.onerror || null;

            if (length > 0) {
                let q = function(image, id) {
                    loaded[id] = image;
                    length--;
                    if (length === 0 && onsuccess) {
                        onsuccess(loaded);
                    }
                };

                for (var k = 0; k < keys.length; k++) {
                    let key = keys[k];
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
            let onsuccess = options.onsuccess || null;
            let onprogress = options.onprogress || null;
            let onerror = options.onerror || null;
            let globalprogress = options.globalprogress || new GlobalProgress();
            let onglobalprogress = options.onglobalprogress || null;

            let media = null;

            if (images[url] === undefined) {
                let request = new XMLHttpRequest();
                request.onprogress = function (e) {
                    let computable = e.lengthComputable;
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

                        let progress = parseInt(e.loaded / e.total * 100);
                        if (onprogress) {
                            onprogress(id, progress);
                        }
                    }
                };

                request.onload = function () {
                    let reader = new window.FileReader();
                    reader.readAsDataURL(this.response);
                    reader.onloadend = function () {
                        let base64data = reader.result;
                        let image = document.createElement('img');
                        image.src = base64data;

                        let onload = function () {
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
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            let dataUrl = canvas.toDataURL();
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
                let keys = Object.keys(loaded);
                let loaded_data = [];
                let length = keys.length;
                let q = function (dataUrl, id) {
                    loaded_data[id] = dataUrl;
                    length--;
                    if (length <= 0) {
                        callback(loaded_data);
                    }
                };
                for (var k = 0; k < keys.length; k++) {
                    let key = keys[k];
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
                let img = new Image();
                img.src = data;

                let load_callback = function () {
                    this.removeEventListener('load', load_callback);
                    this.removeEventListener('error', error_callback);
                    callback(img);
                };

                let error_callback = function () {
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

    Object.defineProperty(w,'Graphic_Loader',{
        /**
         *
         * @returns {{loadAll: loadAll, load: load, toDataURL: toDataURL, toDataURLS: toDataURLS, fromDataURL: fromDataURL}}
         */
        get:function(){
            return Graphic_Loader;
        }
    });
})(window);