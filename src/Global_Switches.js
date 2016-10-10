(function(root){
    if(root.Game_Event == undefined){
        throw "GlobalSwitches requires Game_Event"
    }

    var Main = root.Main,
        Game_Event = root.Game_Event;

    root.GlobalSwitches = {
        switches:[],
        enable:function(name){
            var self = this;
            if(!self.switches[name]){
                self.switches[name] = true;
                updateEvents();
            }
        },
        disable:function(name){
            var self = this;
            if(self.switches[name]){
                delete self.switches[name];
                updateEvents();
            }
        },
        isEnabled:function(name){
            var self = this;
            return self.switches[name] == true;
        }
    };

    var updateEvents = function(){
        if(Main.scene){
            var map = Main.scene.map;
            var objects = map.objects;
            var length = objects.length;
            for(var i =0; i < length;i++){
                if(objects[i] instanceof Game_Event){
                    objects[i].updateCurrentPage();
                }
            }
        }
    };
})(RPG);