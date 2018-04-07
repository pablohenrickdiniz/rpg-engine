(function(root){
    if(root.Game_Face === undefined){
        throw "Faces requires Game_Face"
    }

    if(root.Main === undefined){
        throw "Faces requires Main"
    }

    var Game_Face = root.Game_Face, Main = root.Main;
    var faces = [];

    Main.Faces = {
        set:function(id,face){
            if(face instanceof Game_Face){
                faces[id] = face;
            }
        },
        get:function(id){
            if(faces[id] !== undefined){
               return faces[id];
            }
            return null;
        }
    };
})(RPG);