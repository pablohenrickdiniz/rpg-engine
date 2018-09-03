'use strict';
(function (root,w) {
    if (!w.Graphic_Loader) {
        throw "TilesetLoader requires Graphic_Loader";
    }

    if (!root.Tileset) {
        throw "TilesetLoader requires Tileset";
    }

    let Tileset = root.Tileset,
        Graphic_Loader = w.Graphic_Loader;

    let tilesets = {};
    let Tileset_Loader = {
        /**
         *
         * @param urls
         * @param onsuccess
         * @param onprogress
         * @param onerror
         */
        loadAll: function (urls, onsuccess, onprogress, onerror) {
            let keys = Object.keys(urls);
            let tilesets = [];
            let length = keys.length;

            if (length > 0) {
                let q = function (tileset, id) {
                    tilesets[id] = tileset;
                    length--;
                    if (length === 0) {
                        onsuccess(tilesets);
                    }
                };

                for (let k = 0; k < keys.length; k++) {
                    let key = keys[k];
                    TilesetLoader.load(urls[key], key, q, onprogress, onerror);
                }
            }
            else if (onsuccess) {
                onsuccess(tilesets);
            }
        },
        /**
         *
         * @param url
         * @param id
         * @param onsuccess
         * @param onprogress
         * @param onerror
         */
        load: function (url, id, onsuccess, onprogress, onerror) {
            if (tilesets[url] === undefined) {
                Graphic_Loader.load(url, id, function (image, id) {
                    tilesets[url] = new Tileset(image);
                    onsuccess(tilesets[url], id);
                }, onprogress, onerror);
            }
            else if (onsuccess) {
                onsuccess(tilesets[url], id);
            }
        }
    };

    Object.defineProperty(root,'Tileset_Loader',{
        /**
         *
         * @returns {{loadAll: loadAll, load: load}}
         */
        get:function(){
            return Tileset_Loader;
        }
    });
})(RPG,window);