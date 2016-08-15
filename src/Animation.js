(function (root) {
    var Animation = function (fps, frame_count) {
        var self = this;
        self.fps = fps;
        self.frame_count = frame_count;
        self.start_time = root.System.time;
        self.end_time = self.start_time;
        self.running = false;
        self.stop_on_end = false;
        self.direction = 'positive';
    };

    /*
     getIndexFrame():int
     Retorna o índice do quadro atual da animação
     */
    Animation.prototype.getIndexFrame = function () {
        var self = this;
        var frames = self.getFrames();

        if (frames < self.frame_count) {
            if (self.direction == 'negative') {
                return self.frame_count - 1 - frames;
            }
            return frames;
        }
        else {
            if (self.stop_on_end) {
                if (self.direction == 'negative') {
                    return 0;
                }
                return self.frame_count - 1;
            }

            var mod = frames % self.frame_count;
            if (self.direction == 'negative') {
                return self.frame_count - 1 - mod;
            }

            return mod;
        }
    };


    Animation.prototype.getFrames = function () {
        var diff = null;
        var self = this;
        if (self.running) {
            diff = root.System.time - self.start_time;
        }
        else {
            diff = self.end_time - self.start_time;
        }

        if (diff == 0) {
            return 0;
        }

        var sec = diff / 1000;
        return Math.ceil(sec * self.fps);
    };

    Animation.prototype.isRunning = function () {
        var self = this;
        if (self.stop_on_end && self.running && self.getFrames() >= self.frame_count) {
            self.running = false;
        }

        return self.running;
    };


    /*
     execute():void
     Executa a animação
     */
    Animation.prototype.execute = function (stop_on_end, direction) {
        var self = this;
        if (!self.running) {
            self.start_time = root.System.time;
            self.running = true;
            self.stop_on_end = stop_on_end == undefined ? false : stop_on_end;
            self.direction = direction == undefined ? 'positive' : direction;
        }
    };

    /*
     pause:Pausa a execução da animação
     */
    Animation.prototype.pause = function () {
        var self = this;
        if (self.running) {
            self.end_time = root.System.time;
            self.running = false;
        }
    };

    /*
     pauseToFrame(int index):void
     Pausa a animação no quadro index
     */
    Animation.prototype.pauseToFrame = function (index) {
        var self = this;
        if (self.frame_count > index) {
            var diff = (index / self.fps) * 1000;
            self.end_time = self.start_time + diff;
            self.running = false;
        }
    };

    root.Animation = Animation;
})(RPG);