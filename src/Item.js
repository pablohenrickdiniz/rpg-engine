(function (root) {
    root.Item = function (options) {
        var name = options.name;
        var graphic = options.graphic;

        var self = this;


        self.name = name;
        self.graphic = graphic;
    };
})(RPG);