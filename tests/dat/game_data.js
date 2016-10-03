(function(root){
    if(root.Game_Character == undefined){
        throw "game data requires Game_Character"
    }

    if(root.Character_Graphic == undefined){
        throw  "game data requires Character_Graphic"
    }

    if(root.Characters == undefined){
        throw "game data requires Characters"
    }


    var Game_Character = root.Game_Character,
        Characters = root.Characters,
        Character_Graphic = root.Character_Graphic;


    var character1 = new Game_Character({
        graphic:new Character_Graphic({
            image:'2',
            sx:0,
            sy:0,
            sWidth:96,
            sHeight:192,
            cols:3,
            rows:4,
            startFrame:1
        })
    });

    var character2 = new Game_Character({
        graphic:new Character_Graphic({
            image:'2',
            sx:96,
            sy:0,
            sWidth:96,
            sHeight:192,
            cols:3,
            rows:4,
            startFrame:1
        })
    });

    Characters.set('character1',character1);
    Characters.set('character2',character2);
})(RPG);