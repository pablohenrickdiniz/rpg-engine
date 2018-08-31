(function (root) {
    if (root.UI_Element == undefined) {
        throw "UI_List requires UI_Element"
    }

    let UI_Element = root.UI_Element;

    let UI_ListHorizontal = function (parent, options) {
        let self = this;
        UI_Element.call(self, parent, options);
        initialize(self);
        self.type = 'List';
    };

    UI_ListHorizontal.prototype = Object.create(UI_Element.prototype);
    UI_ListHorizontal.prototype.constructor = UI_ListHorizontal;

    UI_ListHorizontal.prototype.add = function (element) {
        let self = this;
        if (element instanceof UI_Element && self.contents.indexOf(element) == -1) {
            element.parent = self;
            element.index = self.contents.length;
            let last = self.lastItem();
            let left = 0;
            if(last != null){
                left = last.realLeft+last.realWidth;
            }
            element.left = left;
            self.contents.push(element);
        }
        return self;
    };


    UI_ListHorizontal.prototype.remove = function (item) {
        let self = this;

        if (item instanceof UI_Element) {
            let index = self.contents.indexOf(item);
            if (index != -1) {
                self.contents.splice(index, 1)[0].parent = null;
                update_elements_position(self, index);
                self.changed = true;
            }
        }
        else if (/^[0-9]+$/.test(item)) {
            if (self.contents[item] != undefined) {
                self.contents.splice(item, 1)[0].parent = null;
                update_elements_position(self, item);
                self.changed = true;
            }
        }
        return self;
    };

    UI_ListHorizontal.prototype.indexOf = function (item) {
        let self = this;
        return self.contents.indexOf(item);
    };

    UI_ListHorizontal.prototype.swapIndex = function (indexA, indexB) {
        let self = this;
        if (self.contents[indexA] != undefined && self.contents[indexB] != undefined) {
            let tmp = self.contents[indexA];
            self.contents[indexA] = self.contents[indexB];
            self.contents[indexB] = tmp;
        }
    };

    let update_elements_position = function (self, index) {
        for (var i = index; i < self.contents.length; i++) {
            let el = self.contents[i];
            let top = 0;
            if (i > 0) {
                let prev = self.contents[i - 1];
                top = prev.top + prev.realHeight;
            }
            el.top = top;
        }
    };

    let initialize = function(self){
        let contentWidth = null;
        let contentHeight = null;

        Object.defineProperty(self,'contentWidth',{
            get:function(){
                if(contentWidth == null){
                    contentWidth = self.contents.reduce(function(prev,current){
                        return prev + current.realWidth;
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
                        return Math.max(prev,current.realHeight);
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

    root.UI_ListHorizontal = UI_ListHorizontal;
})(RPG);