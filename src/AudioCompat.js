'use strict';
(function (w) {
    if (w.Audio === undefined) {
        (function (w) {
            let context = new (w.AudioContext || w.webkitAudioContext)();
            /**
             *
             * @param url
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
                     * @param newSrc
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
                     * @param newTime
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
            };

            Audio.prototype.pause = function () {
                let self = this;
                if (!self.paused) {
                    self.paused = true;
                    self.source.stop();
                    self.currentTime = (new Date()).getTime() - self.time_start;
                }
            };
            /**
             *
             * @param event
             * @param callback
             */
            Audio.prototype.addEventListener = function (event, callback) {
                let self = this;
                if (self.listeners[event] === undefined) {
                    self.listeners[event] = [];
                }
                self.listeners[event].push(callback);
            };
            /**
             *
             * @param event
             * @param callback
             */
            Audio.prototype.removeEventListener = function (event, callback) {
                let self = this;
                if (self.listeners[event] !== undefined) {
                    let index = self.listeners[event].indexOf(callback);
                    if (index !== -1) {
                        self.listeners[event].splice(index, 1);
                    }
                }
            };
            /**
             *
             * @param event
             */
            Audio.prototype.trigger = function (event) {
                let self = this;
                if (self.listeners[event] !== undefined) {
                    let i;
                    for (i = 0; i < self.listeners[event].length; i++) {
                        self.listeners[event][i].apply(self);
                    }
                }
            };

            w.Audio = Audio;
        })(w);
    }
    else {
        if (w.Audio.prototype.stop === undefined) {
            w.Audio.prototype.stop = function () {
                let self = this;
                self.pause();
                self.currentTime = 0;
            };
        }
    }
})(window);