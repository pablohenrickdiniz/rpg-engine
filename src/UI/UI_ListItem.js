(function(root){
    if(root.UI_Block == undefined){
        throw "UI_ListItem requires UI_Block"
    }

    var UI_Block = root.UI_Block;

    var initialize = function(self){
        var text = '';
        Object.defineProperty(self,'text',{
            get:function(){
                return text;
            },
            set:function(t){
                if(text != t){
                    text = t;
                    self.changed = true;
                }
            }
        });
    };

    var UI_ListItem = function(parent,options){
        var self = this;
        options.height = options.height || 20;
        UI_Block.call(self,parent,options);
        initialize(self);
        self.width = '100%';
        self.text = options.text;
    } ;

    UI_ListItem.prototype = Object.create(UI_Block.prototype);
    UI_ListItem.prototype.constructor = UI_ListItem;

    UI_ListItem.prototype.update = function(layer){
        var self = this;

        if(self.parent.visible && self.visible){
            layer.rect({
                x:self.absoluteLeft,
                y:self.absoluteTop,
                width:self.realWidth,
                height:self.realHeight,
                fillStyle: self.backgroundColor,
                strokeStyle:self.borderColor,
                lineWidth: self.borderWidth,
                backgroundOpacity: self.backgroundOpacity,
                borderOpacity:self.borderOpacity,
                borderColor:'yellow'
            });

            layer.text(self.text,{
                x:self.absoluteLeft,
                y:self.absoluteTop,
                width:self.realWidth,
                height:self.realHeight,
                fontSize:self.fontSize,
                fillStyle:self.color,
                textAlign:self.textAlign
            });
        }
    };

    root.UI_ListItem = UI_ListItem;
})(RPG);