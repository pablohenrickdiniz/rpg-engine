(function(root){
    if(root.SceneLoader == undefined){
        throw "SceneManager requires SceneLoader"
    }

    if(root.Main == undefined){
        throw "SceneManager requires Main"
    }

    var SceneLoader = root.SceneLoader,
        Main = root.Main;

    root.SceneManager = {
        scenes:{},
        scene:null,
        call:function(name){
            var self = this;
            var scene = self.get(name);
            if(scene != self.scene){
                Main.scene = scene;
                SceneLoader.load(scene,function(){
                    scene.ready(RPG);
                });
            }
        },
        set:function(name,scene){
            var self = this;
            self.scenes[name] = scene;
        },
        get:function(name){
            var self = this;
            if(self.scenes[name] != undefined){
                return self.scenes[name];
            }
            return null;
        }
    };


})(RPG);