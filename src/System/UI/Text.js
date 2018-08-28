'use strict';
(function(root){
    if(root.UI === undefined){
        throw "Text requires UI";
    }

    if(root.UI.classes.Element === undefined){
        throw "Text requires Element";
    }

    var UI = root.UI,
        Element = UI.classes.Element;

    /**
     *
     * @param options
     * @param tag
     * @constructor
     */
    var Text = function(options,tag){
        var self = this;
        tag = tag || 'p';
        options = options || {};
        Element.call(self,options,tag);
        initialize(self);
    };

    Text.prototype = Object.create(Element.prototype);
    Text.prototype.constructor = Text;

    function initialize(self){
        var value = '';

        Object.defineProperty(self,'value',{
            /**
             *
             * @returns {string}
             */
            get:function(){
                return value;
            },
            /*8

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