'use strict';
(function (root,w) {
    if (w.Graphic_Loader === undefined) {
        throw "TilesetLoader requires Graphic_Loader"
    }

    if (root.Tileset === undefined) {
        throw "TilesetLoader requires Tileset"
    }

    let Tileset = root.Tileset,
        Graphic_Loader = w.Graphic_Loader;

    let TilesetLoader = {
        tilesets: {},
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

                for (var k = 0; k < keys.length; k++) {
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
            let self = this;
            if (self.tilesets[url] === undefined) {
                Graphic_Loader.load(url, id, function (image, id) {
                    self.tilesets[url] = new Tileset(image);
                    onsuccess(self.tilesets[url], id);
                }, onprogress, onerror);
            }
            else if (onsuccess) {
                onsuccess(self.tilesets[url], id);
            }
        }
    };

    root.TilesetLoader = TilesetLoader;
})(RPG,window);