(function (root,w) {
    var last_loop = null;
    var interval = null;

    var System = {
        Video:null,
        Audio:null,
        Graphic:null,
        time:0,
        wait_calls: [],
        running:false,
        initialize:function(container){
            var self = this;
            self.Video.initialize(container);
        },
        wait: function (mss, callback) {
            var self = this;
            self.wait_calls.push([mss, callback]);
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
            var calls = self.wait_calls;
            if (calls.length > 0) {
                for (var i = 0; i < calls.length; i++) {
                    calls[i][0] -= passed;
                    if (calls[i][0] <= 0) {
                        calls[i][1]();
                        calls.splice(i, 1);
                        i--;
                    }
                }
            }

            var scene = root.Game.current_scene;

            if (scene instanceof SceneMap) {
                root.stepPlayer();
                root.stepEvents();
                System.Video.stepFocus();
                System.Video.refreshBG(scene);

                var clear_areas = root.prepareClearAreas();
                var graphics = root.prepareDrawGraphics();

                System.Video.clearAreas(clear_areas);
                System.Video.drawGraphics(graphics);
            }

            System.Video.stepAnimations();
            last_loop = current_time;
        }
    };

    root.System = System;
})(RPG,window);