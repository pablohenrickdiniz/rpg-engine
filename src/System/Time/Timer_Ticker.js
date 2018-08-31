'use strict';
(function (w) {
    /**
     *
     * @param options
     * @constructor
     */
    let Timer_Ticker = function (options) {
        let self = this;
        options = options || {};
        self.fps = options.fps || 60;
        self.currentTime = 0;
        self.interval = null;
        self.last_tick = null;
        self.running = false;
        self.listeners = [];
    };

    Timer_Ticker.prototype.run = function () {
        let self = this;
        if (!self.running) {
            self.running = true;
            self.trigger('start');
            tick(self);
        }
    };

    Timer_Ticker.prototype.stop = function () {
        let self = this;
        w.cancelAnimationFrame(self.interval);
        self.last_tick = null;
        self.running = false;
        self.trigger('stop');
    };
    /**
     *
     * @param eventName
     * @param callback
     */
    Timer_Ticker.prototype.addEventListener = function (eventName, callback) {
        let self = this;
        if(self.listeners[eventName] === undefined){
            self.listeners[eventName] = [];
        }
        if(self.listeners[eventName].indexOf(callback) === -1){
            self.listeners[eventName].push(callback);
        }
    };
    /**
     *
     * @param event
     * @param callback
     */
    Timer_Ticker.prototype.removeEventListener = function (event, callback) {
        let self = this;
        if(self.listeners[event] !==undefined){
            let index = self.listeners[event].indexOf(callback);
            if(index !== -1){
                self.listeners[event].splice(index,1);
            }
        }
    };
    /**
     *
     * @param eventName
     * @param args
     */
    Timer_Ticker.prototype.trigger = function (eventName,args) {
        let self = this;

        if(self.listeners[eventName] !== undefined){
            let length = self.listeners[eventName].length;
            args = args || [];
            for(var i =0; i < length;i++){
                self.listeners[eventName][i].apply(self,args);
            }
        }
    };

    /**
     *
     * @param timer
     */
    function tick(timer) {
        if(timer.running){
            timer.interval = w.requestAnimationFrame(function () {
                clearInterval(timer.interval);
                tick(timer);
            });
            let passed = 0;
            let current_time = new Date().getTime();
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