(function(root){
    root.AudioPlayer = {
        bgm:null,
        playBGM:function(bgm){
            var self= this;
            if(self.bgm != null && self.bgm != bgm){
                self.bgm = bgm;
                self.bgm.play();
            }
        },
        stopBGM:function(){
            var self= this;
            if(self.bgm != null){
                self.bgm.stop();
            }
        }
    };
})(RPG);