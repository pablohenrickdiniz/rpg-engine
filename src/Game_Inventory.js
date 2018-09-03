'use strict';
(function(root){
    if(root.Game_Slot === undefined){
        throw "Game_Inventory requires Game_Slot";
    }

    let Game_Slot = root.Game_Slot;
    /**
     *
     * @param options
     * @constructor
     */
    let Game_Inventory = function(options){
        let self = this;
        initialize(self);
        options = options || {};
        self.slots = options.slots || {};
        self.actor = options.actor || null;
        self.listeners = [];
    };

    /**
     *
     * @param slotA
     * @param slotB
     * @returns {boolean}
     */
    Game_Inventory.prototype.swap = function(slotA,slotB) {
        let self = this;
        if (self.slots[slotA] && self.slots[slotB]) {
            let from = self.slots[slotA];
            let to = self.slots[slotB];

            if (from.hasItem()) {
                if (to.type === 'generic' || from.item.type === to.type) {
                    if (to.hasItem()) {
                        let swap = false;
                        if(from.item === to.item){
                            if (to.freeAmount > 0) {
                                let qtd = Math.min(from.amount, to.freeAmount);
                                from.amount -= qtd;
                                to.amount += qtd;
                                return true;
                            }
                            else {
                                swap = true;
                            }
                        }
                        else if(from.type === 'generic' || to.item.type === from.type){
                            swap = true;
                        }

                        if(swap){
                            let tmp_amount = to.amount;
                            to.amount = from.amount;
                            from.amount = tmp_amount;
                            let tmp_item = to.item;
                            to.item = from.item;
                            from.item = tmp_item;
                            return true;
                        }
                    }
                    else {
                        let add = Math.min(to.freeAmount,from.amount);
                        to.item = from.item;
                        to.amount +=add;
                        from.amount -=add;
                        return true;
                    }
                }
            }
        }
        return false;
    };

    /**
     *
     * @param event
     * @param callback
     */
    Game_Inventory.prototype.on = function(event,callback){
        let self = this;
        if(!self.listeners[event]){
            self.listeners[event] = [];
        }
        if(self.listeners[event].indexOf(callback) === -1){
            self.listeners[event].push(callback);
        }
    };

    /**
     *
     * @param event
     * @param callback
     */
    Game_Inventory.prototype.off = function(event,callback){
        let self = this;
        if(self.listeners[event]){
            let index = self.listeners[event].indexOf(callback);
            if(index !== -1){
                self.listeners[event].splice(index,1);
            }
        }
    };

    /**
     *
     * @param event
     * @param args
     */
    Game_Inventory.prototype.trigger = function(event,args){
        let self = this;
        if(self.listeners[event]){
            let length = self.listeners[event].length;
            for(var i =0; i < length;i++){
                self.listeners[event][i].apply(self,args);
            }
        }
    };

    /**
     *
     * @param item
     * @param amount
     * @returns {*}
     */
    Game_Inventory.prototype.addItem = function(item,amount){
        let self = this;
        let keys = Object.keys(self.slots);
        let length = keys.length;

        for(var i =0; i < length;i++){
            if(amount === 0){
                break;
            }

            let slot = self.slots[keys[i]];

            if((item.type === slot.type || slot.type === 'generic') && (!slot.hasItem() || slot.item === item) && slot.freeAmount > 0){
                let add = amount;
                if(slot.freeAmount < amount){
                    add = slot.freeAmount;
                }
                slot.item = item;
                slot.amount += add;
                amount-=add;
                self.trigger('addItem',[item,add]);
            }
        }
        return amount;
    };

    /**
     *
     * @param id
     * @param options
     */
    Game_Inventory.prototype.addSlot = function(id,options){
        let self = this;
        self.slots[id] = new Game_Slot(options);
    };

    /**
     *
     * @param id
     * @returns {*}
     */
    Game_Inventory.prototype.getSlot = function(id){
        let self = this;
        let slots = self.slots;
        if(slots[id]){
            return slots[id];
        }
        return null;
    };

    /**
     *
     * @param self
     */
    function initialize(self){
        let slots = {};

        Object.defineProperty(self,'slots',{
            get:function(){
                return slots;
            },
            set:function(sls){
                if(sls.constructor === {}.constructor){
                    let keys = Object.keys(sls);
                    let length = keys.length;
                    for(var i = 0; i < length;i++){
                        let id = keys[i];
                        let config = sls[id];
                        self.addSlot(id,config);
                    }
                }
            }
        });
    }

    Object.defineProperty(root,'Game_Inventory',{
        /**
         *
          * @returns {Game_Inventory}
         */
       get:function(){
           return Game_Inventory;
       }
    });
})(RPG);