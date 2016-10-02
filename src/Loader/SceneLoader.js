(function (root, w) {
    if (w.ImageLoader == undefined) {
        throw "SceneLoader requires ImageLoader"
    }

    if (w.AudioLoader == undefined) {
        throw "SceneLoader requires AudioLoader"
    }

    if (root.Audio == undefined) {
        throw "SceneLoader requires Audio"
    }

    if (root.Graphics == undefined) {
        throw "SceneLoader requires Graphics"
    }

    var Audio = root.Audio,
        Graphics = root.Graphics;

    var SceneLoader = function () {
        var self = this;
        self.eventListeners = [];
    };

    SceneLoader.prototype.load = function (scene,callback) {
        var count = 0;
        var onsuccess = function () {
            count++;
            if (count == 2) {
                if(callback){
                    callback();
                }
            }
        };

        var globalprogress = new GlobalProgress();

        var onglobalprogress = function (progress) {
            //scene.drawProgressBar(progress);
        };

        loadAudio(scene.audio, {
            onsuccess: onsuccess,
            globalprogress: globalprogress,
            onglobalprogress: onglobalprogress
        });

        loadGraphics(scene.graphics, {
            onsuccess: onsuccess,
            globalprogress: globalprogress,
            onglobalprogress: onglobalprogress
        })
    };

    var loadAudio = function (audio, options) {
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
    };


    var loadGraphics = function (graphics, options) {
        graphics = graphics || {};
        var names = Object.keys(graphics);
        var onsuccess = options.onsuccess;
        var onglobalprogress = options.onglobalprogress;
        var globalprogress = options.globalprogress;
        var onprogress = options.onprogress;

        var count = 0;
        var length = names.length;
        var q = function () {
            count++;
            if (count == length) {
                onsuccess();
            }
        };


        loadGraphicsHell(names,graphics,q,onglobalprogress,globalprogress,onprogress);
    };


    var loadGraphicsHell = function(names,data,q,onglobalprogress,globalprogress,onprogress){
        if(names.length > 0){
            var name = names.pop();
            ImageLoader.loadAll(data[name], {
                onsuccess: function (graphics) {
                    Graphics.setAll(name, graphics);
                    q();
                },
                onglobalprogress: onglobalprogress,
                globalprogress: globalprogress,
                onprogress: onprogress
            });
            loadGraphicsHell(names,data,q,onglobalprogress,globalprogress,onprogress)
        }
    };

    root.Scene.SceneLoader = SceneLoader;
})
(RPG, window);