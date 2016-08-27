(function (root) {
    if (root.Viewport == undefined) {
        throw "UI_Element requires Viewport"
    }

    if (root.Document == undefined) {
        throw "UI_Element requires Document"
    }

    if (root.UI_Element == undefined) {
        throw "UI_Block requires UI_Element"
    }

    var UI_Element = root.UI_Element;

    var UI_Block = function (parent, options) {
        var self = this;
        options = options || {};
        UI_Element.call(self, parent, options);
        initialize(self);
        self.left = options.left || 0;
        self.top = options.top || 0;
        self.bottom = options.bottom || 0;
        self.right = options.right || 0;
        self.verticalAlign = options.verticalAlign || null;
        self.horizontalAlign = options.horizontalAlign || null;
    };

    UI_Block.prototype = Object.create(UI_Element.prototype);
    UI_Block.prototype.constructor = UI_Block;

    UI_Block.prototype.update = function (layer) {
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
            UI_Element.prototype.update.call(self,layer);
        }
    };


    var initialize = function (self) {
        var right = [0];
        var bottom = [0];
        var old_right = right;
        var old_bottom = bottom;
        var horizontalAlign = [null];
        var verticalAlign = [null];

        Object.defineProperty(self, 'realLeft', {
            get: function () {
                var sum = 0;
                var ha = horizontalAlign[self.state] || horizontalAlign[0];
                var l = self.left;

                if (ha != null) {
                    sum = calculate_align(ha, self.realWidth, self.parent.realWidth);
                }

                if (/[0-9]+(.\[0-9]+)?%/.test(l)) {
                    var pc = parseFloat(l);
                    return (self.parent.realWidth * pc) / 100
                }
                return l + sum;
            }
        });

        Object.defineProperty(self, 'realTop', {
            get: function () {
                var sum = 0;
                var va = verticalAlign[self.state] || verticalAlign[0];
                var t = self.top;

                if (va != null) {
                    sum = calculate_align(va, self.realHeight, self.parent.realHeight);
                }

                if (/[0-9]+(.\[0-9]+)?%/.test(t)) {
                    var pc = parseFloat(t);
                    return (self.parent.realHeight * pc) / 100
                }
                return t + sum;
            }
        });


        Object.defineProperty(self, 'right', {
            get: function () {
                return right[self.state] || right[0];
            },
            set: function (r) {
                if (r != right[self.state]) {
                    old_right = right[self.state];
                    right[self.state] = r;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'bottom', {
            get: function () {
                return bottom[self.state] || bottom[0];
            },
            set: function (b) {
                if (b != bottom[self.state]) {
                    old_bottom = bottom[self.state];
                    bottom[self.state] = b;
                    self.changed = true;
                }
            }
        });


        Object.defineProperty(self, 'absoluteLeft', {
            get: function () {
                return self.realLeft + self.parent.absoluteLeft;
            }
        });

        Object.defineProperty(self, 'absoluteTop', {
            get: function () {
                return self.realTop + self.parent.absoluteTop;
            }
        });


        Object.defineProperty(self, 'horizontalAlign', {
            get: function () {
                return horizontalAlign[self.state] || horizontalAlign[0];
            },
            set: function (ha) {
                if (ha != horizontalAlign[self.state]) {
                    horizontalAlign[self.state] = ha;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'verticalAlign', {
            get: function () {
                return verticalAlign[self.state] || verticalAlign[0];
            },
            set: function (va) {
                if (va != verticalAlign[self.state]) {
                    verticalAlign[self.state] = va;
                    self.changed = true;
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
                return (contSize / 2) - (objSize / 2);
                break;
            case 'bottom':
            case 'right':
                return contSize - objSize;
                break;
        }
    };

    root.UI_Block = UI_Block;
})(RPG);