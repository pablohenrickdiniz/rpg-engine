(function(root){
    if(root.Item == undefined){
        throw "Game_Slot requires Item"
    }

    var Item = root.Item;

    var Game_Slot = function(options){
        var self = this;
        initialize(self);
        self.type = options.type || 'generic';
        self.disabled = options.disabled || false;
        self.max = options.max || 99;
        self.amount = options.amount || 0;
        self.item = options.item || null;
    };

    function initialize(self){
        var amount = 0;
        var max = 99;
        var item = null;

        Object.defineProperty(self,'freeAmount',{
            get:function(){
                return self.max - self.amount;
            }
        });

        Object.defineProperty(self,'amount',{
            get:function(){
                return amount;
            },
            set:function(a){
                a = parseInt(a);
                if(!isNaN(a) && a >= 0){
                    a = Math.min(a,max);
                    amount = a;
                }
            }
        });

        Object.defineProperty(self,'max',{
            get:function(){
                return max;
            },
            set:function(m){
                m = parseInt(m);
                if(!isNaN(m) && m >= 1){
                    max = m;
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
                    if(i == null){
                        amount = 0;
                    }
                }
            }
        });
    }

    root.Game_Slot= Game_Slot;
})(RPG,window);