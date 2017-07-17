(function(root,w){
    if(root.UI == undefined){
        throw "Element requires UI"
    }

    var UI = root.UI;
    var Element = function(options,tag){
        var self = this;
        options = options || {};
        self.tag = tag || 'div';
        initialize(self);
        self.element = options.element || null;
        self.parent = options.parent || null;
        self.id = options.id;
        self.listeners = [];
        self.class = options.class || '';
        self.draggable = options.draggable || false;
        self.children = [];
        self.display = options.display || 'block';
        self.visible = options.visible != false;
        self.width = options.width;
        self.height = options.height;
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
            el.parent = self;
            self.element.appendChild(el.element);
        }
    };

    Element.prototype.remove = function(el){
        var self = this;
        var index = self.children.indexOf(el);
        if(index != -1){
            self.children.splice(index,1);
            if(self.element == el.element.parent){
                self.element.removeChild(el.element);
                el.parent = null;
            }
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
        var draggable = false;


        Object.defineProperty(self,'bounds',{
            get:function(){
                return self.element.getBoundingClientRect();
            }
        });


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
            set:function(el){
                if(el instanceof Node && el != element){
                    while(el.firstChild){
                        el.removeChild(el.firstChild);
                    }
                    if(element){
                        while(element.firstChild){
                            element.removeChild(element.firstChild);
                        }
                    }
                    element = el;
                    bind(self);
                }
            },
            get:function(){
                if(element == null){
                    element = document.createElement(self.tag);
                    if(self.visible){
                        element.style.display = self.display;
                    }
                    else{
                        element.style.display = 'none;';
                    }
                    if(id != null){
                        element.id = id;
                    }
                    bind(self);
                }
                return element;
            }
        });

        Object.defineProperty(self,'draggable',{
            get:function(){
                return draggable;
            },
            set:function(d){
                d = d?true:false;
                if(d != draggable){
                    draggable = d;
                }
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



        Object.defineProperty(self,'left',{
            get:function(){
                return parseInt(window.getComputedStyle(self.element).left);
            },
            set:function(l){
                l = parseInt(l);
                if(!isNaN(l)){
                    self.element.style.left = l+'px';
                }
            }
        });

        Object.defineProperty(self,'top',{
            get:function(){
                return parseInt(window.getComputedStyle(self.element).top);
            },
            set:function(t){
                t = parseInt(t);
                if(!isNaN(t)){
                    self.element.style.top = t+'px';
                }
            }
        });

        Object.defineProperty(self,'width',{
            get:function(){
                return parseInt(w.getComputedStyle(self.element).width);
            },
            set:function(w){
                w = parseInt(w);
                if(!isNaN(w) && w >= 0){
                    self.element.style.width = w+'px';
                }
            }
        });

        Object.defineProperty(self,'height',{
            get:function(){
                return parseInt(w.getComputedStyle(self.element).height);
            },
            set:function(h){
                h = parseInt(h);
                if(!isNaN(h) && h >= 0){
                    self.element.style.height = h+'px';
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

    Element.prototype.empty = function(){
        var self = this;
        while(self.children.length > 0){
            self.remove(self.children[0]);
        }
    };

    Element.prototype.overlap = function(el){
        if(el instanceof Element && el != self){
            var self = this;
            var rect1 = self.bounds;
            var rect2 = el.bounds;
            return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom)
        }
        return false;
    };

    Element.prototype.findOverlaps = function(el){
        var self = this;
        var overlaps = [];
        var length = self.children.length;
        if(el != self){
            for(var i  = 0; i < length;i++){
                overlaps = overlaps.concat(self.children[i].findOverlaps(el));
            }
            if(self.overlap(el)){
                overlaps.push(self);
            }
        }

        return overlaps;
    };

    function bind(self){
        var oldposition = null;
        var oldparent = null;
        var element = self.element;


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
            self.trigger('keydown');
        });

        element.addEventListener('onkeypress',function(e){
            self.trigger('keypress');
        });

        element.addEventListener('onkeyup',function(e){
            self.trigger('keyup');
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

        /*disable drag and drop events*/
        element.addEventListener('drag',prevent);
        element.addEventListener('dragstart',prevent);
        element.addEventListener('dragend',prevent);
        element.addEventListener('drop',prevent);
        element.addEventListener('dragenter',prevent);
        element.addEventListener('dragleave',prevent);
        element.addEventListener('dragover',prevent);

        /*Disable clipboard*/
        element.addEventListener('oncopy',prevent);
        element.addEventListener('oncut',prevent);
        element.addEventListener('onpaste',prevent);


        function mousemove(e){
            var left = e.clientX-(self.width/2);
            var top = e.clientY- (self.height/2);
            self.left = left;
            self.top = top;
            self.trigger('drag',[e]);
        }

        function mouseup(e){
            if(e.which == 1){
                w.removeEventListener('mousemove',mousemove,false);
                w.removeEventListener('mouseup',mouseup,false);
                self.trigger('dragend',[e]);
                var overlaps =  root.UI.root.findOverlaps(self);
                self.element.style.position = oldposition;
                root.UI.root.remove(self);
                if(oldparent){
                    oldparent.add(self);
                }
                for(var i = 0; i < overlaps.length;i++){
                    overlaps[i].trigger('drop',[e]);
                }
            }
        }

        element.addEventListener('mouseup',function(e){
            self.trigger('mouseup',[e]);
        });

        /*mouse events*/
        element.addEventListener('mousedown',function(e){
            switch(e.which) {
                case 1:
                    if(self.draggable){
                        e.stopPropagation();
                        w.addEventListener('mousemove',mousemove,false);
                        w.addEventListener('mouseup',mouseup,false);
                        oldposition = self.element.style.position;
                        oldparent = self.parent;
                        self.element.style.position = 'absolute';
                        if(self.parent){
                            self.parent.remove(self);
                        }
                        root.UI.root.add(self);
                        mousemove(e);
                        self.trigger('dragstart',[e]);
                    }
                    self.trigger('leftclick');
                    break;
                case 2:
                    self.trigger('middleclick');
                    break;
                case 3:
                    self.trigger('rightclick');
                    break;
            }
        });
    }

    function prevent(e){
        e.preventDefault();
        return false;
    }

    UI.classes.Element = Element;
})(RPG,window);