(function(root){
    if(root.UI == undefined){
        throw "Element requires UI"
    }

    var UI = root.UI;

    var Element = function(options){
        var self = this;
        options = options || {};
        self.tag = options.tag || 'div';
        initialize(self);
        self.parent = options.parent || null;
        self.id = options.id;
        self.listeners = [];
        self.class = options.class;
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
        self.visible = true;
        if(self.parent){
            self.parent.element.appendChild(self.element);
        }
        return self;
    };

    Element.prototype.hide = function(){
        var self = this;
        self.visible = false;
        if(self.parent){
            self.parent.element.removeChild(self.element);
        }
        return self;
    };

    function initialize(self){
        var parent = null;
        var element = null;
        var id = null;
        var className = '';

        Object.defineProperty(self,'parent',{
            get:function(){
                return parent;
            },
            set:function(p){
                if((p == UI || p instanceof Element) && p != parent){
                    parent = p;
                }
            }
        });

        Object.defineProperty(self,'element',{
            configurable:true,
            get:function(){
                if(element == null){
                    element = document.createElement(self.tag);
                    if(id != null){
                        element.id = id;
                    }
                    Element.bind(self,element);
                }
                return element;
            }
        });

        Object.defineProperty(self,'class',{
            get:function(){
                return className;
            },
            set:function(c){
                if(c != className){
                    className = c;
                    self.element.setAttribute("class",className);
                }
            }
        });


        Object.defineProperty(self,'id',{
            get:function(){
                return id;
            },
            set:function(i){
                if(typeof i == 'string' && i != id){
                    id = i;
                    self.element.id = i;
                }
            }
        });
    }


    Element.bind = function(self,element){
        /*mouse events*/
        element.addEventListener('mousedown',function(e){
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

        element.addEventListener('onclick',function(e){e.preventDefault();return false;});
        element.addEventListener('ondblclick',function(e){
            e.preventDefault();
            self.trigger('doubleclick');
            return false;
        });
        element.addEventListener('onmouseover',function(e){
            e.preventDefault();
            self.trigger('mouseover');
            return false;
        });
        element.addEventListener('onmouseout',function(e){
            e.preventDefault();
            self.trigger('mouseout');
            return false;
        });

        /*keyboard events*/
        element.addEventListener('onkeydown',function(e){
            e.preventDefault();
            self.trigger('keydown');
            return false;
        });

        element.addEventListener('onkeypress',function(e){
            e.preventDefault();
            self.trigger('keypress');
            return false;
        });

        element.addEventListener('onkeyup',function(e){
            e.preventDefault();
            self.trigger('keyup');
            return false;
        });

        element.addEventListener('onfocus',function(e){
            e.preventDefault();
            self.trigger('focus');
            return false;
        });

        element.addEventListener('onfocusout',function(e){
            e.preventDefault();
            self.trigger('focusout');
            return false;
        });

        /*drag and drop events*/
        element.addEventListener('ondrag',function(e){
            e.preventDefault();
            self.trigger('drag');
            return false;
        });

        element.addEventListener('ondragstart',function(e){
            e.preventDefault();
            self.trigger('dragstart');
            return false;
        });

        element.addEventListener('ondragend',function(e){
            e.preventDefault();
            self.trigger('dragend');
            return false;
        });

        element.addEventListener('ondrop',function(e){
            e.preventDefault();
            self.trigger('drop');
            return false;
        });

        element.addEventListener('ondragenter',function(e){
            e.preventDefault();
            self.trigger('dragenter');
            return false;
        });

        element.addEventListener('ondragleave',function(e){
            e.preventDefault();
            self.trigger('dragleave');
            return false;
        });

        element.addEventListener('ondragover',function(e){
            e.preventDefault();
            self.trigger('dragover');
            return false;
        });

        /*Disable clipboard*/
        element.addEventListener('oncopy',function(e){
            e.preventDefault();
            return false;
        });
        element.addEventListener('oncut',function(e){
            e.preventDefault();
            return false;
        });
        element.addEventListener('onpaste',function(e){
            e.preventDefault();
            return false;
        });
    }

    UI.classes.Element = Element;
})(RPG);