/**
 * @requires ../System/UI/Element.js
 * @requires ../System/UI/Image.js
 * @requires ../Item.js
 * @requires ../System/UI/Text.js
 * @requires ../System/Audio/Audio.js
 */
(function(root,rpg){
    let UI = root.UI,
        Element = UI.Element,
        Image = UI.Image,
        Item = rpg.Item,
        Text = UI.Text,
        Audio = rpg.Audio;

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

        itemContainer.on('dragstart',function(){
            self.inventory.from = self.index;
        });

        self.on('drop',function(){
            self.inventory.to = self.index;
            if(self.inventory.swap()){
                Audio.play('fx','inventory',1);
            }
        });

        itemContainer.on('dragend',function(){
            self.removeClass('dragover');
        });

        self.on('dragenter',function(){
            self.addClass('dragover');
        });

        self.on('dragleave',function(){
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
})(window,RPG);