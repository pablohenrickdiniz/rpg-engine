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
        self.backgroundOpacity = options.backgroundOpacity || 100;
        self.borderOpacity = options.borderOpacity || 100;
        self.backgroundColor = options.backgroundColor || 'transparent';
        self.borderColor = options.borderColor || 'yellow';
        self.borderWidth = options.borderWidth || 0;
        self.borderStyle = options.borderStyle || 'rounded';
        self.color = options.color || 'black';
        self.fontSize = options.fontSize || 10;
        self.visible = options.visible || false;
        self.textAlign = options.textAlign || 'left';
        self.draggable = false;
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
        var parent = null;
        var state = 0;
        var cursor = ['default'];
        var backgroundOpacity = [100];
        var color = [null];
        var fontSize = [null];
        var textAlign = ['left'];
        var horizontalAlign = [null];
        var verticalAlign = [null];


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
                return self.realLeft + parent.absoluteLeft;
            }
        });

        Object.defineProperty(self, 'absoluteTop', {
            get: function () {
                return self.realTop + parent.absoluteTop;
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
                return old_width + (old_borderWidth * 2);
            }
        });

        Object.defineProperty(self, 'clearHeight', {
            get: function () {
                return old_height + (old_borderWidth * 2);
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

        Object.defineProperty(self, 'color', {
            get: function () {
                return color[state] || color[0];
            },
            set: function (c) {
                if (c != color[state]) {
                    color[state] = c;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'fontSize', {
            get: function () {
                return fontSize[state] || fontSize[0];
            },
            set: function (fs) {
                if (fs != fontSize[state]) {
                    fontSize[state] = fs;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'textAlign', {
            get: function () {
                return textAlign[state] || textAlign[0];
            },
            set: function (t) {
                if (t != textAlign[state]) {
                    textAlign[state] = t;
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
    };

    UI_Element.prototype.clear = function (layer) {
        var self = this;
        layer.clear(self.clearX, self.clearY, self.clearWidth, self.clearHeight);
    };

    UI_Element.prototype.setStateStyle = function (state, style, value) {
        var self = this;
        var tmp = self.state;
        self.state = state;
        self[style] = value;
        self.state = tmp;
        return self;
    };

    var save_state = function (self) {
        self.oldWidth = self.realWidth;
        self.oldHeight = self.realHeight;
        self.oldLeft = self.absoluteLeft;
        self.oldTop = self.absoluteTop;
        self.oldBorderWidth = self.borderWidth;
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


    root.UI_Element = UI_Element;
})(RPG);