'use strict';
(function (w) {
    /*Canvas Engine*/
    if (w.CE === undefined) {
        throw 'RPG requires Canvas Engine';
    }

    /*Keyboard*/
    if (w.Keyboard === undefined) {
        throw "RPG requires Keyboard";
    }

    /*Mouse*/
    if (w.Mouse === undefined) {
        throw "RPG requires Mouse";
    }

    /*TimeTicker*/
    if (w.TimerTicker === undefined) {
        throw "RPG requires TimeTicker";
    }

    if(w.Matter === undefined){
        throw "RPG requires Matter";
    }

    let Keyboard = w.Keyboard,
        Mouse = w.Mouse,
        TimerTicker = w.TimerTicker,
        Matter = w.Matter,
       
        Render = Matter.Render;


    w.RPG = {
        Game_Timer: new TimerTicker(),
        Canvas: null,
        Render: null,
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
            let self = this;
            options = options || {};
            let container = options.container;
            let ui_root = options.ui_root;

            self.UI.root = new self.UI.classes.Element({
                id:'ui-root',
                element:ui_root
            });

            if(self.Controls.Keyboard instanceof Keyboard){
                self.Controls.Keyboard.unbind();
            }

            if(self.Controls.Mouse instanceof Mouse){
               self.Controls.Mouse.element = container;
            }
            else{
                self.Controls.Mouse = new Mouse(container);
            }

            self.Controls.Keyboard = new Keyboard({
                element: ui_root,
                propagate: [Keyboard.F5, Keyboard.F11,Keyboard.F12]
            });

            self.Canvas.initialize({
                container: container,
                width: w.innerWidth,
                height: w.innerHeight
            });

            // self.Render = Render.create({
            //     element:container,
            //     engine:self.engine
            // });

            self.UI.width = w.innerWidth;
            self.UI.height = w.innerHeight;
        //    self.Game_Timer.stop();
            unbind(self);
            bind(self);
        }
    };

    /**
     *
     * @param root
     */
    function unbind(root){
        let Game_Timer = root.Game_Timer,
            Keyboard = root.Controls.Keyboard,
            Canvas  = root.Canvas;

        /*unbind*/
        w.removeEventListener('blur',windowblur);
        w.removeEventListener('focus',windowfocus);
        w.removeEventListener('resize',windowresize);
        Game_Timer.removeEventListener('tick',tick);
        Keyboard.removeShortcutListener('P',pausegame);
        Keyboard.removeShortcutListener('ENTER', actionbutton);
        Keyboard.removeShortcutListener('PLUS',zoomin);
        Keyboard.removeShortcutListener('MINUS',zoomout);
       Canvas.removeEventListener('resize',canvasresize);

    }

    /**
     *
     * @param root
     */
    function bind(root){
        let Game_Timer = root.Game_Timer,
            Keyboard = root.Controls.Keyboard,
            Canvas  = root.Canvas;

        /*bind*/
        w.addEventListener('blur', windowblur);
        w.addEventListener('focus', windowfocus);
        w.addEventListener('resize',windowresize);
        Game_Timer.addEventListener('tick', tick);
        Keyboard.addShortcutListener('P', pausegame);
        Keyboard.addShortcutListener('ENTER', actionbutton);
        Keyboard.addShortcutListener('PLUS',zoomin);
        Keyboard.addShortcutListener('MINUS',zoomout);
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

    function actionbutton(){
        let Main = RPG.Main;
        let current_scene = Main.currentScene;
        if(current_scene){
            current_scene.action_button = true;
        }
    }

    function pausegame(){
        let Game_Timer = RPG.Game_Timer;
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
        RPG.Game_Timer.stop();
    }

    function windowfocus(){
        RPG.Game_Timer.run();
    }

})(window);