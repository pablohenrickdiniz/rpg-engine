(function (root) {
    if (root.UI_Element == undefined) {
        throw "UI_Button requires UI_Element"
    }

    let UI_Element = root.UI_Element;
    /**
     *
     * @constructor
     */
    let UI_Button = function () {
        let self = this;
        UI_Element.call(self, arguments);
        self.text = '';
    };

    UI_Button.prototype = Object.create(UI_Element.prototype);
    UI_Button.prototype.constructor = UI_Button;

    root.UI_Button = UI_Button;
})(RPG);