/**
 * @requires ../../../src/Game_Actor.js
 */
(function(root){
    let Game_Actor = root.Game_Actor;
    let Dog = function(options){
        options = options || {};
        let self = this;
        Game_Actor.call(self,{
            x:options.x,
            y:options.y,
            width: 30,
            height: 30,
            charaID: "dog",
            animationSpeed: 3,
            vSpeed:5,
            hSpeed:5
        });
        setInterval(function(){
       //     self.lookToPlayer();
         //   self.stepForward();
        },100);
    };

    Dog.prototype = Object.create(Game_Actor.prototype);
    Dog.prototype.constructor = Dog;

    Object.defineProperty(root.Objects,'Dog',{
        /**
         *
         * @returns {Battery}
         */
        get:function(){
            return Dog;
        }
    })
})(RPG);