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
        self.draggable = options.draggable || false;
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
        if(self.parent && !self.element.parent){
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
                    element.draggable = self.draggable;
                    if(id != null){
                        element.id = id;
                    }
                    Element.bind(self,element);
                }
                return element;
            }
        });

        Object.defineProperty(self,'draggable',{
            get:function(){
                return self.element.draggable;
            },
            set:function(d){
                d = d?true:false;
                self.element.draggable = d;
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

    Element.prototype.addClass = function(className){
        var self =this;
        var old = self.class;
        old = old.split(' ');
        if(old.indexOf(className) == -1){
            old.push(className);
            self.class = old.join(' ');
        }
    };

    Element.prototype.removeClass = function(className){
        var self = this;
        var old = self.class;
        old = old.split(' ');
        var index = old.indexOf(className);
        if(index != -1){
            old.splice(index,1);
            self.class = old.join(' ');
        }
    };

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
            //e.preventDefault();
            //return false;
        });

        //element.addEventListener('onclick',function(e){e.preventDefault();return false;});
        element.addEventListener('ondblclick',function(e){
            e.preventDefault();
            self.trigger('doubleclick');
            return false;
        });
        element.addEventListener('onmouseover',function(e){
            //e.preventDefault();
            self.trigger('mouseover');
            //return false;
        });
        element.addEventListener('onmouseout',function(e){
            //e.preventDefault();
            self.trigger('mouseout');
            //return false;
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
            //e.preventDefault();
            self.trigger('focus');
            //return false;
        });

        element.addEventListener('onfocusout',function(e){
            //e.preventDefault();
            self.trigger('focusout');
            //return false;
        });

        /*drag and drop events*/


        element.addEventListener('drag',function(e){
            self.trigger('drag');
        });

        element.addEventListener('dragstart',function(e){
            self.trigger('dragstart');
        });

        element.addEventListener('dragend',function(e){
            self.trigger('dragend');
        });

        element.addEventListener('drop',function(e){
            self.trigger('drop');
        });

        element.addEventListener('dragenter',function(e){
            self.trigger('dragenter');
        });

        element.addEventListener('dragleave',function(e){
            self.trigger('dragleave');
        });

        element.addEventListener('dragover',function(e){
            self.trigger('dragover');
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