(function(root){
    if(root.Game_Item  == undefined){
        throw "Items requires Game_Item"
    }

    if(root.Main == undefined){
        throw "Items requires Main"
    }

    var Game_Item = root.Game_Item,
        Main = root.Main;

    var items = [];

    Main.Items = {
        get:function(id){
            if(items[id] != undefined){
                return items[id];
            }
            return null;
        },
        set:function(id,item){
            if(item instanceof Game_Item){
                items[id] = item;
            }
        }
    };
})(RPG);