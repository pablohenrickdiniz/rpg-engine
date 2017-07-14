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
        self.width = options.width;
        self.height = options.height;
        self.objs = options.objs || [];
        self.autoplay_bgs = options.autoplay_bgs || false;
        self.autoplay_bgm = options.autoplay_bgm || false;
        self.bgm = options.bgm || null;
        self.bgs = options.bgs || null;
        self.spriteset = options.spriteset || {};
    };


    /**
     *
     * @param obj
     */
    Game_Map.prototype.add = function (obj) {
        var self = this;
        self.objs.push(obj);
    };

    /**
     *
     * @param obj
     */
    Game_Map.prototype.remove = function (obj) {
        var self = this;
        var index = self.objs.indexOf(obj);
        if (index != -1) {
            delete obj.parent;
        }
    };

    root.Game_Map = Game_Map;
})(RPG,window);

