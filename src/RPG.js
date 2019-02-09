/**
 * @requires System/Time/Timer_Ticker.js
 */
(function (w) {
    let Timer_Ticker = w.Timer_Ticker,
        Game_Timer = new Timer_Ticker(),
        debug = false;

    let Custom = {};

    let RPG = {
        initialize: function () {
            let self = this;
            Game_Timer.off('tick',tick);
            self.Events.trigger('finalize',[self]);
            Game_Timer.on('tick',tick);
            self.Events.trigger('initialize',[self]);
        }
    };

    function tick(){
        let currentScene = RPG.Main.currentScene;
        if (currentScene) {
            currentScene.step();
            RPG.Events.trigger('sceneUpdate',[currentScene]);
        }
    }

    Object.defineProperty(RPG,'Game_Timer',{
        /**
         *
         * @returns {w.Timer_Ticker}
         */
        get:function(){
            return Game_Timer;
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