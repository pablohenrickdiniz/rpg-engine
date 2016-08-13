(function(root){
    if(root.Scene == undefined){
       throw "SceneIntro requires Scene"
    }

    window.SceneIntro = {
        audio:{
            BGM:{
                Intro:'audio/1-02 Opening ~ Bombing Mission Xg.mp3'
            }
        },
        images:{
            Misc:{
                Logo1:'img/1994-metroid.png',
                Logo2:'img/nintendo-metroid.png',
                Logo3:'img/nintendo-logo.png'
            }
        },
        ready:function(rpg){
            console.log('Scene Intro loaded...');
            rpg.Screen.fadeOut(0,function(){
                var image = rpg.ImageRegistry.getImage('Misc','Logo1');

                rpg.Screen.layers.EF2.getContext().drawImage(image,0,0);
            });
        }
    };
})(RPG);