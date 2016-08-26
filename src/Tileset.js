(function (root) {
    if (root.Tile == undefined) {
        throw "Tileset requires Tile"
    }

    var Tile = root.Tile;

    var load_callback = function (image) {
        var self = this;
        self.width = image.width;
        self.height = image.height;
        if (self.rows == null) {
            self.rows = image.height / 32;
        }

        if (self.cols == null) {
            self.cols = image.width / 32;
        }
    };

    var Tileset = function (image, options) {
        var self = this;
        self.width = 0;
        self.height = 0;
        self.rows = options.rows || null;
        self.cols = options.cols || null;
        self.image = null;
        self.tile_map = [];
        self.setImage(image);
    };

    Tileset.prototype.setImage = function (image) {
        if (image instanceof Image) {
            var self = this;
            if (image.complete) {
                load_callback.apply(self, [image]);
            }
            else {
                image.addEventListener('load', function () {
                    load_callback.apply(self, [image]);
                });
            }
            self.image = image;
        }
    };

    Tileset.prototype.getTileWidth = function () {
        var self = this;
        return self.width / self.cols;
    };

    Tileset.prototype.getTileHeight = function () {
        var self = this;
        return self.height / self.rows;
    };

    Tileset.prototype.get = function (i, j) {
        var self = this;
        if (i >= 0 && i < self.rows && j >= 0 && j < self.cols) {
            var tile_width = self.getTileWidth();
            var tile_height = self.getTileHeight();

            if (self.tile_map[i] == undefined) {
                self.tile_map[i] = [];
            }

            if (self.tile_map[i][j] == undefined) {
                self.tile_map[i][j] = new Tile(self.image, j * tile_width, i * tile_height, tile_width, tile_height);
                self.tile_map[i][j].setParent(self);
            }

            return self.tile_map[i][j];
        }
    };


    root.Tileset = Tileset;
})(RPG);