(function(root){
    if(root.UI_Element == undefined){
        throw "UI_ListItem requires UI_Element"
    }

    var UI_Element = root.UI_Element;

    var UI_ListItem = function(){
        var self = this;
        UI_Element.call(self,arguments);
    } ;

    UI_ListItem.prototype = Object.create(UI_Element.prototype);
    UI_ListItem.constructor = UI_ListItem;

    root.UI_ListItem = UI_ListItem;
})(RPG);