(function(root){
    if(root.UI_Element == undefined){
        throw "UI_Button requires UI_Element"
    }

    var UI_Manager = root.UI_Manager,
        UI_Element = root.UI_Element;

    var UI_Button = function(){
        var self = this;
        UI_Element.call(self,arguments);
        self.text = '';
    };

    UI_Button.prototype = Object.create(UI_Element.prototype);
    UI_Button.constructor = UI_Button;

    UI_Manager.UI_Button = UI_Button;
})(RPG);