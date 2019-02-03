/**
 * @requires Game_Character.js
 */
(function(root){
    let Game_Character = root.Game_Character,
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