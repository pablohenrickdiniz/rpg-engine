'use strict';
(function(root){
    if(!root.Game_Slot){
        throw "Game_Inventory requires Game_Slot";
    }

    let Game_Slot = root.Game_Slot;
    /**
     *
     * @param options {object}
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
     * @param slotA {Game_Slot}
     * @param slotB {Game_Slot}
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
     * @param eventName {string}
     * @param callback {function}
     */
    Game_Inventory.prototype.on = function(eventName,callback){
        let self = this;
        if(!self.listeners[eventName]){
            self.listeners[eventName] = [];
        }
        if(self.listeners[eventName].indexOf(callback) === -1){
            self.listeners[eventName].push(callback);
        }
    };

    /**
     *
     * @param eventName {string}
     * @param callback {function}
     */
    Game_Inventory.prototype.off = function(eventName,callback){
        let self = this;
        if(self.listeners[eventName]){
            let index = self.listeners[eventName].indexOf(callback);
            if(index !== -1){
                self.listeners[eventName].splice(index,1);
            }
        }
    };

    /**
     *
     * @param eventName {string}
     * @param args {Array}
     */
    Game_Inventory.prototype.trigger = function(eventName,args){
        let self = this;
        if(self.listeners[eventName]){
            let length = self.listeners[eventName].length;
            for(let i =0; i < length;i++){
                self.listeners[eventName][i].apply(self,args);
            }
        }
    };

    /**
     *
     * @param item {Game_Item}
     * @param amount {number}
     * @returns {number}
     */
    Game_Inventory.prototype.addItem = function(item,amount){
        let self = this;
        let keys = Object.keys(self.slots);
        let length = keys.length;

        for(let i =0; i < length;i++){
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
     * @param id {string}
     * @param options {boolean}
     * @returns Game_Inventory
     */
    Game_Inventory.prototype.addSlot = function(id,options){
        let self = this;
        self.slots[id] = new Game_Slot(options);
        return self;
    };

    /**
     *
     * @param id
     * @returns {Game_Slot}
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
     * @param self {Game_Inventory}
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
                    for(let i = 0; i < length;i++){
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