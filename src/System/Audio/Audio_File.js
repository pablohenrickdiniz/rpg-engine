/**
 * @requires ../../RPG.js
 */
(function(root){
    if(!root.Game_Timer){
        throw "Audio_File requires Game_Timer"
    }

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Audio_File = function(options){
        options = options || {};
        let self  =this;
        initialize(self);
        self.name = options.name || '';
        self.type = options.type;
        self.src = options.src;
        self.volume = options.volume || 1;
        self.loop = options.loop || false;
    };

    /**
     *
     * @returns {Audio_File}
     */
    Audio_File.prototype.play = function(){
        let self = this;
        if(!self.playing){
            self.audio.play();
        }
        return self;
    };

    /**
     *
     * @returns {Audio_File}
     */
    Audio_File.prototype.pause = function(){
        let self = this;
        if(self.playing){
            self.audio.pause();
        }
        return self;
    };

    /**
     *
     * @returns {Audio_File}
     */
    Audio_File.prototype.stop = function(){
        let self = this;
        self.audio.pause();
        self.audio.currentTime = 0;
        return self;
    };

    /**
     *
     * @param self {Audio_File}
     */
    function initialize(self){
        let audio = null;
        let aux_aud = new Audio();
        let loop = false;
        let timeupdate = function(){
            if(loop){
                if(audio.currentTime+audio.playbackRate > audio.duration){
                    audio.removeEventListener('timeupdate',timeupdate);
                    let tmp = audio;
                    audio = aux_aud;
                    aux_aud = tmp;
                    audio.addEventListener('timeupdate',timeupdate);
                    audio.currentTime = 0;
                    audio.play();
                }
                else if(aux_aud.playing){
                    aux_aud.pause();
                }
            }
        };

        Object.defineProperty(self,'src',{
            /**
             *
             * @returns {string}
             */
            get:function(){
                return self.audio.src;
            },
            /**
             *
             * @param src {string}
             */
            set:function(src){
                self.audio.src = src;
                aux_aud.src = src;
            }
        });

        Object.defineProperty(self,'volume',{
            /**
             *
             * @returns {string}
             */
            get:function(){
                return self.audio.volume;
            },
            /**
             *
             * @param volume {number}
             */
            set:function(volume){
                volume  = parseFloat(volume);
                if(!isNaN(volume) && volume <= 1 && volume >= 0){
                    self.audio.volume = volume;
                    aux_aud.volume = volume;
                }
            }
        });

        Object.defineProperty(self,'audio',{
            /**
             *
             * @returns {Audio}
             */
            get:function(){
                if(audio == null){
                    audio = new Audio();
                    audio.addEventListener('timeupdate',timeupdate);
                }
                return audio;
            }
        });

        Object.defineProperty(self,'loop',{
            /**
             *
             * @returns {boolean}
             */
            get:function(){
                return loop;
            },
            /**
             *
             * @param l {boolean}
             */
            set:function(l){
                loop = !!l;
            }
        });

        Object.defineProperty(self,'playing',{
            /**
             * @returns {boolean}
             */
            get:function(){
                return self.audio.playing;
            }
        });
    }

    Object.defineProperty(root,'Audio_File',{
        /**
         *
         * @returns {Audio_File}
         */
       get:function(){
           return Audio_File;
       }
    });
})(RPG);