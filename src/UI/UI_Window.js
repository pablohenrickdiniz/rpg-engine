(function(root){
    if(root.UI_Element == undefined){
        throw "UI_Window requires UI_Element"
    }


    var UI_Element = root.UI_Element,
        viewport = root.Viewport;

    var UI_Window = function(parent,options){
        var self = this;
        options = options || {};
        options.backgroundOpacity = options.backgroundOpacity || 90;
        options.borderColor = options.borderColor || 'white';
        options.borderWidth = options.borderWidth || 0;
        options.backgroundColor = options.backgroundColor || 'Blue';
        UI_Element.call(self,parent,options);
    };


    UI_Window.prototype = Object.create(UI_Element.prototype);
    UI_Window.constructor = UI_Window;

    root.UI_Window = UI_Window;
})(RPG);