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
    };

    Game_Inventory.prototype.addItem = function(item,amount){
        var self = this;
        var keys = Object.keys(self.slots);
        var length = keys.length;

        for(var i =0; i < length;i++){
            if(amount == 0){
                break;
            }

            var slot = self.slots[keys[i]];
            var it = slot.item;
            if(amount > 0 && (it == null || (it.id == item.id && slot.freeAmount > 0))){
                var add = amount;
                if(slot.freeAmount < amount){
                    add = slot.freeAmount;
                }
                slot.amount += add;
                slot.item = item;
                amount-=add;
            }
        }
        return amount;
    };

    Game_Inventory.prototype.addSlot = function(id,options){
        var self = this;
        self.slots[id] = new Game_Slot(options);
    };

    Game_Inventory.prototype.getSlot = function(id){
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
                if(sls.constructor == {}.constructor){
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