'use strict';
(function(root){
    if(root.Main === undefined){
        throw "Characters requires Main";
    }

    if(root.Game_Character === undefined){
        throw "Characters requires Game_Character";
    }

    if(root.Character_Graphic === undefined){
        throw "Characters requires Character_Graphic";
    }

    var Game_Character = root.Game_Character,
        Character_Graphic = root.Character_Graphic,
        Main = root.Main;

    Main.Characters = {
        characters:{},
        /**
         *
         * @param id
         * @param character
         */
        set:function(id,character){
            var self = this;
            self.characters[id] = character;
        },
        /**
         *
         * @param id
         * @returns {*}
         */
        get:function(id){
            var self = this;
            if(self.characters[id] !== undefined){
                return self.characters[id];
            }
            return null;
        },
        /**
         *
         * @param id
         * @param options
         * @returns {*}
         */
        createInstance:function(id,options){
            var self = this;
            if(self.characters[id] !== undefined){
                var graphic = new Character_Graphic(self.characters[id].graphic);
                options = options || {};
                options.id = id;
                options.graphic = graphic;
                var opt = {x:0, y:0, graphic:graphic};
                Object.assign(opt,options);
                return new Game_Character(opt);
            }
            return null;
        }
    };
})(RPG);