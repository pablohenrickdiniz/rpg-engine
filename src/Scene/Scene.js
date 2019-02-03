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
        self.filters = options.filters || false;
        self.listeners = [];

        if(typeof options.start === 'function'){
            self.on('start',options.start);
        }

        if(typeof options.beforeload === 'function'){
            self.on('beforeload',options.beforeload);
        }

        if(typeof options.afterload === 'function'){
            self.on('afterload',options.afterload);
        }

        if(typeof options.audioprogress === 'function'){
            self.on('audioprogress',options.audioprogress);
        }

        if(typeof options.graphicprogress === 'function'){
            self.on('graphicprogress',options.graphicprogress);
        }

        if(typeof options.onprogress === 'function'){
            self.on('progress',options.onprogress);
        }
    };

    Scene.prototype.addFilter = function(filter){
        let self = this;
        if(typeof filter == 'function' && self.filters.indexOf(filter) === -1) {
            self.filters.push(filter);
        }
        return self;
    };

    Scene.prototype.removeFilter = function(filter){
        let self = this;
        let index = self.filters.indexOf(filter);
        if(index !== -1){
            self.filters.splice(index,1);
        }
        return self;
    };

    /**
     *
     * @param eventName {string}
     * @param args {Array}
     * @returns {Scene}
     */
    Scene.prototype.trigger = function(eventName,args){
        let self = this;
        if(self.listeners[eventName] !== undefined){
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
        if(typeof callback === 'function'){
            if(self.listeners[eventName] === undefined){
                self.listeners[eventName] = [];
            }
            if(self.listeners[eventName].indexOf(callback) === -1){
                self.listeners[eventName].push(callback);
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
    Scene.prototype.off = function(eventName,callback){
        let self = this;
        if(self.listeners[eventName] !== undefined){
            let index =self.listeners[eventName].indexOf(callback);
            if(index !== -1){
                self.listeners[eventName].splice(index,1);
            }
        }
        return self;
    };

    Scene.prototype.step = function(){
        let self = this;
        filters(self);
    };

    /**
     *
     * @param self
     */
    function filters(self){
        for(let i = 0; i < self.filters.length;i++){
            self.filters[i].apply(self);
        }
    }

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