(function (root, w) {
    if (w.Graphic_Loader == undefined) {
        throw "SceneLoader requires Graphic_Loader"
    }

    if (w.Audio_Loader == undefined) {
        throw "SceneLoader requires Audio_Loader"
    }

    if (root.Audio == undefined) {
        throw "SceneLoader requires Audio"
    }

    if (root.Graphics == undefined) {
        throw "SceneLoader requires Graphics"
    }

    var Audios = root.Audio,
        Graphics = root.Graphics,
        Audio_Loader = w.Audio_Loader,
        Graphic_Loader = w.Graphic_Loader;

    var Scene_Loader = function () {};
    /**
     *
     * @param scene
     * @param callback
     */
    Scene_Loader.prototype.load = function (scene,callback) {
        var count = 0;
        var audios = scene.audios || {};
        var graphics = scene.graphics || {};

        var audio_types = Object.keys(audios);
        var graphic_types = Object.keys(graphics);
        var total = 0;
        var i;


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
                    callback();
                }
            }
        }

        if(total == 0){
            onsuccess();
        }

        var old_progress = 0;

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

        var globalprogress = new GlobalProgress();

        var type;

        for(i =0; i < audio_types.length;i++){
            type = audio_types[i];
            var audio_urls = audios[type];
            loadAudios(type,audio_urls, {
                onsuccess: onsuccess,
                globalprogress: globalprogress,
                onglobalprogress: onprogress,
                onprogress:onaudioprogress
            });
        }


        for(i =0; i < graphic_types.length;i++){
            type = graphic_types[i];
            var graphic_urls = graphics[type];
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
        var names = Object.keys(audios);
        var onsuccess = options.onsuccess || null;
        var onglobalprogress = options.onglobalprogress || null;
        var globalprogress = options.globalprogress || null;
        var onprogress = options.onprogress || null;
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
        var names = Object.keys(graphics);
        var onsuccess = options.onsuccess || null;
        var onglobalprogress = options.onglobalprogress || null;
        var globalprogress = options.globalprogress || null;
        var onprogress = options.onprogress || null;
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
            var name = names.pop();
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
            var name = names.pop();
            Graphic_Loader.load(data[name],name, {
                onsuccess: function (graphic,id) {
                    Graphics.set(type, id, graphic);
                    if(q){q(id);}
                },
                onglobalprogress: onglobalprogress,
                globalprogress: globalprogress,
                onprogress: onprogress
            });
            loadGraphicsHell(type,names,data,q,onglobalprogress,globalprogress,onprogress)
        }
    }

    root.Scene.Scene_Loader = Scene_Loader;
})
(RPG, window);