(function(root){
    if(!root.Game_Event){
        throw "Energy_Source requires Game_Event";
    }

    let Game_Event = root.Game_Event;
    let Battery = function(options){
        options = options || {};
        let self = this;
        Game_Event.call(self,{
            x:options.x || 0,
            y:options.y || 0,
            pages:[
                {

                }
            ]
        });
    };

    Battery.prototype = Object.create(Game_Event.prototype);
    Battery.prototype.constructor = Battery;

    Object.defineProperty(root,'Battery',{
        /**
         *
         * @returns {Battery}
         */
        get:function(){
            return Battery;
        }
    })
})(RPG);