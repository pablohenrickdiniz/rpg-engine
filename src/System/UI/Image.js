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
        Element.call(self,options);
        initialize(self);
        self.draggable = options.draggable || false;
    };

    Image.prototype = Object.create(Element.prototype);
    Image.prototype.constructor = Image;

    function initialize(self){
        var element = null;
        var src = '';

        Object.defineProperty(self,'element',{
            get:function(){
                if(element == null){
                    element = document.createElement('img');
                    element.setAttribute("class",self.class);
                    Element.bind(self,element);
                }
                return element;
            }
        });

        Object.defineProperty(self,'src',{
            get:function(){
                return src;
            },
            set:function(s){
                if(s != src){
                    src = s;
                    self.element.setAttribute("src",src);
                }
                return element;
            }
        });
    }

    UI.classes.Image = Image;
})(RPG);