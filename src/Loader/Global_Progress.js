'use strict';
(function(w){
    let GlobalProgress = function () {
        let self = this;
        self.media = [];
    };

    /**
     *
     * @param media
     */
    GlobalProgress.prototype.add = function(media){
        let self = this;
        self.media.push(media);
    };

    /**
     *
     * @param obj
     * @returns {boolean}
     */
    GlobalProgress.prototype.exists = function (obj) {
        let self = this;
        return self.media.indexOf(obj) !== -1;
    };

    /**
     *
     * @returns {number}
     */
    GlobalProgress.prototype.total = function () {
        let self = this;
        let length = self.media.length;
        let sum = 0;
        for (var i = 0; i < length; i++) {
            sum += self.media[i].total;
        }
        return sum;
    };

    /**
     *
     * @returns {number}
     */
    GlobalProgress.prototype.loaded = function () {
        let self = this;
        let length = self.media.length;
        let sum = 0;
        for (var i = 0; i < length; i++) {
            sum += self.media[i].loaded;
        }
        return sum;
    };

    /**
     *
     * @returns {number}
     */
    GlobalProgress.prototype.progress = function () {
        let self = this;
        return (self.loaded()) * 100 / self.total();
    };

    w.GlobalProgress = GlobalProgress;
})(window);