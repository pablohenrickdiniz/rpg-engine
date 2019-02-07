/**
 * @requires Game/Main.js
 */
(function(root){
    let Main = root.Main;

    let faces = [];
    let Faces = {
        /**
         *
         * @param id{string}
         * @param face{Game_Face}
         */
        set:function(id,face){
            faces[id] = face;
        },
        /**
         *
         * @param id
         * @returns {Game_Face}
         */
        get:function(id){
            return faces[id]?faces[id]:null;
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