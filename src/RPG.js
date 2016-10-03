(function (w) {
    if (w.CE == undefined) {
        throw 'RPG requires Canvas Engine'
    }

    if (w.Keyboard == undefined) {
        throw "RPG requires Keyboard"
    }

    if(w.Mouse == undefined){
        throw "RPG requires Mouse"
    }

    if(w.TimerTicker == undefined){
        throw "RPG requires TimeTicker"
    }


    var Keyboard = w.Keyboard,
        Mouse = w.Mouse,
        TimerTicker = w.TimerTicker;

    w.RPG = {
        Main:{
            Player:null
        },
        Game_Timer:new TimerTicker(),
        Resources:{},
        Canvas:null,
        Controls:{
            Keyboard:null,
            Mouse:null
        },
        debug:true,
        /**
         *
         * @param container
         */
        initialize: function (options) {
            var self = this;
            options = options || {};
            var container = options.container;
            self.Controls.Keyboard = new Keyboard(container);
            self.Controls.Mouse = new Mouse(container);
            self.Canvas.initialize(container);
            self.Main.Player = options.player || new RPG.Game_Player();
            self.registerEvents();
        },
        registerEvents:function(){
            var self = this;
            w.addEventListener('blur',function(){
                self.Game_Timer.stop();
            });
            w.addEventListener('focus',function(){
                self.Game_Timer.run();
            });

            self.Game_Timer.addEventListener('tick',function(){
                if(self.Main.scene != null){
                    self.Main.scene.step();
                }
            });

            self.Controls.Keyboard.addShortcutListener('ENTER',function(){
                self.Main.scene.action_button = true;
            })
        }
    };
})(window);