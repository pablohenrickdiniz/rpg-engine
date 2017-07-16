(function(root){
    if(root.UI == undefined){
        throw "Image requires UI"
    }

    if(root.UI.classes.Element == undefined){
        throw "Image requires Element";
    }

    var UI = root.UI,
        Element = UI.classes.Element;

    var Image = function(options){
        var self = this;
        options = options || {};
        Element.call(self,options,'img');
        initialize(self);
    };

    Image.prototype = Object.create(Element.prototype);
    Image.prototype.constructor = Image;

    function initialize(self){
        var src = '';

        Object.defineProperty(self,'src',{
            get:function(){
                return src;
            },
            set:function(s){
                if(s != src){
                    src = s;
                    self.element.setAttribute("src",src);
                }
            }
        });
    }

    UI.classes.Image = Image;
})(RPG);