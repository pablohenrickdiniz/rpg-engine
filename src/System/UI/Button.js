'use strict';
(function(root){
    if(root.UI === undefined){
        throw "Menu requires UI"
    }

    if(root.UI.classes.Element === undefined){
        throw "Button requires Element";
    }

    let UI = root.UI,
        Element = UI.classes.Element;

    /**
     *
     * @param options
     * @constructor
     */
    let Button = function(options){
        let self = this;
        options = options || {};
        Element.call(self,options,'button');
        initialize(self);
        self.text = options.text || '';
    };

    Button.prototype = Object.create(Element.prototype);
    Button.prototype.constructor = Button;

    /**
     *
     * @param self
     */
    function initialize(self){
        let text = '';
        Object.defineProperty(self,'text',{
            get:function(){
                return text;
            },
            set:function(t){
                if(t !== text){
                    text = t;
                    self.element.innerHTML = text;
                }
            }
        });
    }

    UI.classes.Button = Button;
})(RPG);