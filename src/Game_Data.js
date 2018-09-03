'use strict';
(function (root) {
    if(root.Game_Item === undefined){
        throw "Game_Data requires Game_Item";
    }

    if(root.Game_Character === undefined){
        throw "Game_Data requires Game_Character";
    }

    if(root.Game_Actor === undefined){
        throw "Game_Data requires Game_Actor";
    }

    let database = {
        actors: {},
        characters: {},
        items: {}
    };

    let Game_Data = {
        /**
         *
         * @param url
         * @param callback
         */
        load: function (url, callback) {
            let req = new XMLHttpRequest();
            req.onload = function () {
                let data = request.response;
                for (var key in data) {
                    if (database[key]) {
                        database[key] = data[key];
                    }
                }
                callback();
            };
            req.onerror = function () {
            };
            req.open("GET", url, true);
            req.responseType = "json";
            req.send();
        },
        createInstance:function(type,options){
            switch(type){

            }
        }
    };

    Object.defineProperty(root,'Game_Data',{
        /**
         *
         * @returns {{load: load, createInstance: createInstance}}
         */
       get:function(){
           return Game_Data;
       }
    });
})(RPG);