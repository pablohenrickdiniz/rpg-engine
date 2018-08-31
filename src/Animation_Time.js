'use strict';
(function (root) {
    let Game_Timer = root.Game_Timer;
    /**
     *
     * @param fps
     * @param frame_count
     * @constructor
     */
    let Animation_Time = function (fps, frame_count) {
        let self = this;
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
     * @returns {number}
     */
    Animation_Time.prototype.getIndexFrame = function () {
        let self = this;
        let frames = self.getFrames();
        if (frames < self.frame_count) {
            return self.direction === 'negative'?self.frame_count - 1 - frames:frames;
        }
        else {
            if (self.stop_on_end) {
               return self.direction === 'negative'?0:self.frame_count - 1;
            }
            let mod = frames % self.frame_count;
            return self.direction === 'negative'?self.frame_count - 1 - mod:mod;
        }
    };

    /**
     *
     * @returns {number}
     */
    Animation_Time.prototype.getFrames = function () {
        let self = this;
        let diff = self.running?Game_Timer.currentTime - self.start_time:self.end_time - self.start_time;
        return diff === 0?0:Math.ceil((diff / 1000) * self.fps);
    };

    /**
     *
     * @returns {boolean}
     */
    Animation_Time.prototype.isRunning = function () {
        let self = this;
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
    Animation_Time.prototype.start = function (stop_on_end, direction) {
        let self = this;
        if (!self.running) {
            self.running = true;
            self.start_time = Game_Timer.currentTime;
            self.stop_on_end = stop_on_end === undefined ? false : stop_on_end;
            self.direction = direction === undefined ? 'positive' : direction;
        }
    };

    /**
     *
     * @param index
     */
    Animation_Time.prototype.pauseToFrame = function (index) {
        let self = this;
        self.running = false;
        if (self.frame_count > index) {
            let diff = (index / self.fps) * 1000;
            self.end_time = self.start_time + diff;
        }
    };

    /**
     *
     * @param index
     */
    Animation_Time.prototype.stop = function (index) {
        index = index || 0;
        let self = this;
        self.pauseToFrame(index);
    };

    root.Animation_Time = Animation_Time;
})(RPG);