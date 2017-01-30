(function (root) {
    if (root.Scene.Scene_Loader == undefined) {
        throw "Scene_Manager requires Scene_Loader"
    }

    if(root.Scene.Scene_Map_Loader == undefined){
        throw "Scene_Manager requires Scene_Map_Loader"
    }

    if (root.Main == undefined) {
        throw "Scene_Manager requires Main"
    }
    else if(root.Main.Scenes == undefined){
        throw "Scene_Manager requires Main.Scenes"
    }

    if(root.Game_Timer == undefined){
        throw "Scene_Manager requires Game_Timer"
    }


    var SceneLoader = new root.Scene.Scene_Loader(),
        SceneMapLoader = new root.Scene.Scene_Map_Loader(),
        SceneMap = root.Scene.SceneMap,
        Scene = root.Scene,
        Main = root.Main,
        Game_Timer = root.Game_Timer;

    var Scenes = Main.Scenes;
    var current_scene = null;
    var queue = [];

    root.Scene_Manager = {
        new: function (type,name, options) {
            var scene = null;
            options = options || {};
            switch (type) {
                case 'map':
                    scene = new SceneMap(options);
                    break;
                default:
                    scene = new Scene(options);
            }
            Scenes.set(name,scene);
            return scene;
        },
        call: function (name) {
            var scene = Scenes.get(name);
            if(scene == null){
                throw new Error('Cena '+name+' não existe!');
            }
            console.log('inicializando cena '+name+'...');
            if(scene instanceof SceneMap){
                scene.trigger('beforeload',[root]);
                SceneMapLoader.load(scene, function () {
                    current_scene = scene;
                    Main.set_current_scene(scene);
                    scene.trigger('afterload',[root]);
                    if(!Game_Timer.running){
                        Game_Timer.run();
                    }
                    scene.trigger('start',[root]);
                });
            }
            else{
                scene.trigger('beforeload',[root]);
                SceneLoader.load(scene, function () {
                    current_scene = scene;
                    Main.set_current_scene(scene);
                    scene.trigger('afterload',[root]);

                    if(!Game_Timer.running){

                        Game_Timer.run();
                    }
                    scene.trigger('start',[root]);
                });
            }
        }
    };
})(RPG);