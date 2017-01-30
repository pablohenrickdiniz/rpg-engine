(function (root) {
    if (root.UI_Element == undefined) {
        throw "UI_Button requires UI_Element"
    }

    var UI_Element = root.UI_Element;
    /**
     *
     * @constructor
     */
    var UI_Button = function () {
        var self = this;
        UI_Element.call(self, arguments);
        self.text = '';
    };

    UI_Button.prototype = Object.create(UI_Element.prototype);
    UI_Button.prototype.constructor = UI_Button;

    root.UI_Button = UI_Button;
})(RPG);