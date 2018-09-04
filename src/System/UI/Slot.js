'use strict';
(function(root){
    if(!root.UI){
        throw "Slot requires UI";
    }
    if(!root.UI.Element){
        throw "Slot requires Element";
    }

    if(!root.UI.Image){
        throw "Slot requires Image";
    }

    if(!root.UI.Text){
        throw "Slot requires Text";
    }

    if(!root.Item){
        throw "Slot requires Item";
    }

    let UI = root.UI,
        Element = UI.Element,
        Image = UI.Image,
        Item = root.Item,
        Text = UI.Text;

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Slot = function(options){
        let self = this;
        options = options || {};
        options.class = options.class || 'slot';
        Element.call(self,options);
        initialize(self);
        self.amount = options.amount || 0;
        self.item = options.item || null;
        self.index = options.index;
        self.inventory = options.inventory;
    };

    Slot.prototype = Object.create(Element.prototype);
    Slot.prototype.constructor = Slot;

    /**
     *
     * @returns {boolean}
     */
    Slot.prototype.hasItem = function(){
       let self = this;
        return self.item != null;
    };

    /**
     *
     * @param self {Slot}
     */
    function initialize(self){
        let amount = 0;
        let item = null;
        let showAmount = true;

        let itemContainer = new Element({
            class:'item',
            parent:self,
            draggable:true,
            visible:false
        });

        let image = new Image({
            class:'item-icon',
            parent:itemContainer,
            draggable:false
        });

        let amountContainer = new Text({
            class:'item-amount',
            parent:itemContainer,
            visible:showAmount
        },'span');


        itemContainer.addEventListener('dragstart',function(){
            self.inventory.from = self.index;
        });

        self.addEventListener('drop',function(){
            self.inventory.to = self.index;
            if(self.inventory.swap()){
                root.Audio.play('fx','inventory',1);
            }
        });

        itemContainer.addEventListener('dragend',function(){
            self.removeClass('dragover');
        });

        self.addEventListener('dragenter',function(){
            self.addClass('dragover');
        });

        self.addEventListener('dragleave',function(){
            self.removeClass('dragover');
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
                if(a >= 0 && a !== amount){
                    amount = a;
                    amountContainer.value = a;
                    amountContainer.visible = amount > 1;
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
             * @param i {Item}
             */
            set:function(i){
                if((i == null || i instanceof Item) && i !== item){
                    item = i;
                    if(item != null){
                        image.src = item.graphic.url;
                        itemContainer.visible = true;
                        self.addClass('has-item');
                    }
                    else{
                        itemContainer.visible = false;
                        self.removeClass('has-item');
                    }
                }
            }
        });
    }

    Object.defineProperty(UI,'Slot',{
        /**
         *
         * @returns {Slot}
         */
        get:function(){
            return Slot;
        }
    });
})(RPG);