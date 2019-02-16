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
    let Progress_Bar = function(options){
        let self = this;
        options = options || {};
        Element.call(self,options,'progress');
        initialize(self);
        self.progress = options.progress || 0;
        self.total = options.total || 100;
    };

    Progress_Bar.prototype = Object.create(Element.prototype);
    Progress_Bar.prototype.constructor = Progress_Bar;

    /**
     *
     * @param self {Progress_Bar}
     */
    function initialize(self){
        Object.defineProperty(self,'progress',{
            /**
             *
             * @returns {Number}
             */
            get:function(){
                return parseFloat(self.element.value);
            },
            /**
             *
             * @param p
             */
            set:function(p){
                p = parseFloat(p);
                if(!isNaN(p)){
                    self.element.value = p;
                    self.element.innerHTML = p+'%';
                }
            }
        });

        Object.defineProperty(self,'total',{
            /**
             *
             * @returns {*}
             */
            get:function(){
                return self.element.max;
            },
            /**
             *
             * @param total
             */
            set:function(total){
                total = parseFloat(total);
                if(!isNaN(total)){
                    self.element.max = total;
                }
            }
        });

        Object.defineProperty(self,'text',{
            /**
             *
             * @returns {string}
             */
            get:function(){
                return self.element.getAttribute("text");
            },
            /**
             *
             * @param text {string}
             */
            set:function(text){
                self.element.setAttribute("text",text);
            }
        });
    }

    Object.defineProperty(UI,'Progress_Bar',{
        /**
         *
          * @returns {Progress_Bar}
         */
       get:function(){
           return Progress_Bar;
       }
    });
})(this);