(function(root){
    if(root.UI == undefined){
        throw "Element requires UI"
    }

    var UI = root.UI;

    var Element = function(options){
        var self = this;
        initialize(self);
        options = options || {};
        self.parent = options.parent || null;
        self.id = options.id;
        self.listeners = [];
        registerListeners(self,options);
    };

    Element.prototype.addEventListener = function(event,callback){
        var self = this;
        if(!self.listeners[event]){
            self.listeners[event] = [];
        }
        if(self.listeners[event].indexOf(callback) == -1){
            self.listeners[event].push(callback);
        }
    };

    Element.prototype.removeEventListener = function(event,callback){
        var self = this;
        if(self.listeners[event]){
            var index = self.listeners[event].indexOf(callback);
            if(index != -1){
                self.listeners[event].splice(index,1);
            }
        }
    };

    Element.prototype.trigger = function(event,args){
        var self = this;
        if(self.listeners[event]){
            var length = self.listeners[event].length;
            for(var i =0; i < length;i++){
                self.listeners[event][i].apply(self,args);
            }
        }
    };

    Element.prototype.show = function(){
        var self = this;
        self.element.style.display = 'block';
    };

    Element.prototype.hide = function(){
        var self = this;
        self.element.style.display = 'none';
    };


    function initialize(self){
        var parent = null;


        Object.defineProperty(self,'parent',{
            get:function(){
                return parent;
            },
            set:function(p){
                if(p instanceof Node && p != parent){
                    var element = self.element;
                    if(parent != null){
                        parent.removeChild(element);
                    }
                    parent = p;
                    parent.appendChild(element);
                }
            }
        });


        Object.defineProperty(self,'id',{
            get:function(){
                return self.element.id;
            },
            set:function(i){
                if(typeof i == 'string'){
                    self.element.id = i;
                }
            }
        });

        /*mouse events*/
        self.element.addEventListener('mousedown',function(e){
            switch(e.which){
                case 1:
                    self.trigger('leftclick');
                    break;
                case 2:
                    self.trigger('middleclick');
                    break;
                case 3:
                    self.trigger('rightclick');
                    break;
            }
            e.preventDefault();
            return false;
        });

        self.element.addEventListener('onclick',function(e){e.preventDefault();return false;});
        self.element.addEventListener('ondblclick',function(e){
            e.preventDefault();
            self.trigger('doubleclick');
            return false;
        });
        self.element.addEventListener('onmouseover',function(e){
            e.preventDefault();
            self.trigger('mouseover');
            return false;
        });
        self.element.addEventListener('onmouseout',function(e){
            e.preventDefault();
            self.trigger('mouseout');
            return false;
        });

        /*keyboard events*/
        self.element.addEventListener('onkeydown',function(e){
            e.preventDefault();
            self.trigger('keydown');
            return false;
        });

        self.element.addEventListener('onkeypress',function(e){
            e.preventDefault();
            self.trigger('keypress');
            return false;
        });

        self.element.addEventListener('onkeyup',function(e){
            e.preventDefault();
            self.trigger('keyup');
            return false;
        });

        self.element.addEventListener('onfocus',function(e){
            e.preventDefault();
            self.trigger('focus');
            return false;
        });

        self.element.addEventListener('onfocusout',function(e){
            e.preventDefault();
            self.trigger('focusout');
            return false;
        });

        /*drag and drop events*/
        self.element.addEventListener('ondrag',function(e){
            e.preventDefault();
            self.trigger('drag');
            return false;
        });

        self.element.addEventListener('ondragstart',function(e){
            e.preventDefault();
            self.trigger('dragstart');
            return false;
        });

        self.element.addEventListener('ondragend',function(e){
            e.preventDefault();
            self.trigger('dragend');
            return false;
        });

        self.element.addEventListener('ondrop',function(e){
            e.preventDefault();
            self.trigger('drop');
            return false;
        });

        self.element.addEventListener('ondragenter',function(e){
            e.preventDefault();
            self.trigger('dragenter');
            return false;
        });

        self.element.addEventListener('ondragleave',function(e){
            e.preventDefault();
            self.trigger('dragleave');
            return false;
        });

        self.element.addEventListener('ondragover',function(e){
            e.preventDefault();
            self.trigger('dragover');
            return false;
        });

        /*Disable clipboard*/
        self.element.addEventListener('oncopy',function(e){
            e.preventDefault();
            return false;
        });
        self.element.addEventListener('oncut',function(e){
            e.preventDefault();
            return false;
        });
        self.element.addEventListener('onpaste',function(e){
            e.preventDefault();
            return false;
        });
    }

    function registerListeners(self,options){
        if(options.leftclick){
            self.addEventListener('leftclick',options.leftclick)
        }
        if(options.middleclick){
            self.addEventListener('middleclick',options.middleclick)
        }
        if(options.rightclick){
            self.addEventListener('rightclick',options.rightclick)
        }
        if(options.doubleclick){
            self.addEventListener('doubleclick',options.doubleclick)
        }
        if(options.mouseover){
            self.addEventListener('mouseover',options.mouseover);
        }
        if(options.mouseout){
            self.addEventListener('mouseout',options.mouseout);
        }
        if(options.keydown){
            self.addEventListener('keydown',options.keydown);
        }
        if(options.keypress){
            self.addEventListener('keypress',options.keypress);
        }
        if(options.keyup){
            self.addEventListener('keyup',options.keyup);
        }
    }

    UI.classes.Element = Element;
})(RPG);