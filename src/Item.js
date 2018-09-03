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

    let Icons = root.Main.Icons;

    /**
     *
     * @param options
     * @constructor
     */
    let Item = function (options) {
        let self = this;
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

    Object.defineProperty(root,'Item',{
        /**
         *
         * @returns {Item}
         */
       get:function(){
           return Item;
       }
    });
})(RPG);