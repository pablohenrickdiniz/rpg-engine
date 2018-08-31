'use strict';
(function(root){
    if(root.UI === undefined){
        throw "Menu_Item requires UI";
    }

    if(root.UI.classes.Element === undefined){
        throw "Menu_Item requires UI.Element";
    }

    let UI = root.UI,
        Element = root.UI.classes.Element;

    /**
     *
     * @param options
     * @constructor
     */
    let Menu_Item = function(options){
        let self = this;
        options = options || {};
        Element.call(self,options,'li');
        initialize(self);
        self.text = options.text || '';
    };

    Menu_Item.prototype = Object.create(Element.prototype);
    Menu_Item.prototype.constructor = Menu_Item;

    /**
     *
     * @param self
     */
    function initialize(self){
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