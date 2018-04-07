(function (w) {
    var Timer_Ticker = function (options) {
        var self = this;
        options = options || {};
        self.fps = options.fps || 60;
        self.currentTime = 0;
        self.interval = null;
        self.last_tick = null;
        self.running = false;
        self.listeners = [];
    };

    Timer_Ticker.prototype.run = function () {
        var self = this;
        if (!self.running) {
            self.running = true;
            self.trigger('start');
            tick(self);
        }
    };

    Timer_Ticker.prototype.stop = function () {
        var self = this;
        w.cancelAnimationFrame(self.interval);
        self.last_tick = null;
        self.running = false;
        self.trigger('stop');
    };

    Timer_Ticker.prototype.addEventListener = function (eventName, callback) {
        var self = this;
        if(self.listeners[eventName] === undefined){
            self.listeners[eventName] = [];
        }
        if(self.listeners[eventName].indexOf(callback) === -1){
            self.listeners[eventName].push(callback);
        }
    };

    Timer_Ticker.prototype.removeEventListener = function (event, callback) {
        var self = this;
        if(self.listeners[event] !==undefined){
            var index = self.listeners[event].indexOf(callback);
            if(index !== -1){
                self.listeners[event].splice(index,1);
            }
        }
    };

    Timer_Ticker.prototype.trigger = function (eventName,args) {
        var self = this;

        if(self.listeners[eventName] !== undefined){
            var length = self.listeners[eventName].length;
            args = args || [];
            for(var i =0; i < length;i++){
                self.listeners[eventName][i].apply(self,args);
            }
        }
    };

    function tick(timer) {
        if(timer.running){
            timer.interval = w.requestAnimationFrame(function () {
                clearInterval(timer.interval);
                tick(timer);
            });
            var passed = 0;
            var current_time = new Date().getTime();
            if (timer.last_tick != null) {
                passed = current_time - timer.last_tick;
            }
            timer.currentTime += passed;
            timer.trigger('tick',[current_time,passed]);
            timer.last_tick = current_time;
        }
    }

    w.TimerTicker = Timer_Ticker;
})(window);