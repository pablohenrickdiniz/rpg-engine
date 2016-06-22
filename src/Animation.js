(function(w){
    var Animation = function(fps,frame_count){
        var self = this;
        self.fps = fps;
        self.frame_count = frame_count;
        var now = (new Date()).getTime();
        self.start_time = now;
        self.end_time = now;
        self.running = false;
    };

    /*
     getIndexFrame():int
     Retorna o �ndice do quadro atual da anima��o
     */
    Animation.prototype.getIndexFrame = function(){
        var self = this;
        var diff = null;
        if(self.running){
            diff = (new Date()).getTime() - self.start_time;
        }
        else{
            diff = self.end_time - self.start_time;
        }

        if(diff == 0){
            return 0;
        }

        var mod = ((diff/1000)*self.fps) % self.frame_count;
        mod =  mod === 0? self.frame_count-1:mod-1;
        return Math.abs(Math.ceil(mod));
    };

    /*
     stop():void
     Para a execu��o da anima��o
     */
    Animation.prototype.stop = function(){
        var self = this;
        self.pause();
    };

    /*
     execute():void
     Executa a anima��o
     */
    Animation.prototype.execute = function(){
        var self = this;
        if(!self.running){
            self.start_time = (new Date()).getTime();
            self.running = true;
        }
    };

    /*
     pause:Pausa a execu��o da anima��o
     */
    Animation.prototype.pause = function(){
        var self = this;
        if(self.running){
            self.end_time = (new Date()).getTime();
            self.running = false;
        }
    };

    /*
     pauseToFrame(int index):void
     Pausa a anima��o no quadro index
     */
    Animation.prototype.pauseToFrame = function(index){
        var self = this;
        if(self.frame_count > index){
            var diff = (index/self.fps)*1000;
            self.end_time = self.start_time + diff;
            self.running = false;
        }
    };

    w.Animation = Animation;
})(window);