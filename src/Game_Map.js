(function (root) {
    /**
     *
     * @param options
     * @constructor
     */
    var Game_Map = function (options) {
        var self = this;
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
        var self = this;
        self.listeners.push(obj);
    };

    /**
     *
     * @param obj
     */
    Game_Map.prototype.remove = function (obj) {
        var self = this;
        var index = self.listeners.indexOf(obj);
        if (index !== -1) {
            delete obj.parent;
        }
    };


    function initialize(self){
        Object.defineProperty(self,'width',{
            get:function(){
                return self.spriteset.width*self.spriteset.tileWidth;
            }
        });

        Object.defineProperty(self,'height',{
            get:function(){
                return self.spriteset.height*self.spriteset.tileHeight;
            }
        });
    }

    root.Game_Map = Game_Map;
})(RPG,window);

