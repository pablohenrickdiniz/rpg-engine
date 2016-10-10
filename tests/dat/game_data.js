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

    if(root.Items == undefined){
        throw "game data requires Items"
    }


    var Game_Character = root.Game_Character,
        Characters = root.Characters,
        Character_Graphic = root.Character_Graphic,
        Items = root.Items;

    var data = {
        characters:{
            'character1':{
                graphic:{
                    image:'2',
                    sx:0,
                    sy:0,
                    sWidth:96,
                    sHeight:192,
                    cols:3,
                    rows:4,
                    startFrame:1
                }
            }
        },
        items:{
            'pocao':{
                name:'Poção de Cura',
                graphic:{
                    image:'1',
                    sx:48,
                    sy:168,
                    sWidth:24,
                    sHeight:24
                },
                effects:[]
            }
        }
    };

    for(var id in data.characters){
        Characters.set(id,data.characters[id]);
    }

    for(var id in data.items){
        Items.set(id,data.items[id]);
    }
})(RPG);

var spriteset = [];

for(var i =0; i < 100;i++){
    if(spriteset[i] == undefined){
        spriteset[i] = [];
    }
    for(var j = 0; j < 100;j++){
        var rand = Math.floor(Math.random()*100);
        if(rand == 30){
            spriteset[i][j] = [
                ['1', 6, 8, 32, 32, 32, 32]
            ];
        }
        else{
            spriteset[i][j] = [
                ['1', 0, 0, 32, 32, 32, 32]
            ];
        }
    }
}
