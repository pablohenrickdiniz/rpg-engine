(function(w){
    if(w.ImageLoader == undefined){
        throw "TilesetLoader requires ImageLoader"
    }

    if(w.Tileset == undefined){
        throw "TilesetLoader requires Tileset"
    }

    var TilesetLoader = {
        loadedTilesets:[],
        loadAll:function(urls,callback){
            loadAll(urls,[],callback);
        },
        load:function(url,callback){
            var self= this;
            ImageLoader.load(url,function(image){
                var hash= image.hash;
                if(self.loadedTilesets[hash] == undefined){
                    self.loadedTilesets[hash] = new Tileset(image);
                }
                callback(self.loadedTilesets[hash]);
            });
        }
    };

    var loadAll = function(urls,loaded,callback){
        loaded = loaded === undefined?[]:loaded;
        if(urls.length > 0){
            var url = urls.shift();
            TilesetLoader.load(url,function(tileset){
                loaded.push(tileset);
                loadAll(urls,loaded,callback);
            });
        }
        else if(typeof callback === 'function'){
            callback(loaded);
        }
    };

    w.TilesetLoader = TilesetLoader;
})(window);