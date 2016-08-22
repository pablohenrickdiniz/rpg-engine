(function (root,w) {
    if (w.QuadTree == undefined) {
        throw "Map requires QuadTree"
    }

    var Map = function (options) {
        var self = this;
        options = options  || {};
        self.width = options.width || 160;
        self.height = options.height || 160;
        self.events = options.events || [];
        self.parent = null;
        self.tree = null;
    };

    /*
     _getCollideTree():QuadTree
     Retorna a árvore de colisão do mapa
     */
    Map.prototype.getTree = function () {
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
    Map.prototype.getWidth = function () {
        var self = this;
        return self.width;
    };

    /*
     getHeight():Double
     Obtém a altura total do mapa em pixels
     */
    Map.prototype.getHeight = function () {
        var self = this;
        return self.height;
    };

    /*
     add(Event event):void
     Adiciona um evento no mapa
     */
    Map.prototype.add = function (event) {
        var self = this;
        self.events.push(event);
        self.getTree().insert(event.bounds);
    };

    /*
     remove(Event event):void
     Remove um evento no mapa
     */
    Map.prototype.remove = function (event) {
        var self = this;
        var index = self.events.indexOf(event);
        if (index != -1) {
            self.events.splice(index, 1);
            QuadTree.remove(event.bounds);
        }
    };


    Map.prototype.stepEvents = function () {
        var self = this;
        var events = self.events;
        var length = events.length;
        var i;
        for(i =0; i < length;i++){
            events[i].step();
        }
    };

    root.Map = Map;
})(RPG,window);

