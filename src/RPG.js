'use strict';
(function (w) {
    if (!w.CE) {
        throw 'RPG requires Canvas Engine';
    }

    if (!w.Keyboard) {
        throw "RPG requires Keyboard";
    }

    if (!w.Mouse) {
        throw "RPG requires Mouse";
    }

    if (!w.Timer_Ticker) {
        throw "RPG requires Time_Ticker";
    }

    let Keyboard = w.Keyboard,
        Mouse = w.Mouse,
        Timer_Ticker = w.Timer_Ticker,
        Game_Timer = new Timer_Ticker(),
        keyboard = null,
        mouse = null,
        debug = false;

    let Controls  = {};
    let Custom = {};

    Object.defineProperty(Controls,'Keyboard',{
        /**
         *
         * @returns {Keyboard}
         */
       get:function(){
           return keyboard;
       }
    });

    Object.defineProperty(Controls,'Mouse',{
        /**
         *
         * @returns {Mouse}
         */
        get:function(){
            return mouse;
        }
    });

    let RPG = {
        Canvas: null,
        /**
         *
         * @param options {object}
         */
        initialize: function (options) {
            let self = this;
            options = options || {};
            let container = options.container;
            let ui_root = options.ui_root;

            self.UI.root = new self.UI.Element({
                id:'ui-root',
                element:ui_root
            });

            if(keyboard !== null){
                keyboard.unbind();
            }

            if(mouse !== null){
                mouse.element = container;
            }
            else{
                mouse = new Mouse(container);
            }

            keyboard = new Keyboard({
                element: ui_root,
                propagate: [Keyboard.F5, Keyboard.F11,Keyboard.F12]
            });

            self.Canvas.initialize({
                container: container,
                width: w.innerWidth,
                height: w.innerHeight
            });

            self.UI.width = w.innerWidth;
            self.UI.height = w.innerHeight;
            //    self.Game_Timer.stop();
            unbind(self);
            bind(self);
        }
    };

    Object.defineProperty(RPG,'Game_Timer',{
        /**
         *
         * @returns {Timer_Ticker}
         */
        get:function(){
            return Game_Timer;
        }
    });

    Object.defineProperty(RPG,'Controls',{
        /**
         * @returns{Controls}
         */
       get:function(){
           return Controls;
       }
    });

    Object.defineProperty(RPG,'Custom',{
        /**
         * @returns{Custom}
         */
        get:function(){
            return Custom;
        }
    });

    Object.defineProperty(RPG,'debug',{
        /**
         *
         * @returns {boolean}
         */
        get:function(){
            return debug;
        },
        /**
         *
         * @param d {boolean}
         */
        set:function(d){
            debug = !!d;
        }
    });

    /**
     *
     * @param root {RPG}
     */
    function unbind(root){
        let Canvas  = root.Canvas;
        w.removeEventListener('blur',windowblur);
        w.removeEventListener('focus',windowfocus);
        w.removeEventListener('resize',windowresize);
        Game_Timer.removeEventListener('tick',tick);
        keyboard.removeShortcutListener('P',pause);
        keyboard.removeShortcutListener('ENTER', action);
        keyboard.removeShortcutListener('PLUS',zoomin);
        keyboard.removeShortcutListener('MINUS',zoomout);
        Canvas.removeEventListener('resize',canvasresize);
    }

    /**
     *
     * @param root {RPG}
     */
    function bind(root){
        let Canvas  = root.Canvas;
        w.addEventListener('blur', windowblur);
        w.addEventListener('focus', windowfocus);
        w.addEventListener('resize',windowresize);
        Game_Timer.addEventListener('tick', tick);
        keyboard.addShortcutListener('P', pause);
        keyboard.addShortcutListener('ENTER', action);
        keyboard.addShortcutListener('PLUS',zoomin);
        keyboard.addShortcutListener('MINUS',zoomout);
        Canvas.addEventListener('resize',canvasresize);
    }

    function zoomin(){
        let Canvas = RPG.Canvas;
        Canvas.zoomIn();
    }

    function zoomout(){
        let Canvas = RPG.Canvas;
        Canvas.zoomOut();
    }

    function action(){
        let Main = RPG.Main;
        let current_scene = Main.currentScene;
        if(current_scene){
            current_scene.action = true;
        }
    }

    function pause(){
        if(Game_Timer.running){
            Game_Timer.stop();
        }
        else{
            Game_Timer.run();
        }
    }

    function canvasresize(){
        let Main = RPG.Main;
        let current_scene = Main.currentScene;
        if(current_scene){
            current_scene.bg_refreshed = false;
        }
    }

    function windowresize(){
        let Canvas = RPG.Canvas;
        let UI = RPG.UI;
        Canvas.height = w.innerHeight;
        Canvas.width = w.innerWidth;
        UI.height = w.innerHeight;
        UI.width = w.innerWidth;
    }

    function tick(){
        let Main = RPG.Main;
        let current_scene = Main.currentScene;
        if (current_scene) {
            current_scene.step();
        }
    }

    function windowblur(){
        Game_Timer.stop();
    }

    function windowfocus(){
        Game_Timer.run();
    }

    Object.defineProperty(w,'RPG',{
        /**
         *
         * @returns {RPG}
         */
       get:function(){
           return RPG;
       }
    });
})(window);