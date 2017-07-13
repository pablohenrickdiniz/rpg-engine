(function (root) {
    /**
     *
     * @param options
     * @constructor
     */
    var Item = function (options) {
        var self = this;
        options = options || {};
        self.durability = options.durability || 'INDESTRUCTIBLE';
        self.effects = options.effects || [];
        self.unique = options.unique || false;
    };

    root.Item = Item;
})(RPG);