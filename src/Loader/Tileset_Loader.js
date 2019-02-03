/**
 * @requires ../RPG.js
 * @requires Graphic_Loader.js
 */
(function (root,w) {
    let Tileset = root.Tileset,
        Graphic_Loader = w.Graphic_Loader;

    let tilesets = {};
    let Tileset_Loader = {
        /**
         *
         * @param urls {Array[]<string>}
         * @param options {object}
         */
        loadAll: function (urls, options) {
            let keys = Object.keys(urls);
            let tilesets = [];
            let length = keys.length;
            options = options || {};

            if (length > 0) {
                let q = function (tileset, id) {
                    tilesets[id] = tileset;
                    length--;
                    if (length === 0 && typeof options.success === 'function') {
                        options.success(tilesets);
                    }
                };

                let self = this;
                for (let k = 0; k < keys.length; k++) {
                    let key = keys[k];
                    self.load(urls[key], key, q, options.progress, onerror);
                }
            }
            else if (typeof options.success === 'function') {
                options.success(tilesets);
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
            if (tilesets[url] === undefined) {
                Graphic_Loader.load(url, id, function (image, id) {
                    tilesets[url] = new Tileset(image);
                    if(typeof options.success === 'function'){
                        options.success(tilesets[url], id);
                    }
                }, options.progress, onerror);
            }
            else if (typeof options.success === 'function') {
                options.success(tilesets[url], id);
            }
        }
    };

    Object.defineProperty(root,'Tileset_Loader',{
        /**
         *
         * @returns {Tileset_Loader}
         */
        get:function(){
            return Tileset_Loader;
        }
    });
})(RPG,window);