(function(root){
    var ui_root = null;
    var UI = {
        classes:[]
    };
    function prevent(e){
        e.preventDefault();
        return false;
    }

    Object.defineProperty(UI,'root',{
        get:function(){
            if(ui_root == null){
                ui_root = new Element({
                    id:'ui-root'
                });
                ui_root.element.style.position = 'absolute';
                ui_root.element.style.zIndex = 2;
                ui_root.element.setAttribute('tabindex','-1');
                ui_root.element.style.left = '0';
                ui_root.element.style.top = '0';
            }
            return ui_root;
        },
        set:function(r){
            if(r != ui_root && r instanceof UI.classes.Element){
                if(ui_root != null){
                    while(ui_root.children.length > 0){
                        r.add(ui_root.children[0]);
                    }
                }
                ui_root = r;
                ui_root.element.style.position = 'absolute';
                ui_root.element.style.zIndex = 2;
                ui_root.element.setAttribute('tabindex','-1');
                ui_root.element.style.left = '0';
                ui_root.element.style.top = '0';
            }
        }
    });

    Object.defineProperty(UI,'width',{
        get:function(){
            return UI.root.width;
        },
        set:function(w){
            UI.root.width = w;
        }
    });

    Object.defineProperty(UI,'height',{
        get:function(){
            return UI.root.height;
        },
        set:function(h){
            UI.root.height = h;
        }
    });

    root.UI = UI;
})(RPG);