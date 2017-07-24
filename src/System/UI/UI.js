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
                ui_root.element.setAttribute('tabindex','-1');
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