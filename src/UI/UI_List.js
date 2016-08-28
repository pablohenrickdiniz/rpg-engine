(function (root) {
    if (root.UI_Element == undefined) {
        throw "UI_List requires UI_Element"
    }

    if (root.UI_ListItem == undefined) {
        throw "UI_ListItem requires UI_Element"
    }

    var UI_Element = root.UI_Element,
        UI_ListItem = root.UI_ListItem;

    var UI_List = function (parent, options) {
        var self = this;
        UI_Element.call(self, parent, options);
    };

    UI_List.prototype = Object.create(UI_Element.prototype);
    UI_List.prototype.constructor = UI_List;


    UI_List.prototype.createItem = function (options) {
        var self = this;
        var last = self.lastItem();
        if (last != null) {
            options.top = last.top + last.realHeight;
        }

        return new UI_ListItem(self, options);
    };

    UI_List.prototype.lastItem = function () {
        var self = this;
        if (self.contents.length > 0) {
            return self.contents[self.contents.length - 1];
        }
        return null;
    };

    UI_List.prototype.remove = function (item) {
        var self = this;

        if (item instanceof UI_ListItem) {
            var index = self.contents.indexOf(item);
            if (index != -1) {
                self.contents.splice(index, 1)[0].parent = null;
                update_elements_position(self,index);
                self.changed = true;
            }
        }
        else if (/^[0-9]+$/.test(item)) {
            if (self.contents[item] != undefined) {
                self.contents.splice(item, 1)[0].parent = null;
                update_elements_position(self,item);
                self.changed = true;
            }
        }
        return self;
    };

    UI_List.prototype.indexOf = function (item) {
        var self = this;
        return self.contents.indexOf(item);
    };

    UI_List.prototype.update = function (layer) {
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
                borderColor: 'yellow'
            });
        }
    };

    UI_List.prototype.swapIndex = function (indexA, indexB) {
        var self = this;
        if (self.contents[indexA] != undefined && self.contents[indexB] != undefined) {
            var tmp = self.contents[indexA];
            self.contents[indexA] = self.contents[indexB];
            self.contents[indexB] = tmp;
        }
    };

    var update_elements_position = function (self, index) {
        for (var i = index; i < self.contents.length; i++) {
            var el = self.contents[i];
            var top = 0;
            if(i > 0){
                var prev = self.contents[i - 1];
                top = prev.top + prev.realHeight;
            }
            el.top = top;
        }
    };

    root.UI_List = UI_List;
})(RPG);