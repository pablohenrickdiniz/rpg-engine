(function (root,w) {
    var current_scene = null;
    var current_map = null;
    var current_player_id = null;

    if(root.Scene == undefined){
        throw "Main requires Scene"
    }

    if(root.Game_Map == undefined){
        throw "Main requires Game_Map"
    }

    if(w.QuadTree == undefined){
        throw "Main requires QuadTree"
    }

    var Scene = root.Scene,
        Game_Map = root.Game_Map,
        QuadTree = root.QuadTree;

    var Main = {
        Actors: null,   //Atores
        Variables: null,//Variáveis
        Scenes:null,    //Cenas
        Switches:null,  //Switches
        Items:null,     //Items
        Maps:null,      //Maps
        Faces:null      //Faces
    };

    Object.defineProperty(self,'currentScene',{
        get:function(){
            return current_scene;
        },
        set:function(c){
            if(c instanceof Scene && c != current_scene){
                current_scene = c;
            }
        }
    });

    Object.defineProperty(Main,'currentMap',{
        get:function(){
            return current_map;
        },
        set:function(map){
            if(map instanceof Game_Map){
                current_map = map;
            }
        }
    });

    Object.defineProperty(Main,'currentPlayerID',{
        get:function(){
            return current_player_id;
        },
        set:function(player_id){
            var self = this;
            if(player_id != current_player_id){
                if(current_player_id != null){
                    var tmp = self.Actors.get(current_player_id);
                    if(tmp != null){
                        tmp.type = 'Actor';
                        QuadTree.remove(tmp.bounds);
                    }
                }
                current_player_id = player_id;
                var scene = self.currentScene;
                var p = self.Actors.get(player_id);
                if(scene != null && p != null){
                    p.type = 'Player';
                    scene.tree.insert(p.bounds);
                }
            }
        }
    });

    Object.defineProperty(Main,'currentPlayer',{
        get:function(){
            return Main.Actors.get(current_player_id);
        }
    });


    root.Main = Main;
})(RPG,window);