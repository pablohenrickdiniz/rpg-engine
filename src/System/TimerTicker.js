(function (w) {
    var TimerTicker = function (options) {
        var self = this;
        options = options || {};
        self.fps = options.fps || 60;
        self.currentTime = 0;
        self.interval = null;
        self.last_tick = null;
        self.running = false;
        self.eventListeners = [];
    };

    TimerTicker.prototype.run = function () {
        var self = this;
        if (!self.running) {
            self.running = true;
            self.trigger('start');
            tick(self);
        }
    };

    TimerTicker.prototype.stop = function () {
        var self = this;
        w.cancelAnimationFrame(self.interval);
        self.last_tick = null;
        self.running = false;
        self.trigger('stop');
    };

    TimerTicker.prototype.addEventListener = function (eventName, callback) {
        var self = this;
        if(self.eventListeners[eventName] == undefined){
            self.eventListeners[eventName] = [];
        }
        if(self.eventListeners[eventName].indexOf(callback) == -1){
            self.eventListeners[eventName].push(callback);
        }
    };

    TimerTicker.prototype.removeEventListener = function (event, callback) {
        var self = this;
        if(self.eventListeners[event] != undefined){
            var index = self.eventListeners[event].indexOf(callback);
            if(index != -1){
                self.eventListeners[event].splice(index,1);
            }
        }
    };

    TimerTicker.prototype.trigger = function (eventName) {
        var self = this;
        if(self.eventListeners[eventName] != undefined){
            var length = self.eventListeners[eventName].length;
            for(var i =0; i < length;i++){
                self.eventListeners[eventName][i]();
            }
        }
    };

    var tick = function (timer) {
        if(timer.running){
            timer.interval = w.requestAnimationFrame(function () {
                tick(timer);
            });
            var passed = 0;
            var current_time = new Date().getTime();
            if (timer.last_tick != null) {
                passed = current_time - timer.last_tick;
            }
            timer.currentTime += passed;
            timer.trigger('tick');
            timer.last_tick = current_time;
        }
    };

    w.TimerTicker = TimerTicker;
})(window);