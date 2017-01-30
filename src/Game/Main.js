(function (root) {
    var current_scene = null;
    var current_map = null;
    var current_player = null;

    if(root.Scene == undefined){
        throw "Main requires Scene"
    }

    if(root.Game_Map == undefined){
        throw "Main requires Game_Map"
    }

    var Scene = root.Scene,
        Game_Map = root.Game_Map;

    root.Main = {
        Actors: null,   //Atores
        Variables: null,//Variáveis
        Scenes:null,    //Cenas
        Switches:null,  //Switches
        Items:null,
        Maps:null,
        get_current_scene:function(){
            return current_scene;
        },
        set_current_scene:function(scene){
            if(scene instanceof Scene){
                current_scene = scene;
            }
        },
        set_current_player:function(actor_id){
            var self = this;
            if(actor_id == null){
                self.current_player = null;
            }
            else if(self.Actors.get(actor_id) != null){
                self.current_player = self.Actors.get(actor_id);
            }
        },
        get_current_player:function(){
            return current_player;
        },
        set_current_map:function(map){
            if(map instanceof Game_Map){
                current_map = map;
            }
        },
        get_current_map:function(){
            return current_map;
        }
    };
})(RPG);