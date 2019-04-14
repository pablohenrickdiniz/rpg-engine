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
                        // let minX = obj.width/2;
                        // let minY = obj.height/2;
                        // obj.x = Math.max(Math.random()*2000,minX);
                        // obj.y = Math.max(Math.random()*2000,minY);
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