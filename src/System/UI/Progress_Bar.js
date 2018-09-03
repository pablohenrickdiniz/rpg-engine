'use strict';
(function(root){
    if(!root.UI){
        throw "Progress_Bar requires UI";
    }

    if(!root.UI.Element){
        throw "Progress_Bar requires Element";
    }

    let UI = root.UI,
        Element = UI.Element;

    /**
     *
     * @param options
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

    function initialize(self){
        Object.defineProperty(self,'progress',{
            get:function(){
                return self.element.value;
            },
            set:function(p){
                p = parseFloat(p);
                if(!isNaN(p)){
                    self.element.value = p;
                    self.element.innerHTML = p+'%';
                }
            }
        });

        Object.defineProperty(self,'total',{
            get:function(){
                return self.element.max;
            },
            set:function(total){
                total = parseFloat(total);
                if(!isNaN(total)){
                    self.element.max = total;
                }
            }
        });

        Object.defineProperty(self,'text',{
            get:function(){
                return self.element.getAttribute("text");
            },
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
})(RPG);