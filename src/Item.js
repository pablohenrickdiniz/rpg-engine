'use strict';
(function (root) {
    if(root.Main === undefined){
        throw "Item requires Main";
    }
    else{
        if(root.Main.Icons === undefined){
            throw "Item requires Icons";
        }
    }

    var Icons = root.Main.Icons;

    /**
     *
     * @param options
     * @constructor
     */
    var Item = function (options) {
        var self = this;
        initialize(self);
        options = options || {};
        self.durability = options.durability || 'INDESTRUCTIBLE';
        self.effects = options.effects || [];
        self.unique = options.unique || false;
        self.icon = options.icon;
        self.type = options.type || 'generic';
        self.id = options.id;
    };

    function initialize(self){
        Object.defineProperty(self,'graphic',{
            /**
             *
             * @returns {*}
             */
            get:function(){
                return Icons.get(self.icon);
            }
        });
    }

    root.Item = Item;
})(RPG);