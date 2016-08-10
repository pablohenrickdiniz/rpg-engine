(function(root){
    if(window.ImageLoader == undefined){
        throw "TilesetLoader requires ImageLoader"
    }

    if(root.Tileset == undefined){
        throw "TilesetLoader requires Tileset"
    }

    var Tileset = root.Tileset;

    var TilesetLoader = {
        loaded:[],
        loadAll:function(urls,callback){
            var keys = Object.keys(urls);
            var loaded = [];
            var length = keys.length;

            if(length > 0){
                var q = function(tileset,id){
                    loaded[id] = tileset;
                    length--;
                    if(length <= 0){
                        callback(loaded);
                    }
                };

                for(var k =0; k < keys.length;k++){
                    var key = keys[k];
                    TilesetLoader.load(urls[key],key,q);
                }
            }
            else{
                callback(loaded);
            }
        },
        load:function(url,id,callback){
            var self= this;
            if(self.loaded[url] == undefined){
                ImageLoader.load(url,id,function(image,id){
                    self.loaded[url] = new Tileset(image);
                    callback(self.loaded[url],id);
                });
            }
            else{
                callback(self.loaded[url],id);
            }
        }
    };

    //var loadAll = function(urls,loaded,callback){
    //    loaded = loaded === undefined?[]:loaded;
    //    if(urls.length > 0){
    //        var url = urls.shift();
    //        TilesetLoader.load(url,function(tileset){
    //            loaded.push(tileset);
    //            loadAll(urls,loaded,callback);
    //        });
    //    }
    //    else if(typeof callback === 'function'){
    //        callback(loaded);
    //    }
    //};

    root.TilesetLoader = TilesetLoader;
})(RPG);