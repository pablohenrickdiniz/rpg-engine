(function (root) {

    if (root.Frame == undefined) {
        throw "SpritesetMap requires Frame"
    }

    var Frame = root.Frame;

    var SpritesetMap = function (options) {
        var self = this;
        options = options || {};
        self.width = options.width || 20;
        self.height = options.height || 20;
        self.tileWidth = options.tileWidth || 32;
        self.tileHeight = options.tileHeight || 32;
        self.sprites = [];
    };

    /**
     *
     * @param i
     * @param j
     * @param k
     * @param tile
     * @returns {SpritesetMap}
     */
    SpritesetMap.prototype.set = function (i, j, k, tile) {
        var self = this;

        if (tile instanceof Frame) {
            if (self.sprites[i] === undefined) {
                self.sprites[i] = [];
            }

            if(self.sprites[i][j] == undefined){
                self.sprites[i][j] = [];
            }

            self.sprites[i][j][k] = tile;
        }

        return self;
    };

    /**
     *
     * @param i
     * @param j
     * @param k
     * @returns {*}
     */
    SpritesetMap.prototype.get = function (i, j, k) {
        var self = this;
        if (self.sprites[i] !== undefined && self.sprites[i][j] !== undefined && self.sprites[i][j][k] !== undefined) {
            return self.sprites[i][j][k];
        }

        return null;
    };

    /**
     *
     * @param i
     * @param j
     * @param k
     */
    SpritesetMap.prototype.unset = function (i, j, k) {
        var self = this;
        if (self.sprites[i] !== undefined && self.sprites[i][j] !== undefined && self.sprites[i][j][k] !== undefined) {
            delete self.sprites[i][j][k];
        }
    };

    /**
     *
     * @returns {Array}
     */
    SpritesetMap.prototype.toJSON = function () {
        var self = this;
        var json = [];
        for (var i in self.sprites) {
            for(var j in self.sprites[i]){
                for(var k in self.sprites[i][j]){
                    if(json[i] == undefined){
                        json[i] = [];
                    }
                    if(json[i][j] == undefined){
                        json[i][j] = [];
                    }
                    json[i][j][k] = self.sprites[i][j][k];
                }
            }
        }
        return json;
    };

    root.SpritesetMap = SpritesetMap;
})(RPG);