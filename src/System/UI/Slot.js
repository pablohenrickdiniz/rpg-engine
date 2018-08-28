'use strict';
(function(root){
    if(root.UI === undefined){
        throw "Slot requires UI"
    }
    if(root.UI.classes.Element === undefined){
        throw "Slot requires Element";
    }

    if(root.UI.classes.Image === undefined){
        throw "Slot requires Image";
    }

    if(root.UI.classes.Text === undefined){
        throw "Slot requires Text";
    }

    if(root.Item === undefined){
        throw "Slot requires Item";
    }

    var UI = root.UI,
        Element = UI.classes.Element,
        Image = UI.classes.Image,
        Item = root.Item,
        Text = UI.classes.Text;

    /**
     *
     * @param options
     * @constructor
     */
    var Slot = function(options){
        var self = this;
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
       var self = this;
        return self.item != null;
    };

    /**
     *
     * @param self
     */
    function initialize(self){
        var amount = 0;
        var item = null;
        var showAmount = true;

        var itemContainer = new Element({
            class:'item',
            parent:self,
            draggable:true,
            visible:false
        });

        var image = new Image({
            class:'item-icon',
            parent:itemContainer,
            draggable:false
        });

        var amountContainer = new Text({
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
             * @param a
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

    UI.classes.Slot = Slot;
})(RPG);