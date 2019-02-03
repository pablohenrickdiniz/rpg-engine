(function (w) {
    if (!w.Audio) {
        (function (w) {
            let context = new (w.AudioContext || w.webkitAudioContext)();
            /**
             *
             * @param url {string}
             */
            let load_audio = function (url) {
                let self = this;
                let request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'arraybuffer';
                request.onload = function () {
                    context.decodeAudioData(request.response, function (buffer) {
                        self.buffer = buffer;
                        self.trigger('load');
                    });
                };

                request.send();
            };

            /**
             *
             * @constructor
             */
            let Audio = function () {
                let self = this;
                let src = '';
                self.listeners = [];
                self.buffer = null;
                self.source = null;
                self.paused = true;
                self.timeStart = null;
                let currentTime = 0;

                Object.defineProperty(self, 'src', {
                    /**
                     *
                     * @param newSrc {string}
                     */
                    set: function (newSrc) {
                        if (src !== newSrc) {
                            src = newSrc;
                            load_audio.apply(self, [src]);
                        }
                    },
                    /**
                     *
                     * @returns {string}
                     */
                    get: function () {
                        return src;
                    }
                });

                Object.defineProperty(self, 'currentTime', {
                    /**
                     *
                     * @param newTime {number}
                     */
                    set: function (newTime) {
                        currentTime = newTime;
                    },
                    /**
                     *
                     * @returns {number}
                     */
                    get: function () {
                        return self.paused ? currentTime : (new Date()).getTime() - self.time_start;
                    }
                });
            };

            /**
             *
             * @returns {Audio}
             */
            Audio.prototype.play = function () {
                let self = this;
                if (self.paused && self.buffer != null) {
                    if (self.time_start == null) {
                        self.time_start = (new Date()).getTime();
                    }
                    else {
                        self.time_start = (new Date()).getTime() - self.currentTime;
                    }

                    let source = context.createBufferSource();
                    source.buffer = self.buffer;
                    source.connect(context.destination);
                    source.start(0, self.currentTime / 1000);
                    self.source = source;
                    self.paused = false;
                }
                return self;
            };

            /**
             *
             * @returns {Audio}
             */
            Audio.prototype.pause = function () {
                let self = this;
                if (!self.paused) {
                    self.paused = true;
                    self.source.stop();
                    self.currentTime = (new Date()).getTime() - self.time_start;
                }

                return self;
            };
            /**
             *
             * @param eventName {string}
             * @param callback {function}
             * @returns {Audio}
             */
            Audio.prototype.on = function (eventName, callback) {
                let self = this;
                if (self.listeners[eventName] === undefined) {
                    self.listeners[eventName] = [];
                }
                self.listeners[eventName].push(callback);
                return self;
            };
            /**
             *
             * @param eventName {string}
             * @param callback {function}
             * @returns {Audio}
             */
            Audio.prototype.removeEventListener = function (eventName, callback) {
                let self = this;
                if (self.listeners[eventName] !== undefined) {
                    let index = self.listeners[eventName].indexOf(callback);
                    if (index !== -1) {
                        self.listeners[eventName].splice(index, 1);
                    }
                }
                return self;
            };

            /**
             *
             * @param eventName {string}
             * @param args {Array}
             * @returns {Audio}
             */
            Audio.prototype.trigger = function (eventName,args) {
                let self = this;
                if (self.listeners[eventName] !== undefined) {
                    let i;
                    for (i = 0; i < self.listeners[eventName].length; i++) {
                        self.listeners[eventName][i].apply(self,args);
                    }
                }
                return self;
            };

            Object.defineProperty(w,'Audio',{
                /**
                 *
                 * @returns {Audio}
                 */
                get:function(){
                    return Audio;
                }
            });
        })(w);
    }
    else {
        if (!w.Audio.prototype.stop) {
            /**
             *
             * @returns {w.Audio}
             */
            w.Audio.prototype.stop = function () {
                let self = this;
                self.pause();
                self.currentTime = 0;
                return self;
            };
        }
    }
})(window);