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
        initialize(self);
        Element.call(self,options);
        self.parent = options.parent || null;
        self.text = options.text || '';
    };

    Menu_Item.prototype = Object.create(Element.prototype);
    Menu_Item.prototype.constructor = Menu_Item;

    Menu_Item.prototype.show = function(){
        var self = this;
        self.element.style.display = 'inline-block';
    };


    function initialize(self){
        var element = null;

        Object.defineProperty(self,'element',{
            get:function(){
                if(element == null){
                    element = document.createElement('li');
                    element.setAttribute('class','menu-item');
                    element.style.color = 'white';
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