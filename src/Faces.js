(function(root){
    if(root.Game_Face == undefined){
        throw "Faces requires Game_Face"
    }

    var Game_Face = root.Game_Face;
    var faces = [];

    root.Faces = {
        set:function(id,face){
            if(face instanceof Game_Face){
                faces[id] = face;
            }
        },
        get:function(id){
            if(faces[id] != undefined){
               return faces[id];
            }
            return null;
        }
    };
})(RPG);