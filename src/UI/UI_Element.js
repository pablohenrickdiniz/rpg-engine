(function (root) {
    if (root.Viewport == undefined) {
        throw "UI_Element requires Viewport"
    }

    if(root.Document == undefined){
        throw "UI_Element requires Document"
    }


    var viewport = root.Viewport,
        document = root.Document;

    var ID = 0;


    var UI_Element = function (parent, options) {
        var self = this;
        options = options || {};
        self.events = {};
        self.contents = [];
        self.id = ID;
        ID++;
        initialize.apply(self);
        if (parent == null) {
            document.add(self);
            parent = viewport;
        }
        else{
            parent.add(self);
        }
        self.parent = parent;
        self.width = options.width || 100;
        self.height = options.height || 100;
        self.left = options.left || 0;
        self.top = options.top || 0;
        self.bottom = options.bottom || 0;
        self.right = options.right || 0;
        self.backgroundOpacity = options.backgroundOpacity || 100;
        self.borderOpacity = options.borderOpacity || 100;
        self.backgroundColor = options.backgroundColor || 'transparent';
        self.borderColor = options.borderColor || 'yellow';
        self.borderWidth = options.borderWidth || 0;
        self.borderStyle = options.borderStyle || 'rounded';
        self.visible = options.visible || false;
        self.verticalAlign = options.verticalAlign || null;
        self.horizontalAlign = options.horizontalAlign || null;
        self.draggable = false;
    };

    UI_Element.prototype.add = function (element) {
        var self = this;
        if (element instanceof UI_Element && self.contents.indexOf(element) == -1) {
            element.parent = self;
            self.contents.push(element);
        }
    };

    UI_Element.prototype.remove = function (element) {
        var self = this;
        if(element != undefined){
            var index = self.contents.indexOf(element);
            if(index != -1){
                element.parent = null;
                self.contents.splice(index,1);
            }
        }
        else{
            self.parent.remove(self);
        }
    };

    UI_Element.prototype.addEventListener = function (name, callback) {
        var self = this;
        if (self.events[name] == undefined) {
            self.events[name] = [];
        }

        self.events[name].push(callback);
    };

    UI_Element.prototype.removeEventListener = function (name, callback) {
        var self = this;
        if (self.events[name] != undefined) {
            var index = self.events[name].indexOf(callback);
            if (index != -1) {
                self.events[name].splice(index, 1);
            }
        }
    };

    UI_Element.prototype.update = function () {
        var self = this;
        var layer = viewport.getLayer('UI1');
        if (self.visible) {
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
                borderColor:'yellow'
            });
        }

        var length = self.contents.length;
        var i;
        for (i = 0; i < length; i++) {
            self.contents[i].update();
        }
    };

    UI_Element.prototype.show = function () {
        var self = this;
        self.visible = true;
    };

    UI_Element.prototype.hide = function () {
        var self = this;
        self.visible = false;
    };

    var initialize = function () {
        var self = this;
        var width = 100;
        var height = 100;
        var opacity = 50;
        var left = 0;
        var top = 0;
        var right = 0;
        var bottom = 0;
        var backgroundColor = 'transparent';
        var borderColor = 'yellow';
        var borderWidth = 2;
        var borderStyle = 'rounded';
        var visible = false;
        var draggable = false;
        var old_width = width;
        var old_height = height;
        var old_left = left;
        var old_top = top;
        var old_right = right;
        var old_bottom = bottom;
        var old_borderWidth = borderWidth;
        var changed = false;
        var parent = null;

        Object.defineProperty(self, 'realLeft', {
            get: function () {
                var sum = 0;
                if(self.horizontalAlign != null){
                    sum = calculate_align(self.horizontalAlign,self.realWidth,self.parent.realWidth);
                }

                if(/[0-9]+(.\[0-9]+)?%/.test(left)){
                    var pc = parseFloat(left);
                    return (self.parent.realWidth*pc)/100
                }
                return left+sum;
            }
        });

        Object.defineProperty(self, 'realTop', {
            get: function () {
                var sum = 0;
                if(self.verticalAlign != null){
                    sum = calculate_align(self.verticalAlign,self.realHeight,self.parent.realHeight);
                }

                if(/[0-9]+(.\[0-9]+)?%/.test(top)){
                    var pc = parseFloat(top);
                    return (self.parent.realHeight*pc)/100
                }
                return top+sum;
            }
        });

        Object.defineProperty(self, 'realWidth', {
            get: function () {
                if(/[0-9]+(.\[0-9]+)?%/.test(width)){
                    var pc = parseFloat(width);
                    return (self.parent.realWidth*pc)/100
                }
                return width;
            }
        });

        Object.defineProperty(self, 'realHeight', {
            get: function () {
                if(/[0-9]+(.\[0-9]+)?%/.test(height)){
                    var pc = parseInt(height);
                    return (self.parent.realHeight*pc)/100
                }
                return height;
            }
        });

        Object.defineProperty(self, 'width', {
            get: function () {
                return width;
            },
            set: function (w) {
                if (w != width) {
                    old_width = width;
                    width = w;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'height', {
            get: function () {
                return height;
            },
            set: function (h) {
                if (h != height) {
                    old_height = height;
                    height = h;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'left', {
            get: function () {
                return left;
            },
            set: function (l) {
                if (l != left) {
                    old_left = left;
                    left = l;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'top', {
            get: function () {
                return top;
            },
            set: function (t) {
                if (t != top) {
                    old_top = top;
                    top = t;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'right', {
            get: function () {
                return right;
            },
            set: function (r) {
                if (r != right) {
                    old_right = right;
                    right = r;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'bottom', {
            get: function () {
                return bottom;
            },
            set: function (b) {
                if (b != bottom) {
                    old_bottom = bottom;
                    bottom = b;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'borderWidth', {
            get: function () {
                return borderWidth;
            },
            set: function (bw) {
                if (bw != borderWidth) {
                    old_borderWidth = borderWidth;
                    borderWidth = bw;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'opacity', {
            get: function () {
                return opacity;
            },
            set: function (o) {
                if (o != opacity) {
                    opacity = o;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'backgroundColor', {
            get: function () {
                return backgroundColor;
            },
            set: function (bc) {
                if (bc != backgroundColor) {
                    backgroundColor = bc;
                    if (self.backgroundColor.constructor == {}.constructor) {
                        switch (backgroundColor.type) {
                            case 'linearGradient':
                                Object.defineProperty(backgroundColor, 'x0', {
                                    get: function () {
                                        return self.absoluteLeft;
                                    }
                                });

                                Object.defineProperty(backgroundColor, 'y0', {
                                    get: function () {
                                        return self.absoluteTop;
                                    }
                                });

                                Object.defineProperty(backgroundColor, 'x1', {
                                    get: function () {
                                        return self.absoluteLeft + self.width;
                                    }
                                });

                                Object.defineProperty(backgroundColor, 'y1', {
                                    get: function () {
                                        return self.absoluteTop + self.height;
                                    }
                                });
                        }
                    }
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'borderColor', {
            get: function () {
                return borderColor;
            },
            set: function (bc) {
                if (bc != borderColor) {
                    borderColor = bc;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'borderStyle', {
            get: function () {
                return borderStyle;
            },
            set: function (bs) {
                if (bs != borderStyle) {
                    borderStyle = bs;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'visible', {
            get: function () {
                return visible;
            },
            set: function (v) {
                if (v != visible) {
                    visible = v;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'draggable', {
            get: function () {
                return draggable;
            },
            set: function (d) {
                if (d != draggable) {
                    draggable = d;
                }
            }
        });

        Object.defineProperty(self, 'absoluteLeft', {
            get: function () {
                return self.realLeft +  self.parent.realLeft;
            }
        });

        Object.defineProperty(self, 'absoluteTop', {
            get: function () {
                return self.realTop+ self.parent.realTop
            }
        });

        Object.defineProperty(self, 'changed', {
            get: function () {
                return changed;
            },
            set: function (c) {
                if (changed != c) {
                    changed = c;
                    if (self.parent != null) {
                        self.parent.changed = c;
                    }
                }
            }
        });


        Object.defineProperty(self,'level',{
            get:function(){
                if(self.parent instanceof  UI_Element){
                    return self.parent.level +1;
                }
                return 0;
            }
        });

        Object.defineProperty(self,'parent',{
            get:function(){
               return parent;
            },
            set:function(p){
                if(p != parent){
                    if(parent != null){
                        document.removeFromLevel(self.level,self);
                    }
                    parent = p;
                    if(parent != null){
                        document.addToLevel(self.level,self);
                    }

                    changed = true;
                }
            }
        });
    };

    var calculate_align = function (align, objSize, contSize) {
        switch (align) {
            case 'top':
            case 'left':
                return 0;
                break;
            case 'center':
                return  (contSize / 2) - (objSize / 2);
                break;
            case 'bottom':
            case 'right':
                return contSize - objSize;
                break;
        }
    };

    root.UI_Element = UI_Element;
})(RPG);