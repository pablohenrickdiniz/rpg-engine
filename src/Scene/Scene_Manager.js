(function (root) {
    if (root.Scene_Loader == undefined) {
        throw "Scene_Manager requires Scene_Loader"
    }

    if(root.Scene_Map_Loader == undefined){
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

    if(root.Scene_Map == undefined){
        throw "Scene_Manager requires Scene_Map"
    }


    var Scene_Loader = new root.Scene_Loader(),
        Scene_Map_Loader = new root.Scene_Map_Loader(),
        Scene_Map = root.Scene_Map,
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
                    scene = new Scene_Map(options);
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
            if(scene instanceof Scene_Map){
                scene.trigger('beforeload',[root]);
                Scene_Map_Loader.load(scene, function () {
                    current_scene = scene;
                    Main.currentScene = scene;
                    scene.trigger('afterload',[root]);
                    if(!Game_Timer.running){
                        Game_Timer.run();
                    }
                    scene.trigger('start',[root]);
                });
            }
            else{
                scene.trigger('beforeload',[root]);
                Scene_Loader.load(scene, function () {
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