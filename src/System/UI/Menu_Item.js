'use strict';
(function(root){
    if(!root.UI){
        throw "Menu_Item requires UI";
    }

    if(!root.UI.Element){
        throw "Menu_Item requires Element";
    }

    let UI = root.UI,
        Element = root.UI.Element;

    /**
     *
     * @param options {object}
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
     * @param self {Menu_Item}
     */
    function initialize(self){
        Object.defineProperty(self,'text',{
            /**
             *
             * @returns {string}
             */
            get:function(){
                return self.element.innerHTML;
            },
            /**
             *
             * @param t {string}
             */
            set:function(t){
                self.element.innerHTML = t;
            }
        });
    }

    Object.defineProperty(UI,'Menu_Item',{
        /**
         *
         * @returns {Menu_Item}
         */
       get:function(){
           return Menu_Item;
       }
    });
})(RPG);