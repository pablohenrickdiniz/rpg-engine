(function(root){
    var ui_config = {};
    var ui_elements = {};
    var element = null;
    var width = null;
    var height = null;

    var UI = {
        classes:[],
        children:[],
        initialize:function(options){
            var self = this;
            options = options || {};
            self.element = options.container || null;
            self.width = options.width;
            self.height = options.height;
        },
        add:function(el){
            var self = this;
            if(self.children.indexOf(el) == -1){
                self.children.push(el);
                self.element.appendChild(el.element);
            }
        },
        remove:function(el){
            var self = this;
            var index = self.children.indexOf(el);
            if(index != -1){
                self.children.splice(index,1);
                self.element.removeChild(el.element);
            }
        },
        findById:function(id){
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
        },
        findByClass:function(className,results){
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
        }
    };

    function prevent(e){
        e.preventDefault();
        return false;
    }


    Object.defineProperty(UI,'element',{
        get:function(){
            return element;
        },
        set:function(c){
            if(c != element && c instanceof Node){
                if(element != null){
                    while(element.children.length > 0){
                        var child = element.firstChild;
                        element.removeChild(child);
                        c.appendChild(child);
                    }
                    element.removeEventListener('oncontextmenu',prevent);
                }
                element = c;
                element.style.position = 'absolute';
                element.style.left = 0;
                element.style.top = 0;
                element.style.zIndex = 2;
                element.setAttribute("tabindex","-1");
                element.addEventListener('contextmenu',prevent);
            }
        }
    });

    Object.defineProperty(UI,'width',{
        get:function(){
            return width;
        },
        set:function(w){
            w = parseFloat(w);
            if(!isNaN(w) && w >= 0 && w != width){
                width = w;
                UI.element.style.width = width+'px';
            }
        }
    });

    Object.defineProperty(UI,'height',{
        get:function(){
            return height;
        },
        set:function(h){
            h = parseFloat(h);
            if(!isNaN(h) && h >= 0 && h != height){
                height = h;
                UI.element.style.height = height+'px';
            }
        }
    });

    root.UI = UI;
})(RPG);