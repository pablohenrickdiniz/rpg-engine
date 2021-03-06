/**
 * @requires RPG.js
 * @requires Icons.js
 */
(function (root) {
    let Icons = root.Main.Icons;

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Item = function (options) {
        let self = this;
        initialize(self);
        options = options || {};
        self.durability = options.durability || 'INDESTRUCTIBLE';
        self.effects = options.effects || [];
        self.requirements = options.requirements || [];
        self.unique = options.unique || false;
        self.icon = options.icon;
        self.type = options.type || 'generic';
        self.id = options.id;
    };

    /**
     *
     * @param self {Item}
     */
    function initialize(self){
        Object.defineProperty(self,'graphic',{
            /**
             *
             * @returns {Game_Icon}
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