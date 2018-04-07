(function(root){
    if(root.Game_Slot == undefined){
        throw "Game_Inventory requires Game_Slot";
    }

    var Game_Slot = root.Game_Slot;

    var Game_Inventory = function(options){
        var self = this;
        initialize(self);
        options = options || {};
        self.slots = options.slots || {};
        self.actor = options.actor || null;
        self.listeners = [];
    };

    Game_Inventory.prototype.swap = function(slotA,slotB) {
        var self = this;
        if (self.slots[slotA] && self.slots[slotB]) {
            var from = self.slots[slotA];
            var to = self.slots[slotB];

            if (from.hasItem()) {
                if (to.type === 'generic' || from.item.type === to.type) {
                    if (to.hasItem()) {
                        var swap = false;
                        if(from.item === to.item){
                            if (to.freeAmount > 0) {
                                var qtd = Math.min(from.amount, to.freeAmount);
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
                            var tmp_amount = to.amount;
                            to.amount = from.amount;
                            from.amount = tmp_amount;
                            var tmp_item = to.item;
                            to.item = from.item;
                            from.item = tmp_item;
                            return true;
                        }
                    }
                    else {
                        var add = Math.min(to.freeAmount,from.amount);
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

    Game_Inventory.prototype.on = function(event,callback){
        var self = this;
        if(!self.listeners[event]){
            self.listeners[event] = [];
        }
        if(self.listeners[event].indexOf(callback) === -1){
            self.listeners[event].push(callback);
        }
    };


    Game_Inventory.prototype.off = function(event,callback){
        var self = this;
        if(self.listeners[event]){
            var index = self.listeners[event].indexOf(callback);
            if(index !== -1){
                self.listeners[event].splice(index,1);
            }
        }
    };


    Game_Inventory.prototype.trigger = function(event,args){
        var self = this;
        if(self.listeners[event]){
            var length = self.listeners[event].length;
            for(var i =0; i < length;i++){
                self.listeners[event][i].apply(self,args);
            }
        }
    };


    Game_Inventory.prototype.addItem = function(item,amount){
        var self = this;
        var keys = Object.keys(self.slots);
        var length = keys.length;

        for(var i =0; i < length;i++){
            if(amount === 0){
                break;
            }

            var slot = self.slots[keys[i]];

            if((item.type === slot.type || slot.type === 'generic') && (!slot.hasItem() || slot.item === item) && slot.freeAmount > 0){
                var add = amount;
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

    Game_Inventory.prototype.addSlot = function(id,options){
        var self = this;
        self.slots[id] = new Game_Slot(options);
    };

    Game_Inventory.prototype.getSlot = function(id){
        var self = this;
        var slots = self.slots;
        if(slots[id]){
            return slots[id];
        }
        return null;
    };

    function initialize(self){
        var slots = {};

        Object.defineProperty(self,'slots',{
            get:function(){
                return slots;
            },
            set:function(sls){
                if(sls.constructor === {}.constructor){
                    var keys = Object.keys(sls);
                    var length = keys.length;
                    for(var i = 0; i < length;i++){
                        var id = keys[i];
                        var config = sls[id];
                        self.addSlot(id,config);
                    }
                }
            }
        });
    }

    root.Game_Inventory = Game_Inventory;
})(RPG);