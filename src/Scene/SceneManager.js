(function (root) {
    if (root.Scene.SceneLoader == undefined) {
        throw "SceneManager requires SceneLoader"
    }

    if(root.Scene.SceneMapLoader == undefined){
        throw "SceneManager requires SceneMapLoader"
    }

    if (root.Main == undefined) {
        throw "SceneManager requires Main"
    }

    if(root.Game_Timer == undefined){
        throw "SceneManager requires Game_Timer"
    }

    var SceneLoader = new root.Scene.SceneLoader(),
        SceneMapLoader = new root.Scene.SceneMapLoader(),
        SceneMap = root.Scene.SceneMap,
        Scene = root.Scene.Scene,
        Main = root.Main,
        Game_Timer = root.Game_Timer;


    root.SceneManager = {
        scenes: {},
        queue: [],
        scene: null,
        new: function (type,name, options) {
            var scene = null;
            switch (type) {
                case 'Map':
                    scene = new SceneMap(options);
                    break;
                default:
                    scene = new Scene(options);
            }
            var self = this;
            self.scenes[name] = scene;
        },
        call: function (name) {
            var self = this;
            var scene = self.get(name);
            if(scene != null){
                if(scene instanceof SceneMap){
                    SceneMapLoader.load(scene, function () {
                        self.scene = scene;
                        Main.scene = scene;
                        if(!Game_Timer.running){
                            Game_Timer.run();
                        }
                        scene.trigger('start');
                    });
                }
                else{
                    SceneLoader.load(scene, function () {
                        self.scene = scene;
                        Main.scene = scene;
                        if(!Game_Timer.running){
                            Game_Timer.run();
                        }
                        scene.trigger('start');
                    });
                }
            }
        },
        set: function (name, scene) {
            var self = this;
            self.scenes[name] = scene;
        },
        get: function (name) {
            var self = this;
            if (self.scenes[name] != undefined) {
                return self.scenes[name];
            }
            return null;
        }
    };

})(RPG);