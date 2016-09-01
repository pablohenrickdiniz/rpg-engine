(function (root) {
    if (root.UI_Element == undefined) {
        throw "UI_Text requires UI_Element"
    }

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var UI_Element = root.UI_Element;


    var UI_Text = function (parent, options) {
        var self = this;
        options = options || {};
        initialize(self);
        UI_Element.call(self, parent, options);
        self.text = options.text || '';
        self.color = options.color || 'black';
        self.fontSize = options.fontSize || 10;
        self.textAlign = options.textAlign || 'left';
        self.type = 'Text';
        self.width = '100%';
    };

    UI_Text.prototype = Object.create(UI_Element.prototype);
    UI_Text.prototype.constructor = UI_Text;


    UI_Text.prototype.update = function (layer) {
        var self = this;
        if (self.visible && self.parent.visible) {
            var parent = self.parent;


            var al = self.absoluteLeft;
            var at = self.absoluteTop;
            var pcw = parent?parent.containerWidth:0;
            var pch = parent?parent.containerHeight:0;
            var sl = parent?parent.scrollLeft:0;
            var st = parent?parent.scrollTop:0;

            layer.rect({
                x: al,
                y: at,
                width: pcw,
                height: pch,
                fillStyle: self.backgroundColor,
                strokeStyle: self.borderColor,
                lineWidth: self.borderWidth,
                backgroundOpacity: self.backgroundOpacity,
                borderOpacity: self.borderOpacity,
                borderColor: self.borderColor
            });

            if (self.text.length > 0) {
                layer.text(self.processedText, {
                    x: al,
                    y: at,
                    sx: sl,
                    sy: st,
                    width: pcw,
                    height: pch,
                    fontSize: self.fontSize,
                    fillStyle: self.color,
                    textAlign: self.textAlign,
                    round:true
                });

                if (parent && parent.padding > 0) {
                    var pp = parent.padding;
                    var pal = parent.absoluteLeft;
                    var pat = parent.absoluteTop;
                    var prw = parent.realWidth;
                    layer.clear(pal, pat, prw, pp);
                    layer.clear(pal, pat + parent.realHeight - pp, prw, pp);
                }
            }
        }
    };

    var initialize = function (self) {
        var text = '';
        var fontSize = [10];
        var fontFamilly = ['Arial'];
        var color = ['black'];
        var textAlign = ['left'];
        var processedText = [];

        Object.defineProperty(self, 'text', {
            get: function () {
                return text;
            },
            set: function (t) {
                if (text != t) {
                    text = t;
                    update_size(self);
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'fontFamilly', {
            get: function () {
                return fontFamilly;
            },
            set: function (ff) {
                if (fontFamilly != ff) {
                    fontFamilly = ff;
                    update_size(self);
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'fontSize', {
            get: function () {
                return fontSize[self.state] || fontSize[0];
            },
            set: function (fs) {
                if (fs != fontSize[self.state]) {
                    fontSize[self.state] = fs;
                    update_size(self);
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'textAlign', {
            get: function () {
                return textAlign[self.state] || textAlign[0];
            },
            set: function (t) {
                if (t != textAlign[self.state]) {
                    textAlign[self.state] = t;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'color', {
            get: function () {
                return color[self.state] || color[0];
            },
            set: function (c) {
                if (c != color[self.state]) {
                    color[self.state] = c;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'processedText', {
            get: function () {
                return processedText;
            },
            set: function (pt) {
                if (pt != processedText) {
                    processedText = pt;
                }
            }
        });
    };

    var update_size = function (self) {
        if(self.initialized){
            var fontSize = self.fontSize;
            var processed = processText(self.text, {
                width: self.parent.containerWidth,
                fontSize: fontSize,
                fontFamilly: self.fontFamilly
            });
            self.processedText = processed;
            self.height = processed.length * fontSize;
        }
    };

    var processText = function (text, options) {
        var width = options.width || null;
        var fontSize = options.fontSize || 10;
        var fontFamilly = options.fontFamily || 'Arial';
        var canvas = document.createElement('canvas');
        ctx.font = fontSize + 'px ' + fontFamilly;
        text = text.split(' ');
        var length = text.length;
        var lines = [];
        var oldTextWidth = 0;
        var textWidth = 0;
        var line = [];
        var i;
        var line_length;

        for (i = 0; i < length; i++) {
            line.push(text[i]);
            var join = line.join(' ');
            oldTextWidth = textWidth;
            textWidth = ctx.measureText(join).width;
            line_length = line.length;
            if (line_length > 1 && textWidth > width) {
                line.splice(line_length - 1, 1);
                i--;
                lines.push({
                    text: line.join(' '),
                    width: oldTextWidth
                });
                line = [];
            }
        }

        if (line.length > 0) {
            lines.push({
                text: line.join(' '),
                width: textWidth
            });
        }

        return lines;
    };


    root.UI_Text = UI_Text;
})(RPG);