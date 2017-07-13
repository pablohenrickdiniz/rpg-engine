(function(root){
    if(root.UI == undefined){
        throw "Menu_Item requires UI"
    }


    var UI = root.UI;

    var Menu_Item = function(options){
        var self = this;
        initialize(self);
        options = options || {};
        self.parent = options.parent || null;
        self.text = options.text || '';
    };


    Menu_Item.prototype.show = function(){
        var self = this;
        self.element.style.display = 'inline-block';
    };

    Menu_Item.prototype.hide = function(){
        var self = this;
        self.element.style.display = 'none';
    };

    Menu_Item.prototype.remove = function(){
        var self = this;
        var parent = self.parent;
        var element = self.element;
        if(element.parentNode){
            element.parentNode.removeChild(element);
        }
        if(parent){
            parent.removeItem(self);
        }
    };

    function initialize(self){
        var element = null;
        var parent = null;

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

        Object.defineProperty(self,'parent',{
            get:function(){
                return parent;
            },
            set:function(p){
                var Menu = UI.Menu;
                if(p instanceof Menu && p != parent){
                    if(parent != null){
                        parent.removeItem(self);
                    }
                    parent = p;
                    parent.addItem(self);
                }
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

        Object.defineProperty(self,'id',{
            get:function(){
                return self.element.id;
            },
            set:function(i){
                if(typeof i == 'string'){
                    self.element.id = i;
                }
            }
        });
    }

    UI.classes.Menu_Item = Menu_Item;
})(RPG);