'use strict';
(function(root){
    if(root.Game_Face === undefined){
        throw "Faces requires Game_Face";
    }

    if(root.Main === undefined){
        throw "Faces requires Main";
    }

    let Game_Face = root.Game_Face, Main = root.Main;
    let faces = [];
    let Faces = {
        /**
         *
         * @param id
         * @param face
         */
        set:function(id,face){
            if(face instanceof Game_Face){
                faces[id] = face;
            }
        },
        /**
         *
         * @param id
         * @returns {*}
         */
        get:function(id){
            if(faces[id] !== undefined){
               return faces[id];
            }
            return null;
        }
    };

    Object.defineProperty(Main,'Faces',{
        /**
         *
         * @returns {{set: set, get: get}}
         */
       get:function(){
           return Faces;
       }
    });
})(RPG);