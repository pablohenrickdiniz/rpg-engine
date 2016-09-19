(function (root) {
    if (root.UI_Element == undefined) {
        throw "UI_List requires UI_Element"
    }


    var UI_Element = root.UI_Element;

    var UI_ListVertical = function (parent, options) {
        var self = this;
        UI_Element.call(self, parent, options);
        initialize(self);
        self.type = 'List';
    };

    UI_ListVertical.prototype = Object.create(UI_Element.prototype);
    UI_ListVertical.prototype.constructor = UI_ListVertical;

    UI_ListVertical.prototype.add = function (element) {
        var self = this;
        if (element instanceof UI_Element && self.contents.indexOf(element) == -1) {
            element.parent = self;
            element.index = self.contents.length;
            var last = self.lastItem();
            var top = 0;
            if(last != null){
                top = last.realTop+last.realHeight;
            }
            element.top = top;
            self.contents.push(element);
        }
        return self;
    };


    UI_ListVertical.prototype.remove = function (item) {
        var self = this;

        if (item instanceof UI_Element) {
            var index = self.contents.indexOf(item);
            if (index != -1) {
                self.contents.splice(index, 1)[0].parent = null;
                update_elements_position(self, index);
            }
        }
        else if (/^[0-9]+$/.test(item)) {
            if (self.contents[item] != undefined) {
                self.contents.splice(item, 1)[0].parent = null;
                update_elements_position(self, item);
            }
        }
        return self;
    };

    UI_ListVertical.prototype.indexOf = function (item) {
        var self = this;
        return self.contents.indexOf(item);
    };

    UI_ListVertical.prototype.swapIndex = function (indexA, indexB) {
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
            if (i > 0) {
                var prev = self.contents[i - 1];
                top = prev.top + prev.realHeight;
            }
            el.top = top;
        }
    };


    var initialize = function(self){
        var contentWidth = null;
        var contentHeight = null;

        Object.defineProperty(self,'contentWidth',{
            get:function(){
                if(contentWidth == null){
                    contentWidth = self.contents.reduce(function(prev,current){
                        return Math.max(prev,current.realWidth);
                    },0);
                }
                return contentWidth;
            },
            set:function(cw){
                if(!cw){
                    contentWidth = null;
                    UI_Element.uncache(self,'contentWidth');
                }
            }
        });

        Object.defineProperty(self,'contentHeight',{
            get:function(){
                if(contentHeight == null){
                    contentHeight = self.contents.reduce(function(prev,current){
                        return prev + current.realHeight;
                    },0);
                }
                return contentHeight;
            },
            set:function(ch){
                if(!ch){
                    contentHeight = null;
                    UI_Element.uncache(self,'contentHeight');
                }
            }
        });
    };

    root.UI_ListVertical = UI_ListVertical;
})(RPG);