/**
 * @requires ../RPG.js
 */
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
            if(!listeners[eventName]){
                listeners[eventName] = [];
            }
            if(listeners.indexOf(callback) === -1){
                listeners[eventName].push(callback);
            }
            return Events;
        },
        /**
         *
         * @param eventName{string}
         * @param callback{function}
         */
        off:function(eventName,callback){
            if(listeners[eventName]){
                if(callback){
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
            if(listeners[eventName]){
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