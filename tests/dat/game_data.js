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
            rows:4
        })
    });

    var character3 = new Game_Character({
        graphic:new Character_Graphic({
            image:'2',
            sx:192,
            sy:0,
            sWidth:96,
            sHeight:192,
            cols:3,
            rows:4
        })
    });

    var character4 = new Game_Character({
        graphic:new Character_Graphic({
            image:'2',
            sx:288,
            sy:0,
            sWidth:96,
            sHeight:192,
            cols:3,
            rows:4
        })
    });

    var character5 = new Game_Character({
        graphic:new Character_Graphic({
            image:'2',
            sx:0,
            sy:192,
            sWidth:96,
            sHeight:192,
            cols:3,
            rows:4
        })
    });

    var character6 = new Game_Character({
        graphic:new Character_Graphic({
            image:'2',
            sx:96,
            sy:192,
            sWidth:96,
            sHeight:192,
            cols:3,
            rows:4,
            startFrame:1
        })
    });

    var character7 = new Game_Character({
        graphic:new Character_Graphic({
            image:'2',
            sx:192,
            sy:192,
            sWidth:96,
            sHeight:192,
            cols:3,
            rows:4
        })
    });

    var character8 = new Game_Character({
        graphic:new Character_Graphic({
            image:'2',
            sx:288,
            sy:192,
            sWidth:96,
            sHeight:192,
            cols:3,
            rows:4
        })
    });

    Characters.set('character1',character1);
    Characters.set('character2',character2);
    Characters.set('character3',character3);
    Characters.set('character4',character4);
    Characters.set('character5',character5);
    Characters.set('character6',character6);
    Characters.set('character7',character7);
    Characters.set('character8',character8);
})(RPG);