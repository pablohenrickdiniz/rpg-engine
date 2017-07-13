(function(root){
    var ui_config = {};
    var ui_elements = {};
    var container = null;
    var width = null;
    var height = null;

    var UI = {
        classes:[],
        initialize:function(options){
            var self = this;
            options = options || {};
            self.container = options.container || null;
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
                    parent:self.container,
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


    Object.defineProperty(UI,'container',{
        get:function(){
            return container;
        },
        set:function(c){
            if(c != container && c instanceof Node){
                if(container != null){
                    while(container.children.length > 0){
                        var child = container.firstChild;
                        container.removeChild(child);
                        c.appendChild(child);
                    }
                    container.removeEventListener('oncontextmenu',prevent);
                }
                container = c;
                container.style.position = 'absolute';
                container.style.left = 0;
                container.style.top = 0;
                container.style.zIndex = 2;
                container.setAttribute("tabindex","-1");
                container.addEventListener('contextmenu',prevent);
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
                UI.container.style.width = width+'px';
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
                UI.container.style.height = height+'px';
            }
        }
    });

    root.UI = UI;
})(RPG);