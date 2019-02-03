/**
 * @requires Element.js
 */
(function(root){
    let UI = root.UI,
        Element = UI.Element;

    /**
     *
     * @param options {object}
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
     * @param self {Button}
     */
    function initialize(self){
        let text = '';
        Object.defineProperty(self,'text',{
            /**
             *
             * @returns {string}
             */
            get:function(){
                return text;
            },
            /**
             *
             * @param t {string}
             */
            set:function(t){
                if(t !== text){
                    text = t;
                    self.element.innerHTML = text;
                }
            }
        });
    }

    Object.defineProperty(UI,'Button',{
        /**
         *
         * @returns {Button}
         */
        get:function(){
            return Button;
        }
    });
})(window);