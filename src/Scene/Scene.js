/**
 * @requires ../RPG.js
 */
(function (root) {
    /**
     *
     * @param options {object}
     * @constructor
     */
    let Scene =  function (options) {
        let self = this;
        options = options || {};
        self.audios = options.audios || {};
        self.graphics = options.graphics || {};
        self.fps = options.fps || 60;
        self.listeners = [];
        self.running = false;
        self.name = options.name;

        if(options.start){
            self.on('start',options.start);
        }

        if(options.beforeload){
            self.on('beforeload',options.beforeload);
        }

        if(options.afterload){
            self.on('afterload',options.afterload);
        }

        if(options.audioprogress){
            self.on('audioprogress',options.audioprogress);
        }

        if(options.graphicprogress){
            self.on('graphicprogress',options.graphicprogress);
        }

        if(options.onprogress){
            self.on('progress',options.onprogress);
        }
    };
    /**
     *
     * @param eventName {string}
     * @param args {Array}
     * @returns {Scene}
     */
    Scene.prototype.trigger = function(eventName,args){
        let self = this;
        if(self.listeners[eventName]){
            let length = self.listeners[eventName].length;
            for(let i = 0; i < length;i++){
                self.listeners[eventName][i].apply(self,args);
            }
        }
        return self;
    };

    /**
     *
     * @param eventName {string}
     * @param callback {function}
     * @returns {Scene}
     */
    Scene.prototype.on = function(eventName,callback){
        let self = this;

        if(!self.listeners[eventName]){
            self.listeners[eventName] = [];
        }
        if(self.listeners[eventName].indexOf(callback) === -1){
            self.listeners[eventName].push(callback);
        }

        return self;
    };

    /**
     *
     * @param eventName {string}
     * @param callback {function}
     * @returns {Scene}
     */
    Scene.prototype.off = function(eventName,callback){
        let self = this;
        if(self.listeners[eventName]){
            let index =self.listeners[eventName].indexOf(callback);
            if(index !== -1){
                self.listeners[eventName].splice(index,1);
            }
        }
        else{
            self.listeners = [];
        }
        return self;
    };

    Scene.prototype.step = function(){};

    Object.defineProperty(root,'Scene',{
        /**
         *
         * @returns {Scene}
         */
        get:function(){
            return Scene;
        }
    });
})(RPG);