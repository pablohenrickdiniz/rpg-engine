'use strict';
(function(root){
    if(root.Main === undefined){
        throw "Events requires RPG Main";
    }

    let Main = root.Main;
    let listeners = [];
    let Events = {
        /**
         *
         * @param event
         * @param callback
         * @returns {{on: function(*, *=), off: off, emmit: emmit}}
         */
        on:function(event,callback){
            if(typeof callback === 'function'){
                if(listeners[event] === undefined){
                    listeners[event] = [];
                }
                if(listeners.indexOf(callback) === -1){
                    listeners[event].push(callback);
                }
            }
            return Events;
        },
        /**
         *
         * @param event
         * @param callback
         */
        off:function(event,callback){
            if(listeners[event] !== undefined){
                if(typeof callback === 'function'){
                    let index = listeners[event].indexOf(callback);
                    if(index !== -1){
                        listeners[event].splice(index,1);
                    }
                    if(listeners[event].length === 0){
                        delete listeners[event];
                    }
                }
                else{
                    delete listeners[event];
                }
            }
        },
        /**
         *
         * @param event
         * @param args
         */
        emmit:function(event,args){
            if(listeners[event] !== undefined){
                for(let i = 0;i < listeners[event].length;i++){
                    listeners[event][i].apply(null,args);
                }
            }
        }
    };

    Object.defineProperty(Main,'Events',{
        /**
         *
         * @returns {{on: function(*, *=), off: off, emmit: emmit}}
         */
       get:function(){
           return Events;
       }
    });
})(RPG);