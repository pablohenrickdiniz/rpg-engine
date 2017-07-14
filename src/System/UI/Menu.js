(function(root){
    if(root.UI == undefined){
        throw "Menu requires UI"
    }

    if(root.UI.classes.Element == undefined){
        throw "Menu requires Element";
    }

    var UI = root.UI,
        Element = UI.classes.Element;

    var Menu = function(options){
        var self = this;
        options = options || {};
        Element.call(self,options);
        initialize(self);
        self.items = options.items || [];
    };

    Menu.prototype = Object.create(Element.prototype);
    Menu.prototype.constructor = Menu;

    Menu.prototype.addItem = function(item){
        var self = this;
        if(item instanceof UI.classes.Menu_Item && self.items.indexOf(item) == -1){
            self.items.push(item);
            item.parent = self;
            self.element.appendChild(item.element);
        }
    };

    Menu.prototype.removeItem = function(item){
        var self = this;
        var index = self.items.indexOf(item);
        if(index != -1){
            self.items.splice(index,1);
            item.remove();
        }
    };

    function initialize(self){
        var element = null;
        var parent = null;
        var items = [];

        Object.defineProperty(self,'element',{
            get:function(){
                if(element == null){
                    element = document.createElement('ul');
                    element.setAttribute('class',self.class);
                    Element.bind(self,element);
                }
                return element;
            }
        });


        Object.defineProperty(self,'items',{
            get:function(){
                return items;
            },
            set:function(i){
                if(i instanceof Array){
                    var c = {}.constructor;
                    var length = i.length;
                    var Menu_Item = UI.classes.Menu_Item;
                    for(var j =0; j < length;j++){
                        if(i[j] instanceof Menu_Item){
                            self.addItem(i[j]);
                        }
                        else if(i[j].constructor == c){
                            var config = i[j];
                            config.parent = self;
                            self.addItem(new Menu_Item(config));
                        }
                    }
                }
            }
        });
    }

    UI.classes.Menu = Menu;
})(RPG);