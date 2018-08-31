'use strict';
(function(root){
    if(root.UI === undefined){
        throw "Menu requires UI";
    }

    if(root.UI.classes.Element === undefined){
        throw "Menu requires Element";
    }

    let UI = root.UI,
        Element = UI.classes.Element;

    /**
     *
     * @param options
     * @constructor
     */
    let Menu = function(options){
        let self = this;
        options = options || {};
        Element.call(self,options,'ul');
        initialize(self);
        self.items = options.items || [];
    };

    Menu.prototype = Object.create(Element.prototype);
    Menu.prototype.constructor = Menu;

    /**
     *
     * @param item
     */
    Menu.prototype.addItem = function(item){
        let self = this;
        if(item instanceof UI.classes.Menu_Item && self.items.indexOf(item) === -1){
            self.items.push(item);
            item.parent = self;
            self.element.appendChild(item.element);
        }
    };

    /**
     *
     * @param item
     */
    Menu.prototype.removeItem = function(item){
        let self = this;
        let index = self.items.indexOf(item);
        if(index !== -1){
            self.items.splice(index,1);
            item.remove();
        }
    };

    /**
     *
     * @param self
     */
    function initialize(self){
        let parent = null;
        let items = [];

        Object.defineProperty(self,'items',{
            get:function(){
                return items;
            },
            set:function(i){
                if(i instanceof Array){
                    let c = {}.constructor;
                    let length = i.length;
                    let Menu_Item = UI.classes.Menu_Item;
                    for(var j =0; j < length;j++){
                        if(i[j] instanceof Menu_Item){
                            self.addItem(i[j]);
                        }
                        else if(i[j].constructor === c){
                            let config = i[j];
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