(function (root,w) {
    if (w.QuadTree == undefined) {
        throw "Map requires QuadTree"
    }
    /**
     *
     * @param options
     * @constructor
     */
    var Game_Map = function (options) {
        var self = this;
        options = options  || {};
        self.tileset_id = options.tileset_id;
        self.name = options.name || '';
        self.width = options.width || 640;
        self.height = options.height || 640;
        self.objects = options.objects || [];
        self.autoplay_bgs = options.autoplay_bgs || false;
        self.autoplay_bgm = options.autoplay_bgm || false;
        self.bgm = options.bgm || null;
        self.bgs = options.bgs || null;
        self.parent = null;
        self.tree = null;
    };

    /**
     *
     * @returns {null|*}
     */
    Game_Map.prototype.getTree = function () {
        var self = this;
        if (self.tree === null) {
            self.tree = new QuadTree({
                x: 0,
                y: 0,
                width: self.width,
                height: self.height
            });
        }
        return self.tree;
    };


    /**
     *
     * @param obj
     */
    Game_Map.prototype.add = function (obj) {
        var self = this;
        self.objects.push(obj);
        obj.parent = self;
        self.getTree().insert(obj.bounds);
    };

    /**
     *
     * @param obj
     */
    Game_Map.prototype.remove = function (obj) {
        var self = this;
        var index = self.objects.indexOf(obj);
        if (index != -1) {
            obj.parent = null;
            QuadTree.remove(obj.bounds);
            return self.objects.splice(index, 1)[0];
        }
        return null;
    };

    root.Game_Map = Game_Map;
})(RPG,window);

