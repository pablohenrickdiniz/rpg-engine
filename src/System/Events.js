'use strict';
(function(root){
    let listeners = [];
    let Events = {
        /**
         *
         * @param eventName{string}
         * @param callback{function}
         * @returns {Events}
         */
        on:function(eventName,callback){
            if(typeof callback === 'function'){
                if(listeners[eventName] === undefined){
                    listeners[eventName] = [];
                }
                if(listeners.indexOf(callback) === -1){
                    listeners[eventName].push(callback);
                }
            }
            return Events;
        },
        /**
         *
         * @param eventName{string}
         * @param callback{function}
         */
        off:function(eventName,callback){
            if(listeners[eventName] !== undefined){
                if(typeof callback === 'function'){
                    let index = listeners[eventName].indexOf(callback);
                    if(index !== -1){
                        listeners[eventName].splice(index,1);
                    }
                    if(listeners[eventName].length === 0){
                        delete listeners[eventName];
                    }
                }
                else{
                    delete listeners[eventName];
                }
            }
        },
        /**
         *
         * @param eventName{string}
         * @param args{Array}
         */
        trigger:function(eventName, args){
            if(listeners[eventName] !== undefined){
                for(let i = 0;i < listeners[eventName].length;i++){
                    listeners[eventName][i].apply(null,args);
                }
            }
        }
    };

    Object.defineProperty(root,'Events',{
        /**
         *
         * @returns {Events}
         */
       get:function(){
           return Events;
       }
    });
})(RPG);