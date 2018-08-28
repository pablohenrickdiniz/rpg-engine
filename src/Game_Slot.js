'use strict';
(function(root){
    if(root.Item === undefined){
        throw "Game_Slot requires Item";
    }

    if(root.Main.Items === undefined){
        throw "Game_Slot requires Items";
    }

    var Item = root.Item,
        Items = root.Main.Items;

    /**
     *
     * @param options
     * @constructor
     */
    var Game_Slot = function(options){
        var self = this;
        initialize(self);

        self.type = options.type || 'generic';
        self.disabled = options.disabled || false;
        self.max = options.max || 99;
        self.amount = options.amount || 0;

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
        var self = this;
        return self.item != null;
    };

    function initialize(self){
        var amount = 0;
        var max = 99;
        var item = null;

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
             * @param a
             */
            set:function(a){
                a = parseInt(a);
                if(!isNaN(a) && a >= 0){
                    a = Math.min(a,max);
                    amount = a;
                    if(amount === 0){
                        item = null;
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
             * @param m
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
             * @returns {*}
             */
            get:function(){
                return item;
            },
            /**
             *
             * @param i
             */
            set:function(i){
                if(item == null || (item instanceof Item && i !== item) || (/^[0-9]+$/.test(i) && i !== item.id)){
                    if(/^[0-9]+$/.test(i)){
                        i = Items.get(i);
                    }

                    item = i;
                    if(i == null){
                        amount = 0;
                    }
                }
            }
        });
    }

    root.Game_Slot= Game_Slot;
})(RPG,window);