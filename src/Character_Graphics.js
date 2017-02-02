(function(root){
    if(root.Character_Graphic == undefined){
        throw "Character_Graphics requires Character_Graphic"
    }

    var Character_Graphic = root.Character_Graphic;
    var gpcs = [];

    root.Character_Graphics = {
        get:function(id){
            if(gpcs[id] != undefined){
                return gpcs[id];
            }
            return null;
        },
        set:function(id,chrgpc){
            if(chrgpc instanceof Character_Graphic){
                gpcs[id] = chrgpc;
            }
        }
    };
})(RPG);