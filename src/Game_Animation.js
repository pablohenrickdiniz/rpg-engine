/**
 * @requires RPG.js
 * @requires Game_Graphic.js
 */
(function (root) {
    let Game_Timer = root.Game_Timer,
        Game_Graphic = root.Game_Graphic;
    /**
     * @param graphic {Game_Graphic}
     * @param options {object}
     * @constructor
     */
    let Game_Animation = function (graphic,options) {
        options = options || {};
        let self = this;
        initialize(self);
        self.fps = options.fps;
        self.stopOnEnd = options.stopOnEnd;
        self.direction = options.direction;
        self.graphic = graphic;
        self.startFrame = options.startFrame || 0;
        self.endFrame = options.endFrame || 0;
    };

    /**
     *
     * @param stopOnEnd {boolean}
     * @param direction {string}
     * @returns {Game_Animation}
     */
    Game_Animation.prototype.start = function (stopOnEnd, direction) {
        let self = this;
        if (!self.running) {
            self.running = true;
            self.startTime = Game_Timer.currentTime;
            self.stopOnEnd = stopOnEnd;
            self.direction = direction;
        }
        return self;
    };

    /**
     * @returns {Game_Animation}
     */
    Game_Animation.prototype.stop = function () {
        let self = this;
        self.running = false;
        self.index = 0;
        return self;
    };

    function initialize(self){
        let startTime = Game_Timer.currentTime;
        let endTime = startTime;
        let running = false;
        let fps = 4;
        let stopOnEnd = false;
        let direction = 'positive';
        let graphic = null;
        let startFrame = 0;
        let endFrame = 0;

        Object.defineProperty(self,'startTime',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return startTime;
            },
            /**
             *
             * @param s {number}
             */
            set:function(s){
                s = parseInt(s);
                if(!isNaN(s) && s >= 0){
                    startTime = s;
                }
            }
        });

        Object.defineProperty(self,'endTime',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return endTime;
            },
            /**
             *
             * @param e {number}
             */
            set:function(e){
                e = parseInt(e);
                if(!isNaN(e) && e >= 0){
                    endTime = e;
                }
            }
        });

        Object.defineProperty(self,'frameCount',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return endFrame-startFrame+1;
            }
        });

        Object.defineProperty(self,'fps',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return fps;
            },
            /**
             *
             * @param fs {number}
             */
            set:function(fs){
                fs = parseInt(fs);
                if(!isNaN(fs) && fs > 0){
                    fps = fs;
                }
            }
        });

        Object.defineProperty(self,'startFrame',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return startFrame;
            },
            /**
             *
             * @param sf {number}
             */
            set:function(sf){
                sf = parseInt(sf);
                if(!isNaN(sf) && sf >= 0){
                    startFrame = sf;
                }
            }
        });

        Object.defineProperty(self,'endFrame',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return endFrame;
            },
            /**
             *
             * @param ef {number}
             */
            set:function(ef){
                ef = parseInt(ef);
                if(!isNaN(ef) && ef >= 0){
                    endFrame = ef;
                }
            }
        });

        Object.defineProperty(self,'direction',{
            /**
             *
             * @returns {string}
             */
            get:function(){
                return direction;
            },
            /**
             *
             * @param d
             */
            set:function(d){
                if(/^positive|negative$/.test(d)){
                    direction = d;
                }
            }
        });

        Object.defineProperty(self,'frames',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                let diff = running?Game_Timer.currentTime - startTime:endTime - startTime;
                return diff === 0?0:Math.ceil((diff / 1000) * fps);
            }
        });

        Object.defineProperty(self,'running',{
            /**
             *
             * @returns {boolean}
             */
            get:function(){
                if (stopOnEnd && running && self.frames >= frameCount) {
                    running = false;
                }
                return running;
            },
            set:function(run){
                running = !!run;
            }
        });

        Object.defineProperty(self,'stopOnEnd',{
            /**
             *
             * @returns {boolean}
             */
            get:function(){
                return stopOnEnd;
            },
            set:function(se){
                stopOnEnd = !!se;
            }
        });

        Object.defineProperty(self,'index',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                let frames = self.frames;
                let frameCount = self.frameCount;
                if (frames < frameCount) {
                    return direction === 'negative'?endFrame-frames:startFrame+frames;
                }
                else {
                    if (stopOnEnd) {
                        return direction === 'negative'?0:endFrame;
                    }
                    let mod = frames % frameCount;
                    return direction === 'negative'?endFrame - mod:startFrame+mod;
                }
            },
            /**
             *
             * @param frame {number}
             */
            set:function(frame){
                if (self.frameCount > frame) {
                    let diff = (frame / fps) * 1000;
                    endTime = startTime + diff;
                }
            }
        });

        Object.defineProperty(self,'graphic',{
            /**
             *
             * @returns {Game_Graphic}
             */
            get:function(){
                return graphic;
            },
            /**
             *
             * @param g {Game_Graphic}
             */
            set:function(g){
                if(g instanceof Game_Graphic){
                    graphic = g;
                }
            }
        });

        Object.defineProperty(self,'currentFrame',{
            get:function(){
                return graphic.get(i,j);
            }
        });
    }

    Object.defineProperty(root,'Game_Animation',{
        /**
         *
         * @returns {Game_Animation}
         */
        get:function(){
            return Game_Animation;
        }
    });
})(RPG);