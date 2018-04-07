(function (root,w) {
    if (w.Graphic_Loader === undefined) {
        throw "TilesetLoader requires Graphic_Loader"
    }

    if (root.Tileset === undefined) {
        throw "TilesetLoader requires Tileset"
    }

    var Tileset = root.Tileset,
        Graphic_Loader = w.Graphic_Loader;

    var TilesetLoader = {
        tilesets: {},
        loadAll: function (urls, onsuccess, onprogress, onerror) {
            var keys = Object.keys(urls);
            var tilesets = [];
            var length = keys.length;

            if (length > 0) {
                var q = function (tileset, id) {
                    tilesets[id] = tileset;
                    length--;
                    if (length === 0) {
                        onsuccess(tilesets);
                    }
                };

                for (var k = 0; k < keys.length; k++) {
                    var key = keys[k];
                    TilesetLoader.load(urls[key], key, q, onprogress, onerror);
                }
            }
            else if (onsuccess) {
                onsuccess(tilesets);
            }
        },
        load: function (url, id, onsuccess, onprogress, onerror) {
            var self = this;
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