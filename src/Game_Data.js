(function (root) {
    let database = {
        actors: {},
        characters: {},
        items: {}
    };

    let Game_Data = {
        /**
         *
         * @param url {string}
         * @param callback {function}
         */
        load: function (url, callback) {
            let req = new XMLHttpRequest();
            req.onload = function () {
                let data = request.response;
                for (let key in data) {
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
        /**
         *
         * @param type {string}
         * @param options {object}
         */
        createInstance:function(type,options){
            switch(type){

            }
        }
    };

    Object.defineProperty(root,'Game_Data',{
        /**
         *
         * @returns {Game_Data}
         */
       get:function(){
           return Game_Data;
       }
    });
})(RPG);