(function(root){
    if(root.UI == undefined){
        throw "Inveontory requires UI"
    }

    if(root.UI.classes.Window == undefined){
        throw "Inventory requires Window"
    }

    if(root.UI.classes.Element == undefined){
        throw "Inventory requires Element"
    }

    if(root.Game_Inventory == undefined){
        throw "Inventory requires Game_Inventory"
    }

    if(root.UI.classes.Slot == undefined){
        throw "Inventory requires Slot"
    }

    var UI = root.UI,
        Window = UI.classes.Window,
        Game_Inventory = root.Game_Inventory,
        Element = UI.classes.Element,
        Slot = root.UI.classes.Slot;

    var Inventory = function(options){
        var self = this;
        options = options || {};
        Window.call(self,options);
        initialize(self);
        self.title = 'Inventory';
        self.inventory = options.inventory || null;
        self.from = null;
        self.to = null;
        self.slots = [];
    };

    Inventory.prototype = Object.create(Window.prototype);
    Inventory.prototype.constructor = Inventory;


    Inventory.prototype.swap = function(){
        var self = this;
        if(self.inventory != null && self.from != null && self.to != null && self.from != self.to){
            var from = self.from, to = self.to;
            self.from = null;
            self.top = null;
            if(self.inventory.swap(from,to)){
                self.render();
                return true;
            }
        }
        return false;
    };

    function initialize(self){
        var slots = {};

        var inventoryA  = new Element({
            class:'inventoryA',
            parent:self
        });

        var inventoryB =  new Element({
            class:'inventoryB',
            parent:self
        });

        inventoryA.show();
        inventoryB.show();

        Object.defineProperty(self,'inventoryA',{
            get:function(){
                return inventoryA;
            }
        });

        Object.defineProperty(self,'inventoryB',{
            get:function(){
                return inventoryB;
            }
        });


        var inventory = null;
        Object.defineProperty(self,'inventory',{
            get:function(){
                return inventory;
            },
            set:function(i){
                if((i == null || i instanceof Game_Inventory) && i != inventory){
                    var callback = function(){self.render(slots)};
                    if(inventory != null){
                        inventory.off('addItem',callback);
                        inventory.off('dropItem',callback);
                    }
                    inventory = i;
                    if(inventory != null){
                        inventory.on('addItem',callback);
                        inventory.on('addItem',callback);
                        self.render(slots);
                    }
                }
            }
        });
    }

    Inventory.prototype.render = function(){
        var self = this;
        var slots = self.slots;
        var inventory = self.inventory;
        var old_keys = Object.keys(slots);
        var new_keys = Object.keys(inventory.slots);
        var length = new_keys.length;
        var i;
        var id;
        for(i = 0; i < length;i++){
            id = new_keys[i];
            if(slots[id] == undefined){
                slots[id] = new Slot({
                    amount:inventory.slots[id].amount,
                    item:inventory.slots[id].item,
                    parent:self.inventoryB,
                    class:'inventory-slot',
                    inventory:self,
                    id:id
                });
            }
            else{
                slots[id].amount = inventory.slots[id].amount;
                slots[id].item =  inventory.slots[id].item;
            }
            slots[id].show();
        }
        length = old_keys.length;
        for(i =0 ; i < length;i++){
            id = old_keys[i];
            if(inventory.slots[id] == undefined && slots[id]){
                slots[id].hide();
                delete slots[id];
            }
        }
    };

    UI.classes.Inventory = Inventory;
})(RPG);