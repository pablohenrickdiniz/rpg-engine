'use strict';
(function(root){
    if(root.UI === undefined){
        throw "Text requires UI";
    }

    if(root.UI.classes.Element === undefined){
        throw "Text requires Element";
    }

    let UI = root.UI,
        Element = UI.classes.Element;

    /**
     *
     * @param options
     * @param tag
     * @constructor
     */
    let Text = function(options,tag){
        let self = this;
        tag = tag || 'p';
        options = options || {};
        Element.call(self,options,tag);
        initialize(self);
        self.value = options.value || '';
    };

    Text.prototype = Object.create(Element.prototype);
    Text.prototype.constructor = Text;

    function initialize(self){
        let value = '';

        Object.defineProperty(self,'value',{
            /**
             *
             * @returns {string}
             */
            get:function(){
                return value;
            },
            /**
             *
             * @param v
             */
            set:function(v){
                if(v !== value){
                    value = v;
                    self.element.innerHTML = value;
                }
            }
        });
    }

    UI.classes.Text = Text;
})(RPG);