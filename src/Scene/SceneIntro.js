(function(root){
    if(root.Scene == undefined){
       throw "SceneIntro requires Scene"
    }

    window.SceneIntro = {
        ready:function(rpg){
            rpg.Screen.fadeOut(0,function(){

            });
        }
    };
})(RPG);