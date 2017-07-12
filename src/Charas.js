(function(root){
    if(root.Chara == undefined){
        throw "Charas requires Chara"
    }

    var Chara = root.Chara;
    var gpcs = [];

    root.Charas = {
        get:function(id){
            if(gpcs[id] != undefined){
                return gpcs[id];
            }
            return null;
        },
        set:function(id,chrgpc){
            if(chrgpc instanceof Chara){
                gpcs[id] = chrgpc;
            }
        }
    };
})(RPG);