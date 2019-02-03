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
        self.id = null;
        self.last_tick = null;
        self.running = false;
        self.listeners = [];
    };

    /**
     *
     * @returns {Timer_Ticker}
     */
    Timer_Ticker.prototype.run = function () {
        let self = this;
        if (!self.running) {
            self.running = true;
            self.trigger('start');
            tick(self);
        }
        return self;
    };

    /**
     *
     * @returns {Timer_Ticker}
     */
    Timer_Ticker.prototype.stop = function () {
        let self = this;
        w.cancelAnimationFrame(self.id);
        self.last_tick = null;
        self.running = false;
        self.trigger('stop',[]);
        return self;
    };
    /**
     *
     * @param eventName{string}
     * @param callback{function}
     * @returns{Timer_Ticker}
     */
    Timer_Ticker.prototype.on = function (eventName, callback) {
        let self = this;
        if(self.listeners[eventName] === undefined){
            self.listeners[eventName] = [];
        }
        if(self.listeners[eventName].indexOf(callback) === -1){
            self.listeners[eventName].push(callback);
        }
        return self;
    };
    /**
     *
     * @param eventName{string}
     * @param callback{function}
     * @returns{Timer_Ticker}
     */
    Timer_Ticker.prototype.off = function (eventName, callback) {
        let self = this;
        if(self.listeners[eventName] !==undefined){
            let index = self.listeners[eventName].indexOf(callback);
            if(index !== -1){
                self.listeners[eventName].splice(index,1);
            }
        }
        return self;
    };
    /**
     *
     * @param eventName{string}
     * @param args{Array}
     * @returns{Timer_Ticker}
     */
    Timer_Ticker.prototype.trigger = function (eventName,args) {
        let self = this;
        if(self.listeners[eventName] !== undefined){
            let length = self.listeners[eventName].length;
            args = args || [];
            for(let i = 0; i < length;i++){
                self.listeners[eventName][i].apply(self,args);
            }
        }
        return self;
    };

    /**
     *
     * @param callback {function}
     * @param time {number}
     * @returns {Function}
     */
    Timer_Ticker.prototype.timeout = function(callback,time){
        let self = this;
        let endTime = self.currentTime+time;
        let call = function(){
            if(self.currentTime >= endTime){
                callback.apply(self);
                self.off('tick',call);
            }
        };
        self.on('tick',call);
        return call;
    };

    /**
     *
     * @param callback {function}
     * @param time {number}
     * @returns {Function}
     */
    Timer_Ticker.prototype.interval = function(callback,time){
        let self = this;
        let endTime = self.currentTime+time;
        let call = function(){
            if(self.currentTime >= endTime){
                while(endTime <= self.currentTime){
                    callback.apply(self);
                    endTime += time;
                }
            }
        };
        self.on('tick',call);
        return call;
    };

    /**
     *
     * @param timer{Timer_Ticker}
     */
    function tick(timer) {
        if(timer.running){
            timer.id = w.requestAnimationFrame(function () {
                clearInterval(timer.id);
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

    Object.defineProperty(w,'Timer_Ticker',{
        /**
         *
         * @returns {Timer_Ticker}
         */
        get:function(){
            return Timer_Ticker;
        }
    });
})(window);