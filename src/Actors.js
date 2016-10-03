(function(root){
    if(root.Game_Actor == undefined){
        throw "Actors requires Game_Actor"
    }

    var Game_Actor = root.Game_Actor;

    root.Actors = {
        actors:[],
        set:function(id,actor){
            if(actor instanceof Game_Actor){
                var self = this;
                self.actors[id] = actor;
            }
        },
        get:function(id){
            var self = this;
            if(self.actors[id] != undefined){
                return self.actors[id];
            }
        }
    };
})(RPG);