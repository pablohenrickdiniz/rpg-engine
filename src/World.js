(function (root) {
    if (root.Map == undefined) {
        throw "World requires Map"
    }

    var Map = root.Map;


    var World = function () {
        var self = this;
        self.maps = [];
        self.map_width = 3200;
        self.map_height = 3200;
    };

    World.prototype.setMap = function (i, j, map) {
        var self = this;
        if (map instanceof Map) {
            if (self.maps[i] != undefined) {
                self.maps[i] = [];
            }
            self.maps[i][j] = map;
        }
    };

    World.prototype.getMap = function (i, j) {
        var self = this;
        if (self.maps[i] != undefined && self.maps[i][j] != undefined) {
            return self.maps[i][j];
        }

        return null;
    };

    World.prototype.getMapsAt = function (x, y, width, height) {
        var self = this;
        var si = Math.floor(self.map_height / y);
        var sj = Math.floor(self.map_width / x);
        var ei = Math.ceil((self.map_height + height) / y);
        var ej = Math.ceil((self.map_width + width) / x);
        var maps = [];

        for (var i = si; i <= ei; i++) {
            for (var j = sj; j <= ej; j++) {
                var map = self.get(i, j);
                if (map !== null) {
                    maps.push(map);
                }
            }
        }

        return maps;
    };

    root.World = World;
})(RPG);