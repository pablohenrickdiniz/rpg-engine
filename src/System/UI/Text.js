/**
 * @requires Element.js
 */
(function(root){
    let UI = root.UI,
        Element = UI.Element;

    /**
     *
     * @param options {object}
     * @param tag {string}
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

    /**
     *
     * @param self {Text}
     */
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
             * @param v {string}
             */
            set:function(v){
                if(v !== value){
                    value = v;
                    self.element.innerHTML = value;
                }
            }
        });
    }

    Object.defineProperty(UI,'Text',{
        /**
         *
         * @returns {Text}
         */
        get:function(){
            return Text;
        }
    });
})(window);