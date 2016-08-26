(function (root) {
    if (root.Tile == undefined) {
        throw "CharacterGraphic requires Tile"
    }

    var Tile = root.Tile;

    var CharacterGraphic = function (image, options) {
        var self = this;
        self.image = image;
        self.rows = options.rows || 1;
        self.cols = options.cols || 1;
        self.sx = options.sx || 0;
        self.sy = options.sy || 0;
        self.width = options.width || null;
        self.height = options.height || null;
        self.tile_map = [];
    };

    CharacterGraphic.prototype.get = function (i, j) {
        var self = this;
        if (i >= 0 && i < self.rows && j >= 0 && j < self.cols) {

            if (self.tile_map[i] == undefined) {
                self.tile_map[i] = [];
            }

            if (self.tile_map[i][j] == undefined) {
                var sx = self.sx + (j * self.width);
                var sy = self.sy + (i * self.height);
                self.tile_map[i][j] = new Tile(self.image, sx, sy, self.width, self.height);
                self.tile_map[i][j].setParent(self);
            }

            return self.tile_map[i][j];
        }
    };


    root.CharacterGraphic = CharacterGraphic;
})(RPG);