'use strict';
(function (root) {
    /**
     *
     * @param options {object}
     * @constructor
     */
    let Game_Map = function (options) {
        let self = this;
        options = options  || {};
        self.tileset = options.tileset || null;
        self.name = options.name || '';
        self.objects = options.objects || [];
        self.autoplay_bgs = options.autoplay_bgs || false;
        self.autoplay_bgm = options.autoplay_bgm || false;
        self.bgm = options.bgm || null;
        self.bgs = options.bgs || null;
        self.spriteset = options.spriteset || {};
        initialize(self);
    };

    /**
     *
     * @param obj {Game_Object}
     */
    Game_Map.prototype.add = function (obj) {
        let self = this;
        self.objects.push(obj);
    };

    /**
     *
     * @param obj {Game_Object}
     */
    Game_Map.prototype.remove = function (obj) {
        let self = this;
        let index = self.objects.indexOf(obj);
        if (index !== -1) {
            delete obj.parent;
        }
    };

    /**
     *
     * @param self {Game_Map}
     */
    function initialize(self){
        Object.defineProperty(self,'width',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return self.spriteset.width*self.spriteset.tileWidth;
            }
        });

        Object.defineProperty(self,'height',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return self.spriteset.height*self.spriteset.tileHeight;
            }
        });
    }

    Object.defineProperty(root,'Game_Map',{
        /**
         *
         * @returns {Game_Map}
         */
       get:function(){
           return Game_Map;
       }
    });
})(RPG,window);

