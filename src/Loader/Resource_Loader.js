/**
 * @requires ../RPG.js
 * @requires Graphic_Loader.js
 * @requires Audio_Loader.js
 * @requires ../Graphics.js
 * @requires ../Icons.js
 * @requires ../Faces.js
 * @requires ../Items.js
 * @requires ../Actors.js
 * @requires ../Charas.js
 * @requires ../Game_Icon.js
 * @requires ../System/Audio/Audio.js
 * @requires ../Tilesets.js
 * @requires ../Tileset.js
 */
(function (root, w) {
    let Audios = root.Audio,
        Graphics = root.Main.Graphics,
        Audio_Loader = w.Audio_Loader,
        Graphic_Loader = w.Graphic_Loader,
        Icons = root.Main.Icons,
        Faces = root.Main.Faces,
        Charas = root.Main.Charas,
        Items = root.Main.Items,
        Actors = root.Main.Actors,
        Game_Icon = root.Game_Icon,
        Game_Face = root.Game_Face,
        Chara = root.Chara,
        Item = root.Item,
        Game_Actor = root.Game_Actor,
        Tilesets = root.Main.Tilesets,
        Tileset = root.Tileset;

    let Resource_Loader = {
        loadJSON:function(url,callback){
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    let data = JSON.parse(this.responseText);
                    callback(data);
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        },
        load : function (url,options) {
            let self = this;
            self.loadJSON(url,function(data){
                let audios = data.audios || {};
                let graphics = data.graphics || {};
                let atypes = Object.keys(audios);
                let gtypes = Object.keys(graphics);
                let count = 0,total = 0,old_progress = 0,i = 0;

                options = options || {};

                for(i =0; i < atypes.length;i++){
                    total += Object.keys(audios[atypes[i]]).length;
                }

                for(i =0; i < gtypes.length;i++){
                    total += Object.keys(graphics[gtypes[i]]).length;
                }

                let success = function() {
                    count++;
                    if (count >= total) {
                        let keys,length,key,conf;
                        if(data.tilesets && data.tilesets.constructor === {}.constructor){
                            keys = Object.keys(data.tilesets);
                            length = keys.length;
                            for(i = 0; i < length;i++){
                                key = keys[i];
                                if(!Tilesets.has(key)){
                                    Tilesets.set(key,new Tileset(data.tilesets[key]));
                                }
                            }
                        }

                        if(data.icons && data.icons.constructor === {}.constructor){
                            keys = Object.keys(data.icons);
                            length = keys.length;
                            for(i = 0; i < length;i++){
                                key = keys[i];
                                if(!Icons.has(key)){
                                    Icons.set(key,new Game_Icon(data.icons[key]));
                                }
                            }
                        }

                        if(data.faces && data.faces.constructor === {}.constructor){
                            keys = Object.keys(data.faces);
                            length = keys.length;
                            for(i = 0; i < length;i++){
                                key = keys[i];
                                if(!Faces.has(key)){
                                    Faces.set(key,new Game_Face(data.faces[key]));
                                }
                            }
                        }

                        if(data.charas && data.charas.constructor === {}.constructor){
                            keys = Object.keys(data.charas);
                            length = keys.length;
                            for(i = 0; i < length;i++){
                                key = keys[i];
                                if(!Charas.has(key)){
                                    Charas.set(key,new Chara(data.charas[key]));
                                }
                            }
                        }

                        if(data.items && data.items.constructor === {}.constructor){
                            keys = Object.keys(data.items);
                            length = keys.length;
                            for(i = 0; i < length;i++){
                                key = keys[i];
                                if(!Items.has(key)){
                                    conf = data.items[key];
                                    conf = Object.assign({id:key},conf);
                                    Items.set(key,new Item(conf));
                                }
                            }
                        }

                        if(data.actors && data.actors.constructor === {}.constructor){
                            keys = Object.keys(data.actors);
                            length = keys.length;
                            for(i = 0; i < length;i++){
                                key = keys[i];
                                if(!Actors.has(key)){
                                    conf = data.actors[key];
                                    conf.id = key;
                                    Actors.set(key,new Game_Actor(conf));
                                }
                            }
                        }

                        if(options.complete){
                            options.complete(data);
                        }
                    }
                };

                if(total === 0 && success){
                    success();
                }

                let totalprogress = function(progress) {
                    if(progress > old_progress){
                        old_progress = progress;
                        if(options.progress){
                            options.progress(progress);
                        }
                    }
                };

                let graphicprogress = function (){
                    if(options.graphicprogress){
                        options.graphicprogress.apply(null,arguments);
                    }
                };

                let audioprogress = function(){
                    if(audioprogress){
                        options.audioprogress.apply(null,arguments);
                    }
                };

                let globalprogress = new GlobalProgress();

                for(let i = 0; i < atypes.length;i++){
                    let type = atypes[i];
                    let urls = audios[type];
                    loadAudios(type,urls, {
                        success: success,
                        globalprogress: globalprogress,
                        totalprogress: totalprogress,
                        progress:audioprogress
                    });
                }

                for(let i = 0; i < gtypes.length;i++){
                    let type = gtypes[i];
                    let urls = graphics[type];
                    loadGraphics(type,urls, {
                        success: success,
                        globalprogress: globalprogress,
                        totalprogress: totalprogress,
                        progress:graphicprogress
                    })
                }
            });
        }
    };

    /**
     *
     * @param type {string}
     * @param audios {Array}
     * @param options {object}
     */
    function loadAudios(type,audios, options) {
        audios = audios || {};
        options = options || {};
        let names = Object.keys(audios);
        loadAudiosHell(type,names,audios,options);
    }

    /**
     *
     * @param type {string}
     * @param graphics {Array}
     * @param options {object}
     */
    function loadGraphics(type,graphics, options) {
        graphics = graphics || {};
        options = options ||{};
        let names = Object.keys(graphics);
        loadGraphicsHell(type,names,graphics,options);
    }

    /**
     *
     * @param type {string}
     * @param names {Array}
     * @param data {Array}
     * @param options {object}
     */
    function loadAudiosHell(type,names,data,options){
        options = options || {};
        if(names.length > 0){
            let name = names.pop();
            Audio_Loader.load(root.baseUrl+data[name],name, {
                success: function (id,src) {
                    Audios.set(type,id,src);
                    if(options.success){
                        options.success(id);
                    }
                },
                totalprogress: options.totalprogress,
                globalprogress: options.globalprogress,
                progress: options.progress
            });

            loadAudiosHell(type,names,data,options)
        }
    }

    /**
     *
     * @param type {string}
     * @param names {Array}
     * @param data {Array}
     * @param options {object}
     */
    function loadGraphicsHell(type,names,data,options){
        options = options || {};
        if(names.length > 0){
            let name = names.pop();
            Graphic_Loader.load(root.baseUrl+data[name],name, {
                success: function (id,image) {
                    Graphics.set(type, id, image);
                    if(options.success){
                        options.success(id);
                    }
                },
                totalprogress: options.totalprogress,
                globalprogress: options.globalprogress,
                progress: options.progress
            });
            loadGraphicsHell(type,names,data,options)
        }
    }

    Object.freeze(Resource_Loader);
    Object.defineProperty(root,'Resource_Loader',{
        /**
         *
         * @returns {Resource_Loader}
         */
        get:function(){
            return Resource_Loader;
        }
    });
})
(RPG, this);