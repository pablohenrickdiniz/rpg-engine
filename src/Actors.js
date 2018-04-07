(function(root){
    if(root.Game_Actor === undefined){
        throw "Actors requires Game_Actor"
    }

    if(root.Main === undefined){
        throw "Actors requires RPG Main";
    }

    var Main = root.Main;
    var Game_Actor = root.Game_Actor;
    var actors = [];

    Main.Actors = {
        set:function(id,actor){
            if(actor instanceof Game_Actor){
                actors[id] = actor;
            }
        },
        get:function(id){
            if(actors[id] !== undefined){
               return actors[id];
            }
            return null;
        }
    };
})(RPG);