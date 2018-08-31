'use strict';
(function (root) {
    /**
     *
     * @param options
     * @constructor
     */
    let Game_Map = function (options) {
        let self = this;
        options = options  || {};
        self.tileset = options.tileset || null;
        self.name = options.name || '';
        self.listeners = options.listeners || [];
        self.autoplay_bgs = options.autoplay_bgs || false;
        self.autoplay_bgm = options.autoplay_bgm || false;
        self.bgm = options.bgm || null;
        self.bgs = options.bgs || null;
        self.spriteset = options.spriteset || {};
        initialize(self);
    };


    /**
     *
     * @param obj
     */
    Game_Map.prototype.add = function (obj) {
        let self = this;
        self.listeners.push(obj);
    };

    /**
     *
     * @param obj
     */
    Game_Map.prototype.remove = function (obj) {
        let self = this;
        let index = self.listeners.indexOf(obj);
        if (index !== -1) {
            delete obj.parent;
        }
    };

    /**
     *
     * @param self
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

    root.Game_Map = Game_Map;
})(RPG,window);

