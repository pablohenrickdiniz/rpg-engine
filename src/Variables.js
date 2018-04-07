(function(root){
    if(root.Main === undefined){
        throw "Variables requires RPG Main"
    }

    var Main = root.Main;
    var variables = [];

    Main.Variables = {
        set:function(id,value){
            variables[id] = value;
        },
        get:function(id){
            if(variables[id] !== undefined){
                return variables[id];
            }
            return null;
        }
    };

})(RPG);