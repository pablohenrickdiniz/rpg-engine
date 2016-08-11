(function(root){
    if(root.Scene == undefined){
       throw "SceneIntro requires Scene"
    }

    window.SceneIntro = {
        audio:{
            BGM:{
                BombingMission:'audio/1-02 Opening ~ Bombing Mission Xg.mp3',
                Prelude:'audio/1-01 Prelude Xg.mp3',
                Makou:'audio/1-03 Makou Reactor Xg.mp3',
                Anxious:'audio/1-04 Anxious Heart Xg.mp3',
                Tifa:'audio/1-05 Tifa\'s Theme Xg.mp3',
                Barett:'audio/1-06 Barett\'s Theme Xg.mp3',
                Hurry:'audio/1-07 Hurry! Xg.mp3',
                Lurking:'audio/1-08 Lurking in the Darkness Xg.mp3',
                Shinra:'audio/1-09 ShinRa Company Xg.mp3',
                Fighting:'audio/1-10 Fighting Xg.mp3'
            }
        },
        ready:function(rpg){
            console.log('Scene Intro loaded...');
            rpg.Screen.fadeOut(0,function(){
                rpg.AudioPlayer.playAudio('BGM','BombingMission');
               // rpg.AudioPlayer.playAudio('BGM','Prelude');
            });
        }
    };
})(RPG);