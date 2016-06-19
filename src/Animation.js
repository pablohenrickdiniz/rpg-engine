(function(w){
    var Animation = function(options){
        var self = this;
        options = options == undefined?{}:options;
        var frames = options.frames === undefined?[]:options.frames;
        var fps = parseFloat(options.fps);
        fps = isNaN(fps) || fps <= 0?3:fps;
        self.name = options.name === undefined?'':options.name;
        self.fps = fps;
        self.frames = frames;
        var now = (new Date()).getTime();
        self.start_time = now;
        self.end_time = now;
        self.running = false;
    };

    /*
     getIndexFrame():int
     Retorna o índice do quadro atual da animação
     */
    Animation.prototype.getIndexFrame = function(){
        var self = this;
        var size = self.frames.length;
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

        var mod = ((diff/1000)*self.fps) % size;
        mod =  mod === 0? size-1:mod-1;
        return Math.abs(Math.ceil(mod));
    };

    /*
      getCurrentFrame():Obj
      Retorna o quadro atual de animação
     */
    Animation.prototype.getCurrentFrame = function(){
        var self = this;
        var index_frame = self.getIndexFrame();
        if(self.frames[index_frame] != undefined){
           return self.frames[index_frame];
        }
        return null;
    };

    /*
     stop():void
     Para a execução da animação
     */
    Animation.prototype.stop = function(){
        var self = this;
        self.pause();
    };

    /*
     execute():void
     Executa a animação
     */
    Animation.prototype.execute = function(){
        var self = this;
        if(!self.running){
            self.start_time = (new Date()).getTime();
            self.running = true;
        }
    };

    /*
     pause:Pausa a execução da animação
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
     Pausa a animação no quadro index
     */
    Animation.prototype.pauseToFrame = function(index){
        var self = this;
        if(self.frames[index] !== undefined){
            var diff = (index/self.fps)*1000;
            self.end_time = self.start_time + diff;
            self.running = false;
        }
    };

    /*
     Animation.create(Object options):Animation
     Cria uma animação
     */
    Animation.create = function(options){
        var fps = parseFloat(options.fps);
        var rows = parseInt(options.rows);
        var cols = parseInt(options.cols);
        var si = parseInt(options.si);
        var ei = parseInt(options.ei);
        var sj = parseInt(options.sj);
        var ej = parseInt(options.ej);
        rows = isNaN(rows)?1:rows;
        cols = isNaN(cols)?1:cols;
        fps = isNaN(fps)?cols*2:fps;
        si = isNaN(si)?0:si;
        ei = isNaN(ei)?rows-1:ei;
        sj = isNaN(sj)?0:sj;
        ej = isNaN(ej)?cols-1:ej;

        var image = options.image;
        var width = image.width/cols;
        var height = image.height/rows;
        var name = options.name;

        var frames = [];

        for(var i = si; i <= ei && i < rows;i++){
            for(var j = sj; j <= ej && j < cols;j++){
                var frame = {
                    image:image,
                    sWidth:width,
                    sHeight:height,
                    dWidth:width,
                    dHeight:height,
                    sx:j*width,
                    sy:i*height
                };
                frames.push(frame);
            }
        }
        return new Animation({
            name:'name',
            frames:frames,
            fps:fps
        });
    };

    w.Animation = Animation;
})(window);