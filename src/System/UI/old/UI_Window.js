(function (root) {
    if (root.UI_Element == undefined) {
        throw "UI_Window requires UI_Element"
    }

    let UI_Element = root.UI_Element;
    /**
     *
     * @param parent
     * @param options
     * @constructor
     */
    let UI_Window = function (parent, options) {
        let self = this;
        options = options || {};
        options.backgroundOpacity = options.backgroundOpacity || 90;
        options.borderColor = options.borderColor || 'white';
        options.borderWidth = options.borderWidth || 0;
        options.backgroundColor = options.backgroundColor || 'Blue';
        UI_Element.call(self, parent, options);
        self.type = 'Window';
    };

    UI_Window.prototype = Object.create(UI_Element.prototype);
    UI_Window.prototype.constructor = UI_Window;


    root.UI_Window = UI_Window;
})(RPG);