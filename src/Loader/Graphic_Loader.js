/**
 * @requires Global_Progress.js
 */
(function (w) {
    let GlobalProgress = w.GlobalProgress;
    let images = {};

    let Graphic_Loader = {
        /**
         *
         * @param urls {Array[]<string>}
         * @param options {object}
         */
        loadAll: function (urls, options) {
            options = options || {};
            let keys = Object.keys(urls);
            let loaded = [];
            let length = keys.length;
            let success = options.success || null;
            let progress = options.progress || null;
            let totalprogress = options.totalprogress || null;
            let globalprogress = options.globalprogress || new GlobalProgress();
            let error = options.error || null;

            if (length > 0) {
                let q = function(image, id) {
                    loaded[id] = image;
                    length--;
                    if (success && length === 0) {
                        success(loaded);
                    }
                };

                for (let k = 0; k < keys.length; k++) {
                    let key = keys[k];
                    Graphic_Loader.load(urls[key], key, {
                        success: q,
                        progress: progress,
                        error: error,
                        totalprogress: totalprogress,
                        globalprogress: globalprogress
                    });
                }
            }
            else if (success) {
                success(loaded);
            }
        },
        /**
         *
         * @param url {string}
         * @param id {string}
         * @param options {object}
         */
        load: function (url, id, options) {
            options = options || {};
            let success = options.success || null;
            let progress = options.progress || null;
            let error = options.error || null;
            let totalprogress = options.totalprogress || null;
            let globalprogress = options.globalprogress || new GlobalProgress();
            let media = null;

            if (images[url] === undefined) {
                let request = new XMLHttpRequest();
                request.onprogress = function (e) {
                    let computable = e.lengthComputable;
                    if (computable) {
                        if(globalprogress instanceof GlobalProgress){
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

                        if(totalprogress){
                            totalprogress(globalprogress.progress());
                        }

                        let progress_percent = parseInt(e.loaded / e.total * 100);
                        if (progress) {
                            progress(id, progress_percent);
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
                            if (success) {
                                success(id,image);
                            }
                        };

                        image.addEventListener('load', onload);
                    };
                };

                request.onerror = function () {
                    if (error) {
                        error(id);
                    }
                };

                request.open("GET", url, true);
                request.responseType = "blob";
                request.send();
            }
            else if (success) {
                success(id,images[url]);
            }
        },
        /**
         *
         * @param img {Image}
         * @param id {string}
         * @param callback {function}
         */
        toDataURL: function (img, id, callback) {
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            let dataUrl = canvas.toDataURL();
            canvas = null;
            callback(dataUrl, id);
        },
        /**
         *
         * @param urls {Array[]<string>}
         * @param callback {function}
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
                for (let k = 0; k < keys.length; k++) {
                    let key = keys[k];
                    Graphic_Loader.toDataURL(urls[key], key, q);
                }
            });
        },
        /**
         *
         * @param data {string}
         * @param callback {function}
         */
        fromDataURL: function (data, callback) {
            if (data != null) {
                let img = new Image();
                img.src = data;

                let error = function () {
                    this.removeEventListener('load', load);
                    this.removeEventListener('error', error);
                    callback(null);
                };

                let load = function () {
                    this.removeEventListener('load', load);
                    this.removeEventListener('error', error);
                    callback(img);
                };

                img.addEventListener('load', load);
                img.addEventListener('error', error);
            }
            else {
                callback(null);
            }
        }
    };

    Object.defineProperty(w,'Graphic_Loader',{
        /**
         *
         * @returns {Graphic_Loader}
         */
        get:function(){
            return Graphic_Loader;
        }
    });
})(window);