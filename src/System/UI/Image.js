'use strict';
(function(root){
    if(root.UI === undefined){
        throw "Image requires UI";
    }

    if(root.UI.classes.Element === undefined){
        throw "Image requires Element";
    }

    var UI = root.UI,
        Element = UI.classes.Element;

    /**
     *
     * @param options
     * @constructor
     */
    var Image = function(options){
        var self = this;
        options = options || {};
        Element.call(self,options,'img');
        initialize(self);
    };

    Image.prototype = Object.create(Element.prototype);
    Image.prototype.constructor = Image;

    /**
     *
     * @param self
     */
    function initialize(self){
        var src = '';

        Object.defineProperty(self,'src',{
            /**
             *
             * @returns {string}
             */
            get:function(){
                return src;
            },
            /**
             *
             * @param s
             */
            set:function(s){
                if(s !== src){
                    src = s;
                    self.element.setAttribute("src",src);
                }
            }
        });
    }

    UI.classes.Image = Image;
})(RPG);