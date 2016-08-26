(function (root, w) {
    if (w.ImageLoader == undefined) {
        throw "SceneLoader requires ImageLoader"
    }

    if(w.GlobalProgress == undefined){
        throw "SceneLoader requires GlobalProgress"
    }

    if (w.AudioLoader == undefined) {
        throw "SceneLoader requires AudioLoader"
    }

    if(root.Resources == undefined || root.Resources.Audio == undefined){
        throw "SceneLoader requires Resources Audio"
    }

    if(root.Resources == undefined || root.Resources.Graphic == undefined){
        throw "SceneLoader requires Resources Graphic"
    }

    if(root.Viewport == undefined){
        throw "SceneLoader requires Viewport";
    }

    var Resources = root.Resources,
        System = root.System,
        Audio = Resources.Audio,
        Graphic = Resources.Graphic,
        Viewport = root.Viewport;


    root.SceneLoader = {
        load: function (scene,callback) {
            var self = this;
            var count = 0;
            var onsuccess = function () {
                count++;
                if (count == 2) {
                    scene.clearProgressBar();
                    callback();
                }
            };

            var globalprogress = new GlobalProgress();

            var onglobalprogress = function (progress) {
               scene.drawProgressBar(progress);
            };

            self.loadAudio(scene.audio, {
                onsuccess: onsuccess,
                globalprogress: globalprogress,
                onglobalprogress: onglobalprogress
            });

            self.loadImages(scene.images, {
                onsuccess: onsuccess,
                globalprogress: globalprogress,
                onglobalprogress: onglobalprogress
            })
        },
        loadAudio: function (audio, options) {
            audio = audio || {};
            var BGM = audio.BGM || {};
            var BGS = audio.BGS || {};
            var SE = audio.SE || {};
            var ME = audio.ME || {};
            var onsuccess = options.onsuccess;
            var onglobalprogress = options.onglobalprogress;
            var globalprogress = options.globalprogress;

            var count = 0;
            var q = function () {
                count++;
                if (count == 4) {
                    onsuccess();
                }
            };

            AudioLoader.loadAll(BGM, {
                onsuccess: function (bgms) {
                    Audio.setAll('BGM', bgms);
                    q();
                },
                onglobalprogress: onglobalprogress,
                globalprogress: globalprogress
            });

            AudioLoader.loadAll(BGS, {
                onsuccess: function (bgms) {
                    Audio.setAll('BGS', bgms);
                    q();
                },
                onglobalprogress: onglobalprogress,
                globalprogress: globalprogress
            });

            AudioLoader.loadAll(SE, {
                onsuccess: function (bgms) {
                    Audio.setAll('SE', bgms);
                    q();
                },
                onglobalprogress: onglobalprogress,
                globalprogress: globalprogress
            });

            AudioLoader.loadAll(ME, {
                onsuccess: function (bgms) {
                    Audio.setAll('ME', bgms);
                    q();
                },
                onglobalprogress: onglobalprogress,
                globalprogress: globalprogress
            });
        },
        loadImages: function (images, options) {
            images = images || {};
            var Tilesets = images.Tilesets || {};
            var Characters = images.Characters || {};
            var Animations = images.Animations || {};
            var Icons = images.Icons || {};
            var Misc = images.Misc || {};
            var onsuccess = options.onsuccess;
            var onglobalprogress = options.onglobalprogress;
            var globalprogress = options.globalprogress;
            var onprogress = options.onprogress;

            var count = 0;
            var q = function () {
                count++;
                if (count == 5) {
                    onsuccess();
                }
            };


            ImageLoader.loadAll(Tilesets, {
                onsuccess: function (images) {
                    Graphic.setAll('Tileset', images);
                    q();
                },
                onglobalprogress: onglobalprogress,
                globalprogress: globalprogress,
                onprogress: onprogress
            });

            ImageLoader.loadAll(Characters, {
                onsuccess: function (characters) {
                    Graphic.setAll('Character', characters);
                    q();
                },
                onglobalprogress: onglobalprogress,
                globalprogress: globalprogress,
                onprogress: onprogress
            });

            ImageLoader.loadAll(Animations, {
                onsuccess: function (animations) {
                    Graphic.setAll('Animation', animations);
                    q();
                },
                onglobalprogress: onglobalprogress,
                globalprogress: globalprogress,
                onprogress: onprogress
            });

            ImageLoader.loadAll(Icons, {
                onsuccess: function (animations) {
                    Graphic.setAll('Icons', animations);
                    q();
                },
                onglobalprogress: onglobalprogress,
                globalprogress: globalprogress,
                onprogress: onprogress
            });

            ImageLoader.loadAll(Misc, {
                onsuccess: function (misc) {
                    Graphic.setAll('Misc', misc);
                    q();
                },
                onglobalprogress: onglobalprogress,
                globalprogress: globalprogress,
                onprogress: onprogress
            });
        }
    };


})(RPG, window);