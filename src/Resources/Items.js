(function(root){
    if(root.Game_Item  == undefined){
        throw "Items requires Game_Item"
    }

    if(root.Item_Graphic  == undefined){
        throw "Items requires Item_Graphic"
    }

    var Game_Item = root.Game_Item,
        Item_Graphic = root.Item_Graphic;

    root.Items = {
        items:[],
        get:function(id){
            var self= this;
            if(self.items[id] != undefined){
                return self.items[id];
            }
            return null;
        },
        set:function(id,item){
            var self = this;
            self.items[id] = item;
        },
        unset:function(id){
            var self = this;
            if(self.items[id]){
                delete self.items[id];
            }
        },
        createInstance:function(id,options){
            var self = this;
            if(self.items[id] != undefined){
                var graphic = new Item_Graphic(self.items[id].graphic);
                options = options || {};
                options.id = id;
                options.graphic = graphic;
                options.effects = self.items[id].effects;
                var opt = {x:0, y:0};
                opt = Object.assign(opt,options);
                return new Game_Item(opt);
            }
            return null;
        },
        clear:function(){
            var self = this;
            self.items = [];
        }
    };
})(RPG);