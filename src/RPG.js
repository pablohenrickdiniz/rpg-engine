/**
 * @requires System/Time/Timer_Ticker.js
 */
(function (w) {
    let Timer_Ticker = w.Timer_Ticker,
        Game_Timer = new Timer_Ticker(),
        debug = false,
        baseUrl = '/';

    let RPG = {
        initialize: function (u) {
            let self = this;
            self.finalize();
            Game_Timer.on('tick',tick);
            Game_Timer.run();
            self.Events.trigger('initialize',[self]);
            self.baseUrl = u;
        },
        finalize:function(){
            let self = this;
            Game_Timer.stop();
            Game_Timer.off('tick',tick);
            self.Events.trigger('finalize',[self]);
        },
        Objects:{}
    };

    function tick(){
        let currentScene = RPG.Main.currentScene;
        if (currentScene && currentScene.running) {
            currentScene.step();
            RPG.Events.trigger('sceneUpdate',[currentScene]);
        }
    }


    Object.defineProperty(RPG,'baseUrl',{
        get:function(){
            return baseUrl;
        },
        set:function(b){
            if(typeof b === 'string'){
                if(b.charAt(b.length - 1) !== '/'){
                    b += '/';
                }
                baseUrl = b;
            }
        }
    });

    Object.defineProperty(RPG,'Game_Timer',{
        /**
         *
         * @returns {w.Timer_Ticker}
         */
        get:function(){
            return Game_Timer;
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

    Object.defineProperty(w,'RPG',{
        /**
         *
         * @returns {{}}
         */
        get:function(){
            return RPG;
        }
    });
})(this);