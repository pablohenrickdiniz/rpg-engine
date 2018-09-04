'use strict';
(function(root){
    if(!root.Main){
        throw "Characters requires Main";
    }

    if(!root.Game_Character){
        throw "Characters requires Game_Character";
    }

    if(!root.Character_Graphic){
        throw "Characters requires Character_Graphic";
    }

    let Game_Character = root.Game_Character,
        Character_Graphic = root.Character_Graphic,
        Main = root.Main,
        characters = {};

    let Characters = {
        /**
         *
         * @param id {string}
         * @param character {Game_Character}
         */
        set:function(id,character){
            characters[id] = character;
        },
        /**
         *
         * @param id {string}
         * @returns {Game_Character}
         */
        get:function(id){
            if(characters[id] !== undefined){
                return characters[id];
            }
            return null;
        },
        /**
         *
         * @param id {string}
         * @param options {object}
         * @returns {Game_Character}
         */
        createInstance:function(id,options){
            if(characters[id] !== undefined){
                let graphic = new Character_Graphic(characters[id].graphic);
                options = options || {};
                options.id = id;
                options.graphic = graphic;
                let opt = {x:0, y:0, graphic:graphic};
                Object.assign(opt,options);
                return new Game_Character(opt);
            }
            return null;
        }
    };


    Object.defineProperty(Main,'Characters',{
        /**
         *
         * @returns {Characters}
         */
       get:function(){
           return Characters;
       }
    });
})(RPG);