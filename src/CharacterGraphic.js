(function (root) {
    if (root.Tile == undefined) {
        throw "CharacterGraphic requires Tile"
    }

    var Tile = root.Tile;

    var CharacterGraphic = function (image, rows, cols, sx, sy, width, height) {
        var self = this;
        rows = parseInt(rows);
        cols = parseInt(cols);
        sx = parseFloat(sx);
        sy = parseFloat(sy);
        width = parseInt(width);
        height = parseInt(height);
        rows = isNaN(rows) || rows < 0 ? 1 : rows;
        cols = isNaN(cols) || cols <= 0 ? 1 : cols;
        sx = isNaN(sx) || sx < 0 ? 0 : sx;
        sy = isNaN(sy) || sy < 0 ? 0 : sy;
        width = isNaN(width) || width <= 0 ? null : width;
        height = isNaN(height) || height <= 0 ? null : height;

        self.rows = rows;
        self.cols = cols;
        self.sx = sx;

        self.sy = sy;
        self.width = width;
        self.height = height;
        self.tiles = [];
        self.setImage(image);
    };

    CharacterGraphic.prototype.setImage = function (image) {
        if (image instanceof Image) {
            var self = this;
            self.image = image;
        }
    };

    CharacterGraphic.prototype.get = function (i, j) {
        var self = this;
        if (i >= 0 && i < self.rows && j >= 0 && j < self.cols) {

            if (self.tiles[i] == undefined) {
                self.tiles[i] = [];
            }

            if (self.tiles[i][j] == undefined) {
                var sx = self.sx + (j * self.width);
                var sy = self.sy + (i * self.height);
                self.tiles[i][j] = new Tile(self.image, sx, sy, self.width, self.height);
                self.tiles[i][j].setParent(self);
            }

            return self.tiles[i][j];
        }
    };


    root.CharacterGraphic = CharacterGraphic;
})(RPG);