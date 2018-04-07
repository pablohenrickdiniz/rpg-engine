(function(root){
    if(root.Item === undefined){
        throw "Items requires Item"
    }

    if(root.Main === undefined){
        throw "Items requires Main"
    }

    var Item = root.Item,
        Main = root.Main;

    var items = [];

    Main.Items = {
        get:function(id){
            if(items[id] !== undefined){
                return items[id];
            }
            return null;
        },
        set:function(id,item){
            if(item instanceof Item){
                items[id] = item;
            }
        }
    };
})(RPG);