/**
 * @requires ../RPG.js
 *
 */
(function(root){
    let filters = {};

    let Filters = {
        get:function(name){
            if(filters[name]){
                return filters[name];
            }
            return null;
        },
        set:function(name,filter){
            if(typeof filter === 'function' || filter == null){
                 if(filter == null && filters[name]){
                    delete filters[name];
                 }
                 else{
                     filters[name] = filter;
                 }
            }
        }
    };

    Object.defineProperty(root,'Filters',{
        get:function(){
            return Filters;
        }
    });
})(RPG);