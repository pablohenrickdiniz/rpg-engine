/**
 * @requires Element.js
 * @requires Menu_Item.js
 */
(function(root){
    let UI = root.UI,
        Element = UI.Element,
        Menu_Item = UI.Menu_Item;

    /**
     *
     * @param options {object}
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
     * @param item {Menu_Item}
     */
    Menu.prototype.addItem = function(item){
        let self = this;
        if(item instanceof Menu_Item && self.items.indexOf(item) === -1){
            self.items.push(item);
            item.parent = self;
            self.element.appendChild(item.element);
        }
    };

    /**
     *
     * @param item {Menu_Item}
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
     * @param self {Menu}
     */
    function initialize(self){
        let items = [];

        Object.defineProperty(self,'items',{
            /**
             *
             * @returns {Array}
             */
            get:function(){
                return items;
            },
            /**
             *
             * @param i {Array}
             */
            set:function(i){
                if(i instanceof Array){
                    let c = {}.constructor;
                    let length = i.length;
                    let Menu_Item = UI.Menu_Item;
                    for(let j = 0; j < length;j++){
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

    Object.defineProperty(UI,'Menu',{
        /**
         *
         * @returns {Menu}
         */
       get:function(){
           return Menu;
       }
    });
})(window);