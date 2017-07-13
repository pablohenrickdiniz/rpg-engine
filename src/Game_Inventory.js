(function(root){
    if(root.Game_Slot == undefined){
        throw "Game_Inventory requires Game_Slot";
    }

    var Game_Slot = root.Game_Slot;

    var Game_Inventory = function(){
        var self = this;
        self.slots = {};
    };

    Game_Inventory.prototype.addItem = function(item,amount){
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
        self.slots[id] = new Game_Slot(options);
    };

    root.Game_Inventory = Game_Inventory;
})(RPG);