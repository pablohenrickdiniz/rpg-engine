(function (root) {
    if (root.UI_Element == undefined) {
        throw "UI_Text requires UI_Element"
    }

    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    let UI_Element = root.UI_Element;

    /**
     *
     * @param parent
     * @param options
     * @constructor
     */
    let UI_Text = function (parent, options) {
        let self = this;
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

    /**
     *
     * @param layer
     */
    UI_Text.prototype.update = function (layer) {
        let self = this;
        if (self.visible && self.visibleOnScreen) {
            let parent = self.parent;

            //var al = self.absoluteLeft;
            //var at = self.absoluteTop;
            //var pcw = parent?parent.containerWidth:0;
            //var pch = parent?parent.containerHeight:0;
            //var sl = parent?parent.scrollLeft:0;
            //var st = parent?parent.scrollTop:0;
            //
            //var sub_height = 0;
            //var sub_width = 0;
            //var diff = 0;
            ////
            ////if(st > (self.realTop+self.realHeight-pch)){
            ////    sub_height = st - (self.realTop+self.realHeight-pch);
            ////}
            ////
            ////if(st < self.realTop){
            ////    diff = self.realTop-st;
            ////    sub_height += diff;
            ////}
            ////else{
            ////    at -= self.realTop;
            ////}
            //
            //
            //var height = pch-sub_height;
            //var width =  pcw-sub_width;
            //
            //if(self.name = 'text_element_2'){
            //    console.log(self.absoluteTop);
            //}
            //
            //
            //layer.rect({
            //    x: al,
            //    y: at,
            //    width: width,
            //    height: height,
            //    fillStyle: self.backgroundColor,
            //    strokeStyle: self.borderColor,
            //    lineWidth: self.borderWidth,
            //    backgroundOpacity: self.backgroundOpacity,
            //    borderOpacity: self.borderOpacity,
            //    borderColor: self.borderColor
            //});

            //if (self.text.length > 0) {
            //    layer.text(self.processedText, {
            //        x: al,
            //        y: at,
            //        sx: sl,
            //        sy: st,
            //        width: width,
            //        height: height,
            //        fontSize: self.fontSize,
            //        fillStyle: self.color,
            //        textAlign: self.textAlign,
            //        round:true
            //    });
            //
            //    if (parent && parent.padding > 0) {
            //        let pp = parent.padding;
            //        let pal = parent.absoluteLeft;
            //        let pat = parent.absoluteTop;
            //        let prw = parent.realWidth;
            //        layer.clear(pal, pat, prw, pp);
            //        layer.clear(pal, pat + parent.realHeight - pp, prw, pp);
            //    }
            //}
        }
    };
    /**
     *
     * @param self
     */
    let initialize = function (self) {
        let text = '';
        let fontSize = [10];
        let fontFamilly = ['Arial'];
        let color = ['black'];
        let textAlign = ['left'];
        let processedText = [];

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
    /**
     *
     * @param self
     */
    let update_size = function (self) {
        if(self.initialized){
            let fontSize = self.fontSize;
            let processed = processText(self.text, {
                width: self.parent.containerWidth,
                fontSize: fontSize,
                fontFamilly: self.fontFamilly
            });
            self.processedText = processed;
            self.height = processed.length * fontSize;
        }
    };
    /**
     *
     * @param text
     * @param options
     * @returns {Array}
     */
    let processText = function (text, options) {
        let width = options.width || null;
        let fontSize = options.fontSize || 10;
        let fontFamilly = options.fontFamily || 'Arial';
        let canvas = document.createElement('canvas');
        ctx.font = fontSize + 'px ' + fontFamilly;
        text = text.split(' ');
        let length = text.length;
        let lines = [];
        let oldTextWidth = 0;
        let textWidth = 0;
        let line = [];
        let i;
        let line_length;

        for (i = 0; i < length; i++) {
            line.push(text[i]);
            let join = line.join(' ');
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