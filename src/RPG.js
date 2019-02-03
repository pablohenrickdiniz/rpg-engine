/**
 * @requires System/Time/Timer_Ticker.js
 * @requires ../plugins/canvas-engine/src/dist/js/CanvasEngine.js
 * @requires ../plugins/Keyboard/src/keyboard.js
 * @requires ../plugins/Mouse/src/mouse.js
 * @requires ../plugins/math-lib/src/Math.js
 */
(function (w) {
    let Keyboard = w.Keyboard,
        Mouse = w.Mouse,
        Timer_Ticker = w.Timer_Ticker,
        Game_Timer = new Timer_Ticker(),
        keyboard = null,
        mouse = null,
        debug = false;

    let Custom = {};
    
    let RPG = {
        Canvas: null,
        /**
         *
         * @param elementId
         */
        initialize: function (elementId) {
            let self = this;
            let element = document.getElementById(elementId);
            while(element.children.length > 0){
                element.removeChild(element.firstChild);
            }

            let container = document.createElement('div');
            let ui = document.createElement('div');

            container.setAttribute('class','game-container');
            ui.setAttribute('class','game-ui');

            element.appendChild(container);
            element.appendChild(ui);

            self.Events.trigger('uiCreate',[ui]);

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
                element: ui,
                propagate: [Keyboard.F5, Keyboard.F11,Keyboard.F12]
            });

            self.Canvas.initialize({
                container: container,
                width: w.innerWidth,
                height: w.innerHeight
            });

            //    self.Game_Timer.stop();
            unbind(self);
            bind(self);
        }
    };

    Object.defineProperty(RPG,'Game_Timer',{
        /**
         *
         * @returns {w.Timer_Ticker}
         */
        get:function(){
            return Game_Timer;
        }
    });


    Object.defineProperty(RPG,'Keyboard',{
        /**
         *
         * @returns {Keyboard}
         */
        get:function(){
            return keyboard;
        }
    });

    Object.defineProperty(RPG,'Mouse',{
        /**
         *
         * @returns {Mouse}
         */
        get:function(){
            return mouse;
        }
    });

    Object.defineProperty(RPG,'Custom',{
        /**
         * @returns{{}}
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
        Game_Timer.off('tick',tick);
        Canvas.removeEventListener('resize',canvasresize);
        root.Events.trigger('keyboardDestroy',[keyboard]);
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
        Game_Timer.on('tick', tick);
        Canvas.on('resize',canvasresize);
        root.Events.trigger('keyboardCreate',[keyboard]);
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
        Canvas.height = w.innerHeight;
        Canvas.width = w.innerWidth;
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
         * @returns {{}}
         */
       get:function(){
           return RPG;
       }
    });
})(window);