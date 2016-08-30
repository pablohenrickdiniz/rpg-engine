(function (root, w) {


    if (root.Main == undefined) {
        throw "System requires Main"
    }

    var Main = root.Main;

    var last_loop = null;
    var interval = null;

    var System = {
        Audio: null,
        time: 0,
        system_calls: [],
        step_listeners: [],
        running: false,
        fps:0,
        wait: function (mss, callback) {
            var self = this;
            self.system_calls.push({
                start: System.time,
                time: mss,
                callback: callback
            });
        },
        freeze: function () {
            w.cancelAnimationFrame(interval);
            last_loop = null;
            System.running = false;
            System.Audio.systemFreeze();
        },
        resume: function () {
            System.run();
            System.Audio.systemResume();
        },
        run: function () {
            var self = this;
            if (!self.running) {
                self.running = true;
                self.step();
            }
        },
        step: function () {
            interval = w.requestAnimationFrame(function () {
                System.step();
            });

            var passed = 0;
            var current_time = new Date().getTime();

            if (last_loop != null) {
                passed = current_time - last_loop;
            }

            System.time += passed;
            System.fps = 1/(passed/1000);
            System.execute_system_calls();
            System.execute_system_steps();
            last_loop = current_time;
        },
        execute_system_calls: function () {
            var self = this;
            var calls = self.system_calls;
            var length = calls.length;
            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    if ((System.time - calls[i].start) >= calls[i].time) {
                        calls[i].callback();
                        calls.splice(i, 1);
                        i--;
                        length--;
                    }
                }
            }
        },
        execute_system_steps: function () {
            var self = this;
            var listeners = self.step_listeners;
            var length = listeners.length;
            var i;
            for (i = 0; i < length; i++) {
                listeners[i]();
            }
            if (Main.scene != null) {
                Main.scene.step();
            }
        },
        addSteplistener: function (listener) {
            var self = this;
            if (self.step_listeners.indexOf(listener) == -1) {
                self.step_listeners.push(listener);
            }
        },
        removeStepListener: function (listener) {
            var self = this;
            var index = self.step_listeners.indexOf(listener);
            if (index != -1) {
                self.step_listeners.splice(index, 1);
            }
        }
    };

    root.System = System;
})(RPG, window);

