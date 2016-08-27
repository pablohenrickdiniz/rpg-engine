(function(root){
    if(root.UI_Block == undefined){
        throw "UI_Window requires UI_Block"
    }

    var UI_Block = root.UI_Block;

    var UI_Window = function(parent,options){
        var self = this;
        options = options || {};
        options.backgroundOpacity = options.backgroundOpacity || 90;
        options.borderColor = options.borderColor || 'white';
        options.borderWidth = options.borderWidth || 0;
        options.backgroundColor = options.backgroundColor || 'Blue';
        UI_Block.call(self,parent,options);
    };

    UI_Window.prototype = Object.create(UI_Block.prototype);
    UI_Window.prototype.constructor = UI_Window;

    root.UI_Window = UI_Window;
})(RPG);