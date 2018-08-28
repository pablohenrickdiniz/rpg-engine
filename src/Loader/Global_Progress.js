'use strict';
(function(w){
    var GlobalProgress = function () {
        var self = this;
        self.media = [];
    };

    GlobalProgress.prototype.add = function(media){
        var self = this;
        self.media.push(media);
    };

    GlobalProgress.prototype.exists = function (obj) {
        var self = this;
        return self.media.indexOf(obj) !== -1;
    };


    GlobalProgress.prototype.total = function () {
        var self = this;
        var length = self.media.length;
        var sum = 0;
        for (var i = 0; i < length; i++) {
            sum += self.media[i].total;
        }
        return sum;
    };

    GlobalProgress.prototype.loaded = function () {
        var self = this;
        var length = self.media.length;
        var sum = 0;
        for (var i = 0; i < length; i++) {
            sum += self.media[i].loaded;
        }
        return sum;
    };

    GlobalProgress.prototype.progress = function () {
        var self = this;
        return (self.loaded()) * 100 / self.total();
    };

    w.GlobalProgress = GlobalProgress;
})(window);