/**
 * @requires Game_Graphic.js
 */
(function(root){
    let Game_Graphic = root.Game_Graphic;
    /**
     *
     * @param options {object}
     * @constructor
     */
    let Game_Face = function(options){
        let self = this;
        options = options || {};
        Game_Graphic.call(self,options);
        self.graphicType = 'faces';
    };

    Game_Face.prototype = Object.create(Game_Graphic.prototype);
    Game_Face.prototype.constructor = Game_Graphic;

    Object.defineProperty(root,'Game_Face',{
        /**
         *
         * @returns {Game_Face}
         */
       get:function(){
           return Game_Face;
       }
    });
})(RPG);