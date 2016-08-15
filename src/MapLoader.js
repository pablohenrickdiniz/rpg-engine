(function (w) {
    w.MapLoader = {
        fields: [
            'image',
            'dWidth',
            'dHeight',
            'sWidth',
            'sHeight',
            'sx',
            'sy',
            'dx',
            'dy',
            'layer'
        ],
        /*
         load:(Object data, Map map,function callback):void
         Carrega todos os dados do object data no objeto mapa,
         se o objeto map n�o for informado, um novo ser� criado
         */
        load: function (data, map, callback) {
            var self = this;
            map = map === undefined || !(map instanceof  Map) ? new Map() : map;
            var tile_w = parseInt(data.tile_w);
            var tile_h = parseInt(data.tile_h);
            tile_w = isNaN(tile_w) ? 32 : tile_w;
            tile_h = isNaN(tile_h) ? 32 : tile_h;

            map.tile_w = tile_w;
            map.tile_h = tile_h;
            var tilesets = data.tilesets !== undefined ? data.tilesets : [];
            var tiles = data.tiles !== undefined ? data.tiles : [];


            ImageLoader.loadAll(tilesets, function (tilesets) {
                tiles.forEach(function (row, indexA) {
                    if (row !== null) {
                        row.forEach(function (col, indexB) {
                            if (col !== null) {
                                col.forEach(function (tile, layer) {
                                    if (tile !== null) {
                                        var newtile = {};
                                        self.fields.forEach(function (name, index) {
                                            if (tile[index] !== undefined) {
                                                newtile[name] = tile[index];
                                            }
                                        });

                                        if (newtile.image !== undefined) {
                                            var id = newtile.image;
                                            if (tilesets[id] !== undefined) {
                                                newtile.image = tilesets[id];
                                            }
                                        }
                                        if (tile[10] !== undefined) {
                                            newtile.bounds = {
                                                x: tile[10],
                                                y: tile[11],
                                                width: tile[12],
                                                height: tile[13]
                                            };
                                        }

                                        map.setTile(indexA, indexB, newtile);
                                    }
                                    else {
                                        map.removeTile(indexA, indexB);
                                    }
                                });
                            }
                        });
                    }
                });
                callback(map);
            });
        }
    };
})(window);