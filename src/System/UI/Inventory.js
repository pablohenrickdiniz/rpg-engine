'use strict';
(function(root){
    if(!root.UI){
        throw "Inveontory requires UI";
    }

    if(!root.UI.Window){
        throw "Inventory requires Window";
    }

    if(!root.UI.Element){
        throw "Inventory requires Element";
    }

    if(!root.Game_Inventory){
        throw "Inventory requires Game_Inventory";
    }

    if(!root.UI.Slot){
        throw "Inventory requires Slot";
    }

    let UI = root.UI,
        Window = UI.Window,
        Game_Inventory = root.Game_Inventory,
        Element = UI.Element,
        Slot = root.UI.Slot;

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Inventory = function(options){
        let self = this;
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

    /**
     *
     * @returns {boolean}
     */
    Inventory.prototype.swap = function(){
        let self = this;
        if(self.inventory != null && self.from != null && self.to != null && self.from !== self.to){
            let from = self.from, to = self.to;
            self.from = null;
            self.top = null;
            if(self.inventory.swap(from,to)){
                self.render();
                return true;
            }
        }
        return false;
    };

    /**
     *
     * @param self
     */
    function initialize(self){
        let slots = {};

        let inventoryA  = new Element({
            class:'inventoryA',
            parent:self
        });

        let inventoryB =  new Element({
            class:'inventoryB',
            parent:self
        });

        Object.defineProperty(self,'inventoryA',{
            /**
             *
             * @returns {Element}
             */
            get:function(){
                return inventoryA;
            }
        });

        Object.defineProperty(self,'inventoryB',{
            /**
             *
             * @returns {Element}
             */
            get:function(){
                return inventoryB;
            }
        });

        let inventory = null;
        Object.defineProperty(self,'inventory',{
            /**
             *
             * @returns {Game_Inventory}
             */
            get:function(){
                return inventory;
            },
            /**
             *
             * @param i {Game_Inventory}
             */
            set:function(i){
                if((i == null || i instanceof Game_Inventory) && i !== inventory){
                    let callback = function(){self.render(slots)};
                    if(inventory != null){
                        inventory.off('add',callback);
                        inventory.off('drop',callback);
                    }
                    inventory = i;
                    if(inventory != null){
                        inventory.on('add',callback);
                        inventory.on('drop',callback);
                        self.render(slots);
                    }
                }
            }
        });
    }


    Inventory.prototype.render = function(){
        let self = this;
        let slots = self.slots;
        let inventory = self.inventory;
        let old_keys = Object.keys(slots);
        let new_keys = Object.keys(inventory.slots);
        let length = new_keys.length;
        let i;
        let id;
        let equip = [
            'armor',
            'elm',
            'glooves',
            'pants',
            'boots'
        ];
        for(i = 0; i < length;i++){
            id = new_keys[i];
            if(slots[id] === undefined){
                let index = equip.indexOf(id);
                let is_equip = index !== -1;
                let className = 'inventory-slot';
                if(is_equip){
                    className += ' '+equip[index];
                }

                slots[id] = new Slot({
                    amount:inventory.slots[id].amount,
                    item:inventory.slots[id].item,
                    parent:is_equip?self.inventoryA:self.inventoryB,
                    class:className,
                    inventory:self,
                    index:id
                });
            }
            else{
                slots[id].amount = inventory.slots[id].amount;
                slots[id].item =  inventory.slots[id].item;
            }
        }
        length = old_keys.length;
        for(i =0 ; i < length;i++){
            id = old_keys[i];
            if(inventory.slots[id] === undefined && slots[id]){
                slots[id].destroy();
                delete slots[id];
            }
        }
    };

    Object.defineProperty(UI,'Inventory',{
        /**
         *
         * @returns {Inventory}
         */
        get:function(){
            return Inventory;
        }
    });
})(RPG);