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
            delete self.element;
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
                    self.unbind();
                    element = el;
                    self.bind();
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
                    self.bind();
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

    Element.prototype.unbind = function(){
        var self = this;
        var element = self.element;

        if(element != null){
            //element.addEventListener('onclick',function(e){e.preventDefault();return false;});
            element.removeEventListener('ondblclick',self.ondblclick);
            element.removeEventListener('onmouseover',self.onmouseover);
            element.removeEventListener('onmouseout',self.onmouseout);

            /*keyboard events*/
            element.removeEventListener('onkeydown',self.onkeydown);
            element.removeEventListener('onkeypress',self.onkeypress);
            element.removeEventListener('onkeyup',self.onkeyup);
            element.removeEventListener('onfocus',self.onfocus);
            element.removeEventListener('onfocusout',self.onfocusout);

            /*disable drag and drop events*/
            element.removeEventListener('drag',prevent);
            element.removeEventListener('dragstart',prevent);
            element.removeEventListener('dragend',prevent);
            element.removeEventListener('drop',prevent);
            element.removeEventListener('dragenter',prevent);
            element.removeEventListener('dragleave',prevent);
            element.removeEventListener('dragover',prevent);
            element.removeEventListener('contextmenu',prevent);

            /*Disable clipboard*/
            element.removeEventListener('oncopy',prevent);
            element.removeEventListener('oncut',prevent);
            element.removeEventListener('onpaste',prevent);
            element.removeEventListener('mouseup',self.mouseup);

            /*mouse events*/
            element.removeEventListener('mousedown',self.mousedown);
            w.removeEventListener('mousemove',self.mousemove,false);
            w.removeEventListener('mouseup',self.mouseup,false);
        }
    };


    Element.prototype.bind = function(){
        var self = this;
        self.unbind();
        var oldposition = null;
        var oldparent = null;
        var element = self.element;
        var downX = 0;
        var downY = 0;


        self.ondblclick = function(e){
            e.preventDefault();
            self.trigger('doubleclick');
            return false;
        };

        self.onmouseover = function(e){
            //e.preventDefault();
            self.trigger('mouseover');
            //return false;
        };

        self.onmouseout = function(e){
            //e.preventDefault();
            self.trigger('mouseout');
            //return false;
        };

        self.onkeydown = function(e){
            self.trigger('keydown');
        };

        self.onkeypress = function(e){
            self.trigger('keypress');
        };

        self.onkeyup = function(e){
            self.trigger('keyup');
        };

        self.onfocus = function(e){
            //e.preventDefault();
            self.trigger('focus');
            //return false;
        };

        self.onfocusout = function(e){
            //e.preventDefault();
            self.trigger('focusout');
            //return false;
        };

        self.mousemove =  function (e){
            e.stopPropagation();
            var left = e.clientX-downX;
            var top = e.clientY-downY;
            self.left = left;
            self.top = top;
            self.trigger('drag',[e]);
        };

        self.mouseup = function(e){
            e.stopPropagation();
            if(e.which == 1){
                w.removeEventListener('mousemove',self.mousemove,false);
                w.removeEventListener('mouseup',self.mouseup,false);
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
            self.trigger('mouseup');
        };

        self.mousedown = function(e){
            e.preventDefault();
            switch(e.which) {
                case 1:
                    if(self.draggable){
                        e.stopPropagation();
                        w.addEventListener('mousemove',self.mousemove,false);
                        w.addEventListener('mouseup',self.mouseup,false);
                        oldposition = self.element.style.position;
                        oldparent = self.parent;

                        var el = e.target;
                        downX = e.offsetX;
                        downY = e.offsetY;

                        while(el != self.element && el.parentNode != undefined){
                            downX += el.offsetLeft;
                            downY += el.offsetTop;
                            el = el.parentNode;
                        }

                        self.element.style.position = 'absolute';
                        if(self.parent){
                            self.parent.remove(self);
                        }
                        root.UI.root.add(self);
                        self.mousemove(e);
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
        };


        //element.addEventListener('onclick',function(e){e.preventDefault();return false;});
        element.addEventListener('ondblclick',self.ondblclick);
        element.addEventListener('onmouseover',self.onmouseover);
        element.addEventListener('onmouseout',self.onmouseout);

        /*keyboard events*/
        element.addEventListener('onkeydown',self.onkeydown);
        element.addEventListener('onkeypress',self.onkeypress);
        element.addEventListener('onkeyup',self.onkeyup);
        element.addEventListener('onfocus',self.onfocus);
        element.addEventListener('onfocusout',self.onfocusout);

        /*disable drag and drop events*/
        element.addEventListener('drag',prevent);
        element.addEventListener('dragstart',prevent);
        element.addEventListener('dragend',prevent);
        element.addEventListener('drop',prevent);
        element.addEventListener('dragenter',prevent);
        element.addEventListener('dragleave',prevent);
        element.addEventListener('dragover',prevent);
        element.addEventListener('contextmenu',prevent);

        /*Disable clipboard*/
        element.addEventListener('oncopy',prevent);
        element.addEventListener('oncut',prevent);
        element.addEventListener('onpaste',prevent);
        element.addEventListener('onmouseup',self.mouseup);

        /*mouse events*/
        element.addEventListener('mousedown',self.mousedown);
    };

    function prevent(e){
        e.preventDefault();
        return false;
    }

    UI.classes.Element = Element;
})(RPG,window);