(function (root) {
    if (root.UI_Element == undefined) {
        throw "UI_ListItem requires UI_Element"
    }

    let UI_Element = root.UI_Element;
    /**
     *
     * @param parent
     * @param options
     * @constructor
     */
    let UI_ListItem = function (parent, options) {
        let self = this;
        options.height = options.height || 20;
        UI_Element.call(self, parent, options);
        self.width = '100%';
        self.type = 'ListItem'
    };

    UI_ListItem.prototype = Object.create(UI_Element.prototype);
    UI_ListItem.prototype.constructor = UI_ListItem;


    root.UI_ListItem = UI_ListItem;
})(RPG);