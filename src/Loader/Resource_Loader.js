/**
 * @requires ../RPG.js
 * @requires Graphic_Loader.js
 * @requires Audio_Loader.js
 * @requires ../Graphics.js
 * @requires ../System/Audio/Audio.js
 */
(function (root, w) {
    let Audios = root.Audio,
        Graphics = root.Main.Graphics,
        Audio_Loader = w.Audio_Loader,
        Graphic_Loader = w.Graphic_Loader;

    let Resource_Loader = function () {

    };
    /**
     *
     * @param url {string}
     * @param options {object}
     */
    Resource_Loader.prototype.load = function (url,options) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let data = JSON.parse(this.responseText);
                let count = 0;
                let audios = data.audios || {};
                let graphics = data.graphics || {};
                let atypes = Object.keys(audios);
                let gtypes = Object.keys(graphics);
                let total = 0;
                let old_progress = 0;
                options = options || {};

                for(let i =0; i < atypes.length;i++){
                    total += Object.keys(audios[atypes[i]]).length;
                }

                for(let i =0; i < gtypes.length;i++){
                    total += Object.keys(graphics[gtypes[i]]).length;
                }

                let success = function() {
                    count++;
                    if (count >= total) {
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
                    let audio_urls = audios[type];
                    loadAudios(type,audio_urls, {
                        success: success,
                        globalprogress: globalprogress,
                        totalprogress: totalprogress,
                        progress:audioprogress
                    });
                }

                for(let i = 0; i < gtypes.length;i++){
                    let type = gtypes[i];
                    let graphic_urls = graphics[type];
                    loadGraphics(type,graphic_urls, {
                        success: success,
                        globalprogress: globalprogress,
                        totalprogress: totalprogress,
                        progress:graphicprogress
                    })
                }
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
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
            Audio_Loader.load(data[name],name, {
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
            Graphic_Loader.load(data[name],name, {
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
(RPG, window);