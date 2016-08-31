(function (root) {
    if (root.Document == undefined) {
        throw "UI_Element requires Document"
    }

    var document = root.Document,
        viewport = root.Viewport;

    var ID = 0;

    var UI_Element = function (parent, options) {
        var self = this;
        options = options || {};
        self.events = {};
        self.contents = [];
        self.id = ID;
        ID++;
        initialize(self);
        if (parent == null) {
            document.add(self);
            parent = viewport;
        }
        else {
            parent.add(self);
        }
        self.parent = parent;
        self.left = options.left || 0;
        self.top = options.top || 0;
        self.verticalAlign = options.verticalAlign || null;
        self.horizontalAlign = options.horizontalAlign || null;
        self.width = options.width || 0;
        self.height = options.height || 0;
        self.padding = options.padding || 0;
        self.backgroundOpacity = options.backgroundOpacity || 100;
        self.borderOpacity = options.borderOpacity || 100;
        self.backgroundColor = options.backgroundColor || 'transparent';
        self.borderColor = options.borderColor || 'yellow';
        self.borderWidth = options.borderWidth || 0;
        self.borderStyle = options.borderStyle || 'rounded';
        self.visible = options.visible || false;
        self.scrollLeft = options.scrollLeft || 0;
        self.scrollTop = options.scrollTop || 0;
        self.scrollWidth = options.scrollWidth || 15;
        self.scrollHeight = 0;
        self.draggable = false;
        self.overflow = 'hidden';
        self.scrollable = options.scrollable || 0;
        self.type = 'Element';
        self.scrolling = 0;
        self.scrollingStart = null;
        self.scrollTime = options.scrollTime || 1000;
        self.scrollStep = options.scrollStep || 100;
        self.startScrollTop = self.scrollTop;
    };


    UI_Element.prototype.add = function (element) {
        var self = this;
        if (element instanceof UI_Element && self.contents.indexOf(element) == -1) {
            element.parent = self;
            self.contents.push(element);
        }
        return self;
    };

    UI_Element.prototype.remove = function (element) {
        var self = this;
        if (element != undefined) {
            var index = self.contents.indexOf(element);
            if (index != -1) {
                element.parent = null;
                self.contents.splice(index, 1);
            }
        }
        else {
            self.parent.remove(self);
        }
        return self;
    };

    UI_Element.prototype.addEventListener = function (name, callback) {
        var self = this;
        if (self.events[name] == undefined) {
            self.events[name] = [];
        }

        self.events[name].push(callback);
        return self;
    };

    UI_Element.prototype.removeEventListener = function (name, callback) {
        var self = this;
        if (self.events[name] != undefined) {
            var index = self.events[name].indexOf(callback);
            if (index != -1) {
                self.events[name].splice(index, 1);
            }
        }
        return self;
    };

    UI_Element.prototype.show = function () {
        var self = this;
        self.visible = true;
        return self;
    };

    UI_Element.prototype.hide = function () {
        var self = this;
        self.visible = false;
        return self;
    };

    var initialize = function (self) {
        var width = [100];
        var height = [100];
        var opacity = [50];
        var left = [0];
        var top = [0];
        var padding = [0];
        var backgroundColor = ['transparent'];
        var borderColor = ['yellow'];
        var borderWidth = [2];
        var borderStyle = ['rounded'];
        var visible = ['visible'];
        var draggable = ['draggable'];
        var old_width = null;
        var old_height = null;
        var old_left = null;
        var old_top = null;
        var old_borderWidth = null;
        var old_background_opacity = null;
        var old_padding = null;
        var parent = null;
        var state = 0;
        var cursor = ['default'];
        var backgroundOpacity = [100];
        var horizontalAlign = [null];
        var verticalAlign = [null];
        var overflow = ['hidden'];
        var scrollable = false;
        var scrollLeft = 0;
        var scrollTop = 0;
        var scrollWidth = 15;
        var scrollHeight = 0;

        Object.defineProperty(self, 'realLeft', {
            get: function () {
                var sum = 0;
                var ha = horizontalAlign[state] || horizontalAlign[0];
                var l = calc_size(self.left, parent.realWidth);

                if (ha != null) {
                    sum = calculate_align(ha, self.realWidth, parent.realWidth);
                }

                return l + sum;
            }
        });

        Object.defineProperty(self, 'realTop', {
            get: function () {
                var sum = 0;
                var va = verticalAlign[state] || verticalAlign[0];
                var t = calc_size(self.top, parent.realHeight);


                if (va != null) {
                    sum = calculate_align(va, self.realHeight, parent.realHeight);
                }

                return t + sum;
            }
        });


        Object.defineProperty(self, 'absoluteLeft', {
            get: function () {
                return self.realLeft + parent.absoluteLeft + self.parent.padding;
            }
        });

        Object.defineProperty(self, 'absoluteTop', {
            get: function () {
                return self.realTop + parent.absoluteTop + self.parent.padding;
            }
        });


        Object.defineProperty(self, 'horizontalAlign', {
            get: function () {
                return horizontalAlign[state] || horizontalAlign[0];
            },
            set: function (ha) {
                if (ha != horizontalAlign[state]) {
                    save_state(self);
                    horizontalAlign[state] = ha;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'verticalAlign', {
            get: function () {
                return verticalAlign[state] || verticalAlign[0];
            },
            set: function (va) {
                if (va != verticalAlign[state]) {
                    save_state(self);
                    verticalAlign[state] = va;
                    self.changed = true;
                }
            }
        });


        Object.defineProperty(self, 'realWidth', {
            get: function () {
                return calc_size(self.width, parent.realWidth);
            }
        });

        Object.defineProperty(self, 'realHeight', {
            get: function () {
                return calc_size(self.height, parent.realHeight);
            }
        });

        Object.defineProperty(self, 'containerWidth', {
            get: function () {
                return self.realWidth - self.scrollWidth - self.padding * 2;
            }
        });

        Object.defineProperty(self, 'containerHeight', {
            get: function () {
                return self.realHeight - self.padding * 2;
            }
        });

        Object.defineProperty(self, 'width', {
            get: function () {
                return width[state] || width[0];
            },
            set: function (w) {
                if (w != width[state]) {
                    save_state(self);
                    width[state] = w;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'height', {
            get: function () {
                return height[state] || height[0];
            },
            set: function (h) {
                if (h != height[state]) {
                    save_state(self);
                    height[state] = h;
                    self.changed = true;
                }
            }
        });


        Object.defineProperty(self, 'padding', {
            get: function () {
                return padding[state] || padding[0];
            },
            set: function (pad) {
                if (pad != padding[state]) {
                    save_state(self);
                    padding[state] = pad;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'left', {
            get: function () {
                return left[state] || left[0];
            },
            set: function (l) {
                if (l != left[state]) {
                    save_state(self);
                    left[state] = l;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'top', {
            get: function () {
                return top[state] || top[0];
            },
            set: function (t) {
                if (t != top[state]) {
                    save_state(self);
                    top[state] = t;
                    self.changed = true;
                }
            }
        });


        Object.defineProperty(self, 'clearX', {
            get: function () {
                return old_left - old_borderWidth;
            }
        });

        Object.defineProperty(self, 'clearY', {
            get: function () {
                return old_top - old_borderWidth;
            }
        });

        Object.defineProperty(self, 'clearWidth', {
            get: function () {
                return old_width + old_borderWidth * 2;
            }
        });

        Object.defineProperty(self, 'clearHeight', {
            get: function () {
                return old_height + old_borderWidth * 2;
            }
        });

        Object.defineProperty(self, 'borderWidth', {
            get: function () {
                return borderWidth[state] || borderWidth[0];
            },
            set: function (bw) {
                if (bw != borderWidth[state]) {
                    save_state(self);
                    borderWidth[state] = bw;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'opacity', {
            get: function () {
                return opacity[state] || opacity[0];
            },
            set: function (o) {
                if (o != opacity[state]) {
                    opacity[state] = o;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'backgroundColor', {
            get: function () {
                return backgroundColor[state] || backgroundColor[0];
            },
            set: function (bc) {
                if (bc != backgroundColor[state]) {
                    backgroundColor[state] = bc;
                    if (self.backgroundColor[state].constructor == {}.constructor) {
                        switch (backgroundColor[state].type) {
                            case 'linearGradient':
                                Object.defineProperty(backgroundColor[state], 'x0', {
                                    get: function () {
                                        return self.absoluteLeft;
                                    }
                                });

                                Object.defineProperty(backgroundColor[state], 'y0', {
                                    get: function () {
                                        return self.absoluteTop;
                                    }
                                });

                                Object.defineProperty(backgroundColo[state], 'x1', {
                                    get: function () {
                                        return self.absoluteLeft + self.width;
                                    }
                                });

                                Object.defineProperty(backgroundColor[state], 'y1', {
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

        Object.defineProperty(self, 'backgroundOpacity', {
            get: function () {
                return backgroundOpacity[state] || backgroundOpacity[0];
            },
            set: function (bo) {
                if (bo != backgroundOpacity[state]) {
                    backgroundOpacity[state] = bo;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'borderColor', {
            get: function () {
                return borderColor[state] || borderColor[0];
            },
            set: function (bc) {
                if (bc != borderColor[state]) {
                    save_state(self);
                    borderColor[state] = bc;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'borderStyle', {
            get: function () {
                return borderStyle[state] || borderStyle[0];
            },
            set: function (bs) {
                if (bs != borderStyle[state]) {
                    borderStyle[state] = bs;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'visible', {
            get: function () {
                return visible[state] || visible[0];
            },
            set: function (v) {
                if (v != visible[state]) {
                    visible[state] = v;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'draggable', {
            get: function () {
                return draggable[state] || draggable[0];
            },
            set: function (d) {
                if (d != draggable[state]) {
                    draggable[state] = d;
                }
            }
        });

        Object.defineProperty(self, 'changed', {
            set: function (c) {
                if (c) {
                    document.change(self.level, self.id);
                }
            }
        });

        Object.defineProperty(self, 'level', {
            get: function () {
                if (self.parent instanceof  UI_Element) {
                    return self.parent.level + 1;
                }
                return 0;
            }
        });

        Object.defineProperty(self, 'parent', {
            get: function () {
                return parent;
            },
            set: function (p) {
                if (p != parent) {
                    if (parent != null) {
                        document.removeFromLevel(self.level, self);
                    }
                    parent = p;
                    if (parent != null) {
                        document.addToLevel(self.level, self);
                    }

                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'hover', {
            get: function () {
                return state == 1;
            },
            set: function (h) {
                if (h) {
                    self.state = 1;
                }
                else {
                    self.state = 0;
                }
            }
        });

        Object.defineProperty(self, 'state', {
            get: function () {
                return state;
            },
            set: function (s) {
                if (s != state) {
                    save_state(self);
                    state = s;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'cursor', {
            get: function () {
                return cursor[state] || cursor[0];
            },
            set: function (c) {
                if (c != cursor[state]) {
                    cursor[state] = c;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'oldWidth', {
            set: function (ow) {
                old_width = ow;
            },
            get: function () {
                return old_width;
            }
        });

        Object.defineProperty(self, 'oldHeight', {
            set: function (oh) {
                old_height = oh;
            },
            get: function () {
                return old_height;
            }
        });

        Object.defineProperty(self, 'oldLeft', {
            set: function (ol) {
                old_left = ol;
            },
            get: function () {
                return old_left;
            }
        });

        Object.defineProperty(self, 'oldTop', {
            set: function (ot) {
                old_top = ot;
            },
            get: function () {
                return old_top;
            }
        });

        Object.defineProperty(self, 'oldBorderWidth', {
            set: function (obw) {
                old_borderWidth = obw;
            },
            get: function () {
                return old_borderWidth;
            }
        });

        Object.defineProperty(self, 'oldBackgroundOpacity', {
            set: function (obp) {
                old_background_opacity = obp;
            },
            get: function () {
                return old_background_opacity;
            }
        });

        Object.defineProperty(self, 'oldPadding', {
            set: function (op) {
                old_padding = op;
            },
            get: function () {
                return old_padding;
            }
        });


        Object.defineProperty(self, 'overflow', {
            set: function (o) {
                if (o != overflow) {
                    overflow = o;
                }
            },
            get: function () {
                return overflow;
            }
        });

        Object.defineProperty(self, 'scrollable', {
            get: function () {
                return scrollable;
            },
            set: function (s) {
                if (s != scrollable) {
                    scrollable = s;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'scrollHeight', {
            get: function () {
                return scrollHeight;
            },
            set:function(sh){
                if(sh != scrollHeight){
                    console.log(sh);
                    scrollHeight = sh;
                    self.changed = true;
                    fire_change(self);
                }
            }
        });

        Object.defineProperty(self, 'scrollLeft', {
            get: function () {
                if (scrollable) {
                    return scrollLeft;
                }
                return 0;
            },
            set: function (s) {
                if (s != scrollLeft) {
                    scrollLeft = s;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'scrollTop', {
            get: function () {
                if (scrollable) {
                    return scrollTop;
                }
                return 0;
            },
            set: function (st) {
                if (st != scrollTop) {
                    var max = self.maxScrollTop;
                    if (st < 0) {
                        st = 0;
                    }
                    else if(st > max){
                        st = max;
                    }

                    scrollTop = st;
                    self.changed = true;
                    fire_change(self);
                }
            }
        });

        Object.defineProperty(self, 'scrollButton1Left', {
            get: function () {
                return self.absoluteLeft + self.realWidth - self.scrollWidth;
            }
        });

        Object.defineProperty(self, 'scrollButton1Top', {
            get: function () {
                return self.absoluteTop;
            }
        });

        Object.defineProperty(self, 'scrollButton2Left', {
            get: function () {
                return self.absoluteLeft + self.realWidth - self.scrollWidth;
            }
        });

        Object.defineProperty(self, 'scrollButton2Top', {
            get: function () {
                return self.absoluteTop + self.realHeight - self.scrollWidth;
            }
        });

        Object.defineProperty(self, 'scrollWidth', {
            get: function () {
                return self.scrollable?scrollWidth:0;
            },
            set: function (sw) {
                if (sw != scrollWidth) {
                    scrollWidth = sw;
                }
            }
        });

        Object.defineProperty(self,'contentHeight',{
           get:function(){
               return self.contents.reduce(function(prev,current){
                    return prev+(current.realHeight);
               },0);
           }
        });

        Object.defineProperty(self, 'railHeight', {
            get: function () {
                return self.realHeight - self.scrollWidth * 2;
            }
        });

        Object.defineProperty(self, 'maxScrollTop', {
            get: function () {
                return self.contentHeight - self.containerHeight;
            }
        });
    };

    UI_Element.prototype.update = function (layer) {
        var self = this;
        if (self.visible && self.parent.visible) {
            var at = self.absoluteTop;

            layer.rect({
                x: self.absoluteLeft,
                y: at,
                width: self.realWidth,
                height: self.realHeight,
                fillStyle: self.backgroundColor,
                strokeStyle: self.borderColor,
                lineWidth: self.borderWidth,
                backgroundOpacity: self.backgroundOpacity,
                borderOpacity: self.borderOpacity,
                borderColor: self.borderColor
            });

            var content_height = self.contentHeight;
            var container_height = self.containerHeight;

            if (self.scrollable && content_height > container_height) {

                var scrollbar_size = self.scrollWidth;
                var fontSize = scrollbar_size / 1.5;
                var button1_left = self.scrollButton1Left;
                var button2_top = self.scrollButton2Top;
                var rail_y = at + scrollbar_size;
                var rail_height = self.railHeight;


                //Scrollbar background
                layer.rect({
                    x: button1_left,
                    y: rail_y,
                    width: scrollbar_size,
                    height: rail_height,
                    fillStyle: 'Blue',
                    backgroundOpacity: 80
                });

                var scroll_y = rail_y + rail_height * (self.scrollTop / content_height);
                var scroll_height = (container_height / content_height) * rail_height;


              //  Scrollbar Slider
                layer.rect({
                    x: button1_left,
                    y: scroll_y,
                    width: scrollbar_size,
                    height: scroll_height,
                    fillStyle: 'White',
                    lineWidth: 1,
                    strokeStyle: 'Black'
                });


                //Scrollbar button up
                layer.rect({
                    x: button1_left,
                    y: at,
                    width: scrollbar_size,
                    height: scrollbar_size,
                    fillStyle: 'White',
                    lineWidth: 1,
                    strokeStyle: 'Black'
                });

                //Scrollbar character up
                layer.text('▲', {
                    x: button1_left,
                    y: at,
                    color: 'Blue',
                    width: scrollbar_size,
                    height: scrollbar_size,
                    textAlign: 'center',
                    fontSize: fontSize
                });

                //Scrollbar button down
                layer.rect({
                    x: button1_left,
                    y: button2_top,
                    width: scrollbar_size,
                    height: scrollbar_size,
                    fillStyle: 'White',
                    lineWidth: 1,
                    strokeStyle: 'Black'
                });

                //Scrollbar character down
                layer.text('▼', {
                    x: button1_left,
                    y: button2_top + (scrollbar_size / 7.5),
                    color: 'Blue',
                    width: scrollbar_size,
                    height: scrollbar_size,
                    textAlign: 'center',
                    fontSize: fontSize
                });
            }
        }
    };

    UI_Element.prototype.mousedown = function (x, y) {
        var self = this;
        if(document.scrolling == null){
            var scrolling = 0;
            if (colide_button1(self, x, y)) {
                scrolling = -1;
            }
            else if (colide_button2(self, x, y)) {
                scrolling = 1;
            }

            if(scrolling != 0){
                document.scrolling_data.element = self;
                self.scrolling = scrolling;
            }
        }
    };

    UI_Element.prototype.clear = function (layer) {
        var self = this;
        layer.clear(self.clearX-self.parent.padding, self.clearY-self.parent.padding, self.clearWidth, self.clearHeight);
    };

    UI_Element.prototype.setStateStyle = function (state, style, value) {
        var self = this;
        var tmp = self.state;
        self.state = state;
        self[style] = value;
        self.state = tmp;
        return self;
    };

    var fire_change = function(self){
        var length = self.contents.length;
        var i;
        for (i = 0; i < length; i++) {
            save_state(self.contents[i]);
            self.contents[i].changed = true;
        }
    };

    var save_state = function (self) {
        self.oldWidth = self.realWidth;
        self.oldHeight = self.realHeight;
        self.oldLeft = self.absoluteLeft;
        self.oldTop = self.absoluteTop;
        self.oldBorderWidth = self.borderWidth;
        self.oldBackgroundOpacity = self.backgroundOpacity;
        self.oldPadding = self.padding;
        fire_change(self);
    };

    var calc_size = function (size, total) {
        if (/[0-9]+(.\[0-9]+)?%/.test(size)) {
            var pc = parseFloat(size);
            return (total * pc) / 100
        }
        return size;
    };

    var calculate_align = function (align, objSize, contSize) {
        switch (align) {
            case 'top':
            case 'left':
                return 0;
                break;
            case 'center':
                return (contSize / 2) - (objSize / 2);
                break;
            case 'bottom':
            case 'right':
                return contSize - objSize;
                break;
        }
    };

    var colide_button1 = function (self, x, y) {
        var sw = self.scrollWidth;
        var sx = self.scrollButton1Left;
        var sy = self.scrollButton1Top;
        return x >= sx && x <= sx + sw && y >= sy && y <= sy + sw;
    };

    var colide_button2 = function (self, x, y) {
        var sw = self.scrollWidth;
        var sx = self.scrollButton2Left;
        var sy = self.scrollButton2Top;
        return x >= sx && x <= sx + sw && y >= sy && y <= sy + sw;
    };


    root.UI_Element = UI_Element;
})(RPG);