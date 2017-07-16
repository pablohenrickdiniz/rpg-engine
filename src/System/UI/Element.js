(function(root){
    if(root.UI == undefined){
        throw "Element requires UI"
    }

    var UI = root.UI;

    var Element = function(options,tag){
        var self = this;
        options = options || {};
        self.tag = tag || 'div';
        initialize(self);
        self.parent = options.parent || null;
        self.id = options.id;
        self.listeners = [];
        self.class = options.class || '';
        self.draggable = options.draggable || false;
        self.children = [];
        self.display = options.display || 'block';
        self.visible = options.visible != false;
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

    Element.prototype.add = function(el){
        var self = this;
        if(el instanceof Element && el != self && self.children.indexOf(el) == -1){
            self.children.push(el);
            self.element.appendChild(el.element);
            el.parent = self;
        }
    };

    Element.prototype.remove = function(el){
        var self = this;
        var index = self.children.indexOf(el);
        if(index != -1){
            self.children.splice(index,1);
            self.element.removeChild(el.element);
            self.element.parent = null;
        }
    };

    Element.prototype.destroy = function(){
        var self = this;
       if(self.parent){
          self.parent.remove(self);
       }
    };

    function initialize(self){
        var parent = null;
        var element = null;
        var id = null;
        var className = '';
        var visible = true;

        Object.defineProperty(self,'parent',{
            get:function(){
                return parent;
            },
            set:function(p){
                if((p == UI || p instanceof Element || p == null) && p != parent){
                    if(parent != null){
                        parent.remove(self);
                    }
                    parent = p;
                    if(parent != null){
                        parent.add(self);
                    }
                }
            }
        });

        Object.defineProperty(self,'visible',{
            get:function(){
                return visible;
            },
            set:function(v){
                v = v?true:false;
                if(v != visible){
                    visible = v;
                    if(visible){
                        self.element.style.display = self.display;
                    }
                    else{
                        self.element.style.display = 'none';
                    }
                }
            }
        });

        Object.defineProperty(self,'element',{
            get:function(){
                if(element == null){
                    element = document.createElement(self.tag);
                    element.draggable = self.draggable;
                    if(self.visible){
                        element.style.display = self.display;
                    }
                    else{
                        element.style.display = 'none;';
                    }
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

    Element.prototype.findByClass = function(className,results){
        var self = this;
        results = results == undefined?[]:results;
        var length = self.children.length;
        for(var i =0; i < length;i++){
            var child = self.children[i];
            if(child.hasClass(className) && results.indexOf(child) == -1){
                results.push(child);
            }
            child.findByClass(className,results);
        }
        return results;
    };

    Element.prototype.findById = function(id){
        var self = this;
        var result = null;
        var length = self.children.length;
        for(var i =0; i < length;i++){
            var child = self.children[i];
            if(child.id == id){
               result = child;
               break;
            }

            result = child.findById(id);
            if(result != null){
                break;
            }
        }
        return result;
    };

    Element.prototype.hasClass = function(className){
        var self = this;
        var tmp = self.class.split(' ');
        return tmp.indexOf(className) != -1;
    };

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
            if(e.target == element){
                self.trigger('drag',[e]);
            }
        });

        element.addEventListener('dragstart',function(e){
            if(e.target == element){
                self.trigger('dragstart',[e]);
            }
        });

        element.addEventListener('dragend',function(e){
            if(e.target == element){
                self.trigger('dragend',[e]);
                e.preventDefault();
                return false;
            }
        });

        element.addEventListener('drop',function(e){
            if(e.target == element){
                self.trigger('drop',[e]);
                e.preventDefault();
                return false;
            }
        });

        element.addEventListener('dragenter',function(e){
            if(e.target == element){
                self.trigger('dragenter',[e]);
                e.preventDefault();
                return false;
            }
        });

        element.addEventListener('dragleave',function(e){
            if(e.target == element){
                self.trigger('dragleave',[e]);
            }
        });

        element.addEventListener('dragover',function(e){
            if(e.target == element){
                self.trigger('dragover',[e]);
                e.preventDefault();
                return false;
            }
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
    };

    UI.classes.Element = Element;
})(RPG);