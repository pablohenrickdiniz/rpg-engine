(function(root){
    if(root.UI == undefined){
        throw "Menu requires UI"
    }

    if(root.UI.classes.Element == undefined){
        throw "Button requires Element";
    }

    var UI = root.UI,
        Element = UI.classes.Element;

    var Button = function(options){
        var self = this;
        options = options || {};
        Element.call(self,options);
        initialize(self);
        self.text = options.text || '';
        self.draggable = options.draggable || false;
    };

    Button.prototype = Object.create(Element.prototype);
    Button.prototype.constructor = Button;

    function initialize(self){
        var element = null;
        var text = '';

        Object.defineProperty(self,'element',{
            get:function(){
                if(element == null){
                    element = document.createElement('button');
                    element.setAttribute('class',self.class);
                    Element.bind(self,element);
                }
                return element;
            }
        });

        Object.defineProperty(self,'text',{
            get:function(){
                return text;
            },
            set:function(t){
                if(t != text){
                    text = t;
                    self.element.innerHTML = text;
                }
            }
        });
    }

    UI.classes.Button = Button;
})(RPG);