(function (w) {
    /*Canvas Engine*/
    if (w.CE == undefined) {
        throw 'RPG requires Canvas Engine'
    }

    /*Keyboard*/
    if (w.Keyboard == undefined) {
        throw "RPG requires Keyboard"
    }

    /*Mouse*/
    if (w.Mouse == undefined) {
        throw "RPG requires Mouse"
    }

    /*TimeTicker*/
    if (w.TimerTicker == undefined) {
        throw "RPG requires TimeTicker"
    }


    var Keyboard = w.Keyboard,
        Mouse = w.Mouse,
        TimerTicker = w.TimerTicker;

    w.RPG = {
        Game_Timer: new TimerTicker(),
        Canvas: null,
        Controls: {
            Keyboard: null,
            Mouse: null
        },
        debug:false,
        /**
         *
         * @param options
         */
        initialize: function (options) {
            var self = this;
            options = options || {};
            var container = options.container;
            var ui_root = options.ui_root;

            var root = new self.UI.classes.Element({
                id:'ui-root',
                element:ui_root
            });

            self.Controls.Keyboard = new Keyboard({
                element: ui_root,
                propagate: [Keyboard.F5, Keyboard.F11,Keyboard.F12]
            });
            self.Controls.Mouse = new Mouse(container);

            self.Canvas.initialize({
                container: container,
                width: w.innerWidth,
                height: w.innerHeight
            });

            self.UI.root = root;
            self.UI.width = w.innerWidth;
            self.UI.height = w.innerHeight;
            registerEvents(self,w);
        }
    };


    function registerEvents(root,w){
        var Game_Timer = root.Game_Timer,
            Keyboard = root.Controls.Keyboard,
            Canvas = root.Canvas,
            Main = root.Main,
            UI = root.UI;


        w.addEventListener('blur', function () {
            Game_Timer.stop();
        });
        w.addEventListener('focus', function () {
            Game_Timer.run();
        });

        Game_Timer.addEventListener('tick', function () {
            var current_scene = Main.currentScene;
            if (current_scene) {
                current_scene.step();
            }
        });

        Keyboard.addShortcutListener('P', function () {
            if(Game_Timer.running){
                Game_Timer.stop();
            }
            else{
                Game_Timer.run();
            }
        });

        Keyboard.addShortcutListener('ENTER', function () {
            var current_scene = Main.currentScene;
            if(current_scene){
                current_scene.action_button = true;
            }
        });

        Canvas.addEventListener('resize', function () {
            var current_scene = Main.currentScene;
            if(current_scene){
                current_scene.bg_refreshed = false;
            }
        });

        w.addEventListener('resize', function () {
            Canvas.height = w.innerHeight;
            Canvas.width = w.innerWidth;
            UI.height = w.innerHeight;
            UI.width = w.innerWidth;
        });
    }
})(window);