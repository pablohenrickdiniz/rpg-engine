(function(root){
    var ui_config = {};
    var ui_elements = {};
    var element = null;
    var width = null;
    var height = null;

    var UI = {
        classes:[],
        initialize:function(options){
            var self = this;
            options = options || {};
            self.element = options.container || null;
            self.width = options.width;
            self.height = options.height;
        },
        set:function(name,config){
            ui_config[name] = config;
        },
        get:function(id){
            if(ui_elements[id]){
                return ui_elements[id];
            }
            return null;
        },
        show:function(id){
            if(ui_elements[id]){
                ui_elements[id].show();
            }
        },
        new:function(name,id){
            if(ui_config[name]){
                var config = ui_config[name];
                var self = this;
                config = Object.assign(config,{
                    parent:self,
                    id:id
                });
                if(self.classes[config.type]){
                    ui_elements[id] = new self.classes[config.type](config);
                    return  ui_elements[id];
                }
            }
            return null;
        },
        hide:function(id){
            if(ui_elements[id]){
                ui_elements[id].hide();
            }
        },
        destroy:function(id){
            if(ui_elements[id]){
                ui_elements[id].remove();
                delete ui_elements[id];
            }
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