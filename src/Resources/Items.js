(function(root){
    if(root.Game_Item  == undefined){
        throw "Items requires Game_Item"
    }

    var Game_Item = root.Game_Item;

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
        clear:function(){
            var self = this;
            self.items = [];
        }
    };
})(RPG);