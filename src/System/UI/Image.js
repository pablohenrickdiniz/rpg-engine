'use strict';
(function(root){
    if(!root.UI){
        throw "Image requires UI";
    }

    if(!root.UI.Element){
        throw "Image requires Element";
    }

    let UI = root.UI,
        Element = UI.Element;

    /**
     *
     * @param options
     * @constructor
     */
    let Image = function(options){
        let self = this;
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
        let src = '';

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

    Object.defineProperty(UI,'Image',{
        /**
         *
         * @returns {Image}
         */
       get:function(){
           return Image;
       }
    });
})(RPG);