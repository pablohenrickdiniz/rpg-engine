/**
 * @requires ../../../src/Game_Event.js
 */
(function(root){
    let Game_Event = root.Game_Event;
    let Portal = function(options){
        options = options || {};
        let self = this;
        Game_Event.call(self,{
            x:options.x,
            y:options.y,
            width: 30,
            height: 30,
            static: true,
            charaID: "darkness",
            animationSpeed: 10,
            pages: [
                {
                    through: true,
                    touch:function(obj){
                        obj.x = Math.random()*500;
                        obj.y = Math.random()*500
                    }
                }
            ]
        });
    };

    Portal.prototype = Object.create(Game_Event.prototype);
    Portal.prototype.constructor = Portal;

    Object.defineProperty(root.Objects,'Portal',{
        /**
         *
         * @returns {Battery}
         */
        get:function(){
            return Portal;
        }
    })
})(RPG);