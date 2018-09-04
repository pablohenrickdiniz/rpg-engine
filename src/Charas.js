'use strict';
(function(root){
    if(!root.Chara){
        throw "Charas requires Chara";
    }

    if(!root.Main){
        throw "Charas requires Main";
    }

    let Chara = root.Chara,
        Main = root.Main;
    let charas = [];

    let Charas = {
        /**
         *
         * @param id {string}
         * @returns {Chara}
         */
        get:function(id){
            if(charas[id] !== undefined){
                return charas[id];
            }
            return null;
        },
        /**
         *
         * @param id {string}
         * @param chara {Chara}
         */
        set:function(id,chara){
            if(chara instanceof Chara){
                charas[id] = chara;
            }
        }
    };

    Object.defineProperty(Main,'Charas',{
        /**
         *
         * @returns {Charas}
         */
       get:function(){
           return Charas;
       }
    });
})(RPG);