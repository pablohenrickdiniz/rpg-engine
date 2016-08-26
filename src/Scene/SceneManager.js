(function (root) {
    if (root.SceneLoader == undefined) {
        throw "SceneManager requires SceneLoader"
    }

    if (root.Main == undefined) {
        throw "SceneManager requires Main"
    }

    var SceneLoader = root.SceneLoader,
        Main = root.Main;

    root.SceneManager = {
        scenes: {
            default: root.SceneTitle
        },
        queue: [],
        defaultScene: root.SceneTitle,
        run: function () {
            if (Main.scene == null) {
                var self = this;
                self.call('default');
            }
            else{
                SceneLoader.load(Main.scene, function () {
                    Main.scene.start();
                });
            }
            root.System.run();
        },
        call: function (name) {
            var self = this;
            var scene = self.get(name);

            if (Main.scene != scene) {
                Main.scene = scene;
                SceneLoader.load(scene, function () {
                    scene.start();
                });
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