(function(root){
    if(root.Game_Event == undefined){
        throw "Switches requires Game_Event"
    }

    if(root.Main == undefined){
        throw "Switches requires RPG Main"
    }

    var Main = root.Main,
        Game_Event = root.Game_Event;

    var switches = {
        global:{},
        local:{},
        map:{}
    };

    Main.Switches = {
        enable:function(map_id,event_id,switch_id){
            var changed = false;
            if(map_id != null){
                if(event_id != null){
                    if(switches.local[map_id] == undefined){
                        switches.local[map_id] = {};
                    }

                    if(switches.local[map_id][event_id] == undefined){
                        switches.local[map_id][event_id] = {};
                    }
                    if(!switches.local[map_id][event_id][switch_id]){
                        switches.local[map_id][event_id][switch_id] = true;
                        changed = true;
                    }
                }
                else{
                    if(switches.map[map_id] == undefined){
                        switches.map[map_id] = {};
                    }
                    if(! switches.map[map_id][switch_id]){
                        switches.map[map_id][switch_id] = true;
                        changed = true;
                    }
                }
            }
            else{
                if(! switches.global[switch_id]){
                    switches.global[switch_id] = true;
                    changed = true;
                }
            }

            if(changed){
                propagate_switch_changes();
            }
        },
        disable:function(map_id,event_id,name){
            var changed = false;
            if(map_id != null){
                if(event_id != null){
                    if(switches.local[map_id][event_id]){
                        delete switches.local[map_id][event_id];
                        changed = true;
                    }
                }
                else if(switches.map[map_id]){
                    delete switches.map[map_id];
                    changed = true;
                }
            }
            else if(switches.global[name]){
                delete switches.global[name];
                changed = true;
            }

            if(changed){
                propagate_switch_changes();
            }
        }
    };

    function propagate_switch_changes(){
        var scene = Main.get_current_scene();
        if(scene){
            var objects = scene.objects;
            var length = objects.length;
            for(var i =0; i < length;i++){
                if(objects[i] instanceof Game_Event){
                    objects[i].updateCurrentPage();
                }
            }
        }
    }
})(RPG);