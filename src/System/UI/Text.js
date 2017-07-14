(function(root){
    if(root.UI == undefined){
        throw "Text requires UI"
    }

    if(root.UI.classes.Element == undefined){
        throw "Text requires Element";
    }

    var UI = root.UI,
        Element = UI.classes.Element;

    var Text = function(options){
        var self = this;
        options = options || {};
        options.tag = options.tag || 'p';
        Element.call(self,options);
        initialize(self);
    };

    Text.prototype = Object.create(Element.prototype);
    Text.prototype.constructor = Text;

    function initialize(self){
        var element = null;
        var value = '';

        Object.defineProperty(self,'element',{
            get:function(){
                if(element == null){
                    element = document.createElement(self.tag);
                    element.setAttribute("class",self.class);
                    if(self.id != null){
                        element.id = self.id;
                    }
                    Element.bind(self,element);
                }
                return element;
            }
        });

        Object.defineProperty(self,'value',{
            get:function(){
                return value;
            },
            set:function(v){
                if(v != value){
                    value = v;
                    self.element.innerHTML = value;
                }
            }
        });
    }

    UI.classes.Text = Text;
})(RPG);