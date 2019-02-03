/**
 * @requires RPG.js
 * @requires Game_Event.js
 * @requires Consts.js
 * @requires Game/Main.js
 * @requires Items.js
 */
(function (root) {
    let Game_Event = root.Game_Event,
        Consts = root.Consts,
        Main = root.Main,
        Items = Main.Items;

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Game_Item = function (options) {
        let self = this;
        options = options || {};
        options.type = options.type || 'generic';
        Game_Event.call(self,options);
        initialize(self);
        self.amount = options.amount || 1;
        self.itemID = options.itemID;
        self.pages = [{
            through:options.through || true,
            static: options.static || true,
            trigger: options.trigger || Consts.TRIGGER_PLAYER_TOUCH,
            script:function(actor){
                let amount = actor.inventory.addItem(self.item,self.amount);
                if(amount > 0){
                    self.amount = amount;
                }
                else{
                    self.trigger('remove');
                }
            }
        }];
    };

    Game_Item.prototype = Object.create(Game_Event.prototype);
    Game_Item.prototype.constructor = Game_Item;

    /**
     *
     * @param self {Game_Item}
     */
    function initialize(self){
        let itemID = null;

        Object.defineProperty(self,'item',{
            /**
             *
             * @returns {Item}
             */
            get:function(){
                if(itemID !== null){
                    return Items.get(itemID)
                }
                return null;
            }
        });

        Object.defineProperty(self,'requirements',{
            /**
             *
             * @returns {*}
             */
            get:function(){
                if(self.item !== null){
                    return self.item.requirements;
                }
                return  [];
            }
        });

        Object.defineProperty(self,'currentFrame',{
            /**
             *
             * @returns {Item_Graphic}
             */
            get:function(){
                let item = self.item;
                if(item !== null){
                    return item.graphic;
                }
                return null;
            }
        });

        Object.defineProperty(self,'itemID',{
            /**
             *
             * @returns {string}
             */
           get:function(){
               return itemID;
           },
            /**
             *
             * @param i {string}
             */
           set:function(i){
               itemID = i;
           }
        });
    }

    Object.defineProperty(root,'Game_Item',{
        /**
         *
         * @returns {Game_Item}
         */
        get:function(){
            return Game_Item;
        }
    });
})(RPG);