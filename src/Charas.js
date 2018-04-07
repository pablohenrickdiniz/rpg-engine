(function(root){
    if(root.Chara === undefined){
        throw "Charas requires Chara"
    }

    if(root.Main === undefined){
        throw "Charas requires Main"
    }

    var Chara = root.Chara,
        Main = root.Main;
    var charas = [];

    Main.Charas = {
        get:function(id){
            if(charas[id] !== undefined){
                return charas[id];
            }
            return null;
        },
        set:function(id,chrgpc){
            if(chrgpc instanceof Chara){
                charas[id] = chrgpc;
            }
        }
    };
})(RPG);