'use strict';
(function (root, w) {
    if(!root.Main){
        throw "Scene_Loader requires Main";
    }
    else{
        if(!root.Main.Graphics){
            throw "Scene_Loader requires Graphics";
        }
    }

    if (!w.Graphic_Loader) {
        throw "SceneLoader requires Graphic_Loader";
    }

    if (!w.Audio_Loader) {
        throw "SceneLoader requires Audio_Loader";
    }

    if (!root.Audio) {
        throw "SceneLoader requires Audio";
    }

    let Audios = root.Audio,
        Graphics = root.Main.Graphics,
        Audio_Loader = w.Audio_Loader,
        Graphic_Loader = w.Graphic_Loader;

    let Scene_Loader = function () {};
    /**
     *
     * @param scene {Scene}
     * @param callback {function}
     */
    Scene_Loader.prototype.load = function (scene,callback) {
        let count = 0;
        let audios = scene.audios || {};
        let graphics = scene.graphics || {};
        let atypes = Object.keys(audios);
        let gtypes = Object.keys(graphics);
        let total = 0;
        let old_progress = 0;

        for(let i =0; i < atypes.length;i++){
            total += Object.keys(audios[atypes[i]]).length;
        }

        for(let i =0; i < gtypes.length;i++){
            total += Object.keys(graphics[gtypes[i]]).length;
        }

        let success = function() {
            count++;
            if (count >= total) {
                if(typeof callback === 'function'){
                    callback(scene);
                }
            }
        };

        if(total === 0 && typeof success === 'function'){
            success();
        }

        let totalprogress = function(progress) {
            if(progress > old_progress){
                old_progress = progress;
                scene.trigger('progress',[progress]);
            }
        };

        let graphicprogress = function (){
            scene.trigger('graphicprogress',arguments);
        };

        let audioprogress = function(){
            scene.trigger('audioprogress',arguments);
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
                    if(typeof options.success === 'function'){
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
                    if(typeof options.success === 'function'){
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

    Object.defineProperty(root,'Scene_Loader',{
        /**
         *
         * @returns {Scene_Loader}
         */
       get:function(){
           return Scene_Loader;
       }
    });
})
(RPG, window);