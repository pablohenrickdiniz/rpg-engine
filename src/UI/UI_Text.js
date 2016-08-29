(function (root) {
    if(root.UI_Element == undefined){
        throw "UI_Text requires UI_Element"
    }

    var UI_Element = root.UI_Element;


    var UI_Text = function (parent,options) {
        var self = this;
        options = options || {};
        UI_Element.call(self,parent,options);
        initialize(self);
        self.text = options.text || '';
        self.color = options.color || 'black';
        self.fontSize = options.fontSize || 10;
        self.textAlign = options.textAlign || 'left';
        self.width = '100%';
    };

    UI_Text.prototype = Object.create(UI_Element.prototype);
    UI_Text.prototype.constructor = UI_Text;

    UI_Text.prototype.update = function(layer){
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
                borderColor: self.borderColor
            });

            if(self.text.length > 0){
                layer.text(self.text,{
                    x:self.absoluteLeft,
                    y:self.absoluteTop,
                    sx:self.parent.scrollLeft,
                    sy:self.parent.scrollTop,
                    width:self.parent.containerWidth,
                    height:self.parent.containerHeight,
                    fontSize:self.fontSize,
                    fillStyle:self.color,
                    textAlign:self.textAlign
                });
            }
        }
    };

    var initialize = function(self){
        var text = '';
        var fontSize = [10];
        var fontFamilly = ['Arial'];
        var color = ['black'];
        var textAlign = ['left'];


        Object.defineProperty(self,'text',{
            get:function(){
                return text;
            },
            set:function(t){
                if(text != t){
                    text = t;
                    self.changed = true;
                    update_size(self);
                }
            }
        });

        Object.defineProperty(self,'fontFamilly',{
            get:function(){
                return fontFamilly;
            },
            set:function(ff){
                if(fontFamilly != ff){
                    fontFamilly = ff;
                    self.changed = true;
                    update_size(self);
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
                    self.changed = true;
                    update_size(self);
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
    };

    var update_size = function(self){
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var area = calc_text_area(self.text,ctx,{
            width:self.parent.realWidth ,
            fontSize:self.fontSize,
            fontFamilly:self.fontFamilly
        });
        self.height = area.height;
    };

    var calc_text_area = function(text, ctx, options){
        var width = options.width || null;
        var fontSize = options.fontSize || 10;
        var fontFamilly = options.fontFamily || 'Arial';
        ctx.save();
        ctx.font = fontSize+'px '+fontFamilly;
        var i;
        text = text.trim();

        var lines = 0;

        if(width == null){
            width = ctx.measureText(text.join(' ')).width;
            lines = 1;
        }
        else{
            var join = '';
            var textWidth;
            var line = [];
            text = text.split(' ');
            var length = text.length;
            for (i = 0; i < length; i++) {
                line.push(text[i]);
                join = line.join(' ');
                textWidth = ctx.measureText(join).width;
                if (line.length > 1 &&  textWidth > width) {
                    line.splice(line.length-1,1);
                    i--;
                    lines++;
                    line = [];
                }
            }

            if (line.length > 0) {
                lines++;
            }
        }

        return {
            width:width,
            height:fontSize*lines
        };
    };


    root.UI_Text = UI_Text;
})(RPG);