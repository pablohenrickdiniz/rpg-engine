(function (root) {
    var Game_Timer = root.Game_Timer;

    /**
     *
     * @param fps
     * @param frame_count
     * @constructor
     */
    var Animation = function (fps, frame_count) {
        var self = this;
        self.fps = fps;
        self.frame_count = frame_count;
        self.start_time = Game_Timer.currentTime;
        self.end_time = self.start_time;
        self.running = false;
        self.stop_on_end = false;
        self.direction = 'positive';
    };

    /**
     *
     * @returns {*}
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

    /**
     *
     * @returns {number}
     */
    Animation.prototype.getFrames = function () {
        var diff = null;
        var self = this;
        if (self.running) {
            diff = Game_Timer.currentTime - self.start_time;
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
    /**
     *
     * @returns {boolean|*}
     */
    Animation.prototype.isRunning = function () {
        var self = this;
        if (self.stop_on_end && self.running && self.getFrames() >= self.frame_count) {
            self.running = false;
        }

        return self.running;
    };

    /**
     *
     * @param stop_on_end
     * @param direction
     */
    Animation.prototype.start = function (stop_on_end, direction) {
        var self = this;
        if (!self.running) {
            self.running = true;
            self.start_time = Game_Timer.currentTime;
            self.stop_on_end = stop_on_end == undefined ? false : stop_on_end;
            self.direction = direction == undefined ? 'positive' : direction;
        }
    };


    /**
     *
      * @param index
     */
    Animation.prototype.pauseToFrame = function (index) {
        var self = this;
        self.running = false;
        if (self.frame_count > index) {
            var diff = (index / self.fps) * 1000;
            self.end_time = self.start_time + diff;
        }
    };

    /**
     *
     * @param index
     */
    Animation.prototype.stop = function (index) {
        index = index || 0;
        var self = this;
        self.pauseToFrame(index);
    };

    root.Animation = Animation;
})(RPG);