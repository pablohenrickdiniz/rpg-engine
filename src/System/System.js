(function (root,w) {
    if(w.Keyboard == undefined){
        throw "System requires Keyboard"
    }

    if(root.Main == undefined){
        throw "System requires Main"
    }

    var Keyboard = w.Keyboard,
        Main = root.Main;

    var last_loop = null;
    var interval = null;

    var System = {
        Video:null,
        Audio:null,
        Controls:{
            Mouse:undefined,
            Keyboard:undefined
        },
        time:0,
        system_calls: [],
        running:false,
        initialize:function(container){
            var self = this;
            self.Video.initialize(container);
            self.Controls.Keyboard = new Keyboard(container);
        },
        wait: function (mss,callback) {
            var self = this;
            self.system_calls.push({
                start:System.time,
                time:mss,
                callback:callback
            });
        },
        freeze:function(){
            w.cancelAnimationFrame(interval);
            last_loop = null;
            System.running = false;
            System.Audio.systemFreeze();
        },
        resume:function(){
            System.run();
            System.Audio.systemResume();
        },
        run:function(){
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

            var self = this;
            var calls = self.system_calls;
            var length = calls.length;
            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    if((System.time - calls[i].start) >= calls[i].time){
                        calls[i].callback();
                        calls.splice(i, 1);
                        i--;
                        length--;
                    }
                }
            }

            if(Main.scene != undefined){
                Main.scene.step();
            }


            last_loop = current_time;
        }
    };

    root.System = System;
})(RPG,window);

