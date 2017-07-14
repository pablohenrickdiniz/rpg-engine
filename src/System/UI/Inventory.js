(function(root){
    if(root.UI == undefined){
        throw "Inveontory requires UI"
    }

    if(root.UI.classes.Window == undefined){
        throw "Inventory requires Window"
    }



    var UI = root.UI,
        Window = UI.classes.Window;

    var Inventory = function(options){
        var self = this;
        options = options || {};
        Window.call(self,options);
        initialize(self);
        self.title = 'Inventory';
    };

    Inventory.prototype = Object.create(Window.prototype);
    Inventory.prototype.constructor = Inventory;

    function initialize(){
        var container1  = document.createElement('div');
        var container2 =  document.createElement('div');
    }

    UI.classes.Inventory = Inventory;
})(RPG);