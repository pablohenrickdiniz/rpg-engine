/**
 * @requires RPG.js
 * @requires Item.js
 * @requires Items.js
 */
(function(root){
    let Item = root.Item,
        Items = root.Main.Items;

    /**
     *
     * @param inventory {Game_Inventory}
     * @param options
     * @constructor
     */
    let Game_Slot = function(inventory,options){
        let self = this;
        initialize(self);
        self.type = options.type || 'generic';
        self.disabled = options.disabled || false;
        self.max = options.max || 99;
        self.amount = options.amount || 0;
        self.equipable = options.equipable || false;
        self.inventory = inventory;

        if(options.item === 0){
            self.item = options.item
        }
        else{
            self.item = options.item || null;
        }
    };

    /**
     *
     * @returns {boolean}
     */
    Game_Slot.prototype.hasItem = function(){
        let self = this;
        return self.item != null;
    };

    /**
     *
     * @param item {Game_Item}
     */
    Game_Slot.prototype.canEquip = function(item){
        let self = this;
        return self.inventory.canEquip(item);
    };

    /**
     *
     * @param self {Game_Slot}
     */
    function initialize(self){
        let amount = 0;
        let max = 99;
        let item = null;
        let equipable = false;
        let inventory = null;

        Object.defineProperty(self,'inventory',{
            get:function(){
                return inventory;
            },
            set:function(inv){
                inventory = inv;
            }
        });

        Object.defineProperty(self,'freeAmount',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return self.max - self.amount;
            }
        });

        Object.defineProperty(self,'amount',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return amount;
            },
            /**
             *
             * @param a {number}
             */
            set:function(a){
                a = parseInt(a);
                if(!isNaN(a) && a >= 0){
                    a = Math.min(a,max);
                    amount = a;
                    if(amount === 0){
                        self.item = null;
                    }
                }
            }
        });

        Object.defineProperty(self,'max',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return max;
            },
            /**
             *
             * @param m {number}
             */
            set:function(m){
                m = parseInt(m);
                if(!isNaN(m) && m >= 1){
                    max = m;
                }
            }
        });

        Object.defineProperty(self,'item',{
            /**
             *
             * @returns {Item}
             */
            get:function(){
                return item;
            },
            /**
             *
             * @param i {string|Item}
             */
            set:function(i){
                if(item == null || (item instanceof Item && i !== item) || (/^[0-9]+$/.test(i) && i !== item.id)){
                    if(/^[0-9]+$/.test(i)){
                        i = Items.get(i);
                    }
                    let t = item;
                    item = i;
                    if(inventory !== null && t !== null && self.equipable){
                        inventory.trigger('unequip',[t]);
                    }
                    if(inventory !== null && item !== null && self.equipable){
                        inventory.trigger('equip',[item]);
                    }
                    if(i == null){
                        amount = 0;
                    }
                }
            }
        });

        Object.defineProperty(self,'equipable',{
            /**
             *
             * @returns {boolean}
             */
            get:function(){
                return equipable;
            },
            /**
             *
             * @param e
             */
            set:function(e){
                equipable = !!e;
            }
        });
    }

    Object.defineProperty(root,'Game_Slot',{
        /**
         *
         * @returns {Game_Slot}
         */
        get:function(){
            return Game_Slot;
        }
    });
})(RPG,this);