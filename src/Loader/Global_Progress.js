(function(w){
    let GlobalProgress = function () {
        this.media = [];
    };

    /**
     *
     * @param media
     */
    GlobalProgress.prototype.add = function(media){
        this.media.push(media);
    };

    /**
     *
     * @param obj
     * @returns {boolean}
     */
    GlobalProgress.prototype.exists = function (obj) {
        return this.media.indexOf(obj) !== -1;
    };

    /**
     *
     * @returns {number}
     */
    GlobalProgress.prototype.total = function () {
        let self = this;
        let length = self.media.length;
        let sum = 0;
        for (let i = 0; i < length; i++) {
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
        for (let i = 0; i < length; i++) {
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

    Object.defineProperty(w,'GlobalProgress',{
        /**
         *
         * @returns {GlobalProgress}
         */
        get:function(){
            return GlobalProgress;
        }
    });
})(this);