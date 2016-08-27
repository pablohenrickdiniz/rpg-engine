(function (root) {
    if (root.UI_Block == undefined) {
        throw "UI_List requires UI_Block"
    }

    if (root.UI_ListItem == undefined) {
        throw "UI_ListItem requires UI_Block"
    }

    var UI_Block = root.UI_Block,
        UI_ListItem = root.UI_ListItem,
        viewport = root.Viewport,
        document = root.Document;

    var UI_List = function (parent, options) {
        var self = this;
        UI_Block.call(self, parent, options);
    };

    UI_List.prototype = Object.create(UI_Block.prototype);
    UI_List.prototype.constructor = UI_List;


    UI_List.prototype.createItem = function (options) {
        var self = this;
        var last = self.lastItem();
        var top = 0;
        if (last != null) {
            top = last.top + last.realHeight;
        }

        options.top = top;
        var item = new UI_ListItem(self, options);
        item.parent = self;
        document.changed = true;
        return item;
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
                document.changed = true;

            }
        }
        else if (/^[0-9]+$/.test(item)) {
            if (self.contents[item] != undefined) {
                self.contents.splice(item, 1)[0].parent = null;
                update_elements_position(self,item);
                document.changed = true;
            }
        }
        return self;
    };

    UI_List.prototype.indexOf = function (item) {
        var self = this;
        return self.contents.indexOf(item);
    };

    UI_List.prototype.update = function () {
        var self = this;
        var layer = viewport.getLayer('UI1');
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
            var length = self.contents.length;
            var i;

            for (i = 0; i < length; i++) {
                var item = self.contents[i];
                item.update(i);
            }
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