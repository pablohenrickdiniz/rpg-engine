(function(root){
    if(root.Game_Character == undefined){
        throw "Characters requires Game_Character"
    }

    var Game_Character = root.Game_Character;

    root.Characters = {
        characters:[],
        set:function(id,character){
            if(character instanceof Game_Character){
                var self = this;
                self.characters[id] = character;
            }
        },
        get:function(id){
            var self = this;
            if(self.characters[id] != undefined){
                return self.characters[id];
            }
            return null;
        }
    };
})(RPG);