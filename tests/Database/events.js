(function(root,w){
    let Canvas = w.Canvas,
        Game_Timer = root.Game_Timer,
        Main = root.Main,
        Keyboard = w.Keyboard;

    function action(){
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

    function windowresize(){
        Canvas.height = w.innerHeight;
        Canvas.width = w.innerWidth;
    }

    let keyboard = null;

    function tick(){
        let currentPlayer = Main.currentPlayer;
        if(currentPlayer){
            if(keyboard){
                if (keyboard.state[Keyboard.LEFT]) {
                    currentPlayer.stepLeft();
                }
                else if (keyboard.state[Keyboard.RIGHT]) {
                    currentPlayer.stepRight();
                }
                else if (keyboard.state[Keyboard.DOWN]) {
                    currentPlayer.stepDown();
                }
                else if (keyboard.state[Keyboard.UP]) {
                    currentPlayer.stepUp();
                }
                else{
                    currentPlayer.stop();
                }
            }
        }
    }

    function windowblur(){
        Game_Timer.stop();
    }

    function windowfocus(){
        Game_Timer.run();
    }

    root.Events.on('initialize',function(){
        let element = document.getElementById('ui-root');
        keyboard = new Keyboard({
            element: element,
            propagate: [Keyboard.F5, Keyboard.F11,Keyboard.F12]
        });
        keyboard.on('state,P,active', pause);
        keyboard.on('state,ENTER,active', action);
        keyboard.on('state,PLUS,active',Canvas.zoomIn);
        keyboard.on('state,MINUS,active',Canvas.zoomOut);
        root.Events.trigger('keyboardCreate',[keyboard]);
        w.addEventListener('blur', windowblur);
        w.addEventListener('focus', windowfocus);
        w.addEventListener('resize',windowresize);
        Game_Timer.on('tick', tick);
    });

    root.Events.on('finalize',function(){
        if(keyboard != null){
            keyboard.off('state,P,active',pause);
            keyboard.off('state,ENTER,active', action);
            keyboard.off('state,PLUS,active',Canvas.zoomIn);
            keyboard.off('state,MINUS,active',Canvas.zoomOut);
            keyboard.unbind();
            root.Events.trigger('keyboardDestroy',[keyboard]);
        }
        w.removeEventListener('blur',windowblur);
        w.removeEventListener('focus',windowfocus);
        w.removeEventListener('resize',windowresize);
        Game_Timer.off('tick',tick);
    });
})(RPG,window);