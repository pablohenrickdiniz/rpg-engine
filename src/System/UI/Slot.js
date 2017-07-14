(function(root){
    if(root.UI == undefined){
        throw "Slot requires UI"
    }
    if(root.UI.classes.Element == undefined){
        throw "Slot requires Element"
    }

    if(root.UI.classes.Image == undefined){
        throw "Slot requires Image"
    }

    if(root.UI.classes.Text == undefined){
        throw "Slot requires Text"
    }

    if(root.Item == undefined){
        throw "Slot requires Item"
    }

    var UI = root.UI,
        Element = UI.classes.Element,
        Image = UI.classes.Image,
        Item = root.Item,
        Text = UI.classes.Text;

    var Slot = function(options){
        var self = this;
        options = options || {};
        options.class = options.class || 'slot';
        Element.call(self,options);
        initialize(self);
        self.amount = options.amount || 0;
        self.item = options.item || null;
    };

    Slot.prototype = Object.create(Element.prototype);
    Slot.prototype.constructor = Slot;


    function initialize(self){
        var amount = 0;
        var item = null;

        var itemContainer = new Element({
            class:'item',
            parent:self,
            draggable:true
        });

        var image = new Image({
            class:'item-icon',
            parent:itemContainer,
            draggable:false
        });

        var amountContainer = new Text({
            tag:'span',
            class:'item-amount',
            parent:itemContainer
        });

        self.addEventListener('dragenter',function(){
            self.addClass('dragover');
        });

        self.addEventListener('dragleave',function(){
            self.removeClass('dragover');
        });


        Object.defineProperty(self,'amount',{
            get:function(){
                return amount;
            },
            set:function(a){
                a = parseInt(a);
                if(a >= 0 && a != amount){
                    amount = a;
                    amountContainer.value = a;
                }
            }
        });

        Object.defineProperty(self,'item',{
            get:function(){
                return item;
            },
            set:function(i){
                if((i == null || i instanceof Item) && i != item){
                    item = i;
                    if(item != null){
                        amountContainer.show();
                        image.src = item.graphic.image.src;
                        image.show();
                        itemContainer.show();
                        self.addClass('has-item');
                    }
                    else{
                        amountContainer.hide();
                        image.hide();
                        itemContainer.hide();
                        self.class = "inventory-slot";
                        self.removeClass('has-item');
                    }
                }
            }
        });
    }

    UI.classes.Slot = Slot;
})(RPG);