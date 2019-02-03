/**
 * @requires Game_Face.js
 * @requires Game/Main.js
 */
(function(root){
    let Game_Face = root.Game_Face,
        Main = root.Main;

    let faces = [];
    let Faces = {
        /**
         *
         * @param id{string}
         * @param face{Game_Face}
         */
        set:function(id,face){
            if(face instanceof Game_Face){
                faces[id] = face;
            }
        },
        /**
         *
         * @param id
         * @returns {Game_Face}
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
         * @returns {Faces}
         */
       get:function(){
           return Faces;
       }
    });
})(RPG);