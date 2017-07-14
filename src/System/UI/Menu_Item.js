(function(root){
    if(root.UI == undefined){
        throw "Menu_Item requires UI"
    }

    if(root.UI.classes.Element == undefined){
        throw "Menu_Item requires UI.Element"
    }


    var UI = root.UI,
        Element = root.UI.classes.Element;

    var Menu_Item = function(options){
        var self = this;
        options = options || {};
        Element.call(self,options);
        initialize(self);
        self.text = options.text || '';
    };

    Menu_Item.prototype = Object.create(Element.prototype);
    Menu_Item.prototype.constructor = Menu_Item;

    function initialize(self){
        var element = null;

        Object.defineProperty(self,'element',{
            get:function(){
                if(element == null){
                    element = document.createElement('li');
                    element.setAttribute('class',self.class);
                    element.style.color = 'white';
                    Element.bind(self,element);
                }

                return element;
            }
        });


        Object.defineProperty(self,'text',{
            get:function(){
                return self.element.innerHTML;
            },
            set:function(t){
                self.element.innerHTML = t;
            }
        });
    }

    UI.classes.Menu_Item = Menu_Item;
})(RPG);