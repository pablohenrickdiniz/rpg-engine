(function(w){
    if(w.Scene == undefined){
        "SceneIntro requires Scene"
    }

    w.SceneIntro = {
        images:{
            "manamon-title":"../src/images/manamo-title.png"
        },
        ready:function(RPG){
            RPG.Screen.fadeOut(0,function(){

            });
        }
    };
})(window);