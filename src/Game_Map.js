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
        self.events = options.events || [];
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
     * @param event
     */
    Game_Map.prototype.add = function (event) {
        var self = this;
        self.events.push(event);
        self.getTree().insert(event.bounds);
    };

    /**
     *
     * @param event
     */
    Game_Map.prototype.remove = function (event) {
        var self = this;
        var index = self.events.indexOf(event);
        if (index != -1) {
            self.events.splice(index, 1);
            QuadTree.remove(event.bounds);
        }
    };

    root.Game_Map = Game_Map;
})(RPG,window);

