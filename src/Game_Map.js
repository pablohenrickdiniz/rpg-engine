(function (root,w) {
    if (w.QuadTree == undefined) {
        throw "Map requires QuadTree"
    }

    var Game_Map = function (options) {
        var self = this;
        options = options  || {};
        self.tileset_id = options.tileset_id;
        self.name = options.name || '';
        self.width = options.width || 160;
        self.height = options.height || 160;
        self.events = options.events || [];
        self.autoplay_bgs = options.autoplay_bgs || false;
        self.autoplay_bgm = options.autoplay_bgm || false;
        self.bgm = options.bgm || null;
        self.bgs = options.bgs || null;
        self.data = options.data || {};

        self.parent = null;
        self.tree = null;
    };

    /*
     _getCollideTree():QuadTree
     Retorna a árvore de colisão do mapa
     */
    Game_Map.prototype.getTree = function () {
        var self = this;
        if (self.tree === null) {
            self.tree = new QuadTree({
                x: 0,
                y: 0,
                width: self.getWidth(),
                height: self.getHeight()
            });
        }
        return self.tree;
    };

    /*
     getWidth():Double
     Obtém a largura total do mapa em pixels
     */
    Game_Map.prototype.getWidth = function () {
        var self = this;
        return self.width;
    };

    /*
     getHeight():Double
     Obtém a altura total do mapa em pixels
     */
    Game_Map.prototype.getHeight = function () {
        var self = this;
        return self.height;
    };

    /*
     add(Event event):void
     Adiciona um evento no mapa
     */
    Game_Map.prototype.add = function (event) {
        var self = this;
        self.events.push(event);
        self.getTree().insert(event.bounds);
    };

    /*
     remove(Event event):void
     Remove um evento no mapa
     */
    Game_Map.prototype.remove = function (event) {
        var self = this;
        var index = self.events.indexOf(event);
        if (index != -1) {
            self.events.splice(index, 1);
            QuadTree.remove(event.bounds);
        }
    };

    root.Map = Game_Map;
})(RPG,window);

