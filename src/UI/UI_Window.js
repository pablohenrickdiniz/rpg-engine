(function(root){
    if(root.UI_Element == undefined){
        throw "UI_Window requires UI_Element"
    }

    var UI_Element = root.UI_Element;

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
    UI_Window.prototype.constructor = UI_Window;

    UI_Window.prototype.update = function(layer){
        var self = this;
        if (self.visible && self.parent.visible) {
            layer.rect({
                x: self.absoluteLeft,
                y: self.absoluteTop,
                width: self.realWidth,
                height: self.realHeight,
                fillStyle: self.backgroundColor,
                strokeStyle: self.borderColor,
                lineWidth: self.borderWidth,
                backgroundOpacity: self.backgroundOpacity,
                borderOpacity: self.borderOpacity,
                borderColor: self.borderColor
            });
        }
    };

    root.UI_Window = UI_Window;
})(RPG);