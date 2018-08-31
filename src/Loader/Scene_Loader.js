'use strict';
(function (root, w) {
    if(root.Main === undefined){
        throw "Scene_Loader requires Main"
    }
    else{
        if(root.Main.Graphics === undefined){
            throw "Scene_Loader requires Graphics"
        }
    }

    if (w.Graphic_Loader === undefined) {
        throw "SceneLoader requires Graphic_Loader"
    }

    if (w.Audio_Loader === undefined) {
        throw "SceneLoader requires Audio_Loader"
    }

    if (root.Audio === undefined) {
        throw "SceneLoader requires Audio"
    }

    let Audios = root.Audio,
        Graphics = root.Main.Graphics,
        Audio_Loader = w.Audio_Loader,
        Graphic_Loader = w.Graphic_Loader;

    let Scene_Loader = function () {};
    /**
     *
     * @param scene
     * @param callback
     */
    Scene_Loader.prototype.load = function (scene,callback) {
        let count = 0;
        let audios = scene.audios || {};
        let graphics = scene.graphics || {};

        let audio_types = Object.keys(audios);
        let graphic_types = Object.keys(graphics);
        let total = 0;
        let i;

        for(i =0; i < audio_types.length;i++){
            total += Object.keys(audios[audio_types[i]]).length;
        }

        for(i =0; i < graphic_types.length;i++){
            total += Object.keys(graphics[graphic_types[i]]).length;
        }

        function onsuccess() {
            count++;
            if (count >= total) {
                if(callback){
                    callback(scene);
                }
            }
        }

        if(total === 0){
            onsuccess();
        }

        let old_progress = 0;

        function onprogress(progress) {
            if(progress > old_progress){
                old_progress = progress;
                scene.trigger('onprogress',[progress]);
            }
        }

        function ongraphicprogress(){
            scene.trigger('ongraphicprogress',arguments);
        }

        function onaudioprogress(){
            scene.trigger('onaudioprogress',arguments);
        }

        let globalprogress = new GlobalProgress();

        let type;

        for(i =0; i < audio_types.length;i++){
            type = audio_types[i];
            let audio_urls = audios[type];
            loadAudios(type,audio_urls, {
                onsuccess: onsuccess,
                globalprogress: globalprogress,
                onglobalprogress: onprogress,
                onprogress:onaudioprogress
            });
        }


        for(i =0; i < graphic_types.length;i++){
            type = graphic_types[i];
            let graphic_urls = graphics[type];
            loadGraphics(type,graphic_urls, {
                onsuccess: onsuccess,
                globalprogress: globalprogress,
                onglobalprogress: onprogress,
                onprogress:ongraphicprogress
            })
        }




    };

    /**
     *
     * @param type
     * @param audios
     * @param options
     */
    function loadAudios(type,audios, options) {
        audios = audios || {};
        options = options || {};
        let names = Object.keys(audios);
        let onsuccess = options.onsuccess || null;
        let onglobalprogress = options.onglobalprogress || null;
        let globalprogress = options.globalprogress || null;
        let onprogress = options.onprogress || null;
        loadAudiosHell(type,names,audios,onsuccess,onglobalprogress,globalprogress,onprogress);
    }

    /**
     *
     * @param type
     * @param graphics
     * @param options
     */
    function loadGraphics(type,graphics, options) {
        graphics = graphics || {};
        options = options ||{};
        let names = Object.keys(graphics);
        let onsuccess = options.onsuccess || null;
        let onglobalprogress = options.onglobalprogress || null;
        let globalprogress = options.globalprogress || null;
        let onprogress = options.onprogress || null;
        loadGraphicsHell(type,names,graphics,onsuccess,onglobalprogress,globalprogress,onprogress);
    }

    /**
     *
     * @param type
     * @param names
     * @param data
     * @param q
     * @param onglobalprogress
     * @param globalprogress
     * @param onprogress
     */
    function loadAudiosHell(type,names,data,q,onglobalprogress,globalprogress,onprogress){
        if(names.length > 0){
            let name = names.pop();
            Audio_Loader.load(data[name],name, {
                onsuccess: function (id,src) {
                    Audios.set(type,id,src);
                    if(q){q(id);}
                },
                onglobalprogress: onglobalprogress,
                globalprogress: globalprogress,
                onprogress: onprogress
            });

            loadAudiosHell(type,names,data,q,onglobalprogress,globalprogress,onprogress)
        }
    }


    /**
     *
     * @param type
     * @param names
     * @param data
     * @param q
     * @param onglobalprogress
     * @param globalprogress
     * @param onprogress
     */
    function loadGraphicsHell(type,names,data,q,onglobalprogress,globalprogress,onprogress){
        if(names.length > 0){
            let name = names.pop();
            Graphic_Loader.load(data[name],name, {
                onsuccess: function (id,image) {
                    Graphics.set(type, id, image);
                    if(q){q(id);}
                },
                onglobalprogress: onglobalprogress,
                globalprogress: globalprogress,
                onprogress: onprogress
            });
            loadGraphicsHell(type,names,data,q,onglobalprogress,globalprogress,onprogress)
        }
    }

    root.Scene_Loader = Scene_Loader;
})
(RPG, window);